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

  readonly fragmento?: string;
}

@Component({
  selector: 'app-cabecalho',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './cabecalho.html',
  styleUrl: './cabecalho.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'fecharComTeclado()',
    '(document:click)': 'fecharAoClicarFora($event)',
  },
})
export class Cabecalho {
  private readonly elemento = inject(ElementRef<HTMLElement>);
  private readonly alternador = viewChild.required<ElementRef<HTMLButtonElement>>('alternador');

  protected readonly itens: readonly ItemDeMenu[] = [
    { rotulo: 'Soluções', rota: '/', fragmento: 'solucoes' },
    { rotulo: 'Como funciona', rota: '/', fragmento: 'como-funciona' },
    { rotulo: 'Sobre mim', rota: '/sobre' },
  ];

  protected readonly menuAberto = signal(false);

  protected classeDeAtivo(item: ItemDeMenu): string {
    return item.fragmento === undefined ? 'menu__link--ativo' : '';
  }

  protected alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  protected fecharMenu(): void {
    this.menuAberto.set(false);
  }

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

    const alvo = evento.target;
    if (alvo instanceof Node && this.elemento.nativeElement.contains(alvo)) {
      return;
    }

    this.fecharMenu();
  }
}
