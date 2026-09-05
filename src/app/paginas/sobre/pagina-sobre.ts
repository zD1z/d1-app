import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Apresentacao } from './secoes/apresentacao/apresentacao';
import { ChamadaFinal } from './secoes/chamada-final/chamada-final';
import { Combinacoes } from './secoes/combinacoes/combinacoes';
import { Tecnologias } from './secoes/tecnologias/tecnologias';

@Component({
  selector: 'app-pagina-sobre',
  imports: [Apresentacao, Tecnologias, Combinacoes, ChamadaFinal],
  templateUrl: './pagina-sobre.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginaSobre {}
