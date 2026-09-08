import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
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
import { RouterLink } from '@angular/router';
import { CONFIGURACAO_DE_CONTATO } from '../../../../../core/config/contato';
import { AberturaDoFormulario } from '../../../../../core/contato/abertura';
import { DesafioDeSeguranca, EnvioDeIdeias } from '../../../../../core/contato/servicos';
import type { ApiDoTurnstile } from '../../../../../core/contato/turnstile';
import {
  CONTATO_MAXIMO,
  IDEIA_MAXIMA,
  NOME_MAXIMO,
  erroDaIdeia,
  erroDoContato,
  erroDoNome,
} from '../../../../../core/contato/validacao';

type EstadoDoEnvio = 'parado' | 'enviando' | 'enviado' | 'limite' | 'erro';

type CampoDoFormulario = 'nome' | 'ideia' | 'contato';

const CAMPOS: readonly CampoDoFormulario[] = ['nome', 'ideia', 'contato'];

const AVISAR_RESTANTE = 200;

function comoValidador(regra: (valor: string) => string | null): ValidatorFn {
  return (controle: AbstractControl): ValidationErrors | null => {
    const erro = regra(String(controle.value ?? ''));
    return erro ? { mensagem: erro } : null;
  };
}

@Component({
  selector: 'app-formulario-de-ideia',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-de-ideia.html',
  styleUrl: './formulario-de-ideia.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioDeIdeia {
  private readonly envio = inject(EnvioDeIdeias);
  private readonly desafio = inject(DesafioDeSeguranca);
  private readonly rolagem = inject(ViewportScroller);
  private readonly abertura = inject(AberturaDoFormulario);

  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private readonly alvoDoDesafio = viewChild<ElementRef<HTMLElement>>('desafio');

  protected readonly formulario = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [comoValidador(erroDoNome)] }),
    ideia: new FormControl('', { nonNullable: true, validators: [comoValidador(erroDaIdeia)] }),
    contato: new FormControl('', { nonNullable: true, validators: [comoValidador(erroDoContato)] }),

    armadilha: new FormControl('', { nonNullable: true }),
  });

  protected readonly limiteDaIdeia = IDEIA_MAXIMA;
  protected readonly limiteDoNome = NOME_MAXIMO;
  protected readonly limiteDoContato = CONTATO_MAXIMO;
  protected readonly avisarRestante = AVISAR_RESTANTE;
  protected readonly estado = signal<EstadoDoEnvio>('parado');
  protected readonly mensagemDeErro = signal('');
  protected readonly tentouEnviar = signal(false);
  protected readonly enviando = computed(() => this.estado() === 'enviando');

  private readonly tocados = signal<ReadonlySet<CampoDoFormulario>>(new Set());

  private readonly aberto = signal(false);

  private abertoEm = 0;
  private token = '';
  private idDoDesafio: string | null = null;
  private api: ApiDoTurnstile | null = null;

  private elementoDoDesafio: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const alvo = this.alvoDoDesafio()?.nativeElement;

      if (!this.aberto() || !alvo || alvo === this.elementoDoDesafio) {
        return;
      }

      this.elementoDoDesafio = alvo;
      void this.desenharDesafio(alvo);
    });

    effect(() => {
      if (this.abertura.pedido() === 0) {
        return;
      }

      untracked(() => this.abrir());
    });

    inject(DestroyRef).onDestroy(() => this.removerDesafio());
  }

  protected marcarTocado(campo: CampoDoFormulario): void {
    this.tocados.update((tocados) => new Set(tocados).add(campo));
  }

  protected mostrarErro(campo: CampoDoFormulario): boolean {
    return this.tentouEnviar() || this.tocados().has(campo);
  }

  protected restanteDaIdeia(): number {
    return IDEIA_MAXIMA - this.formulario.controls.ideia.value.length;
  }

  abrir(): void {
    this.abertoEm = Date.now();
    this.estado.set('parado');
    this.tentouEnviar.set(false);
    this.tocados.set(new Set());
    this.aberto.set(true);
    this.dialogo().nativeElement.showModal();
  }

  protected fechar(): void {
    this.dialogo().nativeElement.close();
  }

  protected aoFechar(): void {
    this.aberto.set(false);
    this.removerDesafio();

    if (this.estado() === 'enviado') {
      this.formulario.reset();
      this.estado.set('parado');
    }

    if (this.estado() === 'limite') {
      this.estado.set('parado');
    }
  }

  protected sairDoLimite(): void {
    this.fechar();
    this.rolagem.scrollToPosition([0, 0]);
  }

  protected async enviar(): Promise<void> {
    this.tentouEnviar.set(true);

    if (this.formulario.invalid || this.enviando()) {
      this.focarPrimeiroInvalido();
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

    const { nome, ideia, contato, armadilha } = this.formulario.getRawValue();
    const resultado = await this.envio.enviar({
      nome,
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

    this.reiniciarDesafio();

    if (resultado === 'limite') {
      this.estado.set('limite');
      return;
    }

    this.estado.set('erro');
    this.mensagemDeErro.set(MENSAGENS_DE_ERRO[resultado]);
  }

  private focarPrimeiroInvalido(): void {
    const primeiro = CAMPOS.find((campo) => this.formulario.controls[campo].invalid);

    if (primeiro === undefined) {
      return;
    }

    this.dialogo().nativeElement.querySelector<HTMLElement>(`#campo-${primeiro}`)?.focus();
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

        size: 'flexible',
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

const MENSAGENS_DE_ERRO: Record<'recusado' | 'falha', string> = {
  recusado: 'Alguma coisa no envio não passou na verificação. Tente de novo, ou use o e-mail.',
  falha: 'O envio não completou. Tente de novo em instantes, ou me escreva por e-mail.',
};
