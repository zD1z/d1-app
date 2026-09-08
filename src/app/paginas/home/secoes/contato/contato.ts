import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';
import { AberturaDoFormulario, FORMULARIO_LIGADO } from '../../../../core/contato/abertura';
import { FormularioDeIdeia } from './formulario-de-ideia/formulario-de-ideia';

@Component({
  selector: 'app-contato',
  imports: [FormularioDeIdeia],
  templateUrl: './contato.html',
  styleUrl: './contato.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contato {
  private readonly abertura = inject(AberturaDoFormulario);

  protected readonly contato = CONTEUDO.contato;

  protected readonly temFormulario = inject(FORMULARIO_LIGADO);

  protected readonly enderecoDeEmail = `mailto:${CONTEUDO.contato.email}?subject=${encodeURIComponent(
    'Tenho uma ideia',
  )}`;

  protected abrirFormulario(): void {
    this.abertura.pedir();
  }
}
