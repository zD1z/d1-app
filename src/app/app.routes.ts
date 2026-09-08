import { Routes } from '@angular/router';
import type { DadosDeMeta } from './core/seo/meta-da-rota';
import { Home } from './paginas/home/home';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'D1 App para sua ideia',

    data: {
      descricao:
        'Transformo sua ideia em software sob medida, seja sistema, automação ou integração. ' +
        'Quinze anos construindo sistemas em que a falha é cara e aparece na hora.',
    } satisfies DadosDeMeta,
    component: Home,
  },
  {
    path: 'sobre',
    title: 'Danilo Pereira da Silva · Engenheiro de software',
    data: {
      descricao:
        'As tecnologias com que eu trabalho e onde cada uma foi usada de verdade: Angular, ' +
        '.NET, Java, Python, PostgreSQL, AWS e Azure.',
    } satisfies DadosDeMeta,
    loadComponent: () => import('./paginas/sobre/pagina-sobre').then((m) => m.PaginaSobre),
  },

  { path: '**', redirectTo: '' },
];
