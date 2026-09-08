import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CONTEUDO } from '../../../../core/conteudo/perfil';
import { Solucoes } from './solucoes';

describe('Solucoes', () => {
  let raiz: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });

    const fixture = TestBed.createComponent(Solucoes);
    await fixture.whenStable();

    raiz = fixture.nativeElement;
  });

  it('desenha um cartão por serviço do conteúdo', () => {
    expect(raiz.querySelectorAll('.servico').length).toBe(CONTEUDO.servicos.length);
  });

  it('desenha todo ícone com pelo menos um traçado', () => {
    for (const icone of raiz.querySelectorAll('.servico__icone svg')) {
      const caminhos = icone.querySelectorAll('path');
      expect(caminhos.length).toBeGreaterThan(0);

      for (const caminho of caminhos) {
        expect(caminho.getAttribute('d')?.trim()).toBeTruthy();
      }
    }
  });

  it('mantém o ícone fora da árvore de acessibilidade', () => {
    for (const icone of raiz.querySelectorAll('.servico__icone')) {
      expect(icone.getAttribute('aria-hidden')).toBe('true');
    }
  });
});
