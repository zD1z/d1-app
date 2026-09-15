import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';
import {
  CONTRASTE_DO_ICONE,
  CONTRASTE_DO_MONOGRAMA,
  coresLegiveis,
  type CoresLegiveis,
} from '../../../../core/cor/contraste';
import { ICONES, type ChaveDeIconeDeMarca } from '../../../../core/icones/icones';
import type { Tecnologia } from '../../../../core/models/conteudo';

function coresDaMarca(item: Tecnologia): CoresLegiveis | null {
  if (item.icone) {
    const cor = ICONES[item.icone].cor;
    return cor ? coresLegiveis(cor, CONTRASTE_DO_ICONE) : null;
  }

  return item.cor ? coresLegiveis(item.cor, CONTRASTE_DO_MONOGRAMA) : null;
}

@Component({
  selector: 'app-tecnologias',
  templateUrl: './tecnologias.html',
  styleUrl: './tecnologias.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tecnologias {
  protected readonly grupos = CONTEUDO.tecnologias.map((grupo) => ({
    ...grupo,
    itens: grupo.itens.map((item) => ({ ...item, cores: coresDaMarca(item) })),
  }));

  protected caminhoDoIcone(chave: ChaveDeIconeDeMarca | undefined): string | null {
    return chave ? ICONES[chave].caminho : null;
  }
}
