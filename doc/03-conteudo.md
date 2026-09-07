# Conteúdo

## Regra central

**Todo o texto do site vive em `src/app/core/conteudo/perfil.ts`.** Não há texto
solto em template; os componentes só desenham. O formato está descrito em
`src/app/core/models/conteudo.ts`, com um comentário por campo dizendo onde ele
aparece e que tamanho de texto cabe.

Exceções conhecidas (texto que está no template, não no `perfil.ts`):

- rótulos de navegação em `cabecalho.ts` (`Soluções`, `Como funciona`,
  `Sobre mim`, `Falar comigo`);
- rótulos numerados das seções (`01 · Soluções`, `03 · Contato`) e títulos de
  seção (`Vamos conversar`);
- textos dos botões do hero;
- meta tags e `<title>` em `src/index.html` e `app.routes.ts`.

## O modelo, bloco a bloco

### `perfil: Perfil`

Identidade. `nome`, `titulo`, `chamada`, `localizacao` e `resumoDeCarreira`
(uma linha no lugar da linha do tempo). Cinco campos, todos renderizados: os
antigos `apelido`, `desdeAno` e `disponivel` foram removidos por não aparecerem
em lugar nenhum.

### `oferta: Oferta`

A oferta comercial da home. `bordao` vira o `h1`; `bordaoDestaque` é o trecho
que sai em cor e **precisa existir literalmente dentro de `bordao`** — o
componente `Hero` fatia a string por `indexOf` e cai para "sem destaque" se não
encontrar. `subtitulo` explica o bordão para quem não é técnico. `quemFaz` fecha
a faixa de credencial e leva para `/sobre`.

### `numeros: Numero[]`

Três pares `valor` / `rotulo` exibidos na seção "quem faz": 15 anos, 11 anos em
automação, 4 setores.

### `tecnologias: GrupoDeTecnologias[]`

O coração da `/sobre`. Seis grupos — Frontend, Backend, Dados, Nuvem e
infraestrutura, Qualidade, IA aplicada — com 20 tecnologias no total. Cada item
tem:

- `icone` (chave em `core/icones/icones.ts`) **ou** `sigla` (monograma, para
  marcas sem ícone redistribuível);
- `prova`: uma frase dizendo onde aquilo foi usado. É o campo que separa lista
  de prova, e o que faz a página valer alguma coisa. Ao adicionar tecnologia,
  esse campo não é opcional na prática.

### `combinacoes: Combinacao[]`

Três arranjos típicos de stack — SaaS completo, Sistema interno sob medida,
Integração e automação — cada um com `titulo`, `descricao` e `pecas` (nomes de
tecnologia como texto livre). Existem para ligar a lista técnica de volta à
oferta comercial da home.

> As `pecas` são strings soltas, sem vínculo com a lista de `tecnologias`.
> Renomear uma tecnologia não quebra o build, mas deixa a combinação
> inconsistente em silêncio.

### `servicos: Servico[]`

Os quatro tipos de trabalho contratáveis: sistema sob medida, automação de
processo, dados que você já tem, integração entre sistemas. O campo `icone` é do
tipo `ChaveDeIcone`, derivado das chaves de `ICONES_DE_SERVICO` em
`core/icones/icones-de-servico.ts`, onde cada ícone é uma lista de `d` de
`<path>`. Um serviço novo custa dois arquivos: o desenho lá e o texto aqui. Uma
chave sem desenho não compila.

### `processo: EtapaDoProcesso[]`

As quatro etapas do trabalho: conversa, escopo e proposta, construção com
entregas visíveis, entrega e continuidade. Ancora o `#como-funciona` do menu.

### `contato: Contato`

`email` (`danilop.silva.d1@gmail.com`), `linkedin` e `convite`. O componente
`Contato` monta um `mailto:` com o assunto "Tenho uma ideia" já preenchido.

## Marcadores `[PREENCHER]`

O `README.md` da raiz descreve uma convenção: campos ainda em rascunho ficam
marcados com `[PREENCHER]` e **aparecem assim no site**, de propósito, para a
página ter forma real antes do conteúdo real.

**Hoje não existe nenhum `[PREENCHER]` no `perfil.ts`.** Todo o conteúdo é real.

## Tom de escrita

Padrão observável em todo o texto, e mantido de propósito:

- primeira pessoa, direto ao leitor ("Você tem o problema", "Eu transformo");
- sem jargão na home, jargão denso e específico na `/sobre`;
- sem travessão — foram removidos de todos os textos no commit `21286b1`;
- sem emoji (removido da intro de Soluções no commit `5227380`);
- honestidade como argumento de venda ("Se o problema for menor do que parecia,
  eu digo").
