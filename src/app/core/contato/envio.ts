export interface PedidoDeContato {
  readonly nome: string;
  readonly ideia: string;
  readonly contato: string;
  readonly abertoEm: number;
  readonly armadilha: string;
  readonly turnstile: string;
}

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
