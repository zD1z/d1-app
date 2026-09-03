import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.html',
  styleUrl: './sobre.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sobre {
  protected readonly perfil = CONTEUDO.perfil;
  protected readonly habilidades = CONTEUDO.habilidades;
}
