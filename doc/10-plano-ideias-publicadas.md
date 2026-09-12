# Plano: propostas publicadas em `/ideias`

Terceira leva de trabalho, decidida em 2026-09-12, depois que a primeira ideia
chegou pelo formulário e virou proposta.

O objetivo é curto de dizer: **cada proposta vira uma página no `d1.app.br`,
alcançável só por quem receber o endereço.** O cliente abre no seu domínio, sem
conta e sem login, e a própria página é prova da stack que a `/sobre` afirma
dominar. Hoje isso é feito em plataforma de terceiro, e o link de lá tem menos
peso comercial do que um endereço seu.

A primeira versão deste plano servia as propostas como arquivo estático no
GitHub Pages. Ela foi substituída em 2026-09-12, antes de qualquer linha de
código, pela versão servida por Lambda com DynamoDB. O porquê da troca está na
seção "Por que não o arquivo estático".

## Decisões travadas

| Assunto            | Decisão                                                                           |
| ------------------ | --------------------------------------------------------------------------------- |
| Endereço           | `ideias.d1.app.br/<hash>`, sem link a partir de nenhuma página do site            |
| Onde o HTML mora   | DynamoDB, um item por proposta, servido por Lambda                                |
| Fonte da verdade   | O repositório privado `d1-app-ideias`. O banco é destino de publicação            |
| Onde a infra mora  | `d1-app-api`, que já tem Terraform, OIDC e a role. O conteúdo **não** vai para lá |
| Formato da página  | HTML autocontido, um arquivo, com estilo próprio. Não é componente do Angular     |
| Hash               | 16 bytes de `crypto.randomBytes` em base64url: 22 caracteres                      |
| Proteção adicional | Nenhuma senha, nenhuma cifra. O motivo está adiante                               |
| Validade           | Conferida no handler, com `expira_em`. O TTL do DynamoDB só faz faxina            |
| Revogação          | Trocar o estado do item. Vale em segundos, sem deploy                             |
| Leituras           | Registradas como itens próprios, não como contador no item da proposta            |

## Por que o endereço é um subdomínio

Porque o GitHub Pages não reescreve caminho. Com o site no apex, não existe
maneira de `d1.app.br/ideias/<hash>` chegar a uma Lambda: o Pages responderia
antes, com o `404.html`. As duas saídas seriam colocar um proxy na frente do
apex, o que significa mover o DNS e acrescentar uma camada inteira, ou aceitar o
subdomínio.

`ideias.d1.app.br` é o mesmo domínio aos olhos do cliente, e é uma linha de CNAME
no Registro.br.

## Por que não o arquivo estático

O estático era mais simples e continua sendo uma boa solução. Perdeu por três
coisas que ele não faz, e que passam a valer agora que existe proposta de verdade
na rua:

| Ganho do dinâmico              | O que ele resolve                                                  |
| ------------------------------ | ------------------------------------------------------------------ |
| Revogar em segundos            | Encerrar um endereço sem esperar build, deploy e propagação        |
| Validade que se cumpre sozinha | Proposta vencida para de abrir, em vez de circular com preço velho |
| Saber que o cliente abriu      | Data, hora e quantas vezes. É informação comercial, não vaidade    |
| Publicar sem publicar o site   | Corrigir uma frase na proposta sem mexer no deploy do `d1-app`     |
| `X-Robots-Tag` de verdade      | No Pages só dava meta tag; agora o cabeçalho vai junto da resposta |

O preço é honesto e está anotado na seção de riscos: mais peças de pé, partida a
frio de meio segundo, e o dobro de horas.

## Por que não o repositório da API para o conteúdo

Aproveitar o `d1-app-api`, que já é privado, parece economia de um repositório. É
o contrário, e o argumento está escrito no
[08-plano-formulario-e-medicao.md](08-plano-formulario-e-medicao.md): a role que a
esteira daquele repositório assume pode criar Lambda, IAM, SES e DynamoDB. Guardar
texto comercial ali daria a um commit de proposta um caminho indireto até a
infraestrutura da conta AWS. A cadência também briga: infraestrutura muda quase
nunca, proposta muda três vezes antes de ir ao cliente.

A divisão fica assim, e cada repositório tem exatamente a permissão do seu papel:

