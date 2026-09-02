import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.html',
  styleUrl: './contato.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contato {
  protected readonly contato = CONTEUDO.contato;

  /**
   * Assunto pré-preenchido no cliente de e-mail. O site é estático: não há
   * formulário nem backend para receber envio, e o `mailto:` resolve sem isso.
   */
  protected get enderecoDeEmail(): string {
    const assunto = encodeURIComponent('Tenho uma ideia');
    return `mailto:${this.contato.email ?? ''}?subject=${assunto}`;
  }
}
