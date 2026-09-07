/**
 * A conversa com o endpoint. Isolada da tela para o teste poder trocar o `fetch`
 * por um dublê e cobrir cada resposta sem rede.
 */

/** O corpo que viaja. É o contrato, e o espelho de `src/tipos.ts` no d1-app-api. */
export interface PedidoDeContato {
  readonly ideia: string;
  readonly contato: string;
  readonly abertoEm: number;
  readonly armadilha: string;
  readonly turnstile: string;
}

/**
 * O que a tela precisa saber. Os motivos detalhados que o endpoint devolve não
 * sobem até aqui de propósito: para quem está enviando, "recusado" e
 * "armadilha" pedem a mesma frase na tela.
 */
export type ResultadoDoEnvio = 'enviado' | 'limite' | 'recusado' | 'falha';

export async function enviarIdeia(
  pedido: PedidoDeContato,
  endpoint: string,
  buscar: typeof fetch = fetch,
): Promise<ResultadoDoEnvio> {
  let resposta: Response;

  try {
    resposta = await buscar(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(pedido),
    });
  } catch {
    // Rede fora, CORS recusado, aba fechando. Nada disso é culpa de quem
    // escreveu, e a tela oferece o `mailto:` como saída.
    return 'falha';
  }

  if (resposta.status === 202) {
    return 'enviado';
  }
  if (resposta.status === 429) {
    return 'limite';
  }
  if (resposta.status === 400) {
    return 'recusado';
  }
  return 'falha';
}
