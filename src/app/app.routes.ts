import { Routes } from '@angular/router';
import { Home } from './paginas/home/home';

export const routes: Routes = [
  // A home é a oferta. Carregar sob demanda a primeira página só custaria
  // uma ida à rede a mais, então ela entra no bundle inicial.
  {
    path: '',
    pathMatch: 'full',
    title: 'D1 App para sua ideia',
    component: Home,
  },
  {
    path: 'sobre',
    title: 'Danilo Pereira da Silva · Engenheiro de software',
    loadComponent: () => import('./paginas/sobre/pagina-sobre').then((m) => m.PaginaSobre),
  },
  // Qualquer outro caminho volta para a home. O 404.html do GitHub Pages
  // entrega o mesmo index.html, então o roteador resolve a rota daqui.
  { path: '**', redirectTo: '' },
];
