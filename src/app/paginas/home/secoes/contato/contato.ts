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

  /**
   * Com o endpoint configurado, o botão abre o formulário. Sem ele, a seção
   * volta a ser o `mailto:` de sempre, que é como o site funcionou até a
   * infraestrutura de envio existir.
   */
  protected readonly temFormulario = inject(FORMULARIO_LIGADO);

  /**
   * Assunto pré-preenchido no cliente de e-mail. Continua vivo mesmo com o
   * formulário ligado: é a saída de quem não quer preencher caixa, e a rede de
   * segurança se o envio falhar.
   *
   * Valor pronto, e não `get`: a montagem não depende de nada que mude, e como
   * `get` ela rodava a cada ciclo de detecção, duas vezes por passada.
   */
  protected readonly enderecoDeEmail = `mailto:${CONTEUDO.contato.email}?subject=${encodeURIComponent(
    'Tenho uma ideia',
  )}`;

  /**
   * O mesmo caminho que o botão do hero usa. Os dois pontos de entrada passam
   * pelo serviço, então existe um jeito só de a caixa abrir.
   */
  protected abrirFormulario(): void {
    this.abertura.pedir();
  }
}
