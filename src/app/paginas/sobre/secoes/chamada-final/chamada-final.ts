import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTEUDO } from '../../../../core/conteudo/perfil';

/** Fecha a página /sobre devolvendo o visitante para a oferta da home. */
@Component({
  selector: 'app-chamada-final',
  imports: [RouterLink],
  templateUrl: './chamada-final.html',
  styleUrl: './chamada-final.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChamadaFinal {
  protected readonly oferta = CONTEUDO.oferta;
}