| Repositório     | O que tem                                                  | Permissão na AWS                           |
| --------------- | ---------------------------------------------------------- | ------------------------------------------ |
| `d1-app`        | O site. Nada de proposta                                   | Nenhuma                                    |
| `d1-app-api`    | A tabela, a Lambda leitora, a rota, o domínio, o Terraform | A role de infraestrutura, que já existe    |
| `d1-app-ideias` | As propostas em HTML, o `proposta.json` e o publicador     | Só `PutItem` e `UpdateItem` naquela tabela |

## Arquitetura

```
navegador                                AWS
---------                                ---
ideias.d1.app.br/<hash>  -------------->  API Gateway HTTP
                                          domínio próprio, limite de rajada
                                            |
                                            v
                                          Lambda leitora (Node 22)
                                            confere o formato do hash
                                            GetItem na tabela
                                            confere estado e validade
                                            grava a leitura
                                            devolve text/html
                                            |
                                            v
                                          DynamoDB: ideias

seu terminal
------------
npm run publicar -- causa-raiz  ------->  PutItem, com role estreita por OIDC
```

## A tabela

Uma tabela, `ideias`, com chave composta:

| Campo | Papel                               |
| ----- | ----------------------------------- |
| `pk`  | O hash da proposta                  |
| `sk`  | `proposta`, ou `leitura#<ISO-8601>` |

O item `proposta` guarda:

| Atributo    | Conteúdo                                       |
| ----------- | ---------------------------------------------- |
| `html`      | A página inteira, autocontida                  |
| `cliente`   | Para você saber de quem é o hash, meses depois |
| `titulo`    | Usado no log e no relatório, nunca na resposta |
| `criada_em` | ISO-8601                                       |
| `expira_em` | Época em segundos. Serve à regra **e** ao TTL  |
| `estado`    | `ativa` ou `encerrada`                         |
| `versao`    | Incrementa a cada publicação                   |

Cada item `leitura#<momento>` guarda apenas o momento, o agente e o endereço de
origem reduzido.

**Por que leitura em item separado, e não um contador no item da proposta.** No
DynamoDB, escrita custa por quilobyte do item inteiro: somar 1 a um contador
dentro de um item de 28 KB consome 28 unidades de escrita, contra 1 de um item
pequeno. O custo em dinheiro é irrelevante nos dois casos, mas o desenho com
contador é errado por outra razão: ele guarda um número, e o que interessa é
**quando** e **quantas vezes**. Item por leitura dá histórico pelo mesmo preço.

**Por que o TTL não decide nada.** A AWS apaga itens expirados em até 48 horas
depois do vencimento. Isso serve para faxina, não para regra de negócio: quem
decide se a proposta ainda abre é o handler, comparando `expira_em` com o agora.

## A Lambda leitora

Ordem das operações, e cada passo existe por uma razão:

1. **Confere o formato do hash** com expressão regular: 22 caracteres de
   base64url. Endereço fora do formato devolve 404 sem tocar no banco, o que
   torna varredura barata para você e cara para quem varre.
2. **`GetItem`** com `pk = hash` e `sk = proposta`.
3. **Confere `estado` e `expira_em`.**
4. **Grava a leitura**, sem esperar a escrita terminar para responder.
5. **Devolve `text/html`**, com os cabeçalhos abaixo.

| Situação                            | Resposta                                                           |
| ----------------------------------- | ------------------------------------------------------------------ |
| Hash fora do formato, ou não existe | 404, página curta e genérica, sem confirmar nada                   |
| Proposta encerrada ou vencida       | 410, com um aviso curto e educado e um caminho para falar com você |
| Tudo certo                          | 200, com o HTML                                                    |

O 410 é deliberado: quem recebeu aquele endereço merece saber que ele existiu e
venceu, em vez de achar que errou o link.

**Cabeçalhos**, que são a vantagem concreta sobre o Pages:

```
Content-Type: text/html; charset=utf-8
Cache-Control: private, no-store
X-Robots-Tag: noindex, nofollow, noarchive
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src https://fonts.gstatic.com; style-src-elem 'unsafe-inline' https://fonts.googleapis.com
```

`no-store` existe para a proposta não ficar em cache de proxy corporativo depois
de encerrada.

## O hash

```
crypto.randomBytes(16).toString('base64url')   // 22 caracteres, 128 bits
```

