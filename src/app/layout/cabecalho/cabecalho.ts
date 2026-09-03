import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
})
export class Cabecalho {
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

  protected alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  protected fecharMenu(): void {
    this.menuAberto.set(false);
  }
}
