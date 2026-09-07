import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CONTEUDO } from '../../../../core/conteudo/perfil';
import { partirBordao } from '../../../../core/texto/bordao';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly oferta = CONTEUDO.oferta;

  /** Ver `core/texto/bordao.ts`: o destaque sai em cor sem virar HTML no conteúdo. */
  protected readonly partesDoBordao = computed(() =>
    partirBordao(this.oferta.bordao, this.oferta.bordaoDestaque),
  );
}
