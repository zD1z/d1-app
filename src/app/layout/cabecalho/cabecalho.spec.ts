import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Router, provideRouter } from '@angular/router';
import { Cabecalho } from './cabecalho';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class PaginaVazia {}

describe('Cabecalho', () => {
  let fixture: ComponentFixture<Cabecalho>;
  let raiz: HTMLElement;

  function botaoDoMenu(): HTMLButtonElement {
    return raiz.querySelector('.cabecalho__alternar') as HTMLButtonElement;
  }

  async function assentar(): Promise<void> {
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: '', component: PaginaVazia },
          { path: 'sobre', component: PaginaVazia },
        ]),
      ],
    });

    fixture = TestBed.createComponent(Cabecalho);
    raiz = fixture.nativeElement;

    await fixture.whenStable();
  });

  it('começa com o menu fechado e o botão dizendo isso', () => {
    expect(botaoDoMenu().getAttribute('aria-expanded')).toBe('false');
    expect(raiz.querySelector('.menu--aberto')).toBeNull();
  });

  it('abre e fecha no botão', async () => {
    botaoDoMenu().click();
    await assentar();
    expect(botaoDoMenu().getAttribute('aria-expanded')).toBe('true');

    botaoDoMenu().click();
    await assentar();
    expect(botaoDoMenu().getAttribute('aria-expanded')).toBe('false');
  });

  describe('realce do item atual', () => {
    async function irPara(url: string): Promise<void> {
      await TestBed.inject(Router).navigateByUrl(url);
      await assentar();
    }

    it('não acende dois itens ao mesmo tempo na home', async () => {
      await irPara('/');

      expect(raiz.querySelectorAll('.menu__link--ativo')).toHaveLength(0);
    });

    it('acende o item da página quando ele não tem fragmento', async () => {
      await irPara('/sobre');

      const ativos = Array.from(raiz.querySelectorAll('.menu__link--ativo'));
      expect(ativos).toHaveLength(1);
      expect(ativos[0]?.textContent).toBe('Sobre mim');
    });
  });

  describe('fechamento', () => {
    beforeEach(async () => {
      botaoDoMenu().click();
      await assentar();
    });

    it('fecha no Esc e devolve o foco ao botão', async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await assentar();

      expect(botaoDoMenu().getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(botaoDoMenu());
    });

    it('fecha ao clicar fora do cabeçalho', async () => {
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await assentar();

      expect(botaoDoMenu().getAttribute('aria-expanded')).toBe('false');
    });

    it('não se fecha sozinho quando o clique é no próprio botão', async () => {
      expect(botaoDoMenu().getAttribute('aria-expanded')).toBe('true');
    });
  });
});
