import { Injectable } from '@angular/core';
import { CONFIGURACAO_DE_CONTATO } from '../config/contato';
import { enviarIdeia, type PedidoDeContato, type ResultadoDoEnvio } from './envio';
import { carregarTurnstile, type ApiDoTurnstile } from './turnstile';

/**
 * A casca injetável em volta das funções de `envio.ts` e `turnstile.ts`.
 *
 * As funções continuam puras e testadas direto. O que existe aqui é o ponto de
 * troca: o sistema de teste do Angular não deixa trocar módulo por dublê em
 * import relativo, então o componente recebe estes dois serviços por injeção e
 * o teste substitui os dois no TestBed.
 */
@Injectable({ providedIn: 'root' })
export class EnvioDeIdeias {
  enviar(pedido: PedidoDeContato): Promise<ResultadoDoEnvio> {
    return enviarIdeia(pedido, CONFIGURACAO_DE_CONTATO.endpoint);
  }
}

@Injectable({ providedIn: 'root' })
export class DesafioDeSeguranca {
  carregar(): Promise<ApiDoTurnstile> {
    return carregarTurnstile();
  }
}
