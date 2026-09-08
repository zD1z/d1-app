# Decisões no código

O código do site não tem comentários. Toda explicação de estrutura, de escolha
técnica e de porquê mora aqui.

A regra para quem edita: **se a linha precisa de justificativa, a justificativa
entra neste documento**, na seção do arquivo correspondente, e não como
comentário no fonte. O que o código faz se lê no código; o que este documento
guarda é o que ele **não** mostra — a alternativa descartada, o defeito que a
linha evita, o número que foi medido.

---

## 1. Bootstrap, rotas e prerender

### `app.config.ts`

- `withInMemoryScrolling({ anchorScrolling: 'enabled' })` existe porque as
  seções são âncoras na mesma página: sem isso, link com `#` não rola quando o
  roteador processa a navegação.
- O `setOffset` do `ViewportScroller` não é redundante com o
  `scroll-padding-top` do `styles.css`. O `ViewportScroller` do Angular não usa
  `scrollIntoView`: ele lê a posição do elemento e chama `window.scrollTo`, onde
  nem `scroll-padding` nem `scroll-margin` entram na conta. Sem o offset, o alvo
  pousa em `y=0` e o cabeçalho fixo cobre o título. O CSS continua valendo para
  a rolagem nativa, quando o navegador processa o `#` antes de o Angular subir.
  A altura tem fonte única: o token `--altura-do-cabecalho`, lido por
  `folgaDoCabecalho`.
- O inicializador é guardado por `isPlatformBrowser`. No prerender não há
  janela e `getComputedStyle` não existe: sem a guarda, o build inteiro quebra
  ao desenhar as rotas.

### `app.routes.ts`

- A home entra no bundle inicial, sem `loadComponent`: carregar sob demanda a
  primeira página só custaria uma ida à rede a mais.
- Cada rota declara `data.descricao`, consumida por `MetaDaRota`. Sem isso, as
  duas páginas herdam a etiqueta da home, que está no `index.html`.
- A rota curinga devolve qualquer caminho desconhecido para a home. O `404.html`
  do GitHub Pages é cópia do `index.html`, então o roteador resolve a rota no
  cliente.

### `app.ts`

O `MetaDaRota.observar()` é chamado na raiz porque ela é o único componente que
vive por toda a aplicação, e as etiquetas precisam ser reescritas a cada
navegação, não só na primeira.

### `main.server.ts` e `app.config.server.ts`

Entrada do prerender, chamada pelo build uma vez por rota. O HTML que sai daí é
o que o GitHub Pages serve; nada roda em servidor depois da publicação.

O `BootstrapContext` **precisa** ser repassado como terceiro argumento do
`bootstrapApplication`: é ele que carrega a plataforma criada do lado do
servidor. Sem isso o build morre com `NG0401 — No platform exists`.

---

## 2. SEO por rota — `core/seo/meta-da-rota.ts`

As etiquetas que descrevem a página para robô de busca e para prévia de link
eram fixas no `index.html`, escritas para a home. Como as duas rotas
compartilham esse arquivo, a `/sobre` se declarava canônica da home — que é o
jeito de pedir para ser desindexada — e compartilhar o link dela mostrava o
cartão da home.

- O valor de cada rota mora no `data` dela; o serviço aplica no documento a cada
  navegação. Com o prerender ligado isso roda também no build, então o HTML
  publicado já sai correto, sem depender de o robô executar JavaScript.
- `enderecoCanonico` corta consulta e fragmento: `#contato` é a mesma página, e
  listar as duas formas dividiria o sinal entre endereços de conteúdo idêntico.
- A etiqueta `<link rel="canonical">` existente é reaproveitada em vez de
  duplicada. Duas canônicas na mesma página se anulam.

---

## 3. Conteúdo e modelo

### `core/conteudo/perfil.ts`

Arquivo único com todo o texto do site. É o único lugar a editar para mudar a
página. O formato está em `core/models/conteudo.ts`.

**Números que envelhecem.** `INICIO_DA_CARREIRA` e `INICIO_NA_AUTOMACAO` com
`anosDesde()` substituíram "15 anos" e "11 anos" escritos à mão, que viravam
mentira em toda virada de ano sem ninguém notar.

