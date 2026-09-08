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

  protected desenhoDoIcone(chave: ChaveDeIcone): readonly string[] {
    return ICONES_DE_SERVICO[chave];
  }
}
