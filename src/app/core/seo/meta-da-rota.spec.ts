import { DOCUMENT, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { MetaDaRota, SITE, enderecoCanonico } from './meta-da-rota';

describe('enderecoCanonico', () => {
  it('devolve a raiz com barra', () => {
    expect(enderecoCanonico('/')).toBe(`${SITE}/`);
  });

  it('devolve o caminho sem barra no fim', () => {
    expect(enderecoCanonico('/sobre')).toBe(`${SITE}/sobre`);
    expect(enderecoCanonico('/sobre/')).toBe(`${SITE}/sobre`);
  });

  it('corta fragmento e consulta', () => {
    expect(enderecoCanonico('/#contato')).toBe(`${SITE}/`);
    expect(enderecoCanonico('/sobre?de=linkedin')).toBe(`${SITE}/sobre`);
  });
});

describe('MetaDaRota', () => {
  let documento: Document;
  let router: Router;

  function etiqueta(seletor: string): string {
    return documento.head.querySelector(seletor)?.getAttribute('content') ?? '';
  }

  function canonico(): string {
    return documento.head.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: '', title: 'Home', data: { descricao: 'A oferta' }, children: [] },
          { path: 'sobre', title: 'Sobre', data: { descricao: 'As tecnologias' }, children: [] },

          { path: 'solto', title: 'Solto', children: [] },
        ]),
      ],
    });

    documento = TestBed.inject(DOCUMENT);
    documento.head
      .querySelectorAll('link[rel="canonical"], meta[property], meta[name]')
      .forEach((no) => no.remove());

    router = TestBed.inject(Router);
    TestBed.inject(MetaDaRota).observar();
    await router.navigateByUrl('/');
  });

  it('descreve a home', () => {
    expect(etiqueta('meta[name="description"]')).toBe('A oferta');
    expect(etiqueta('meta[property="og:title"]')).toBe('Home');
    expect(canonico()).toBe(`${SITE}/`);
  });

  it('troca as etiquetas ao navegar para outra rota', async () => {
    await router.navigateByUrl('/sobre');

    expect(etiqueta('meta[name="description"]')).toBe('As tecnologias');
    expect(etiqueta('meta[property="og:description"]')).toBe('As tecnologias');
    expect(etiqueta('meta[property="og:title"]')).toBe('Sobre');
    expect(etiqueta('meta[property="og:url"]')).toBe(`${SITE}/sobre`);
    expect(canonico()).toBe(`${SITE}/sobre`);
  });

  it('reaproveita a etiqueta canônica que já existe, sem criar uma segunda', async () => {
    await router.navigateByUrl('/sobre');

    expect(documento.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  });

  it('mantém a descrição anterior quando a rota não declara uma', async () => {
    await router.navigateByUrl('/solto');

    expect(etiqueta('meta[name="description"]')).toBe('A oferta');
    expect(etiqueta('meta[property="og:title"]')).toBe('Solto');
  });
});