> **Atenção:** o mesmo número aparece por extenso em três textos que não dá para
> derivar sem estragar a voz — `perfil.resumo`, `oferta.quemFaz` e a
> `description` do `index.html`, todos com "Quinze anos". Quando o cálculo mudar
> de dezena, essas três frases precisam ser revistas na mão.

### `core/models/conteudo.ts`

Onde cada campo aparece na tela e que tamanho de texto cabe:

| Campo                     | Onde aparece                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `perfil.resumo`           | uma frase, abre a `/sobre` logo abaixo do nome                                                                                             |
| `perfil.resumoDeCarreira` | uma linha no lugar da linha do tempo — o currículo detalhado vive no LinkedIn, que atualiza sozinho e não envelhece aqui sem ninguém notar |
| `oferta.bordao`           | o `h1` da home, a primeira coisa que alguém lê                                                                                             |
| `oferta.bordaoDestaque`   | o trecho do bordão destacado em cor; precisa existir dentro de `bordao`                                                                    |
| `oferta.subtitulo`        | um parágrafo, explica o bordão para quem não é técnico                                                                                     |
| `oferta.reasseguranca`    | uma linha sob a chamada do hero, dizendo o que a pessoa ganha ao clicar                                                                    |
| `oferta.quemFaz`          | duas ou três frases, fecham a faixa "quem faz" e levam para `/sobre`                                                                       |
| `Tecnologia.prova`        | a frase que separa lista de prova; sem ela o cartão vira só um logotipo                                                                    |
| `contato.convite`         | uma frase, fecha a seção de contato                                                                                                        |

**`Tecnologia` é união discriminada: ou `icone`, ou `sigla`, nunca nenhum dos
dois.** Antes os dois campos eram opcionais e independentes, então um item sem
ícone e sem sigla compilava e desenhava um quadrado vazio na tela. O `?: never`
em cada braço existe para o template continuar podendo ler as duas propriedades
sem estreitar o tipo antes.

### `core/icones/icones.ts`

Traçados dos ícones de marca, extraídos do pacote **Simple Icons (CC0 1.0)**.
Ficam embutidos de propósito: o site não faz requisição externa, e o pacote não
precisa virar dependência só para desenhar treze símbolos.

As marcas seguem sendo dos seus donos. O uso aqui é descritivo, para dizer que
ferramentas foram usadas, e não sugere parceria nem endosso.

AWS, Azure, SQL Server, Oracle, DynamoDB e Playwright não estão no arquivo
porque foram removidos do pacote a pedido dos donos das marcas. Essas
tecnologias aparecem com monograma no lugar do símbolo.

O objeto é fechado com `satisfies Record<string, IconeDeMarca>`, e não anotado
como `Record<...>`: com a anotação, `keyof typeof ICONES` valia `string` e uma
chave escrita errada compilava sem reclamar — o símbolo sumia da tela e só o
teste pegava. Com `satisfies`, vira erro de compilação.

### `core/icones/icones-de-servico.ts`

Desenhos próprios, traçados em linha sobre uma grade de 24; não representam
produto de ninguém. Cada ícone é uma lista de `d` de `<path>` — retângulo,
círculo e elipse foram escritos como caminho de propósito: com um formato só, o
template desenha a lista num `@for` e dispensa `@switch` por primitiva.

Os quatro: monitor (sistema sob medida), seta em ciclo com eixo ao centro
(automação de processo), cilindro (dados que você já tem), dois nós ligados por
trilhos (integração entre sistemas).

Serviço novo custa dois arquivos: o desenho aqui e o texto em `perfil.ts`.

### `core/texto/bordao.ts`

O bordão sai com um trecho em cor. Em vez de guardar HTML no arquivo de
conteúdo, o texto e o trecho a destacar viajam como duas strings e a quebra
acontece aqui. Quando o destaque não existe dentro do bordão, o bordão inteiro
volta como `antes`: o hero desenha o texto sem cor em vez de sumir com ele — é o
caso de quem editou `bordao` e esqueceu de acertar `bordaoDestaque`.

---

## 4. Formulário de ideia

### `core/config/contato.ts`

