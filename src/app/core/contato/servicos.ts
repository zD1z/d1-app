import { Injectable } from '@angular/core';
import { CONFIGURACAO_DE_CONTATO } from '../config/contato';
import { enviarIdeia, type PedidoDeContato, type ResultadoDoEnvio } from './envio';
import { carregarTurnstile, type ApiDoTurnstile } from './turnstile';

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
