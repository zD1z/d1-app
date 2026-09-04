import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';

@Component({
  selector: 'app-combinacoes',
  templateUrl: './combinacoes.html',
  styleUrl: './combinacoes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Combinacoes {
  protected readonly combinacoes = CONTEUDO.combinacoes;
}
