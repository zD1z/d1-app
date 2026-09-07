import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ViewportScroller } from '@angular/common';
import { DesafioDeSeguranca, EnvioDeIdeias } from '../../../../../core/contato/servicos';
import type { ResultadoDoEnvio } from '../../../../../core/contato/envio';
import { FormularioDeIdeia } from './formulario-de-ideia';

const IDEIA_BOA = 'Preciso de um sistema para controlar as entregas da minha loja.';

/**
 * O desafio e a rede saem de cena por injeção, e não por dublê de módulo: o
 * sistema de teste do Angular não deixa trocar import relativo, e é por isso que
 * os dois colaboradores existem como serviço.
 */
describe('FormularioDeIdeia', () => {
  let fixture: ComponentFixture<FormularioDeIdeia>;
  let raiz: HTMLElement;
  let enviar: ReturnType<typeof vi.fn>;
  let reset: ReturnType<typeof vi.fn>;
  let remove: ReturnType<typeof vi.fn>;
  let desenhouEm: HTMLElement[];
  let rolarPara: ReturnType<typeof vi.fn>;
  let desafioDevolveToken: boolean;

  function preencher(ideia = IDEIA_BOA, contato = 'pessoa@exemplo.com.br'): void {
    const area = raiz.querySelector('textarea') as HTMLTextAreaElement;
    const entrada = raiz.querySelector('input[type="text"]:not([tabindex])') as HTMLInputElement;

    area.value = ideia;
    area.dispatchEvent(new Event('input'));
    entrada.value = contato;
    entrada.dispatchEvent(new Event('input'));
  }

  async function abrir(): Promise<void> {
    fixture.componentInstance.abrir();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function submeter(): Promise<void> {
    raiz.querySelector('form')?.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    desafioDevolveToken = true;
    enviar = vi.fn().mockResolvedValue('enviado' satisfies ResultadoDoEnvio);
    reset = vi.fn();

    desenhouEm = [];
    remove = vi.fn();

    const desafio = {
      carregar: vi.fn().mockResolvedValue({
        render: (alvo: HTMLElement, opcoes: { callback: (token: string) => void }) => {
          desenhouEm.push(alvo);
          if (desafioDevolveToken) {
            opcoes.callback('token-de-teste');
          }
          return 'id-do-desafio';
        },
        reset,
        remove,
      }),
    };

    rolarPara = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: EnvioDeIdeias, useValue: { enviar } },
        { provide: DesafioDeSeguranca, useValue: desafio },
        { provide: ViewportScroller, useValue: { scrollToPosition: rolarPara } },
      ],
    });

    fixture = TestBed.createComponent(FormularioDeIdeia);
    raiz = fixture.nativeElement;

    // O jsdom conhece o elemento, mas não abre janela de verdade.
    const dialogo = raiz.querySelector('dialog') as HTMLDialogElement;
    dialogo.showModal = vi.fn();
    // O `close` real dispara o evento; o dublê precisa disparar também, porque é
    // o `(close)` do template que descarta o desafio para a próxima abertura.
    dialogo.close = vi.fn(() => dialogo.dispatchEvent(new Event('close')));

    await fixture.whenStable();
  });

  it('tem a armadilha no DOM, fora da tabulação e fora do leitor de tela', () => {
    const armadilha = raiz.querySelector('.ideia__armadilha');

    expect(armadilha?.getAttribute('aria-hidden')).toBe('true');
    expect(armadilha?.querySelector('input')?.getAttribute('tabindex')).toBe('-1');
  });

  it('não envia enquanto os campos não passam na validação', async () => {
    await abrir();
    await submeter();

    expect(enviar).not.toHaveBeenCalled();
    expect(raiz.querySelector('.campo__erro')).not.toBeNull();
  });

  it('manda o carimbo de abertura, a armadilha vazia e o token junto do texto', async () => {
    await abrir();
    preencher();
    await submeter();

    const [pedido] = enviar.mock.calls[0] ?? [];
    expect(pedido.ideia).toBe(IDEIA_BOA);
    expect(pedido.contato).toBe('pessoa@exemplo.com.br');
    expect(pedido.armadilha).toBe('');
    expect(pedido.turnstile).toBe('token-de-teste');
    expect(pedido.abertoEm).toBeGreaterThan(0);
  });

  it('troca o formulário pelo recado depois de enviar', async () => {
    await abrir();
    preencher();
    await submeter();

    expect(raiz.querySelector('.ideia__recado')).not.toBeNull();
    expect(raiz.querySelector('form')).toBeNull();
  });

  it.each([
    ['falha', 'não completou'],
    ['recusado', 'não passou'],
  ])('mostra recado próprio quando o envio volta %s', async (resultado, trecho) => {
    enviar.mockResolvedValue(resultado);

    await abrir();
    preencher();
    await submeter();

    const erro = raiz.querySelector('.ideia__erro');
    expect(erro?.getAttribute('role')).toBe('alert');
    expect(erro?.textContent).toContain(trecho);
  });

  // O token vale uma vez só. Sem o `reset`, a segunda tentativa seria recusada
  // pelo endpoint mesmo com tudo certo na tela.
  it('reinicia o desafio depois de um envio que falhou', async () => {
    enviar.mockResolvedValue('falha');

    await abrir();
    preencher();
    await submeter();

    expect(reset).toHaveBeenCalledWith('id-do-desafio');
  });

  describe('enquanto envia', () => {
    /** Segura a resposta do envio para a tela ficar no estado "enviando". */
    function envioPendurado(): () => void {
      let liberar = () => {};
      enviar.mockReturnValue(
        new Promise((resolve) => {
          liberar = () => resolve('enviado');
        }),
      );
      return liberar;
    }

    it('cobre a caixa e anuncia o que está acontecendo', async () => {
      envioPendurado();

      await abrir();
      preencher();
      await submeter();

      const bloqueio = raiz.querySelector('.ideia__bloqueio');
      expect(bloqueio).not.toBeNull();
      expect(bloqueio?.getAttribute('aria-live')).toBe('polite');
      expect(bloqueio?.textContent).toContain('Enviando minha ideia...');
    });

    // O botão desabilitado sozinho não impede o Enter dentro do campo de texto.
    // O `inert` tira o formulário inteiro do alcance de mouse, teclado e leitor
    // de tela, que é o que de fato barra o clique duplo.
    it('deixa o formulário inerte e o fechar desabilitado', async () => {
      envioPendurado();

      await abrir();
      preencher();
      await submeter();

      expect(raiz.querySelector('form')?.hasAttribute('inert')).toBe(true);
      expect(raiz.querySelector('.ideia__fechar')?.hasAttribute('disabled')).toBe(true);
    });

    it('não dispara um segundo envio se a submissão se repetir', async () => {
      const liberar = envioPendurado();

      await abrir();
      preencher();
      await submeter();
      await submeter();

      expect(enviar).toHaveBeenCalledTimes(1);

      liberar();
      await fixture.whenStable();
    });

    it('tira a camada quando a resposta chega', async () => {
      const liberar = envioPendurado();

      await abrir();
      preencher();
      await submeter();
      expect(raiz.querySelector('.ideia__bloqueio')).not.toBeNull();

      liberar();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(raiz.querySelector('.ideia__bloqueio')).toBeNull();
      expect(raiz.querySelector('.ideia__recado')).not.toBeNull();
    });
  });

  describe('quando a cota da hora acaba', () => {
    beforeEach(() => {
      enviar.mockResolvedValue('limite');
    });

    // Tela inteira, e não aviso embaixo do formulário: insistir não adianta, e
    // deixar os campos ali convidaria a tentar de novo.
    it('troca o formulário por um alerta com saída', async () => {
      await abrir();
      preencher();
      await submeter();

      const alerta = raiz.querySelector('.ideia__final--limite');
      expect(alerta?.getAttribute('role')).toBe('alert');
      expect(alerta?.textContent).toContain('última hora');
      expect(raiz.querySelector('form')).toBeNull();
      expect(raiz.querySelector('.ideia__erro')).toBeNull();
    });

    it('fecha e devolve a página ao topo no Ok', async () => {
      await abrir();
      preencher();
      await submeter();

      raiz.querySelector('.ideia__final--limite button')?.dispatchEvent(new Event('click'));
      await fixture.whenStable();

      expect(rolarPara).toHaveBeenCalledWith([0, 0]);
      expect((raiz.querySelector('dialog') as HTMLDialogElement).close).toHaveBeenCalled();
    });

    // A cota é que acabou, não o texto. Reabrir e ter que digitar tudo de novo
    // seria castigo dobrado.
    it('preserva o que foi escrito para a próxima tentativa', async () => {
      await abrir();
      preencher();
      await submeter();

      raiz.querySelector('.ideia__final--limite button')?.dispatchEvent(new Event('click'));
      await fixture.whenStable();

      enviar.mockResolvedValue('enviado');
      await abrir();

      expect(raiz.querySelector('form')).not.toBeNull();
      expect(raiz.querySelector('textarea')?.value).toBe(IDEIA_BOA);
    });
  });

  describe('ao reabrir', () => {
    // Depois de um envio que deu certo, o template troca o formulário pelo
    // recado e destrói o `div` do desafio. Reabrir cria um `div` novo, e sem
    // desenhar de novo a caixa da Cloudflare fica vazia até alguém recarregar a
    // página, que era o defeito relatado.
    it('desenha o desafio de novo, no elemento novo', async () => {
      await abrir();
      preencher();
      await submeter();

      const primeiro = desenhouEm[0];
      expect(primeiro).toBeDefined();

      raiz.querySelector('.ideia__final button')?.dispatchEvent(new Event('click'));
      await fixture.whenStable();
      fixture.detectChanges();

      await abrir();

      expect(remove).toHaveBeenCalledWith('id-do-desafio');
      expect(desenhouEm.length).toBe(2);
      expect(desenhouEm[1]).not.toBe(primeiro);
    });

    it('volta a mostrar o formulário, e não o recado do envio anterior', async () => {
      await abrir();
      preencher();
      await submeter();

      raiz.querySelector('.ideia__final button')?.dispatchEvent(new Event('click'));
      await fixture.whenStable();
      fixture.detectChanges();

      await abrir();

      expect(raiz.querySelector('form')).not.toBeNull();
      expect(raiz.querySelector('.ideia__recado')).toBeNull();
      expect(raiz.querySelector('textarea')?.value).toBe('');
    });
  });

  // Sem token não adianta postar: o endpoint recusaria, e a pessoa levaria um
  // erro genérico em vez de saber que é só esperar o desafio.
  it('não posta quando o desafio ainda não devolveu token', async () => {
    desafioDevolveToken = false;

    await abrir();
    preencher();
    await submeter();

    expect(enviar).not.toHaveBeenCalled();
    expect(raiz.querySelector('.ideia__erro')?.textContent).toContain('verificação de segurança');
  });
});
