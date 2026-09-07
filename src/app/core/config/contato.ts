/**
 * Os dois endereços públicos de que o formulário de contato precisa.
 *
 * Nenhum dos dois é segredo: a URL aparece no tráfego da página e a chave do
 * Turnstile é a metade pública do par, feita para ficar no HTML. O que protege
 * o endpoint é o CORS restrito à origem, o desafio e o limite por IP, tudo do
 * lado de lá, no repositório `d1-app-api`.
 *
 * **Enquanto os dois estiverem vazios, o formulário fica desligado** e a seção
 * de contato volta a ser o `mailto:` de sempre. É o estado do site antes de a
 * infraestrutura subir, e também a rede de segurança se um dia ela cair.
 */
export interface ConfiguracaoDeContato {
  /** O endpoint do HTTP API. Sai do `terraform output url_do_endpoint`. */
  readonly endpoint: string;
  /** A site key do Turnstile, do painel da Cloudflare. */
  readonly chaveDoTurnstile: string;
}

export const CONFIGURACAO_DE_CONTATO: ConfiguracaoDeContato = {
  endpoint: 'https://1k63v9hd31.execute-api.sa-east-1.amazonaws.com/contato',
  chaveDoTurnstile: '0x4AAAAAAEq266D4jcHhczJT',
};

/** O formulário só aparece quando os dois endereços existem. */
export function formularioEstaLigado(
  configuracao: ConfiguracaoDeContato = CONFIGURACAO_DE_CONTATO,
): boolean {
  return configuracao.endpoint.trim() !== '' && configuracao.chaveDoTurnstile.trim() !== '';
}
