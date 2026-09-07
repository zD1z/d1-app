import { Injectable, InjectionToken, signal } from '@angular/core';
import { formularioEstaLigado } from '../config/contato';

/**
 * Se a caixa de ideia existe nesta build.
 *
 * É um token, e não uma chamada direta a `formularioEstaLigado()` dentro de
 * cada componente, por dois motivos. O primeiro é que agora são dois
 * componentes lendo a mesma decisão, o hero e o contato, e ela precisa ser a
 * mesma nos dois. O segundo é de teste: com a configuração real preenchida, o
 * caminho de emergência (formulário desligado, botão volta a ser âncora para
 * `#contato`) seria inalcançável pela suíte. Trocando o token no TestBed, os
 * dois caminhos ficam cobertos.
 */
export const FORMULARIO_LIGADO = new InjectionToken<boolean>('FORMULARIO_LIGADO', {
  providedIn: 'root',
  factory: () => formularioEstaLigado(),
});

/**
 * O pedido de abrir a caixa de ideia, feito de qualquer lugar da home.
 *
 * Existe porque a chamada principal do hero passou a abrir o formulário num
 * clique. Antes ela era uma âncora para `#contato`: a pessoa mais decidida da
 * visita rolava a página inteira para encontrar um segundo botão com o mesmo
 * rótulo, e o primeiro clique parecia não ter funcionado. O `<dialog>` mora
 * dentro da seção de contato, longe do hero na árvore, então o recado viaja
 * por aqui em vez de por uma cadeia de `output`.
 *
 * **É um contador, e não um booleano.** Abrir, fechar e abrir de novo são dois
 * pedidos distintos; um booleano ficaria em `true` depois do primeiro e o
 * segundo clique não mudaria valor nenhum, então nada aconteceria.
 */
@Injectable({ providedIn: 'root' })
export class AberturaDoFormulario {
  private readonly pedidos = signal(0);

  /** Quantas vezes alguém pediu a caixa. Zero é "ainda ninguém pediu". */
  readonly pedido = this.pedidos.asReadonly();

  pedir(): void {
    this.pedidos.update((quantos) => quantos + 1);
  }
}
