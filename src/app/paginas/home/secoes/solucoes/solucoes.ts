import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';

@Component({
  selector: 'app-solucoes',
  templateUrl: './solucoes.html',
  styleUrl: './solucoes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Solucoes {
  protected readonly servicos = CONTEUDO.servicos;
  protected readonly processo = CONTEUDO.processo;
}
