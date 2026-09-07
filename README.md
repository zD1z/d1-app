# d1.app.br

Site pessoal e portfólio profissional. HTML estático, publicado no GitHub Pages
em **https://d1.app.br**.

Angular sem servidor: o build gera arquivos estáticos e nada roda no backend. A
escolha do framework é para o que vem depois, seja integração com API, área logada
ou formulário de contato de verdade, sem precisar reescrever a base.

O contexto longo do projeto, com objetivo, decisões técnicas e o estado atual,
está em [`doc/`](doc/README.md).

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
desenham, e não há texto solto em template. Para mudar qualquer coisa da página,
edite esse arquivo e nada mais.

O formato está descrito em `src/app/core/models/conteudo.ts`, com um comentário
por campo dizendo onde ele aparece e que tamanho de texto cabe.

> Campos ainda em rascunho ficam marcados com `[PREENCHER]` e **aparecem assim
> no site**, de propósito, para a página ter forma real antes do conteúdo real.
> Hoje não resta nenhum: todo o conteúdo publicado é real.

## Estrutura

```
src/app/
  core/
    models/conteudo.ts        formato do conteúdo
    conteudo/perfil.ts        o conteúdo em si  <- edite aqui
    icones/icones.ts          SVG das marcas, embutidos
    icones/icones-de-servico.ts  desenhos dos quatro serviços
    texto/bordao.ts           quebra do bordão para destacar "D1 App"
    layout/folga-do-cabecalho.ts  altura do cabeçalho, do token do CSS
  layout/
    cabecalho/                barra fixa + menu mobile
    rodape/
  paginas/
    home/                     a oferta
      home.ts                 monta as seções na ordem
      secoes/
        hero/                 bordão, subtítulo e os dois botões
        solucoes/             serviços + como funciona
        quem-faz/             credencial + números, leva para /sobre
        contato/
    sobre/                    o aprofundamento técnico, carregada sob demanda
      pagina-sobre.ts         monta as seções na ordem
      secoes/
        apresentacao/         nome, resumo de carreira e LinkedIn
        tecnologias/          seis grupos, cada item com uma frase de prova
        combinacoes/          arranjos típicos de stack
        chamada-final/        devolve o visitante para a home
```

Os tokens de cor, tipografia e espaçamento ficam em `src/styles.css`, junto das
poucas classes compartilhadas (`.container`, `.secao`, `.etiqueta`, `.botao`).
Todo o resto é CSS escopado no componente.

Tema claro e escuro saem de `prefers-color-scheme`, sem botão de alternar
nem estado guardado.

## Publicação

`.github/workflows/deploy.yml` publica no GitHub Pages a cada push na `main`.

Dois detalhes que não são óbvios:

- **`public/CNAME`** carrega `d1.app.br`. Sem esse arquivo dentro do artefato, o
  GitHub descarta o domínio customizado a cada deploy.
- **`404.html`** é uma cópia do `index.html`, feita no workflow. O Pages não
  conhece as rotas do Angular: sem isso, acessar `d1.app.br/algo` direto na barra
  de endereço devolve 404 em vez de abrir o site.

### Configuração no GitHub (uma vez)

1. **Settings → Pages → Source: GitHub Actions**.
2. **Settings → Pages → Custom domain: `d1.app.br`**, e marque **Enforce HTTPS**.
3. No Registro.br, na zona do domínio: os quatro registros `A` do GitHub Pages
   para o apex, mais `CNAME www → zD1z.github.io`.

O domínio é `.app.br`, do Registro.br, e **não** o gTLD `.app` do Google. A
diferença importa: `.app` inteiro está na lista de HSTS preload e só abre em
HTTPS, `.app.br` não está. O certificado do Pages ainda leva alguns minutos para
sair depois que o DNS propaga, e o "Enforce HTTPS" só fica clicável quando ele
existe.
