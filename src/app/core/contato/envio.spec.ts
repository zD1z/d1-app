import { describe, expect, it, vi } from 'vitest';
import { enviarIdeia, type PedidoDeContato } from './envio';

const PEDIDO: PedidoDeContato = {
  nome: 'Diego',
  ideia: 'Preciso de um sistema para controlar as entregas da minha loja.',
  contato: 'pessoa@exemplo.com.br',
  abertoEm: 1_800_000_000_000,
  armadilha: '',
  turnstile: 'token',
};

const ENDPOINT = 'https://exemplo.lambda-url.sa-east-1.on.aws/';

function respondendo(status: number): typeof fetch {
  return vi.fn().mockResolvedValue(new Response(null, { status })) as unknown as typeof fetch;
}

describe('enviarIdeia', () => {
  it.each([
    [202, 'enviado'],
    [429, 'limite'],
    [400, 'recusado'],
    [500, 'falha'],
    [403, 'falha'],
  ])('traduz %i em %s', async (status, esperado) => {
    await expect(enviarIdeia(PEDIDO, ENDPOINT, respondendo(status))).resolves.toBe(esperado);
  });

  it('trata falha de rede como falha, sem estourar', async () => {
    const buscar = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(enviarIdeia(PEDIDO, ENDPOINT, buscar as unknown as typeof fetch)).resolves.toBe(
      'falha',
    );
  });

  it('manda o pedido inteiro, em JSON, por POST', async () => {
    const buscar = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));

    await enviarIdeia(PEDIDO, ENDPOINT, buscar as unknown as typeof fetch);

    const [endereco, opcoes] = buscar.mock.calls[0] as [string, RequestInit];
    expect(endereco).toBe(ENDPOINT);
    expect(opcoes.method).toBe('POST');
    expect(JSON.parse(String(opcoes.body))).toEqual(PEDIDO);
  });
});
