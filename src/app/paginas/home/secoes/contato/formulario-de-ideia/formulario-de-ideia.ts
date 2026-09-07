import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
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
  type ValidationErrors,
  type ValidatorFn,
} from '@angular/forms';
import { ViewportScroller } from '@angular/common';
import { CONFIGURACAO_DE_CONTATO } from '../../../../../core/config/contato';
import { DesafioDeSeguranca, EnvioDeIdeias } from '../../../../../core/contato/servicos';
import type { ApiDoTurnstile } from '../../../../../core/contato/turnstile';
import { IDEIA_MAXIMA, erroDaIdeia, erroDoContato } from '../../../../../core/contato/validacao';

/**
 * `limite` é estado próprio, e não mais uma mensagem de erro embaixo do
 * formulário: quando a cota da hora acaba, insistir não adianta, então a caixa
 * troca de conteúdo e oferece uma saída em vez de convidar a tentar de novo.
 */
type EstadoDoEnvio = 'parado' | 'enviando' | 'enviado' | 'limite' | 'erro';

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
  private readonly envio = inject(EnvioDeIdeias);
  private readonly desafio = inject(DesafioDeSeguranca);
  private readonly rolagem = inject(ViewportScroller);

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

  /**
   * O contato avisa do erro assim que o campo perde o foco, sem esperar o
   * clique em enviar. É o campo em que o formato importa — e-mail torto ou
   * celular sem DDD significa resposta que nunca chega — e é onde o aviso tarde
   * demais custa mais caro. Sinal em vez de `control.touched` porque a aplicação
   * roda sem zone: aqui a mudança é anunciada na mão, no `(blur)`.
   */
  protected readonly contatoTocado = signal(false);
  protected readonly enviando = computed(() => this.estado() === 'enviando');
  protected readonly mostrarErroDoContato = computed(
    () => this.tentouEnviar() || this.contatoTocado(),
  );

  private readonly aberto = signal(false);

  /** Quando o formulário abriu. Vai no corpo e alimenta a trava de tempo. */
  private abertoEm = 0;
  private token = '';
  private idDoDesafio: string | null = null;
  private api: ApiDoTurnstile | null = null;

  /**
   * O elemento em que o desafio foi desenhado. Depois de um envio que deu certo,
   * o template troca o formulário pelo recado e destrói esse `div`; ao reabrir,
   * o Angular cria um novo. Guardar qual elemento foi usado é o que faz o
   * desafio ser desenhado de novo no elemento novo, em vez de o código achar que
   * já desenhou e deixar a caixa vazia.
   */
  private elementoDoDesafio: HTMLElement | null = null;

  constructor() {
    // `viewChild` é signal, então este efeito roda de novo assim que o `div` do
    // desafio aparece na tela, sem precisar esperar ciclo de renderização na
    // mão.
    effect(() => {
      const alvo = this.alvoDoDesafio()?.nativeElement;

      if (!this.aberto() || !alvo || alvo === this.elementoDoDesafio) {
        return;
      }

      this.elementoDoDesafio = alvo;
      void this.desenharDesafio(alvo);
    });

    inject(DestroyRef).onDestroy(() => this.removerDesafio());
  }

  abrir(): void {
    this.abertoEm = Date.now();
    this.estado.set('parado');
    this.tentouEnviar.set(false);
    this.contatoTocado.set(false);
    this.aberto.set(true);
    this.dialogo().nativeElement.showModal();
  }

  protected fechar(): void {
    this.dialogo().nativeElement.close();
  }

  /**
   * Roda tanto no botão de fechar quanto no `Esc`, que o `<dialog>` trata
   * sozinho. O desafio é descartado aqui de propósito: o token vale uma vez só,
   * e a próxima abertura precisa de um novo.
   */
  protected aoFechar(): void {
    this.aberto.set(false);
    this.removerDesafio();

    if (this.estado() === 'enviado') {
      this.formulario.reset();
      this.estado.set('parado');
    }

    // No limite o texto fica onde está: a pessoa escreveu, a cota é que acabou,
    // e daqui a uma hora ela reabre e envia sem digitar tudo de novo.
    if (this.estado() === 'limite') {
      this.estado.set('parado');
    }
  }

  /**
   * Fecha e devolve o visitante ao começo da página. Depois do limite não há o
   * que fazer na caixa, e deixá-la fechada em cima da seção de contato convida a
   * tentar de novo, que é justamente o que não vai funcionar agora.
   */
  protected sairDoLimite(): void {
    this.fechar();
    this.rolagem.scrollToPosition([0, 0]);
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

    if (resultado === 'limite') {
      this.estado.set('limite');
      return;
    }

    this.estado.set('erro');
    this.mensagemDeErro.set(MENSAGENS_DE_ERRO[resultado]);
  }

  private async desenharDesafio(alvo: HTMLElement): Promise<void> {
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
    } catch {
      this.estado.set('erro');
      this.mensagemDeErro.set(
        'Não consegui carregar a verificação de segurança. Escreva por e-mail que eu respondo igual.',
      );
    }
  }

  private removerDesafio(): void {
    if (this.api !== null && this.idDoDesafio !== null) {
      this.api.remove(this.idDoDesafio);
    }

    this.idDoDesafio = null;
    this.elementoDoDesafio = null;
    this.token = '';
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
const MENSAGENS_DE_ERRO: Record<'recusado' | 'falha', string> = {
  recusado: 'Alguma coisa no envio não passou na verificação. Tente de novo, ou use o e-mail.',
  falha: 'O envio não completou. Tente de novo em instantes, ou me escreva por e-mail.',
};
