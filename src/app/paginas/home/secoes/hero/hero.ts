import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';
import { AberturaDoFormulario, FORMULARIO_LIGADO } from '../../../../core/contato/abertura';
import { partirBordao } from '../../../../core/texto/bordao';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  private readonly abertura = inject(AberturaDoFormulario);

  protected readonly oferta = CONTEUDO.oferta;

  protected readonly temFormulario = inject(FORMULARIO_LIGADO);

  protected readonly partesDoBordao = partirBordao(this.oferta.bordao, this.oferta.bordaoDestaque);

  protected abrirFormulario(): void {
    this.abertura.pedir();
  }
}