- **Nada de nome.** `/diego-qualidade` é adivinhável e entrega o cliente no
  próprio endereço, inclusive para quem vê a tela por cima do ombro.
- **`randomBytes`, não `Math.random`.** O segundo é previsível.
- **Base64url.** 22 caracteres contra 32 do hexadecimal, para o mesmo segredo, e
  sem caractere que quebre ao colar em e-mail ou WhatsApp.

## Por que não tem senha

Duas opções existiam, e nenhuma vale aqui:

- **Esconder com JavaScript é teatro**, e com Lambda nem faria sentido: o
  conteúdo vem do servidor.
- **Pedir senha de verdade** significa sessão, armazenamento de segredo e
  recuperação. É construir meia autenticação para uma página de venda.

Para o que a página carrega — seu texto, seu método, seu preço — o endereço
aleatório é o padrão do mercado e é suficiente. Agora que existe Lambda, a porta
está aberta para um token por e-mail no dia em que precisar, e isso é um ganho
do desenho, não uma tarefa deste plano.

## A fronteira que precisa ficar escrita

Enquanto a página for **a sua proposta**, hash basta. No dia em que ela carregar
**dado do cliente** — a Não Conformidade real, nome de pessoa, resultado de
rodada, laudo — a resposta deixa de ser hash: é autenticação de verdade, e o
lugar é a plataforma do cliente, não o seu site.

`ideias` **não recebe dado de terceiro**. Quando alguém pedir "põe o resultado da
rodada aí também", a resposta já está escrita aqui.

## Higiene da página

Vai no template, e vale para toda proposta. Os cabeçalhos da Lambda cobrem parte
disso; o resto é do HTML.

| Cuidado                                                   | Por quê                                                                |
| --------------------------------------------------------- | ---------------------------------------------------------------------- |
| `<meta name="robots" content="noindex,nofollow">`         | Redundante com o cabeçalho, e sobrevive se a página for salva em disco |
| Nenhum link para fora da página                           | Endereço não vaza em `Referer` se não houver clique para fora          |
| Data de emissão e validade visíveis no rodapé             | Proposta velha com preço antigo circulando não ajuda ninguém           |
| Folha de impressão embutida                               | O cliente vai salvar em PDF para encaminhar. Melhor que saia bonito    |
| Nada de imagem em data URI acima de algumas dezenas de KB | O item da tabela tem teto de 400 KB                                    |

O `sitemap.xml` e o `robots.txt` do site **não mudam**: o subdomínio não é
alcançável a partir de nenhuma página, e listar `ideias` no `robots.txt` só
serviria para anunciar que ele existe.

## Como fica o repositório privado

```
d1-app-ideias/
  propostas/
    causa-raiz-qualidade/
      proposta.json        hash, cliente, criada em, validade, estado, versão
      index.html           a página, autocontida
  scripts/
    nova.mjs               gera o hash e a pasta a partir do modelo
    publicar.mjs           valida e grava na tabela
    leituras.mjs           lista quem abriu e quando
  modelo/
    index.html             o template com a higiene já aplicada
```

O `proposta.json` nunca é servido. Ele existe para você saber, meses depois, qual
hash é de quem e o que já venceu.

## Custo

Com três propostas no ar e 200 aberturas por mês somadas, em `us-east-1`:

| Item                                 | Conta                                  | Por mês        |
| ------------------------------------ | -------------------------------------- | -------------- |
| DynamoDB, leitura sob demanda        | 200 leituras de um item de 28 KB       | US$ 0,0002     |
| DynamoDB, escrita das leituras       | 200 itens pequenos                     | US$ 0,0002     |
| DynamoDB, armazenamento              | 84 KB                                  | US$ 0,00002    |
| Lambda                               | 200 invocações de ~500 ms              | US$ 0          |
| API Gateway HTTP                     | 200 requisições, a US$ 1,00 por milhão | US$ 0,0002     |
| Certificado ACM e domínio no gateway | —                                      | US$ 0          |
| **Total**                            |                                        | **< US$ 0,01** |

Mesmo multiplicando por cem, fica abaixo de R$ 1 por mês. `sa-east-1` é mais caro,
e nesse volume a diferença some no arredondamento.

**As duas coisas que podem cobrar de verdade:**

- **CloudWatch Logs sem retenção definida.** O padrão é guardar para sempre. Use
  14 dias no Terraform e o assunto morre.
