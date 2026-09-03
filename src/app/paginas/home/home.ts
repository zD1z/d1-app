import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Contato } from './secoes/contato/contato';
import { Hero } from './secoes/hero/hero';
import { QuemFaz } from './secoes/quem-faz/quem-faz';
import { Solucoes } from './secoes/solucoes/solucoes';

@Component({
  selector: 'app-home',
  imports: [Hero, Solucoes, QuemFaz, Contato],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
