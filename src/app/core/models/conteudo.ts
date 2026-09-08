import type { ChaveDeIconeDeMarca } from '../icones/icones';
import type { ChaveDeIcone } from '../icones/icones-de-servico';

export interface Perfil {
  readonly nome: string;
  readonly titulo: string;

  readonly chamada: string;
  readonly localizacao: string;

  readonly resumoDeCarreira: string;
}

export interface Oferta {
  readonly bordao: string;

  readonly bordaoDestaque: string;

  readonly subtitulo: string;

  readonly reasseguranca: string;

  readonly quemFaz: string;
}

export interface Numero {
  readonly valor: string;
  readonly rotulo: string;
}

interface DadosDaTecnologia {
  readonly nome: string;

  readonly prova: string;
}

export type Tecnologia = DadosDaTecnologia &
  (
    | {
        readonly icone: ChaveDeIconeDeMarca;
        readonly sigla?: never;
      }
    | {
        readonly icone?: never;

        readonly sigla: string;
      }
  );

export interface GrupoDeTecnologias {
  readonly grupo: string;
  readonly itens: readonly Tecnologia[];
}

export interface Combinacao {
  readonly titulo: string;
  readonly descricao: string;
  readonly pecas: readonly string[];
}

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
