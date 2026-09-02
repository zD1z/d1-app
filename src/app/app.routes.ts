import { Routes } from '@angular/router';
import { Home } from './paginas/home/home';

export const routes: Routes = [
  // Página única: carregar sob demanda só custaria uma ida à rede a mais.
  { path: '', pathMatch: 'full', title: 'Danilo Pereira da Silva · Engenheiro de software', component: Home },

  // Qualquer outro caminho volta para a home. O 404.html do GitHub Pages
  // entrega o mesmo index.html, então o roteador resolve a rota daqui.
  { path: '**', redirectTo: '' },
];