Os dois endereços públicos de que o formulário precisa. Nenhum é segredo: a URL
aparece no tráfego da página e a chave do Turnstile é a metade pública do par,
feita para ficar no HTML. O que protege o endpoint é o CORS restrito à origem, o
desafio e o limite por IP, tudo no repositório `d1-app-api`.

**Enquanto os dois estiverem vazios, o formulário fica desligado** e a seção de
contato volta a ser o `mailto:`. É o estado do site antes de a infraestrutura
subir, e a rede de segurança se um dia ela cair. Meio configurado seria pior que
desligado: o formulário apareceria e o envio morreria no desafio ou no CORS, com
a pessoa achando que mandou.

### `core/contato/abertura.ts`

- `FORMULARIO_LIGADO` é token, e não chamada direta a `formularioEstaLigado()`
  em cada componente, por dois motivos: são dois componentes lendo a mesma
  decisão (hero e contato), e ela precisa ser a mesma nos dois; e, com a
  configuração real preenchida, o caminho de emergência seria inalcançável pela
  suíte. Trocando o token no TestBed, os dois caminhos ficam cobertos.
- `AberturaDoFormulario` existe porque a chamada principal do hero passou a
  abrir o formulário num clique. Antes ela era âncora para `#contato`: a pessoa
  mais decidida da visita rolava a página inteira para encontrar um segundo
  botão com o mesmo rótulo, e o primeiro clique parecia não ter funcionado. O
  `<dialog>` mora dentro da seção de contato, longe do hero na árvore, então o
  recado viaja pelo serviço em vez de por uma cadeia de `output`.
- **É um contador, e não um booleano.** Abrir, fechar e abrir de novo são dois
  pedidos distintos; um booleano ficaria em `true` depois do primeiro e o
  segundo clique não mudaria valor nenhum. Zero é "ainda ninguém pediu", e o
  efeito ignora esse valor — senão a caixa abriria sozinha assim que a home
  monta.

### `core/contato/validacao.ts`

Validar no navegador serve para a pessoa saber do problema antes de enviar;
validar no servidor serve porque ninguém confia no navegador. O contrato do
endpoint está em `doc/08-plano-formulario-e-medicao.md`.

**O navegador é mais estrito que o endpoint, de propósito.** Lá o campo de
contato passa com "e-mail ou telefone" em sentido largo; aqui só passa e-mail
bem formado ou celular brasileiro com DDD. A diferença é segura porque anda numa
direção só: tudo que o site aprova, o endpoint também aprova.

- **E-mail:** estrito o suficiente para pegar erro de digitação, e não mais que
  isso. Exige local, arroba, domínio com ao menos um ponto e terminação de duas
  letras ou mais. `a@b` e `pessoa@empresa.c` caem; `nome.sobrenome@empresa.com.br`
  passa.
- **DDD:** lista fechada do plano de numeração brasileiro. É ela que transforma
  "faltou um dígito" em mensagem certa: sem a lista, `1198888777` (dez dígitos) e
  `41988887777` seriam indistinguíveis de um número válido com DDD errado.
- **Celular:** onze dígitos, nono dígito na frente, `55` do país opcional. Fixo
  de oito dígitos não passa — a promessa da tela é responder por WhatsApp. O
  `55` só é descartado quando sobra exatamente um celular inteiro; sem essa
  conferência, um `5511` digitado como DDD viraria número válido.
- **Nome:** exige uma letra de verdade, o que recusa `...` e `12345` sem cobrar
  sobrenome, acento ou formato. Gente se apresenta como quer, e exigir nome
  completo aqui só espantaria.
- O aparo de espaço nas pontas é o mesmo que o endpoint faz. Se divergisse, o
  site aprovaria texto que o servidor recusa.

### `core/contato/envio.ts` e `servicos.ts`

- `envio.ts` é a conversa com o endpoint, isolada da tela para o teste trocar o
  `fetch` por um dublê e cobrir cada resposta sem rede. `PedidoDeContato` é o
  contrato, espelho de `src/tipos.ts` no `d1-app-api`.
- Os motivos detalhados que o endpoint devolve não sobem até a tela: para quem
  está enviando, "recusado" e "armadilha" pedem a mesma frase.
- Rede fora, CORS recusado, aba fechando: nada disso é culpa de quem escreveu,
  então vira `falha` e a tela oferece o `mailto:` como saída.
