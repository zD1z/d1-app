import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';

@Component({
  selector: 'app-trajetoria',
  templateUrl: './trajetoria.html',
  styleUrl: './trajetoria.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Trajetoria {
  protected readonly trajetoria = CONTEUDO.trajetoria;
}
