import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CONTEUDO } from '../../../../core/conteudo/perfil';
import { AberturaDoFormulario, FORMULARIO_LIGADO } from '../../../../core/contato/abertura';
import { Hero } from './hero';

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

  it('mostra a reasseguração junto da chamada principal', async () => {
    const raiz = await montar(true);

    expect(raiz.querySelector('.hero__reasseguranca')?.textContent).toContain(
      CONTEUDO.oferta.reasseguranca,
    );
  });

  describe('com o formulário ligado', () => {
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
