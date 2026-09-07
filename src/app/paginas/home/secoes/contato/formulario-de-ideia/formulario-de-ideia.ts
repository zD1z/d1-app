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

/**
 * `limite` é estado próprio, e não mais uma mensagem de erro embaixo do
 * formulário: quando a cota da hora acaba, insistir não adianta, então a caixa
 * troca de conteúdo e oferece uma saída em vez de convidar a tentar de novo.
 */
type EstadoDoEnvio = 'parado' | 'enviando' | 'enviado' | 'limite' | 'erro';

/** Os três campos que a pessoa preenche. A armadilha fica de fora: ninguém a vê. */
type CampoDoFormulario = 'nome' | 'ideia' | 'contato';

/** A ordem em que os campos aparecem na tela, e a ordem em que o foco os procura. */
const CAMPOS: readonly CampoDoFormulario[] = ['nome', 'ideia', 'contato'];

/**
 * A partir de quantos caracteres restantes o contador aparece. Mostrar "3940
 * restantes" desde a primeira letra é ruído; o número só interessa quando o
 * limite vira um risco real.
 */
const AVISAR_RESTANTE = 200;

/** Ponte entre as regras puras de `core/contato/validacao` e o formulário. */
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
    // Escondida da tela e do leitor de tela. Gente não preenche o que não vê;
    // robô que preenche todo campo do formulário, sim.
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

  /**
   * Quais campos a pessoa já visitou e deixou. Os três são obrigatórios, e o
   * erro aparece assim que o campo perde o foco, em vez de esperar o clique em
   * enviar e devolver três avisos de uma vez.
   *
   * Sinal em vez do `touched` do próprio controle porque a aplicação roda sem
   * zone: `touched` muda sem avisar ninguém, e a tela não redesenharia.
   */
  private readonly tocados = signal<ReadonlySet<CampoDoFormulario>>(new Set());

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

    // Quem pede a caixa é o botão do hero ou o da seção de contato, os dois
    // pelo mesmo serviço. Zero é o valor de partida, e ignorá-lo é o que
    // impede a caixa de abrir sozinha assim que a home monta. O `untracked`
    // deixa explícito que só o contador é dependência daqui: o resto de `abrir`
    // é escrita, e não leitura reativa.
    effect(() => {
      if (this.abertura.pedido() === 0) {
        return;
      }

      untracked(() => this.abrir());
    });

    inject(DestroyRef).onDestroy(() => this.removerDesafio());
  }

  /** Chamado no `(blur)` de cada campo. */
  protected marcarTocado(campo: CampoDoFormulario): void {
    this.tocados.update((tocados) => new Set(tocados).add(campo));
  }

  /** Se o aviso de erro daquele campo já pode aparecer. */
  protected mostrarErro(campo: CampoDoFormulario): boolean {
    return this.tentouEnviar() || this.tocados().has(campo);
  }

  /**
   * Quanto ainda cabe na ideia. Lê o controle direto em vez de guardar um
   * segundo estado: o `(input)` do formulário reativo já avisa a aplicação, e
   * duplicar o tamanho num sinal só criaria uma cópia para sair de sincronia.
   */
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

  /**
   * Submeter com campo inválido só acendia os avisos na tela. Quem navega por
   * teclado ou usa leitor de tela apertava Enter e não percebia nada
   * acontecer, porque o foco continuava no botão e o aviso ficava acima, fora
   * do caminho. Levar o foco ao campo faz o leitor anunciar o rótulo e a
   * mensagem ligada a ele por `aria-describedby`.
   *
   * A busca é pelo `id` do campo, e não por `[aria-invalid]`: o atributo só
   * aparece no DOM depois do próximo desenho, e este código roda antes dele.
   */
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
        // A caixa do desafio acompanha a largura do contêiner. No tamanho
        // padrão ela tem 300px fixos, e a 360px de tela sobravam 288px dentro
        // do diálogo: o widget estourava a caixa na horizontal.
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

/**
 * Uma frase por resultado. O que o endpoint devolve como motivo detalhado não
 * chega aqui: para quem está enviando, "armadilha" e "corpo inválido" pedem a
 * mesma resposta na tela.
 */
const MENSAGENS_DE_ERRO: Record<'recusado' | 'falha', string> = {
  recusado: 'Alguma coisa no envio não passou na verificação. Tente de novo, ou use o e-mail.',
  falha: 'O envio não completou. Tente de novo em instantes, ou me escreva por e-mail.',
};
