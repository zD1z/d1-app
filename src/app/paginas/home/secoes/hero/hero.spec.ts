import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CONTEUDO } from '../../../../core/conteudo/perfil';
import { AberturaDoFormulario, FORMULARIO_LIGADO } from '../../../../core/contato/abertura';
import { Hero } from './hero';

/**
 * O `FORMULARIO_LIGADO` é trocado no TestBed porque a configuração real está
 * preenchida: sem substituir o token, o caminho de emergência (envio desligado)
 * seria inalcançável pela suíte, e é justamente ele que precisa continuar
 * funcionando se a infraestrutura cair.
 */
async function montar(ligado: boolean): Promise<HTMLElement> {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), { provide: FORMULARIO_LIGADO, useValue: ligado }],
  });

  const fixture = TestBed.createComponent(Hero);
  await fixture.whenStable();

  return fixture.nativeElement;
}

describe('Hero', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  // O `trim` tira a indentação do template, mas o miolo é comparado como está:
  // o destaque fica dentro de um `span` colado no texto, e uma quebra de linha
  // injetada ali viraria um espaço a mais no meio do título, visível na tela.
  it('usa o bordão do conteúdo como h1, inteiro e sem espaço sobrando', async () => {
    const raiz = await montar(true);
    const titulo = raiz.querySelector('h1');

    expect(titulo?.textContent?.trim()).toBe(CONTEUDO.oferta.bordao);
  });

  it('isola o trecho destacado em seu próprio elemento', async () => {
    const raiz = await montar(true);
    const marca = raiz.querySelector('.hero__marca');

    expect(marca?.textContent).toBe(CONTEUDO.oferta.bordaoDestaque);
  });

  // A promessa que derruba a hesitação estava só na quarta seção, longe demais
  // de quem acabou de ler o bordão.
  it('mostra a reasseguração junto da chamada principal', async () => {
    const raiz = await montar(true);

    expect(raiz.querySelector('.hero__reasseguranca')?.textContent).toContain(
      CONTEUDO.oferta.reasseguranca,
    );
  });

  describe('com o formulário ligado', () => {
    // Antes a chamada principal era âncora para `#contato`: a pessoa rolava a
    // página inteira e encontrava um segundo botão com o mesmo rótulo. Um
    // clique, e a caixa abre aqui mesmo.
    it('a chamada principal é um botão, e não uma âncora', async () => {
      const raiz = await montar(true);
      const principal = raiz.querySelector('.hero__acoes .botao--primario');

      expect(principal?.tagName).toBe('BUTTON');
      expect(principal?.getAttribute('href')).toBeNull();
    });

    it('o clique pede a abertura da caixa de ideia', async () => {
      const raiz = await montar(true);
      const abertura = TestBed.inject(AberturaDoFormulario);

      expect(abertura.pedido()).toBe(0);

      raiz.querySelector<HTMLButtonElement>('.hero__acoes .botao--primario')?.click();

      expect(abertura.pedido()).toBe(1);
    });
  });

  describe('com o formulário desligado', () => {
    // A rede de segurança: sem endpoint, a seção de contato volta a ser o
    // `mailto:`, e é para lá que a chamada precisa levar.
    it('a chamada principal volta a ser âncora para o contato', async () => {
      const raiz = await montar(false);
      const principal = raiz.querySelector('.hero__acoes .botao--primario');

      expect(principal?.tagName).toBe('A');
      expect(principal?.getAttribute('href')).toBe('#contato');
    });

    it('não pede abertura nenhuma', async () => {
      const raiz = await montar(false);
      const abertura = TestBed.inject(AberturaDoFormulario);

      raiz.querySelector<HTMLAnchorElement>('.hero__acoes .botao--primario')?.click();

      expect(abertura.pedido()).toBe(0);
    });
  });
});