- **Route 53**, que custa US$ 0,50 por zona ao mês. Não é preciso: o DNS está no
  Registro.br, e tanto o CNAME do domínio do gateway quanto a validação do
  certificado podem ser criados lá.

O custo real deste plano é tempo, não dinheiro.

## Lotes

### Lote 1 — Infraestrutura e leitura

Repositório: `d1-app-api`. Branch: `feat/ideias`

| Ajuste                                                                                    |
| ----------------------------------------------------------------------------------------- |
| Tabela `ideias` no Terraform, sob demanda, com TTL em `expira_em`                         |
| Lambda leitora em Node 22, com a ordem de operações acima                                 |
| Rota no HTTP API, com domínio `ideias.d1.app.br`, certificado regional e limite de rajada |
| Retenção de 14 dias no grupo de logs                                                      |
| Páginas de 404 e 410, curtas, no mesmo tom do site                                        |
| Testes do handler: formato inválido, ausente, encerrada, vencida, feliz, e cabeçalhos     |

### Lote 2 — Conteúdo e publicação

Repositório: `d1-app-ideias`. Branch: `feat/publicador`

| Ajuste                                                                                          |
| ----------------------------------------------------------------------------------------------- |
| Estrutura de pastas, modelo da proposta com a higiene aplicada                                  |
| `nova.mjs`: gera hash, cria a pasta, escreve o `proposta.json`                                  |
| `publicar.mjs`: valida e grava. Recusa acima de 380 KB, sem as metas, ou com link externo       |
| Role por OIDC restrita a `PutItem` e `UpdateItem` na tabela `ideias`                            |
| Workflow que publica ao entrar na `main`, só o que mudou                                        |
| Migrar a apresentação da causa raiz, gerar o hash e publicar                                    |
| Testes: formato do hash, recusa por tamanho, recusa por falta de meta, dois hashes nunca iguais |

A validação que recusa a publicação é o que substitui a revisão humana: um HTML
sem `noindex`, ou com um link para fora, não chega ao ar.

### Lote 3 — Ciclo de vida

Repositório: `d1-app-ideias`, e o `doc/` deste aqui.

| Ajuste                                                                          |
| ------------------------------------------------------------------------------- |
| `encerrar.mjs`: muda o estado, e o endereço passa a responder 410 na hora       |
| `leituras.mjs`: lista aberturas por proposta, com data e hora                   |
| Registro das decisões no `doc/09-decisoes-no-codigo.md`                         |
| **Ajustar o `doc/01`**: o site não rastreia nada, mas `ideias` registra leitura |

O último item não é burocracia. O `doc/01` declara hoje que nada é rastreado, e
essa frase deixa de ser inteiramente verdadeira no dia em que o primeiro item de
leitura for gravado. Ou o documento passa a dizer a exceção com todas as letras,
ou a declaração vira mentira por omissão.

## Esforço

| Lote      | Horas      |
| --------- | ---------- |
| 1         | 4 a 6      |
| 2         | 3 a 4      |
| 3         | 2          |
| **Total** | **9 a 12** |

Cresceu em relação às 4 a 6 horas da versão estática, e cresceu de novo quando o
plano foi detalhado. É o preço dos ganhos da segunda seção, e ele está sendo pago
de olhos abertos.

## Riscos

| Risco                                                       | Mitigação                                                                          |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| A Lambda cai e a proposta do cliente cai junto              | Alarme de erro no CloudWatch. O PDF da proposta continua existindo                 |
| Partida a frio na primeira abertura                         | Aceito: meio segundo, uma vez                                                      |
| HTML editado direto na tabela, sem passar pelo git          | O publicador é o único caminho, e a role de escrita é só dele                      |
| Proposta acima de 400 KB                                    | O publicador recusa acima de 380 KB, antes de tentar gravar                        |
| Varredura de hashes                                         | Formato conferido antes do banco, limite de rajada no gateway, 128 bits de segredo |
| Cliente encaminha o endereço                                | Aceito. É o mesmo risco de mandar um PDF por e-mail                                |
| Certificado ou CNAME mal configurados derrubam o subdomínio | Validar com o endereço de uma proposta de teste antes de mandar ao cliente         |
| Registro de leitura contradiz a declaração de não rastrear  | Lote 3 acerta o `doc/01`                                                           |