- `servicos.ts` é a casca injetável em volta das funções puras. O sistema de
  teste do Angular não deixa trocar módulo por dublê em import relativo, então o
  componente recebe os dois colaboradores por injeção.

### `core/contato/turnstile.ts`

O script só entra na página quando alguém abre o formulário: numa visita que não
chega ao contato, o site continua sem requisição externa nenhuma. O script é
injetado uma vez por página e as chamadas seguintes reaproveitam a mesma
promessa, então abrir e fechar o formulário várias vezes não baixa nada de novo.
Em caso de falha, a promessa guardada é descartada para a tentativa seguinte
poder baixar de novo, em vez de herdar a falha para sempre.

`size: 'flexible'` faz a caixa do desafio acompanhar a largura do contêiner: no
tamanho padrão ela tem 300px fixos, e dentro do diálogo a 360px de tela sobram
288px — o widget estourava para fora da caixa.

### `formulario-de-ideia.ts`

- `limite` é estado próprio, e não mensagem de erro embaixo do formulário:
  quando a cota da hora acaba, insistir não adianta, então a caixa troca de
  conteúdo e oferece uma saída. Ao fechar nesse estado, o texto escrito fica
  onde está — a cota é que acabou, e digitar tudo de novo seria castigo dobrado.
- O campo `armadilha` fica escondido da tela e do leitor de tela. Gente não
  preenche o que não vê; robô que preenche todo campo, sim.
- `tocados` é um sinal, e não o `touched` do controle: a aplicação roda sem
  zone, e `touched` muda sem avisar ninguém, então a tela não redesenharia. O
  erro aparece assim que o campo perde o foco, em vez de esperar o clique em
  enviar e devolver três avisos de uma vez.
- O contador de caracteres lê o controle direto em vez de guardar um segundo
  estado: duplicar o tamanho num sinal só criaria uma cópia para sair de
  sincronia. Ele só aparece perto do limite — "3940 restantes" desde a primeira
  letra é ruído.
- O efeito que desenha o desafio guarda qual elemento foi usado. Depois de um
  envio que deu certo, o template troca o formulário pelo recado e destrói o
  `div`; ao reabrir, o Angular cria um novo, e sem redesenhar a caixa da
  Cloudflare fica vazia até alguém recarregar a página. Era um defeito relatado.
- O token do Turnstile vale uma vez só: sem `reset` depois de uma falha, a
  segunda tentativa seria recusada mesmo com tudo certo na tela. Ao fechar, o
  desafio é descartado pelo mesmo motivo.
- Submeter com campo inválido só acendia os avisos. Quem navega por teclado ou
  usa leitor de tela apertava Enter e não percebia nada acontecer, porque o foco
  continuava no botão. O foco vai para o primeiro campo inválido, e a busca é
  pelo `id` do campo, não por `[aria-invalid]`: o atributo só aparece no DOM
  depois do próximo desenho, e esse código roda antes dele.

### `formulario-de-ideia.html`

- O rótulo é `<label for>` e a mensagem de erro fica **fora** dele, ligada por
  `aria-describedby`. Com o erro dentro do `<label>`, o texto virava parte do
  **nome** do campo e o leitor de tela anunciava "A sua ideia Conte um pouco
  mais" como se fosse o rótulo.
- `inert` durante o envio tira a caixa inteira do alcance do mouse, do teclado e
  do leitor de tela. O botão desabilitado sozinho não bastaria: o Enter dentro
  do campo de texto continuaria submetendo.
- A camada de bloqueio cobre a caixa enquanto o envio acontece. O `<dialog>`
  modal já bloqueia a página atrás; a camada fecha o que faltava.
- A tela de "recebido" oferece a `/sobre`: quem acabou de mandar a ideia é a
  pessoa mais interessada do site, e até então a única coisa oferecida a ela era
  fechar a caixa.
- O estado de limite ocupa a caixa inteira em vez de virar aviso sob o
  formulário: deixar os campos ali convidaria a tentar de novo.

---

## 5. Layout

### `layout/cabecalho`

- Os itens levam rota **e** fragmento porque o site tem duas páginas: um
  `href="#solucoes"` só funcionaria estando na home e quebraria em `/sobre`.
