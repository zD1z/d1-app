const ENDERECO_DO_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export interface OpcoesDoDesafio {
  readonly sitekey: string;
  readonly callback: (token: string) => void;
  readonly 'error-callback': () => void;
  readonly 'expired-callback': () => void;
  readonly theme: 'auto' | 'light' | 'dark';
  readonly language: string;

  readonly size: 'normal' | 'flexible' | 'compact';
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
      carregamento = null;
      rejeitar(new Error('Não foi possível carregar o Turnstile'));
    });

    documento.head.append(script);
  });

  return carregamento;
}

export function esquecerTurnstile(): void {
  carregamento = null;
}
