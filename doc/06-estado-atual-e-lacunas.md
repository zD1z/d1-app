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

### 1. Nenhum teste existe

`tsconfig.spec.json`, Vitest e `jsdom` estão configurados, e `npm test` roda,
mas **não há um único arquivo `.spec.ts` no projeto**. A lógica que valeria
testar hoje é pequena e bem delimitada: o fatiamento do bordão em `Hero`
(inclusive o caso em que `bordaoDestaque` não existe dentro de `bordao`) e a
montagem do `mailto:` em `Contato`.

### 2. O `README.md` da raiz está desatualizado

A seção "Estrutura" ainda lista `secoes/sobre`, `secoes/trajetoria` e
`secoes/projetos` dentro da home. Essas seções não existem mais: a home tem
`hero`, `solucoes`, `quem-faz` e `contato`, e a página `/sobre` não é sequer
mencionada na árvore. O texto sobre `[PREENCHER]` também não corresponde mais ao
estado do conteúdo.

### 3. Campos de conteúdo que não são renderizados — **resolvido**

`perfil.disponivel`, `perfil.desdeAno` e `perfil.apelido` estavam no modelo e
preenchidos, mas nenhum template os lia. O comentário do modelo prometia um selo
"disponível para novos projetos" no hero que nunca existiu. Os três campos e o
comentário foram removidos.

### 4. Sem `og:image`

O `index.html` tem Open Graph completo, menos a imagem, e o `twitter:card` é
`summary` em vez de `summary_large_image`. Um link do site compartilhado no
WhatsApp, LinkedIn ou Slack aparece sem prévia visual, que é justamente o
contexto em que ele mais circula.

### 5. Contato depende de `mailto:`

É uma decisão consciente (ver [01-contexto-e-objetivo.md](01-contexto-e-objetivo.md)),
mas com custo real: o `mailto:` falha ou frustra em quem usa webmail sem cliente
padrão configurado, e não há como medir quantas pessoas chegaram ao botão e
desistiram.

### 6. Nenhuma medição

Sem analytics, sem Search Console documentado, sem nenhum sinal de quantas
pessoas visitam, por onde entram ou onde param de rolar. Também é decisão
consciente, mas significa que qualquer mudança de conteúdo é feita no escuro.

### 7. `combinacoes.pecas` sem vínculo com `tecnologias`

São strings livres. Renomear uma tecnologia deixa a combinação inconsistente sem
erro de compilação.

### 8. Adicionar um serviço custa três arquivos — **resolvido**

O tipo `ChaveDeIcone` era uma união fechada no modelo e os SVG dos serviços
estavam inline no template de `solucoes`, cada um em um braço de `@switch`.
Agora os desenhos vivem em `core/icones/icones-de-servico.ts`, como listas de
`d`, e `ChaveDeIcone` é `keyof typeof` desse objeto. Custa dois arquivos, e
chave sem desenho não compila.

### 9. Fontes vindas do Google Fonts

É a única requisição externa do site. Custa uma conexão a mais no carregamento e
é o único ponto em que o visitante toca um terceiro.

### 10. Sem verificação automática de qualidade no CI

O workflow roda `npm ci` e `npm run build`, e mais nada. Não há lint, não há
`npm test`, não há checagem de formatação com o Prettier já instalado, nem
auditoria de acessibilidade ou performance.

### 11. `app.css` e o duplo 96

A altura do cabeçalho aparece como `96` em dois lugares independentes
(`FOLGA_DO_CABECALHO` em `app.config.ts` e `scroll-padding-top` em
`styles.css`). Mudar um sem o outro quebra a rolagem por âncora de um dos dois
caminhos, e nada avisa.
