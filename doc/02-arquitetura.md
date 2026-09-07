# Arquitetura e detalhes técnicos

## Stack

| Camada | Escolha | Versão |
| --- | --- | --- |
| Framework | Angular (standalone, zoneless) | `^21.2.0` |
| Linguagem | TypeScript em modo estrito | `~5.9.2` |
| Build | `@angular/build:application` (esbuild) | `^21.2.22` |
| Testes | Vitest via `@angular/build:unit-test` | `^4.0.8` |
| Estilo | CSS puro com custom properties | — |
| Formatação | Prettier | `^3.8.1` |
| Hospedagem | GitHub Pages (estático) | — |

Sem Tailwind, sem biblioteca de componentes, sem gerenciador de estado, sem
cliente HTTP. As únicas dependências de runtime são o próprio Angular, `rxjs` e
`tslib`. RxJS entra apenas como dependência transitiva do router.

## Estrutura de pastas

```
src/
  index.html                    meta tags, Open Graph, fontes do Google
  main.ts                       bootstrapApplication
  styles.css                    tokens + utilitários compartilhados (260 linhas)
  app/
    app.ts / app.html / app.css shell: skip link, cabeçalho, router-outlet, rodapé
    app.config.ts               providers: router, zoneless, offset de âncora
    app.routes.ts               3 rotas
    core/
      models/conteudo.ts        interfaces do conteúdo, uma por bloco
      conteudo/perfil.ts        o conteúdo em si  <- único arquivo de texto
      icones/icones.ts          SVG paths de marca embutidos (Simple Icons, CC0)
      icones/icones-de-servico.ts  desenhos próprios da seção Soluções
      texto/bordao.ts           quebra do bordão em antes / destaque / depois
    layout/
      cabecalho/                barra fixa, menu mobile por signal
      rodape/
    paginas/
      home/
        home.ts/.html           monta 4 seções na ordem
        secoes/hero|solucoes|quem-faz|contato/
      sobre/
        pagina-sobre.ts/.html   monta 4 seções na ordem
        secoes/apresentacao|tecnologias|combinacoes|chamada-final/
public/
  CNAME  favicon.svg  favicon.ico  robots.txt  sitemap.xml
```

Convenções que valem em todo o projeto:

- **Nomes de arquivo, classe e identificador em português.** `Cabecalho`,
  `perfil.ts`, `secoes/`, `partesDoBordao`. Inclusive os comentários.
- **Uma pasta por seção**, com `.ts`, `.html` e `.css` juntos. Nenhum arquivo de
  seção passa de algumas dezenas de linhas.
- **Sem sufixo `.component`** nos nomes — é o padrão do Angular moderno.

## Decisões técnicas e o porquê

### Zoneless

`provideZonelessChangeDetection()` em `app.config.ts`. O site é praticamente
estático; o único estado reativo é o `menuAberto` do cabeçalho, que é um
`signal`. Não há motivo para carregar `zone.js`.

### `ChangeDetectionStrategy.OnPush` em todos os componentes

Sem exceção. Consistente com o zoneless e com o fato de que o conteúdo é
constante importada, não fluxo de dados.

### Conteúdo como constante tipada, não como serviço

`CONTEUDO` é um objeto `readonly` importado direto pelos componentes. Não há
`ContentService`, nem injeção, nem `HttpClient` buscando JSON. Para um site em
que o texto muda por commit, um serviço só adicionaria indireção. O modelo em
`core/models/conteudo.ts` documenta cada campo com um comentário dizendo onde
ele aparece e que tamanho de texto cabe.

### Offset de âncora feito na mão

`app.config.ts` chama `ViewportScroller.setOffset([0, 96])` num
`provideAppInitializer`. O comentário no arquivo explica: o `scroll-padding-top`
do CSS **não** resolve a âncora do router, porque o `ViewportScroller` do
Angular lê a posição do elemento e chama `window.scrollTo`, caminho em que nem
`scroll-padding` nem `scroll-margin` entram na conta. Sem o offset, o alvo pousa
em `y=0` e o cabeçalho fixo cobre o título. O `scroll-padding-top` no
`styles.css` continua valendo para a rolagem nativa do navegador, quando o `#`
é processado antes de o Angular subir.

**Os dois valores são 96 e precisam ser mudados juntos** se a altura do
cabeçalho mudar.

### Rotas: home eager, `/sobre` lazy

A home entra no bundle inicial porque é a oferta e carregá-la sob demanda só
custaria uma ida à rede a mais. A `/sobre` usa `loadComponent`. O curinga `**`
redireciona para a home, e funciona em produção porque o workflow duplica o
`index.html` como `404.html`.

### Links de menu com rota **e** fragmento

`cabecalho.ts` guarda `{ rota, fragmento }` em vez de um `href="#secao"`. Um
`href` com hash só funcionaria estando na home e quebraria em `/sobre`.

### Ícones de marca embutidos

`core/icones/icones.ts` carrega os *paths* SVG extraídos do Simple Icons
(CC0 1.0), como constantes. Duas razões, ambas no comentário do arquivo: o site
não faz nenhuma requisição externa por ícone, e o pacote não vira dependência
para desenhar doze símbolos. Marcas que foram removidas do Simple Icons a pedido
dos donos (AWS, Azure, SQL Server, Oracle, DynamoDB, Playwright) aparecem como
monograma via campo `sigla`.

### CSS: tokens globais, resto escopado

`src/styles.css` tem, e só tem:

- tokens em custom properties (`--fundo`, `--texto`, `--acento`, `--fonte`,
  `--largura: 1080px`, `--raio`, `--sombra`);
- o bloco `@media (prefers-color-scheme: light)` que redefine os mesmos tokens;
- reset mínimo e regras de elemento (`body`, títulos, `a`, `:focus-visible`);
- `@media (prefers-reduced-motion: reduce)` zerando animações;
- quatro classes compartilhadas: `.container`, `.secao` (com `__rotulo`,
  `__titulo`, `__intro`), `.etiqueta`, `.botao` (com `--primario` e
  `--secundario`), mais `.apenas-leitor`.

Todo o resto é `styleUrl` no componente, com encapsulamento padrão do Angular.
A nomenclatura das classes é BEM (`bloco__elemento--modificador`).

O tema escuro é o padrão (`color-scheme: dark light`), e o claro é a
sobreposição.

### Acessibilidade

Presente por construção, não como retrofit: skip link `.pular` para
`#conteudo`, `aria-expanded`/`aria-controls` no botão do menu,
`aria-labelledby` nas seções, `.apenas-leitor` para rótulos de leitor de tela,
`:focus-visible` visível, e respeito a `prefers-reduced-motion`.

## Configuração do TypeScript

`strict: true` mais `noImplicitOverride`, `noPropertyAccessFromIndexSignature`,
`noImplicitReturns`, `noFallthroughCasesInSwitch`, `isolatedModules`. No lado
Angular: `strictTemplates` e `strictInjectionParameters`. Alvo `ES2022`.

## Ferramentas de apoio

`.vscode/mcp.json` registra o servidor MCP do Angular CLI
(`npx -y @angular/cli mcp`), disponível para agentes que trabalhem no repo.
