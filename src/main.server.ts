import { bootstrapApplication, type BootstrapContext } from '@angular/platform-browser';
import { App } from './app/app';
import { configuracaoDeRenderizacao } from './app/app.config.server';

const desenhar = (contexto: BootstrapContext) =>
  bootstrapApplication(App, configuracaoDeRenderizacao, contexto);

export default desenhar;
