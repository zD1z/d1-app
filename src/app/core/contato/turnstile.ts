/**
 * O desafio da Cloudflare, carregado sob demanda.
 *
 * O script só entra na página quando alguém abre o formulário. Numa visita que
 * não chega ao contato, o site continua sem fazer requisição externa nenhuma,
 * que é como ele foi construído.
 */

const ENDERECO_DO_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export interface OpcoesDoDesafio {
  readonly sitekey: string;
  readonly callback: (token: string) => void;
  readonly 'error-callback': () => void;
  readonly 'expired-callback': () => void;
  readonly theme: 'auto' | 'light' | 'dark';
  readonly language: string;
}

export interface ApiDoTurnstile {
  render(elemento: HTMLElement, opcoes: OpcoesDoDesafio): string;
  reset(id: string): void;
  remove(id: string): void;
}

declare global {
  interface Window {
    turnstile?: ApiDoTurnstile;
  }
}

let carregamento: Promise<ApiDoTurnstile> | null = null;

/**
 * Injeta o script uma vez por página e devolve a API. Chamadas seguintes
 * reaproveitam a mesma promessa, então abrir e fechar o formulário várias vezes
 * não baixa nada de novo.
 */
export function carregarTurnstile(documento: Document = document): Promise<ApiDoTurnstile> {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  carregamento ??= new Promise<ApiDoTurnstile>((resolver, rejeitar) => {
    const script = documento.createElement('script');
    script.src = ENDERECO_DO_SCRIPT;
    script.async = true;
    script.defer = true;

    script.addEventListener('load', () => {
      if (window.turnstile) {
        resolver(window.turnstile);
      } else {
        rejeitar(new Error('O script do Turnstile carregou sem expor a API'));
      }
    });

    script.addEventListener('error', () => {
      // A promessa guardada é descartada para uma tentativa seguinte poder
      // baixar de novo, em vez de herdar a falha para sempre.
      carregamento = null;
      rejeitar(new Error('Não foi possível carregar o Turnstile'));
    });

    documento.head.append(script);
  });

  return carregamento;
}

/** Só para o teste: derruba a promessa guardada entre um caso e outro. */
export function esquecerTurnstile(): void {
  carregamento = null;
}
