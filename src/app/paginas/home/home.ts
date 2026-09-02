import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Contato } from './secoes/contato/contato';
import { Hero } from './secoes/hero/hero';
import { Projetos } from './secoes/projetos/projetos';
import { Sobre } from './secoes/sobre/sobre';
import { Solucoes } from './secoes/solucoes/solucoes';
import { Trajetoria } from './secoes/trajetoria/trajetoria';

@Component({
  selector: 'app-home',
  imports: [Hero, Sobre, Trajetoria, Projetos, Solucoes, Contato],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
