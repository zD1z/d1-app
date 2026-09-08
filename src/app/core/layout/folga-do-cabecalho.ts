export function folgaDoCabecalho(elemento: HTMLElement = document.documentElement): number {
  const token = getComputedStyle(elemento).getPropertyValue('--altura-do-cabecalho');
  const folga = Number.parseFloat(token);

  return Number.isFinite(folga) ? folga : 0;
}
