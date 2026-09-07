import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CONTEUDO } from '../../../../core/conteudo/perfil';
import { Hero } from './hero';

describe('Hero', () => {
  let raiz: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });

    const fixture = TestBed.createComponent(Hero);
    await fixture.whenStable();

    raiz = fixture.nativeElement;
  });

  // O `trim` tira a indentação do template, mas o miolo é comparado como está:
  // o destaque fica dentro de um `span` colado no texto, e uma quebra de linha
  // injetada ali viraria um espaço a mais no meio do título, visível na tela.
  it('usa o bordão do conteúdo como h1, inteiro e sem espaço sobrando', () => {
    const titulo = raiz.querySelector('h1');
    expect(titulo?.textContent?.trim()).toBe(CONTEUDO.oferta.bordao);
  });

  it('isola o trecho destacado em seu próprio elemento', () => {
    const marca = raiz.querySelector('.hero__marca');
    expect(marca?.textContent).toBe(CONTEUDO.oferta.bordaoDestaque);
  });
});