- **Só item sem fragmento acende.** Os dois primeiros apontam para a mesma rota
  `/`, então marcar por rota deixava "Soluções" e "Como funciona" ativos ao
  mesmo tempo, em qualquer ponto da home — dois itens acesos nunca disseram onde
  a pessoa está. Saber a seção visível exigiria observar a rolagem, caro demais
  para três itens de menu.
- O menu aberto é um painel sobre a página, e painel que abre precisa fechar do
  jeito que todo mundo já tenta: `Esc` e clique fora. O foco volta para o botão
  que abriu, senão fica órfão no documento. O clique no próprio botão chega ao
  documento depois de `alternarMenu`, e sem a saída antecipada ele reabriria e
  fecharia na mesma ação.
- A marca é o mesmo arquivo do favicon: uma fonte da verdade para o desenho, e o
  navegador já o tem em cache quando chega ali.
- No mobile os itens vão a 44px de altura. Com o padding de desktop ficavam em
  40px, abaixo do que a mão espera.

### `core/layout/folga-do-cabecalho.ts`

Lê o token `--altura-do-cabecalho` do `styles.css`; é o valor que desloca a
âncora do roteador. Fica em função própria, e não dentro do `app.config.ts`,
para poder ser testado sem subir a aplicação inteira.

O zero de reserva não é uma segunda cópia do valor: o CSS chega ao navegador
antes do JavaScript, então o token sempre existe, e o zero só apareceria se
alguém apagasse o token do `:root`. Nesse caso a âncora volta a pousar sob o
cabeçalho e o defeito salta na primeira navegação por menu, em vez de ficar
escondido atrás de um 96 duplicado.

---

## 6. Sistema visual — `styles.css`

Tokens e base. Nada de componente: cada seção tem seu próprio arquivo.

### Fontes

Servidas do próprio domínio, e não do Google Fonts: o site deixa de depender de
terceiro para desenhar o texto e economiza duas conexões. Os arquivos são
variáveis, então um `woff2` por família cobre todos os pesos usados. Só o subset
latino veio — o conteúdo é português. Licença em `public/fontes/LICENCA.txt`.

A fonte de reserva aplica as métricas da Inter sobre a Arial. Com
`font-display: swap`, o primeiro quadro é desenhado na fonte do sistema e
trocado quando a Inter chega; sem os ajustes de `size-adjust`, `ascent-override`
e companhia, a troca muda a altura da linha e empurra o layout — e quem paga é o
`h1` do hero, que é o elemento de LCP da home.

### Cor

- **Superfícies** têm três degraus para o cartão se destacar da faixa, e a faixa
  do fundo. A escala anterior tinha 1,03:1 entre cartão e faixa, diferença que
  ninguém enxerga: quem sustentava a leitura era o filete de 1px. Hoje fundo e
  cartão estão a 1,25:1 no escuro.
- `--borda` é filete decorativo. `--contorno` é limite de controle — token
  separado porque a WCAG 1.4.11 pede 3:1 para o limite de um componente de
  interface, e a borda decorativa fica em 1,5:1 de propósito. Medido: 3,82:1 no
  escuro, 3,09:1 no claro.
- `--texto-fraco` foi clareado. No valor antigo (`#6b7484`) reprovava em AA nos
  dois temas, em sete usos, incluindo o rodapé inteiro e os rótulos dos números
  de credencial. Hoje o pior par é 5,13:1, contra os 4,5:1 exigidos.
- **O acento é a cor da conversão, e só dela.** A regra de uso é: chamada
  principal, trecho destacado do bordão, anel de foco. Rótulo de seção, chip de
  ícone, número de etapa e borda de hover foram para os neutros justamente para
  o botão voltar a ser a coisa mais saturada da tela.
- `--acento-contraste` declara o que se escreve em cima do acento. Antes o botão
  usava `--fundo`, que dava certo por coincidência.
- **Cores de estado** vivem nos tokens, e não chumbadas no CSS do formulário: o
  vermelho antigo (`#e5484d`) dava 3,91:1 sobre branco e o âmbar (`#e9a319`)
  dava 2,16:1, ou seja, sumia no tema claro.
- `--cortina` escurece nos dois temas: o papel dela é tirar a página de cena, e
  clarear no tema claro não tira nada de cena.

