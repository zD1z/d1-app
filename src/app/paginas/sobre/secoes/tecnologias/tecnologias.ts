import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';
import { ICONES } from '../../../../core/icones/icones';

@Component({
  selector: 'app-tecnologias',
  templateUrl: './tecnologias.html',
  styleUrl: './tecnologias.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tecnologias {
  protected readonly grupos = CONTEUDO.tecnologias;

  protected caminhoDoIcone(chave: string | undefined): string | null {
    return chave ? (ICONES[chave]?.caminho ?? null) : null;
  }

  /** Cor oficial da marca, aplicada só no hover por uma custom property. */
  protected corDaMarca(chave: string | undefined): string | null {
    return chave ? (ICONES[chave]?.cor ?? null) : null;
  }
}
