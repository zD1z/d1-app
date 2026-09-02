import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTEUDO } from '../../core/conteudo/perfil';

@Component({
  selector: 'app-rodape',
  templateUrl: './rodape.html',
  styleUrl: './rodape.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Rodape {
  protected readonly perfil = CONTEUDO.perfil;
  protected readonly contato = CONTEUDO.contato;
  protected readonly ano = new Date().getFullYear();
}