### Tipografia e espaço

- Nove degraus de tipo, e nenhum tamanho solto no CSS de componente. Antes havia
  26 declarações distintas, quinze delas espremidas entre 0.72rem e 1.08rem —
  diferenças de 0,16px, que ninguém percebe e que impedem qualquer ritmo.
- O degrau intermediário serve aos números da credencial, que saíam menores que
  o rótulo acima deles, e ao `h1` da `/sobre`, que precisa ficar acima do `h2`
  seguinte sem disputar com o bordão da home.
- Espaço em múltiplos de 4. Os valores fora de escala que existiam (18, 22, 26, 52) eram decisões de uma vez só, e o custo delas é que nada alinha com nada.
- `text-wrap: balance` nos quatro níveis de título, e não só no hero: sem ele a
  última linha sai com uma palavra sozinha.
- Tracking negativo é ajuste de título grande. Aplicado igual em `h4` de 16px
  ele fecha o desenho da letra, então só entra a partir do tamanho em que a
  compensação óptica de fato existe.
- `.secao` tem o fecho um pouco maior que a abertura: opticamente, o respiro de
  baixo é lido junto com a borda da seção seguinte.

### Foco, rolagem e modal

- O `:focus-visible` **não** declara `border-radius`. A propriedade não arredonda
  o contorno: ela arredonda o próprio elemento, então declará-la ali fazia todo
  botão, cartão e etiqueta mudarem de forma ao receber foco de teclado, e o
  número redondo da etapa virava quadrado. O contorno já acompanha o raio de
  cada elemento sozinho.
- `scroll-padding-top` vale para a rolagem nativa do navegador (o `#` na barra
  de endereço antes de o Angular subir). A âncora do roteador é deslocada pelo
  `setOffset`, que ignora essa propriedade mas lê o mesmo token.
- **`body:has(dialog[open]) { overflow: hidden }`.** Com o `<dialog>` modal
  aberto, o navegador torna o resto da página inerte para clique e foco, mas
  **não** para rolagem: a roda do mouse continua movendo o conteúdo por baixo da
  cortina, e quem está preenchendo o formulário vê a página andar sozinha atrás.
  A regra mora no global, e não no CSS do componente, porque o `body` está fora
  do escopo dele — com o encapsulamento do Angular, o seletor nunca casaria.
  `scrollbar-gutter: stable` acompanha: sem ele, trancar o `body` faz a barra
  sumir e a página inteira pular para o lado no instante em que a caixa abre.

### Botões

Ficam no global porque são usados no hero e no contato. O `:active` existe
porque no toque não há hover: sem estado de pressão, a interface parece inerte
justamente onde a conversão acontece.

A regra de largura total no mobile mira as faixas de ação (`.hero__acoes`,
`.contato__acoes`), e não o `.botao` solto. O `.botao` é `inline-block`, então
`flex: 1 1 100%` só vale quando o pai é contêiner flex — a regra antiga não
fazia nada em `quem-faz`, `chamada-final` e `apresentacao`, e o CTA saía largura
total em duas telas e automático em três.

---

## 7. CSS por seção

### `hero.css`

- O brilho radial atrás do texto saiu. Usava o acento a 10% de opacidade sobre
  fundo quase preto: o pico do gradiente chegava a um delta de ~1,1:1, ou seja,
  ninguém enxergava. Custava uma camada de composição para não entregar imagem
  nenhuma, e era a assinatura visual mais batida que existe.
- A medida curta é do **texto**, e não do contêiner. Com `max-width` no
  contêiner, o bloco do hero era centralizado numa caixa de 880px enquanto as
  outras seções usavam os 1080px do `.container`: a borda esquerda do hero ficava
  cem pixels adiante do resto da página.
- A reasseguração fica junto da chamada: a promessa que derruba a hesitação
  estava só na quarta seção, a três mil pixels de rolagem.

### `solucoes.css`

- 228px é o maior mínimo que ainda deixa os quatro cartões numa linha só dentro
  do container de 1080px. Acima disso sobra um cartão órfão.
- Hover em neutro forte, e não em acento: são quatro cartões, e acender quatro
  bordas azuis competia com o único botão que interessa na página. O chip de
  ícone virou monocromático pelo mesmo motivo.
