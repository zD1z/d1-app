import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly oferta = CONTEUDO.oferta;

  /**
   * Quebra o bordão em antes / destaque / depois, para "D1 App" sair em cor
   * sem que o texto precise virar HTML no arquivo de conteúdo.
   */
  protected readonly partesDoBordao = computed(() => {
    const { bordao, bordaoDestaque } = this.oferta;
    const corte = bordao.indexOf(bordaoDestaque);
    if (corte < 0) {
      return { antes: bordao, destaque: '', depois: '' };
    }
    return {
      antes: bordao.slice(0, corte),
      destaque: bordaoDestaque,
      depois: bordao.slice(corte + bordaoDestaque.length),
    };
  });
}
