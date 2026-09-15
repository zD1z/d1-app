export const SUPERFICIE_NO_ESCURO = '#14171e';
export const SUPERFICIE_NO_CLARO = '#e8edf5';

export const CONTRASTE_DO_ICONE = 3;
export const CONTRASTE_DO_MONOGRAMA = 4.5;

const PASSOS_DE_MISTURA = 20;

type Rgb = readonly [number, number, number];

export interface CoresLegiveis {
  readonly escuro: string;
  readonly claro: string;
}

function lerHex(hex: string): Rgb {
  const valor = Number.parseInt(hex.slice(1), 16);
  return [(valor >> 16) & 255, (valor >> 8) & 255, valor & 255];
}

function escreverHex(rgb: Rgb): string {
  return `#${rgb.map((canal) => Math.round(canal).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

function luminancia([r, g, b]: Rgb): number {
  const linear = (canal: number): number => {
    const s = canal / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

export function razaoDeContraste(cor: string, fundo: string): number {
  const [maior, menor] = [luminancia(lerHex(cor)), luminancia(lerHex(fundo))].sort((a, b) => b - a);
  return (maior + 0.05) / (menor + 0.05);
}

export function corLegivel(cor: string, fundo: string, minimo: number): string {
  const origem = lerHex(cor);
  const destino: Rgb = luminancia(lerHex(fundo)) < 0.5 ? [255, 255, 255] : [0, 0, 0];
  const misturar = (i: number, t: number): number => origem[i] + (destino[i] - origem[i]) * t;

  for (let passo = 0; passo <= PASSOS_DE_MISTURA; passo++) {
    const t = passo / PASSOS_DE_MISTURA;
    const candidata = escreverHex([misturar(0, t), misturar(1, t), misturar(2, t)]);

    if (razaoDeContraste(candidata, fundo) >= minimo) {
      return candidata;
    }
  }

  return escreverHex(destino);
}

export function coresLegiveis(cor: string, minimo: number): CoresLegiveis {
  return {
    escuro: corLegivel(cor, SUPERFICIE_NO_ESCURO, minimo),
    claro: corLegivel(cor, SUPERFICIE_NO_CLARO, minimo),
  };
}