- O título do cartão reserva duas linhas (`2.4em`, duas linhas na entrelinha
  1.2). Três dos quatro títulos quebram e um não, e sem a reserva as quatro
  descrições começavam em alturas diferentes — numa fileira de cartões, é o
  desalinhamento que faz a grade parecer quebrada.

### `quem-faz.css`

Os três números são a única prova quantitativa do site e estavam saindo a 27px:
menores que o título da seção e do mesmo peso visual que um subtítulo de cartão.
A credencial perdia para o rótulo administrativo em cima dela. `tabular-nums`
alinha os dígitos entre as três colunas.

### `contato.css`

O gradiente radial no topo da caixa saiu pelo mesmo motivo do brilho do hero. A
borda em acento continua, e agora é ela sozinha que marca a caixa como a área de
ação da página. O `mailto:` sai em monoespaçada porque é um endereço — vale para
o botão que é o próprio endereço, não para o que abre o formulário.

### `tecnologias.css` e `apresentacao.css`

- A cor oficial da marca só aparece no hover. Monocromático por padrão mantém a
  grade coesa e legível nos dois temas, onde logo colorido some num deles. A
  reserva é o contorno neutro, e não o acento: numa grade de vinte itens, vinte
  hovers em azul disputariam com a única chamada de ação da página.
- Sem símbolo disponível, o monograma ocupa o mesmo lugar com o mesmo peso.
- O `h1` da `/sobre` fica um degrau acima do título de seção e bem abaixo do
  bordão da home: é a página de apoio, mas o `h1` dela não pode empatar com o
  `h2` logo adiante.

### `formulario-de-ideia.css`

- **`position: fixed` é correção de defeito de produção, não enfeite.** O bloco
  declarava `position: relative`, para a camada de envio ter ancestral
  posicionado. Regra de autor vence a folha do navegador, então o
  `position: fixed` que o UA aplica em `dialog:modal` era sobrescrito e a caixa
  voltava ao fluxo normal: era desenhada onde o elemento mora no DOM, dentro da
  seção de contato. Quem abrisse o formulário no celular com a página rolada via
  o fundo escurecer e mais nada. Parecia site travado. O `fixed` continua sendo
  ancestral posicionado, então a correção não custa nada em troca.
- `max-height: min(92dvh, 900px)`: a caixa nunca passa da tela, e o que não
  couber rola dentro dela, não na página atrás. `dvh` porque no celular a barra
  do navegador entra e sai da conta de `vh`. Os 88dvh anteriores deixavam 12% da
  tela sem uso enquanto o formulário rolava por dentro, e o teto de 760px mordia
  justamente o 1440×900.
- `display: flex` é escopado em `.ideia[open]`: no seletor solto ele
  sobrescreveria o `display: none` que o navegador dá ao `<dialog>` fechado, e a
  caixa apareceria na página o tempo todo.
- `min-height: 0` nos filhos flex é o que destrava a rolagem interna: sem ele um
  filho não encolhe abaixo do próprio conteúdo e a caixa estouraria a tela.
- A entrada usa `@starting-style` com `allow-discrete`, que segura o elemento na
  camada de topo durante a saída; sem ele o navegador tira do DOM antes de a
  transição rodar. A pose de entrada mora numa variável porque aparece em dois
  lugares que precisam concordar. O bloco global de `prefers-reduced-motion` zera
  a duração, e aí a caixa volta a aparecer cortada — que é o comportamento
  pedido.
- O textarea nasce em três linhas e cresce com `field-sizing: content`, sem uma
  linha de JavaScript; onde ele ainda não existe, o `min-height` segura o piso.
  O `max-height` impede o crescimento de comer a caixa inteira.
- A introdução é contexto, e não corpo de texto: no tamanho de leitura ocupava
  cinco linhas num celular de 360px, quase um sexto da caixa, para dizer o que
  os rótulos já dizem. O aviso de privacidade fica colado no botão, e não como
  mais um bloco da pilha.
- A armadilha é posicionada fora da tela, e não `display: none`: assim continua
  no DOM para o robô achar, que é o ponto dela.
- O alerta de limite é âmbar, e não vermelho: nada quebrou e ninguém errou, só a
  cota da hora acabou. Vermelho ali leria como falha da pessoa.
