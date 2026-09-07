import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
  viewChild,
  type ElementRef,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  type AbstractControl,
  type ValidatorFn,
  type ValidationErrors,
} from '@angular/forms';
import { CONFIGURACAO_DE_CONTATO } from '../../../../../core/config/contato';
import { DesafioDeSeguranca, EnvioDeIdeias } from '../../../../../core/contato/servicos';
import type { ApiDoTurnstile } from '../../../../../core/contato/turnstile';
import { IDEIA_MAXIMA, erroDaIdeia, erroDoContato } from '../../../../../core/contato/validacao';

type EstadoDoEnvio = 'parado' | 'enviando' | 'enviado' | 'erro';

/** Ponte entre as regras puras de `core/contato/validacao` e o formulário. */
function comoValidador(regra: (valor: string) => string | null): ValidatorFn {
  return (controle: AbstractControl): ValidationErrors | null => {
    const erro = regra(String(controle.value ?? ''));
    return erro ? { mensagem: erro } : null;
  };
}

@Component({
  selector: 'app-formulario-de-ideia',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-de-ideia.html',
  styleUrl: './formulario-de-ideia.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioDeIdeia {
  private readonly aoDestruir = inject(DestroyRef);
  private readonly envio = inject(EnvioDeIdeias);
  private readonly desafio = inject(DesafioDeSeguranca);

  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private readonly alvoDoDesafio = viewChild<ElementRef<HTMLElement>>('desafio');

  protected readonly formulario = new FormGroup({
    ideia: new FormControl('', { nonNullable: true, validators: [comoValidador(erroDaIdeia)] }),
    contato: new FormControl('', { nonNullable: true, validators: [comoValidador(erroDoContato)] }),
    // Escondida da tela e do leitor de tela. Gente não preenche o que não vê;
    // robô que preenche todo campo do formulário, sim.
    armadilha: new FormControl('', { nonNullable: true }),
  });

  protected readonly limiteDaIdeia = IDEIA_MAXIMA;
  protected readonly estado = signal<EstadoDoEnvio>('parado');
  protected readonly mensagemDeErro = signal('');
  protected readonly tentouEnviar = signal(false);
  protected readonly enviando = computed(() => this.estado() === 'enviando');

  /** Quando o formulário abriu. Vai no corpo e alimenta a trava de tempo. */
  private abertoEm = 0;
  private token = '';
  private idDoDesafio: string | null = null;
  private api: ApiDoTurnstile | null = null;

  abrir(): void {
    this.abertoEm = Date.now();
    this.estado.set('parado');
    this.tentouEnviar.set(false);
    this.dialogo().nativeElement.showModal();
    void this.prepararDesafio();
  }

  protected fechar(): void {
    this.dialogo().nativeElement.close();
  }

  /**
   * Roda tanto no botão de fechar quanto no `Esc`, que o `<dialog>` trata
   * sozinho. Depois de um envio que deu certo, limpa para a próxima abertura não
   * mostrar o texto antigo.
   */
  protected aoFechar(): void {
    if (this.estado() === 'enviado') {
      this.formulario.reset();
      this.token = '';
    }
  }

  protected async enviar(): Promise<void> {
    this.tentouEnviar.set(true);

    if (this.formulario.invalid || this.enviando()) {
      return;
    }

    if (this.token === '') {
      this.estado.set('erro');
      this.mensagemDeErro.set(
        'A verificação de segurança ainda não terminou. Espere um instante e tente de novo.',
      );
      return;
    }

    this.estado.set('enviando');

    const { ideia, contato, armadilha } = this.formulario.getRawValue();
    const resultado = await this.envio.enviar({
      ideia,
      contato,
      armadilha,
      abertoEm: this.abertoEm,
      turnstile: this.token,
    });

    if (resultado === 'enviado') {
      this.estado.set('enviado');
      return;
    }

    // O token do Turnstile vale uma vez só. Sem o `reset`, uma segunda tentativa
    // seria recusada mesmo com tudo certo.
    this.reiniciarDesafio();
    this.estado.set('erro');
    this.mensagemDeErro.set(MENSAGENS_DE_ERRO[resultado]);
  }

  private async prepararDesafio(): Promise<void> {
    const alvo = this.alvoDoDesafio()?.nativeElement;
    if (!alvo || this.idDoDesafio !== null) {
      return;
    }

    try {
      const api = await this.desafio.carregar();
      this.api = api;

      this.idDoDesafio = api.render(alvo, {
        sitekey: CONFIGURACAO_DE_CONTATO.chaveDoTurnstile,
        callback: (token) => {
          this.token = token;
        },
        'error-callback': () => {
          this.token = '';
        },
        'expired-callback': () => {
          this.token = '';
        },
        theme: 'auto',
        language: 'pt-BR',
      });

      this.aoDestruir.onDestroy(() => {
        if (this.idDoDesafio !== null) {
          api.remove(this.idDoDesafio);
        }
      });
    } catch {
      this.estado.set('erro');
      this.mensagemDeErro.set(
        'Não consegui carregar a verificação de segurança. Escreva por e-mail que eu respondo igual.',
      );
    }
  }

  private reiniciarDesafio(): void {
    this.token = '';
    if (this.api !== null && this.idDoDesafio !== null) {
      this.api.reset(this.idDoDesafio);
    }
  }
}

/**
 * Uma frase por resultado. O que o endpoint devolve como motivo detalhado não
 * chega aqui: para quem está enviando, "armadilha" e "corpo inválido" pedem a
 * mesma resposta na tela.
 */
const MENSAGENS_DE_ERRO: Record<'limite' | 'recusado' | 'falha', string> = {
  limite: 'Já chegaram várias mensagens daqui hoje. Tente mais tarde, ou me escreva por e-mail.',
  recusado: 'Alguma coisa no envio não passou na verificação. Tente de novo, ou use o e-mail.',
  falha: 'O envio não completou. Tente de novo em instantes, ou me escreva por e-mail.',
};
