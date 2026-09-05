/**
 * Formato do conteúdo do site. Os dados vivem em `core/conteudo/perfil.ts`,
 * arquivo único e sem dependência de framework, e o único lugar a editar
 * para mudar qualquer texto da página.
 */

export interface Perfil {
  readonly nome: string;
  readonly apelido: string;
  readonly titulo: string;
  /** Uma frase. Aparece no hero, logo abaixo do nome. */
  readonly chamada: string;
  readonly localizacao: string;
  readonly desdeAno: number;
  /**
   * Uma linha no lugar da linha do tempo. O currículo detalhado vive no
   * LinkedIn, que atualiza sozinho e não envelhece aqui sem ninguém notar.
   */
  readonly resumoDeCarreira: string;
  /** Liga o selo "disponível para novos projetos" no hero. */
  readonly disponivel: boolean;
}

/** A oferta comercial. É o que a home diz antes de qualquer coisa sobre mim. */
export interface Oferta {
  /** O bordão. Vira o `h1` da home, a primeira coisa que alguém lê. */
  readonly bordao: string;
  /** O trecho do bordão a destacar em cor. Precisa existir dentro de `bordao`. */
  readonly bordaoDestaque: string;
  /** Um parágrafo. Explica o bordão para quem não é técnico. */
  readonly subtitulo: string;
  /** Duas ou três frases. Fecha a faixa "quem faz" da home e leva para /sobre. */
  readonly quemFaz: string;
}

export interface Numero {
  readonly valor: string;
  readonly rotulo: string;
}

export interface Tecnologia {
  readonly nome: string;
  /**
   * Chave em `core/icones/icones.ts`. Sem ela, o cartão desenha um monograma
   * com as iniciais, que é o caso das marcas cujo símbolo não pode ser
   * redistribuído.
   */
  readonly icone?: string;
  /** Iniciais do monograma. Só é lido quando não há ícone. */
  readonly sigla?: string;
  /** Uma frase dizendo onde isso foi usado. É o que separa lista de prova. */
  readonly prova: string;
}

export interface GrupoDeTecnologias {
  readonly grupo: string;
  readonly itens: readonly Tecnologia[];
}

/** Uma combinação típica de stack, ligando as tecnologias à oferta da home. */
export interface Combinacao {
  readonly titulo: string;
  readonly descricao: string;
  readonly pecas: readonly string[];
}

/** Ícone da seção "Soluções". Cada chave tem um SVG no template. */
export type ChaveDeIcone = 'sistema' | 'automacao' | 'dados' | 'integracao';

export interface Servico {
  readonly icone: ChaveDeIcone;
  readonly titulo: string;
  readonly descricao: string;
}

export interface EtapaDoProcesso {
  readonly titulo: string;
  readonly descricao: string;
}

export interface Contato {
  readonly email: string;
  readonly linkedin: string;
  /** Fecha a seção de contato. Uma frase de convite. */
  readonly convite: string;
}

export interface Conteudo {
  readonly perfil: Perfil;
  readonly oferta: Oferta;
  readonly numeros: readonly Numero[];
  readonly tecnologias: readonly GrupoDeTecnologias[];
  readonly combinacoes: readonly Combinacao[];
  readonly servicos: readonly Servico[];
  readonly processo: readonly EtapaDoProcesso[];
  readonly contato: Contato;
}