- Sem movimento, o girador congelaria numa posição qualquer e viraria enfeite
  sem significado — por isso ele some sob `prefers-reduced-motion`, e a frase
  sozinha diz o que está acontecendo.
- **Densidade por altura de tela, não por largura.** Quem manda na rolagem
  interna é a altura disponível: um celular deitado e um monitor curto sofrem do
  mesmo problema, e um tablet estreito e alto não sofre de nenhum. O corte em
  860px é medido, não escolhido: abaixo dele o formulário com os três erros na
  tela não cabe na densidade folgada, e um notebook de 1280×800 cai justamente
  ali.
- **Telefone pequeno: a caixa vira a tela inteira.** Num aparelho de 640px de
  altura, o cartão com margem gastava 32px de tela para desenhar uma borda que
  ninguém precisa ver enquanto preenche, e ainda rolava por dentro. Continua
  sendo o mesmo `<dialog>` modal. Em tela cheia a escala de entrada sai: ela
  leria como falha de renderização, não como origem do movimento.

---

## 8. Testes

O que os testes cobrem, e por que existem desse jeito:

- **`perfil.spec.ts`** — o conteúdo é escrito à mão e nada nele é validado pelo
  compilador além do formato. Os testes cobrem os acordos que o tipo não
  expressa: `bordaoDestaque` existindo dentro de `bordao`, prova presente em
  toda tecnologia, e as peças de `combinacoes` batendo com o nome, a sigla ou um
  dos lados de um nome composto por " e " (".NET e C#" cobre ".NET").
- **`hero.spec.ts` e `contato.spec.ts`** — o `FORMULARIO_LIGADO` é trocado no
  TestBed porque a configuração real está preenchida: sem substituir o token, o
  caminho de emergência seria inalcançável pela suíte, e é justamente ele que
  precisa continuar funcionando se a infraestrutura cair. Os testes de contato
  valem nos dois estados de propósito: amarrar a um deles faria a suíte quebrar
  quando o formulário fosse ligado ou desligado, que é configuração e não
  defeito.
- **`formulario-de-ideia.spec.ts`** — o desafio e a rede saem de cena por
  injeção, e não por dublê de módulo, porque o sistema de teste do Angular não
  deixa trocar import relativo. O jsdom conhece o `<dialog>` mas não abre janela
  de verdade, então `showModal` e `close` são substituídos — e o dublê de `close`
  precisa disparar o evento, porque é o `(close)` do template que descarta o
  desafio para a próxima abertura. A armadilha também é `input[type="text"]`, e é
  o `tabindex` que a separa dos campos de gente.
- **`cabecalho.spec.ts`** — cobre o item ativo (dois nunca podem acender ao mesmo
  tempo) e o fechamento por `Esc` e clique fora.
- **`bordao.spec.ts`** — a rede de segurança do arquivo de conteúdo: quando
  `bordaoDestaque` não existe dentro de `bordao`, o texto não pode sumir.
- **`folga-do-cabecalho.spec.ts`** — sem o token não existe segundo lugar de onde
  tirar o número, e a âncora volta ao comportamento de antes do offset.
- **`meta-da-rota.spec.ts`** — cobre o defeito que motivou o serviço: a `/sobre`
  se declarando canônica da home.
- **`solucoes.spec.ts`** — chave de ícone sem desenho passaria pelo compilador
  como lista vazia e o cartão sairia com um `svg` em branco.
- **`config/contato.spec.ts`** — meio configurado é pior que desligado.

---

## 9. `index.html`

- O `og:image` usa URL absoluta porque quem lê é um robô de fora, sem `base
href`. O arquivo não leva hash no nome: os robôs guardam a imagem em cache
  pela URL, e trocar o nome a cada build faria a prévia sumir das conversas
  antigas. A arte-fonte é `public/og.svg`.
- As fontes vivem em `public/fontes` e são declaradas no `styles.css`. O texto
  da primeira tela é Inter, então ela vem no `preload`; a monoespaçada aparece só
  em rótulo pequeno e pode esperar.
- As etiquetas de descrição e Open Graph que estão ali são o padrão da home.
  Cada rota sobrescreve as suas por `MetaDaRota`.
