import { mergeApplicationConfig, type ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';
import { appConfig } from './app.config';

const configuracaoDoServidor: ApplicationConfig = {
  providers: [provideServerRendering()],
};

export const configuracaoDeRenderizacao = mergeApplicationConfig(appConfig, configuracaoDoServidor);
