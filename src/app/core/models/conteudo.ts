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
  /** Dois ou três parágrafos. Aparece na seção "Sobre". */
  readonly sobre: readonly string[];
  readonly localizacao: string;
  readonly desdeAno: number;
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

export interface GrupoDeHabilidades {
  readonly grupo: string;
  readonly itens: readonly string[];
}

export interface Experiencia {
  readonly organizacao: string;
  readonly cargo: string;
  readonly periodo: string;
  /** Marca o item como o atual na linha do tempo. */
  readonly atual: boolean;
  readonly descricao: string;
  /** O que foi entregue de concreto. Verbo no passado, resultado no fim. */
  readonly entregas: readonly string[];
  readonly stack: readonly string[];
}

export interface Projeto {
  readonly nome: string;
  readonly ano: string;
  readonly papel: string;
  /** Uma linha. É o subtítulo do cartão. */
  readonly resumo: string;
  readonly descricao: string;
  /** Decisões técnicas que valem ser contadas. */
  readonly destaques: readonly string[];
  readonly stack: readonly string[];
  readonly link?: string;
  readonly repositorio?: string;
  /** Projeto fechado: o cartão mostra o selo e não oferece link. */
  readonly privado: boolean;
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
  /** Opcional: sem e-mail, a seção de contato simplesmente não mostra o botão. */
  readonly email?: string;
  readonly github: string;
  readonly linkedin?: string;
  /** Fecha a seção de contato. Uma frase de convite. */
  readonly convite: string;
}

export interface Conteudo {
  readonly perfil: Perfil;
  readonly oferta: Oferta;
  readonly numeros: readonly Numero[];
  readonly habilidades: readonly GrupoDeHabilidades[];
  readonly trajetoria: readonly Experiencia[];
  readonly projetos: readonly Projeto[];
  readonly servicos: readonly Servico[];
  readonly processo: readonly EtapaDoProcesso[];
  readonly contato: Contato;
}
