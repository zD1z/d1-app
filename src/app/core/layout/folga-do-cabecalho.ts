/**
 * Altura do cabeçalho fixo, lida do token `--altura-do-cabecalho` do
 * `styles.css`. É o valor que desloca a âncora do roteador para o alvo não
 * pousar embaixo da barra.
 *
 * A leitura acontece aqui, e não direto no `app.config.ts`, para o
 * comportamento poder ser testado sem subir a aplicação inteira.
 */
export function folgaDoCabecalho(elemento: HTMLElement = document.documentElement): number {
  const token = getComputedStyle(elemento).getPropertyValue('--altura-do-cabecalho');
  const folga = Number.parseFloat(token);

  // O zero de reserva não é uma segunda cópia do valor. O CSS chega ao
  // navegador antes do JavaScript, então o token sempre existe aqui, e o zero
  // só apareceria se alguém apagasse o token do `:root`. Nesse caso a âncora
  // volta a pousar sob o cabeçalho, e o defeito salta na primeira navegação
  // por menu em vez de ficar escondido atrás de um 96 duplicado.
  return Number.isFinite(folga) ? folga : 0;
}
