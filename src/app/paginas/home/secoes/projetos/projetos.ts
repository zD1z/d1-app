import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.html',
  styleUrl: './projetos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projetos {
  protected readonly projetos = CONTEUDO.projetos;
}
