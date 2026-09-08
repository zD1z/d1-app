import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';
import { ICONES, type ChaveDeIconeDeMarca } from '../../../../core/icones/icones';

@Component({
  selector: 'app-tecnologias',
  templateUrl: './tecnologias.html',
  styleUrl: './tecnologias.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tecnologias {
  protected readonly grupos = CONTEUDO.tecnologias;

  protected caminhoDoIcone(chave: ChaveDeIconeDeMarca | undefined): string | null {
    return chave ? ICONES[chave].caminho : null;
  }

  protected corDaMarca(chave: ChaveDeIconeDeMarca | undefined): string | null {
    return chave ? ICONES[chave].cor : null;
  }
}
