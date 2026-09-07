import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

    const desafio = {
      carregar: vi.fn().mockResolvedValue({
        render: (_alvo: HTMLElement, opcoes: { callback: (token: string) => void }) => {
          if (desafioDevolveToken) {
            opcoes.callback('token-de-teste');
          }
          return 'id-do-desafio';
        },
        reset,
        remove: vi.fn(),
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: EnvioDeIdeias, useValue: { enviar } },
        { provide: DesafioDeSeguranca, useValue: desafio },
      ],
    });

    fixture = TestBed.createComponent(FormularioDeIdeia);
    raiz = fixture.nativeElement;

    // O jsdom conhece o elemento, mas não abre janela de verdade.
    const dialogo = raiz.querySelector('dialog') as HTMLDialogElement;
    dialogo.showModal = vi.fn();
    dialogo.close = vi.fn();

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
    ['limite', 'várias mensagens'],
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
