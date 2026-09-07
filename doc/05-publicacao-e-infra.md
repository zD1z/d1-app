# Publicação e infraestrutura

## Comandos

```bash
npm install
npm start          # servidor de desenvolvimento em http://localhost:4200
npm run build      # gera dist/d1-app/browser (configuração production por padrão)
npm run watch      # build incremental em modo development
npm test           # Vitest via @angular/build:unit-test
```

## Build

Builder `@angular/build:application`. Na configuração `production`: hashing de
saída em todos os arquivos e orçamentos de tamanho — 500 kB de aviso e 1 MB de
erro para o bundle inicial, 4 kB / 8 kB por arquivo de estilo de componente.
Tudo em `public/` é copiado para a raiz do artefato.

## Deploy

`.github/workflows/deploy.yml` publica no GitHub Pages a cada push na `main`,
e também sob `workflow_dispatch`. Dois jobs: `construir` e `publicar`.

A concorrência usa `group: pages` com `cancel-in-progress: false` — um push no
meio de um deploy espera o anterior terminar, em vez de cancelar e deixar o site
em estado intermediário.

Dois detalhes que não são óbvios e estão comentados no próprio workflow:

- **`public/CNAME`** carrega `d1.app.br`. Sem esse arquivo dentro do artefato, o
  GitHub descarta o domínio customizado a cada deploy.
- **`404.html`** é uma cópia do `index.html`, feita por `cp` no workflow. O
  Pages não conhece as rotas do Angular: sem isso, acessar `d1.app.br/sobre`
  direto na barra de endereço devolve 404 em vez de abrir o site.

E uma pegadinha já enfrentada (commits `005afcd` e `caecc22`): **não adianta
passar `enablement: true` no `configure-pages`.** O `GITHUB_TOKEN` publica no
Pages, mas não cria o site; a chamada morre com "Resource not accessible by
integration". Criar o site é administração do repositório, e o CI não tem essa
permissão. Tem que ser feito uma vez na mão.

## Configuração no GitHub (uma vez)

1. **Settings → Pages → Source: GitHub Actions**.
2. **Settings → Pages → Custom domain: `d1.app.br`**, com **Enforce HTTPS**
   marcado.
3. No Registro.br, na zona do domínio: os quatro registros `A` do GitHub Pages
   para o apex, mais `CNAME www → zD1z.github.io`.

## O domínio

`d1.app.br` é do **Registro.br**, e **não** é o gTLD `.app` do Google. A
diferença importa: o `.app` inteiro está na lista de HSTS preload e só abre em
HTTPS; o `.app.br` não está. O certificado do Pages leva alguns minutos para
sair depois que o DNS propaga, e o "Enforce HTTPS" só fica clicável quando ele
existe.

## SEO e metadados

Em `src/index.html`: `lang="pt-BR"`, `description`, `author`, `canonical`,
`theme-color` para os dois temas, bloco Open Graph completo
(`og:type`, `og:url`, `og:site_name`, `og:locale`, `og:title`,
`og:description`, `og:image` com tipo, dimensões e `alt`) e `twitter:card` do
tipo `summary_large_image`.

A prévia é `public/og.png`, 1200×630, com o fonte ao lado em `public/og.svg`
para poder ser reeditada. **O nome do arquivo não leva hash de propósito:** os
robôs de WhatsApp, LinkedIn e Slack guardam a imagem em cache pela URL, e um
nome novo a cada build faria a prévia sumir das conversas antigas.

### Regerar a prévia

Editar `public/og.svg` não muda o PNG: o SVG é o fonte, e o PNG é o que os
robôs leem, porque quase nenhum deles renderiza SVG. Para rasterizar de novo,
sem dependência nova no projeto:

1. Gere um HTML temporário com o SVG dentro e as duas fontes embutidas como
   `data:` URI. A substituição é literal, nas duas `url('fontes/...woff2')` do
   `<style>` do SVG. Sem isso o navegador cai na fonte do sistema e o
   resultado sai com outro desenho de letra.
2. Rasterize com o Chrome em modo headless, na medida exata:

```bash
chrome --headless=new --disable-gpu --hide-scrollbars        --window-size=1200,630 --screenshot=public/og.png og-temporario.html
```

Depois confira o PNG a olho. A imagem circula em miniatura de conversa, então o
teste que vale é reduzi-la para uns 300 px de largura e ver se o bordão continua
legível.

Em `app.routes.ts`, cada rota define seu `title`.

Em `public/`: `robots.txt` liberando tudo e apontando o sitemap; `sitemap.xml`
com as duas URLs (`/` com prioridade 1.0, `/sobre` com 0.8), ambas com
`changefreq: monthly`.
