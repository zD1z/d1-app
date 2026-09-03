import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';

@Component({
  selector: 'app-apresentacao',
  templateUrl: './apresentacao.html',
  styleUrl: './apresentacao.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Apresentacao {
  protected readonly perfil = CONTEUDO.perfil;
}
