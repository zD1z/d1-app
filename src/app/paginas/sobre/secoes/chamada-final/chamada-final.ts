import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTEUDO } from '../../../../core/conteudo/perfil';

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
