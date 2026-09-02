# d1.app

Site pessoal e portfólio profissional. HTML estático, publicado no GitHub Pages
em **https://d1.app**.

Angular sem servidor: o build gera arquivos estáticos e nada roda no backend. A
escolha do framework é para o que vem depois — integração com API, área logada,
formulário de contato de verdade — sem precisar reescrever a base.

## Rodar localmente

```bash
npm install
npm start          # http://localhost:4200
npm run build      # gera dist/d1-app/browser
```

## Onde fica o conteúdo

**Todo o texto do site vive em um arquivo só:**

```
src/app/core/conteudo/perfil.ts
```

Nome, bio, trajetória, projetos, serviços e contato saem dali. Os componentes só
desenham — não há texto solto em template. Para mudar qualquer coisa da página,
edite esse arquivo e nada mais.

O formato está descrito em `src/app/core/models/conteudo.ts`, com um comentário
por campo dizendo onde ele aparece e que tamanho de texto cabe.

> Os campos marcados com `[PREENCHER]` ainda são rascunho e **aparecem assim no
> site**. Estão ali de propósito, para a página ter forma real antes do conteúdo
> real. Troque todos antes de apontar o domínio.

## Estrutura

```
src/app/
  core/
    models/conteudo.ts        formato do conteúdo
    conteudo/perfil.ts        o conteúdo em si  <- edite aqui
  layout/
    cabecalho/                barra fixa + menu mobile
    rodape/
  paginas/home/
    home.ts                   monta as seções na ordem
    secoes/
      hero/                   nome, chamada, números
      sobre/                  bio + habilidades
      trajetoria/             linha do tempo profissional
      projetos/               cartões de projeto
      solucoes/               serviços + como funciona
      contato/
```

Os tokens de cor, tipografia e espaçamento ficam em `src/styles.css`, junto das
poucas classes compartilhadas (`.container`, `.secao`, `.etiqueta`, `.botao`).
Todo o resto é CSS escopado no componente.

Tema claro e escuro saem de `prefers-color-scheme` — não há botão de alternar
nem estado guardado.

## Publicação

`.github/workflows/deploy.yml` publica no GitHub Pages a cada push na `main`.

Dois detalhes que não são óbvios:

- **`public/CNAME`** carrega `d1.app`. Sem esse arquivo dentro do artefato, o
  GitHub descarta o domínio customizado a cada deploy.
- **`404.html`** é uma cópia do `index.html`, feita no workflow. O Pages não
  conhece as rotas do Angular: sem isso, acessar `d1.app/algo` direto na barra
  de endereço devolve 404 em vez de abrir o site.

### Configuração no GitHub (uma vez)

1. **Settings → Pages → Source: GitHub Actions**.
2. **Settings → Pages → Custom domain: `d1.app`**, e marque **Enforce HTTPS**.
3. No DNS do domínio: os quatro registros `A` (e os quatro `AAAA`) do GitHub
   Pages para o apex, mais `CNAME www → zD1z.github.io`.

`.app` está na lista de HSTS preload: o navegador **só** abre o domínio em HTTPS,
sem exceção. O certificado do Pages leva alguns minutos para sair depois que o
DNS propaga — até lá o domínio não abre de jeito nenhum, e isso é normal.
