import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

/** Altura do cabeçalho fixo mais um respiro. Ver `setOffset` abaixo. */
const FOLGA_DO_CABECALHO = 96;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      // As seções são âncoras na mesma página: sem isso o link com #
      // não rola quando o roteador processa a navegação.
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),

    // O `scroll-padding-top` do styles.css NAO resolve a ancora do roteador: o
    // ViewportScroller do Angular nao usa `scrollIntoView`, ele le a posicao do
    // elemento e chama `window.scrollTo`, onde nem `scroll-padding` nem
    // `scroll-margin` entram na conta. Sem este offset o alvo pousa em y=0 e o
    // cabecalho fixo cobre o titulo. O CSS continua valendo para a rolagem
    // nativa, quando o navegador processa o # antes de o Angular subir.
    provideAppInitializer(() => {
      inject(ViewportScroller).setOffset([0, FOLGA_DO_CABECALHO]);
    }),
  ],
};
