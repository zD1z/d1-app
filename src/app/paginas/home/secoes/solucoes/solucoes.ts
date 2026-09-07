import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';
import { ICONES_DE_SERVICO, type ChaveDeIcone } from '../../../../core/icones/icones-de-servico';

@Component({
  selector: 'app-solucoes',
  templateUrl: './solucoes.html',
  styleUrl: './solucoes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Solucoes {
  protected readonly servicos = CONTEUDO.servicos;
  protected readonly processo = CONTEUDO.processo;

  /** Os traçados do ícone, desenhados como uma lista de `<path>`. */
  protected desenhoDoIcone(chave: ChaveDeIcone): readonly string[] {
    return ICONES_DE_SERVICO[chave];
  }
}
