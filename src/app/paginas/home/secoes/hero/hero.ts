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

  /**
   * Com o formulário ligado, a chamada principal abre a caixa num clique. Sem
   * ele, volta a ser âncora para `#contato`, que é como a home funcionou até a
   * infraestrutura de envio existir e continua sendo a rede de segurança se ela
   * cair.
   */
  protected readonly temFormulario = inject(FORMULARIO_LIGADO);

  /**
   * Ver `core/texto/bordao.ts`: o destaque sai em cor sem virar HTML no
   * conteúdo. Valor simples, e não `computed`: as duas pontas são constante de
   * módulo, então o resultado não tem como mudar.
   */
  protected readonly partesDoBordao = partirBordao(this.oferta.bordao, this.oferta.bordaoDestaque);

  protected abrirFormulario(): void {
    this.abertura.pedir();
  }
}
