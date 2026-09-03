import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Apresentacao } from './secoes/apresentacao/apresentacao';
import { Projetos } from './secoes/projetos/projetos';
import { Sobre } from './secoes/sobre/sobre';
import { Trajetoria } from './secoes/trajetoria/trajetoria';
import { ChamadaFinal } from './secoes/chamada-final/chamada-final';

@Component({
  selector: 'app-pagina-sobre',
  imports: [Apresentacao, Sobre, Trajetoria, Projetos, ChamadaFinal],
  templateUrl: './pagina-sobre.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginaSobre {}
