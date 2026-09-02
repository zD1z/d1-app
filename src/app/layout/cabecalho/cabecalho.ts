import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface ItemDeMenu {
  readonly ancora: string;
  readonly rotulo: string;
}

@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.html',
  styleUrl: './cabecalho.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cabecalho {
  protected readonly itens: readonly ItemDeMenu[] = [
    { ancora: 'sobre', rotulo: 'Sobre' },
    { ancora: 'trajetoria', rotulo: 'Trajetória' },
    { ancora: 'projetos', rotulo: 'Projetos' },
    { ancora: 'solucoes', rotulo: 'Soluções' },
  ];

  protected readonly menuAberto = signal(false);

  protected alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  protected fecharMenu(): void {
    this.menuAberto.set(false);
  }
}
