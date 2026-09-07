import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface ItemDeMenu {
  readonly rotulo: string;
  readonly rota: string;
  /** Âncora dentro da rota. Ausente = topo da página. */
  readonly fragmento?: string;
}

@Component({
  selector: 'app-cabecalho',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './cabecalho.html',
  styleUrl: './cabecalho.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // O menu aberto é um painel sobre a página, e painel que abre precisa
    // fechar do jeito que todo mundo já tenta: `Esc` e clique fora. Sem isso,
    // o único caminho de volta era achar o mesmo botão de novo.
    '(document:keydown.escape)': 'fecharComTeclado()',
    '(document:click)': 'fecharAoClicarFora($event)',
  },
})
export class Cabecalho {
  private readonly elemento = inject(ElementRef<HTMLElement>);
  private readonly alternador = viewChild.required<ElementRef<HTMLButtonElement>>('alternador');

  /**
   * Os itens levam rota **e** fragmento porque o site tem duas páginas: um
   * `href="#solucoes"` só funcionaria estando na home, e quebraria em /sobre.
   */
  protected readonly itens: readonly ItemDeMenu[] = [
    { rotulo: 'Soluções', rota: '/', fragmento: 'solucoes' },
    { rotulo: 'Como funciona', rota: '/', fragmento: 'como-funciona' },
    { rotulo: 'Sobre mim', rota: '/sobre' },
  ];

  protected readonly menuAberto = signal(false);

  /**
   * Só item sem fragmento acende. Os dois primeiros apontam para a mesma rota
   * `/`, então marcar por rota deixava "Soluções" e "Como funciona" ativos ao
   * mesmo tempo, em qualquer ponto da home: dois itens acesos nunca disseram
   * onde a pessoa está. Saber a seção visível exigiria observar a rolagem, que
   * é caro demais para três itens de menu.
   */
  protected classeDeAtivo(item: ItemDeMenu): string {
    return item.fragmento === undefined ? 'menu__link--ativo' : '';
  }

  protected alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  protected fecharMenu(): void {
    this.menuAberto.set(false);
  }

  /** O foco volta para o botão que abriu, senão ele fica órfão no documento. */
  protected fecharComTeclado(): void {
    if (!this.menuAberto()) {
      return;
    }

    this.fecharMenu();
    this.alternador().nativeElement.focus();
  }

  protected fecharAoClicarFora(evento: Event): void {
    if (!this.menuAberto()) {
      return;
    }

    // O clique no próprio botão chega aqui depois de `alternarMenu`, e sem esta
    // saída ele reabriria e fecharia na mesma ação.
    const alvo = evento.target;
    if (alvo instanceof Node && this.elemento.nativeElement.contains(alvo)) {
      return;
    }

    this.fecharMenu();
  }
}
