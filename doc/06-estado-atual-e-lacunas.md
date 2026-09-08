# Estado atual e lacunas

Fotografia em 2026-09-06, no commit `dcc7ace`.

## O que está pronto

- Duas páginas completas, com conteúdo real (nenhum `[PREENCHER]` restante).
- Deploy automático funcionando a cada push na `main`.
- Domínio próprio, HTTPS, `robots.txt` e `sitemap.xml`.
- Acessibilidade básica coberta: skip link, foco visível, ARIA no menu,
  `prefers-reduced-motion`.
- Tema claro e escuro.
- Zero dependência de runtime além do Angular.

## Lacunas e dívidas conhecidas

Lista descritiva. Nada aqui foi decidido como próximo passo; é insumo para o
planejamento.

### 1. Nenhum teste existe — **resolvido**

Era verdade quando este documento foi escrito. Hoje são doze arquivos
`.spec.ts` e 125 testes, rodados no CI antes de qualquer publicação: conteúdo,
validação do formulário, envio, componentes da home e da `/sobre`, meta por
rota e a folga do cabeçalho.

### 2. O `README.md` da raiz está desatualizado — **resolvido**

Ele listava seções que não existem mais e chamava o site de portfólio, o que
contradiz o `doc/01`. O texto foi reescrito para descrever a estrutura de hoje
e a finalidade comercial.

### 3. Campos de conteúdo que não são renderizados — **resolvido**

`perfil.disponivel`, `perfil.desdeAno` e `perfil.apelido` estavam no modelo e
preenchidos, mas nenhum template os lia. O comentário do modelo prometia um selo
"disponível para novos projetos" no hero que nunca existiu. Os três campos e o
comentário foram removidos.

### 4. Sem `og:image` — **resolvido**

O `index.html` tinha Open Graph completo, menos a imagem, e o `twitter:card` era
`summary`. Um link compartilhado no WhatsApp, LinkedIn ou Slack aparecia sem
prévia visual, justamente o contexto em que ele mais circula. Agora há
`public/og.png` (1200×630, fonte em `og.svg`) e o cartão é
`summary_large_image`.

### 5. Contato depende de `mailto:` — **revisto**

É uma decisão consciente (ver [01-contexto-e-objetivo.md](01-contexto-e-objetivo.md)),
mas com custo real: o `mailto:` falha ou frustra em quem usa webmail sem cliente
padrão configurado, e não há como medir quantas pessoas chegaram ao botão e
desistiram.

### 6. Nenhuma medição — **revisto**

Sem analytics, sem Search Console documentado, sem nenhum sinal de quantas
pessoas visitam, por onde entram ou onde param de rolar. Também é decisão
consciente, mas significa que qualquer mudança de conteúdo é feita no escuro.

As duas decisões foram revertidas em 2026-09-06: o `mailto:` dá lugar a um
formulário com envio de verdade, e o GA4 entra com banner de consentimento. O
raciocínio antigo fica registrado acima, e o novo está em
[08-plano-formulario-e-medicao.md](08-plano-formulario-e-medicao.md).

### 7. `combinacoes.pecas` sem vínculo com `tecnologias`

São strings livres. Renomear uma tecnologia deixa a combinação inconsistente sem
erro de compilação.

### 8. Adicionar um serviço custa três arquivos — **resolvido**

O tipo `ChaveDeIcone` era uma união fechada no modelo e os SVG dos serviços
estavam inline no template de `solucoes`, cada um em um braço de `@switch`.
Agora os desenhos vivem em `core/icones/icones-de-servico.ts`, como listas de
`d`, e `ChaveDeIcone` é `keyof typeof` desse objeto. Custa dois arquivos, e
chave sem desenho não compila.

### 9. Fontes vindas do Google Fonts — **resolvido**

Era a única requisição externa do site. As duas famílias passaram a ser servidas
do próprio domínio, em `public/fontes/`, como arquivos variáveis de subset
latino. O site não toca mais nenhum terceiro em runtime.

### 10. Sem verificação automática de qualidade no CI — **resolvido**

O workflow rodava `npm ci` e `npm run build`, e mais nada. Agora roda
`npx prettier --check .` e `npm test` antes de construir, e o deploy para se
qualquer um falhar. Continua sem lint, sem auditoria de acessibilidade e sem
medição de performance: são assuntos abertos, não pendências deste ponto.

### 11. O duplo 96 — **resolvido**

A altura do cabeçalho aparecia como `96` em dois lugares independentes
(`FOLGA_DO_CABECALHO` em `app.config.ts` e `scroll-padding-top` em
`styles.css`), e mudar um sem o outro quebrava a rolagem por âncora de um dos
dois caminhos sem aviso. Agora o valor é o token `--altura-do-cabecalho` no
`styles.css`, e o `app.config.ts` o lê com `getComputedStyle`.
