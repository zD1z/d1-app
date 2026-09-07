/**
 * Ícones da seção "Soluções". Diferente dos ícones de marca em `icones.ts`,
 * estes são desenhos próprios, traçados em linha sobre uma grade de 24, e não
 * representam produto de ninguém.
 *
 * Cada ícone é uma lista de `d` de `<path>`. Retângulo, círculo e elipse foram
 * escritos como caminho de propósito: com um formato só, o template desenha a
 * lista em um `@for` e não precisa de um `@switch` por primitiva.
 *
 * `ChaveDeIcone` sai das chaves deste objeto. Um serviço novo custa dois
 * arquivos, o desenho aqui e o texto em `conteudo/perfil.ts`, e uma chave que
 * não existe vira erro de compilação em vez de cartão sem ícone.
 */
export const ICONES_DE_SERVICO = {
  /** Monitor: sistema sob medida. */
  sistema: [
    'M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
    'M3 9h18M8 21h8M12 18v3',
  ],
  /** Seta em ciclo com um eixo no centro: automação de processo. */
  automacao: [
    'M21 12a9 9 0 1 1-3.2-6.9',
    'M21 3v5h-5',
    'M9.5 12a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
  ],
  /** Cilindro de banco: dados que você já tem. */
  dados: [
    'M4 5.5a8 3 0 1 0 16 0a8 3 0 1 0-16 0',
    'M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13',
    'M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  ],
  /** Dois nós ligados por trilhos: integração entre sistemas. */
  integracao: [
    'M3.5 6a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
    'M15.5 18a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
    'M8.5 6H15a3 3 0 0 1 3 3v6.5',
    'M15.5 18H9a3 3 0 0 1-3-3V8.5',
  ],
} as const satisfies Record<string, readonly string[]>;

/** Chave de `Servico.icone`. Ver o comentário acima. */
export type ChaveDeIcone = keyof typeof ICONES_DE_SERVICO;
