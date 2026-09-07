# Plano de ajustes

Plano derivado de [06-estado-atual-e-lacunas.md](06-estado-atual-e-lacunas.md).
Cobre os onze pontos levantados na leitura do código em 2026-09-06.

## Como o trabalho é conduzido

- Nada é commitado por agente. Cada lote é feito em uma branch própria, com as
  alterações no diretório de trabalho, para revisão humana antes de subir.
- **Um lote por vez.** Como nada é commitado, as edições de dois lotes se
  misturariam no mesmo diretório de trabalho. A sequência é: criar a branch,
  aplicar as edições, parar, revisar, commitar, e só então o lote seguinte.

## Lote 1 — Documentação

Branch: `docs/contexto-e-plano`

| Ponto | Ajuste |
| --- | --- |
| — | Criar `doc/` com contexto, arquitetura, conteúdo, features, publicação e lacunas |
| 2 | Corrigir a seção "Estrutura" do `README.md` da raiz: hoje lista `secoes/sobre`, `secoes/trajetoria` e `secoes/projetos`, que não existem mais, e não menciona a página `/sobre` |
| 2 | Ajustar a nota sobre `[PREENCHER]` no `README.md`: não resta nenhum marcador no conteúdo |
| — | Apontar o `doc/` a partir do `README.md` |

## Lote 2 — Testes e verificação no CI

Branch: `test/cobertura-minima-e-ci`

| Ponto | Ajuste |
| --- | --- |
| 1 | `hero.spec.ts`: fatiamento do bordão, incluindo o caso em que `bordaoDestaque` não existe dentro de `bordao` e o componente cai para "sem destaque" |
| 1 | `contato.spec.ts`: montagem do `mailto:` com assunto codificado |
| 7 | `conteudo.spec.ts`: toda `peca` de `combinacoes` corresponde ao `nome` de alguma tecnologia; toda tecnologia tem `icone` ou `sigla`; toda chave de `icone` existe em `ICONES` |
| 10 | `deploy.yml`: rodar `npm test` antes do `npm run build`, para o deploy parar quando algo quebrar |

Duas coisas apareceram durante a execução e mudaram o lote:

- **`prettier --check` saiu deste lote.** O repositório nunca passou pelo
  formatador: 66 arquivos falham hoje. Ligar a verificação exigiria reformatar
  tudo no mesmo commit, enterrando os testes num diff de repositório inteiro.
  Vira o lote 2b.
- **O teste de conteúdo achou um defeito em produção.** `xUnit e Vitest`
  apontava `icone: 'vitest'`, chave que não existia em `ICONES`, e o item não
  tinha `sigla`. O cartão renderizava sem símbolo e sem monograma. O ícone da
  Vitest foi acrescentado ao mapa, com traçado e cor vindos do Simple Icons,
  como os outros doze.
- **O fatiamento do bordão saiu do componente** para `core/texto/bordao.ts`. O
  membro era `protected` e o caso de destaque ausente não é alcançável pelo
  conteúdo real, então testá-lo pela tela seria impossível. A função é pura, o
  componente ficou com três linhas.

O teste de conteúdo é a resposta ao ponto 7. Amarrar `pecas` a um tipo derivado
exigiria duplicar a lista de nomes em uma constante `as const`, o que troca uma
inconsistência silenciosa por outra. Uma asserção no teste pega o erro no CI sem
custo de modelo.

## Lote 2b — Formatação

Branch: `chore/formatar-com-prettier`

| Ponto | Ajuste |
| --- | --- |
| 10 | `npx prettier --write .` em um commit isolado, que não muda comportamento nenhum, e `npx prettier --check .` acrescentado ao `deploy.yml` no mesmo lote |

Fica em branch própria justamente porque toca 66 arquivos. Revisar isso junto de
qualquer outra coisa não funciona.

## Lote 3 — Coerência do modelo de conteúdo

Branch: `refactor/modelo-de-conteudo`

| Ponto | Ajuste |
| --- | --- |
| 3 | Remover `perfil.disponivel`, `perfil.desdeAno` e `perfil.apelido` do modelo e do conteúdo, junto do comentário que promete o selo "disponível para novos projetos" no hero. O conteúdo passa a refletir só o que aparece na tela **(feito)** |
| 8 | Extrair os SVG dos serviços do template de `solucoes` para `core/icones/icones-de-servico.ts`, com `ChaveDeIcone` derivada de `keyof typeof`. Adicionar um serviço passa a custar dois arquivos em vez de três, e uma chave inválida vira erro de compilação **(feito)** |

Retângulo, círculo e elipse dos ícones foram reescritos como `<path>`. Com um
formato só, o template desenha a lista de traçados em um `@for` e o `@switch`
por primitiva desaparece. Os quatro foram conferidos na tela, em tamanho de uso
e ampliados: o monitor mantém os cantos e a proporção, os círculos saem
redondos, a elipse do cilindro casa com o corpo e nada é cortado pela `viewBox`.
Nenhuma correção foi necessária.

## Lote 4 — Compartilhamento e carregamento

Branch: `feat/og-image-e-fontes`

| Ponto | Ajuste |
| --- | --- |
| 4 | Gerar a arte 1200×630 em SVG, com o bordão e o favicon sobre os tokens do site, converter para PNG, colocar em `public/` e ligar `og:image` mais `twitter:card: summary_large_image` **(feito)** |
| 9 | Hospedar Inter e JetBrains Mono no próprio domínio: `.woff2` em `public/fontes/`, `@font-face` com `font-display: swap`, e remoção do `<link>` e dos `preconnect` do Google no `index.html` **(feito)** |

As duas famílias são variáveis, então um arquivo por família cobre todos os
pesos: 79 kB somados, contra quatro requisições ao Google. O `latin-ext` ficou
de fora depois de uma varredura confirmar que nenhum caractere do site cai fora
do subset latino.

## Lote 5 — Altura do cabeçalho com fonte única

Branch: `refactor/altura-do-cabecalho`

| Ponto | Ajuste |
| --- | --- |
| 11 | Declarar `--altura-do-cabecalho: 96px` em `styles.css`, usar a variável no `scroll-padding-top`, e ler o mesmo valor em `app.config.ts` via `getComputedStyle` no `provideAppInitializer`. Um valor, um lugar |

## Fora de código: decisões de produto

Decidido em 2026-09-06: as duas premissas ficam como estão, e nenhum código muda
por causa delas.

| Ponto | Questão |
| --- | --- |
| 5 | O contato segue em `mailto:`. A alternativa seria um formulário com serviço de terceiro, o que introduz backend externo e contraria a premissa de custo zero e zero rastreio. Nada muda |
| 6 | Nenhuma medição entra. A premissa de zero rastreio e zero banner de consentimento vale mais do que o dado. Mudanças de conteúdo seguem sendo decididas por julgamento, não por número |
