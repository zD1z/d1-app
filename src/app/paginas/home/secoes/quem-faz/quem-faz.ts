import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTEUDO } from '../../../../core/conteudo/perfil';

@Component({
  selector: 'app-quem-faz',
  imports: [RouterLink],
  templateUrl: './quem-faz.html',
  styleUrl: './quem-faz.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuemFaz {
  protected readonly perfil = CONTEUDO.perfil;
  protected readonly oferta = CONTEUDO.oferta;
  protected readonly numeros = CONTEUDO.numeros;
}
