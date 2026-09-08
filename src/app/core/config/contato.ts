export interface ConfiguracaoDeContato {
  readonly endpoint: string;

  readonly chaveDoTurnstile: string;
}

export const CONFIGURACAO_DE_CONTATO: ConfiguracaoDeContato = {
  endpoint: 'https://1k63v9hd31.execute-api.sa-east-1.amazonaws.com/contato',
  chaveDoTurnstile: '0x4AAAAAAEq266D4jcHhczJT',
};

export function formularioEstaLigado(
  configuracao: ConfiguracaoDeContato = CONFIGURACAO_DE_CONTATO,
): boolean {
  return configuracao.endpoint.trim() !== '' && configuracao.chaveDoTurnstile.trim() !== '';
}
