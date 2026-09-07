import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';
import { formularioEstaLigado } from '../../../../core/config/contato';
import { FormularioDeIdeia } from './formulario-de-ideia/formulario-de-ideia';

@Component({
  selector: 'app-contato',
  imports: [FormularioDeIdeia],
  templateUrl: './contato.html',
  styleUrl: './contato.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contato {
  protected readonly contato = CONTEUDO.contato;

  /**
   * Com o endpoint configurado, o botão abre o formulário. Sem ele, a seção
   * volta a ser o `mailto:` de sempre, que é como o site funcionou até a
   * infraestrutura de envio existir.
   */
  protected readonly temFormulario = formularioEstaLigado();

  private readonly formulario = viewChild(FormularioDeIdeia);

  /**
   * Assunto pré-preenchido no cliente de e-mail. Continua vivo mesmo com o
   * formulário ligado: é a saída de quem não quer preencher caixa, e a rede de
   * segurança se o envio falhar.
   */
  protected get enderecoDeEmail(): string {
    const assunto = encodeURIComponent('Tenho uma ideia');
    return `mailto:${this.contato.email}?subject=${assunto}`;
  }

  protected abrirFormulario(): void {
    this.formulario()?.abrir();
  }
}
