import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ViewportScroller } from '@angular/common';
import { provideRouter } from '@angular/router';
import { AberturaDoFormulario } from '../../../../../core/contato/abertura';
import { DesafioDeSeguranca, EnvioDeIdeias } from '../../../../../core/contato/servicos';
import type { ResultadoDoEnvio } from '../../../../../core/contato/envio';
import { FormularioDeIdeia } from './formulario-de-ideia';

const IDEIA_BOA = 'Preciso de um sistema para controlar as entregas da minha loja.';

describe('FormularioDeIdeia', () => {
  let fixture: ComponentFixture<FormularioDeIdeia>;
  let raiz: HTMLElement;
  let enviar: ReturnType<typeof vi.fn>;
  let reset: ReturnType<typeof vi.fn>;
  let remove: ReturnType<typeof vi.fn>;
  let desenhouEm: HTMLElement[];
  let rolarPara: ReturnType<typeof vi.fn>;
  let desafioDevolveToken: boolean;

  function preencher(ideia = IDEIA_BOA, contato = 'pessoa@exemplo.com.br', nome = 'Diego'): void {
    const area = raiz.querySelector('textarea') as HTMLTextAreaElement;

    const [campoDoNome, campoDoContato] = Array.from(
      raiz.querySelectorAll<HTMLInputElement>('input[type="text"]:not([tabindex])'),
    );

    campoDoNome.value = nome;
    campoDoNome.dispatchEvent(new Event('input'));
    area.value = ideia;
    area.dispatchEvent(new Event('input'));
    campoDoContato.value = contato;
    campoDoContato.dispatchEvent(new Event('input'));
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

        provideRouter([]),
        { provide: EnvioDeIdeias, useValue: { enviar } },
        { provide: DesafioDeSeguranca, useValue: desafio },
        { provide: ViewportScroller, useValue: { scrollToPosition: rolarPara } },
      ],
    });

    fixture = TestBed.createComponent(FormularioDeIdeia);
    raiz = fixture.nativeElement;

    const dialogo = raiz.querySelector('dialog') as HTMLDialogElement;
    dialogo.showModal = vi.fn();

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

    expect(raiz.querySelectorAll('.campo__erro')).toHaveLength(3);
  });

  it('não envia sem o nome, mesmo com ideia e contato preenchidos', async () => {
    await abrir();
    preencher(IDEIA_BOA, 'pessoa@exemplo.com.br', '   ');
    await submeter();

    expect(enviar).not.toHaveBeenCalled();
  });

  it('avisa do erro assim que o campo perde o foco', async () => {
    await abrir();

    const campo = raiz.querySelector('input[type="text"]:not([tabindex])') as HTMLInputElement;
    campo.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(raiz.querySelector('.campo__erro')).not.toBeNull();
  });

  it('manda o carimbo de abertura, a armadilha vazia e o token junto do texto', async () => {
    await abrir();
    preencher();
    await submeter();

    const [pedido] = enviar.mock.calls[0] ?? [];
    expect(pedido.nome).toBe('Diego');
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

  it('liga o erro ao campo por aria-describedby, e não pelo rótulo', async () => {
    await abrir();
    await submeter();

    const area = raiz.querySelector('textarea') as HTMLTextAreaElement;
    expect(area.getAttribute('aria-describedby')).toBe('erro-ideia');
    expect(raiz.querySelector('#erro-ideia')?.closest('label')).toBeNull();
    expect(raiz.querySelector('label[for="campo-ideia"]')?.textContent?.trim()).toBe('A sua ideia');
  });

  it('leva o foco ao primeiro campo inválido quando o envio é barrado', async () => {
    await abrir();
    await submeter();

    expect(document.activeElement?.id).toBe('campo-nome');
  });

  it('leva o foco ao campo que falta, e não sempre ao primeiro', async () => {
    await abrir();
    preencher(IDEIA_BOA, 'nao-e-contato');
    await submeter();

    expect(document.activeElement?.id).toBe('campo-contato');
  });

  it('mostra o contador só quando a ideia chega perto do limite', async () => {
    await abrir();
    expect(raiz.querySelector('.campo__contador')).toBeNull();

    const area = raiz.querySelector('textarea') as HTMLTextAreaElement;
    area.value = 'x'.repeat(3900);
    area.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(raiz.querySelector('.campo__contador')?.textContent).toContain('100 caracteres');
  });

  describe('pedido de abertura', () => {
    it('abre a caixa quando alguém pede pelo serviço', async () => {
      const dialogo = raiz.querySelector('dialog') as HTMLDialogElement;
      expect(dialogo.showModal).not.toHaveBeenCalled();

      TestBed.inject(AberturaDoFormulario).pedir();
      await fixture.whenStable();

      expect(dialogo.showModal).toHaveBeenCalledTimes(1);
    });

    it('não abre sozinha sem pedido nenhum', async () => {
      await fixture.whenStable();

      expect((raiz.querySelector('dialog') as HTMLDialogElement).showModal).not.toHaveBeenCalled();
    });

    it('abre de novo no segundo pedido', async () => {
      const abertura = TestBed.inject(AberturaDoFormulario);
      const dialogo = raiz.querySelector('dialog') as HTMLDialogElement;

      abertura.pedir();
      await fixture.whenStable();
      dialogo.close();
      abertura.pedir();
      await fixture.whenStable();

      expect(dialogo.showModal).toHaveBeenCalledTimes(2);
    });
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

  it('reinicia o desafio depois de um envio que falhou', async () => {
    enviar.mockResolvedValue('falha');

    await abrir();
    preencher();
    await submeter();

    expect(reset).toHaveBeenCalledWith('id-do-desafio');
  });

  describe('enquanto envia', () => {
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

  it('não posta quando o desafio ainda não devolveu token', async () => {
    desafioDevolveToken = false;

    await abrir();
    preencher();
    await submeter();

    expect(enviar).not.toHaveBeenCalled();
    expect(raiz.querySelector('.ideia__erro')?.textContent).toContain('verificação de segurança');
  });
});
