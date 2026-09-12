# Plano: propostas publicadas em `/ideias`

Terceira leva de trabalho, decidida em 2026-09-12, depois que a primeira ideia
chegou pelo formulário e virou proposta.

O objetivo é curto de dizer: **cada proposta vira uma página no `d1.app.br`,
alcançável só por quem receber o endereço.** O cliente abre no seu domínio, sem
conta e sem login, e a própria página é prova da stack que a `/sobre` afirma
dominar. Hoje isso é feito em plataforma de terceiro, e o link de lá tem menos
peso comercial do que um endereço seu.

## Decisões travadas

| Assunto              | Decisão                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| Endereço             | `d1.app.br/ideias/<hash>/`, sem link a partir de nenhuma página do site       |
| Formato da página    | HTML autocontido, um arquivo, com estilo próprio. Não é componente do Angular |
| Onde o conteúdo mora | Repositório **privado** `d1-app-ideias`, uma pasta por proposta               |
| Como chega ao site   | O workflow do Pages clona o privado para `public/ideias/` antes do build      |
| Acesso do workflow   | Chave de implantação somente-leitura, não token de conta                      |
| Hash                 | 16 bytes de `crypto.randomBytes`, em base64url: 22 caracteres                 |
| Proteção adicional   | Nenhuma. Sem senha, sem cifra. O motivo está adiante                          |
| Revogação            | Trocar o hash. Sem servidor, não existe outra                                 |

## Por que o conteúdo não pode morar neste repositório

Este repositório é **público**. Uma proposta comprometida aqui fica legível em
`github.com/zD1z/d1-app`, indexada pela busca do GitHub, e permanente: fork e
cache sobrevivem a qualquer remoção posterior. O hash no endereço não protegeria
nada, porque ninguém precisaria do endereço.

A separação é a mesma do `d1-app-api`, e pelo mesmo tipo de razão: não é o
segredo em si, é o alcance. Um repositório de site, mexido toda semana para
trocar uma frase, não é lugar para o texto comercial de terceiros.

## Por que arquivo estático, e não rota do Angular

A alternativa seria uma rota `/ideias/:hash` com componente e `getPrerenderParams`
lendo a lista de propostas no build. Ela foi descartada por três razões:

1. **Acopla a proposta ao site.** Cada proposta passaria a depender do bundle, do
   roteador e dos testes do `d1-app`. Uma página de venda não deve poder quebrar
   por causa de uma refatoração do cabeçalho.
2. **O desenho é do caso, não do site.** A apresentação da causa raiz tem paleta,
   tipografia e um diagrama que existem para aquele assunto. Encaixar isso nos
   componentes do site tiraria justamente o que faz a página funcionar.
3. **Custo zero contra custo real.** `public/**/*` já é copiado inteiro para o
   artefato do Pages. Um arquivo em `public/ideias/<hash>/index.html` é publicado
   sem uma linha de configuração nova.

O preço é não reaproveitar os tokens do `src/styles.css`. É aceitável: são páginas
de vida curta, uma por cliente.

## Por que não o repositório da API

Aproveitar o `d1-app-api`, que já é privado, parece economia de um repositório. É
o contrário, e o argumento está escrito no
[08-plano-formulario-e-medicao.md](08-plano-formulario-e-medicao.md): a role que a
esteira daquele repositório assume pode criar Lambda, IAM, SES e DynamoDB. Guardar
texto comercial ali daria a um commit de proposta um caminho indireto até a
infraestrutura da conta AWS.

A cadência também briga. Infraestrutura muda quase nunca; proposta muda três vezes
antes de ir ao cliente. Misturar as duas faz cada ajuste de vírgula disparar
`terraform plan`, ou obriga a filtrar caminho no workflow para contornar um
problema que só existe porque as coisas foram juntadas.

`d1-app-ideias` é um repositório de conteúdo: sem esteira, sem credencial, sem
nada além de HTML e um `proposta.json`.

## O DynamoDB, e quando ele passa a valer

Guardar o HTML no DynamoDB, com o hash na chave, e servir pela Lambda é viável e
não tem nada de errado. Só não é o primeiro passo. O que ele compra, e que o
arquivo estático não dá:

| Ganho                                         | Por que importa                                                   |
| --------------------------------------------- | ----------------------------------------------------------------- |
| Revogar na hora                               | Apagar o item tira a página do ar em segundos, sem deploy         |
| Validade que se cumpre sozinha                | O item guarda `expira_em`, e o endereço para de responder na data |
| Saber que o cliente abriu                     | Data, hora e quantas vezes. É informação comercial de verdade     |
| Publicar sem publicar o site                  | Editar e salvar, sem esperar build do Pages                       |
| Caminho para autenticação, se um dia precisar | Token verificado no servidor deixa de ser impossível              |

E o que ele custa:

| Custo                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **O endereço muda.** O Pages não reescreve caminho, então `/ideias/<hash>` no apex não pode ir para a Lambda. Vira `ideias.d1.app.br/<hash>`, com domínio próprio no gateway                       |
| **Limite de 400 KB por item.** O HTML de hoje tem 28 KB e cabe com folga, mas uma página com imagem embutida em data URI estoura. Acima disso, o item guarda o endereço e o conteúdo vai para o S3 |
| **A página passa a depender da Lambda estar de pé**, com partida a frio, em vez de um arquivo no CDN do Pages                                                                                      |
| **Mais peças para uma página lida três vezes**: rota, domínio, certificado, handler, publicador, testes                                                                                            |

**A regra que não pode ser quebrada se isso for feito:** o git continua sendo a
fonte da verdade, e o DynamoDB é destino de publicação, nunca editor. HTML
digitado direto na tabela é conteúdo sem histórico, sem diff e sem como provar o
que o cliente recebeu. O fluxo é `git → comando publica → tabela`.

Um detalhe de implementação que engana: **o TTL do DynamoDB não é pontual.** A
AWS apaga o item em até 48 horas depois do vencimento. Ele serve para faxina, não
para regra de negócio. A validade tem que ser conferida no handler, comparando
`expira_em` com o agora.

**O gatilho para migrar** é qualquer um destes doer de verdade: precisar revogar
um endereço com urgência, ter proposta vencida no ar sem perceber, ou querer saber
se o cliente abriu. Enquanto for uma proposta por mês, o arquivo estático ganha em
simplicidade. O esforço da migração é de 6 a 10 horas, e nada do que está nos
lotes abaixo é jogado fora: o repositório privado vira a fonte, e o publicador lê
dele.

## O aviso de leitura, sem sair do estático

Saber que o cliente abriu é o ganho mais concreto da lista acima, e dá para tê-lo
sem migrar nada: uma chamada de uma linha, no fim da página, para um endpoint no
`d1-app-api` que grava hash e momento. Meia hora de trabalho, e some com a maior
razão para trocar de arquitetura agora.

**Com uma ressalva que não é técnica.** O
[01-contexto-e-objetivo.md](01-contexto-e-objetivo.md) declara que o site não
rastreia nada, e essa decisão continua valendo para as duas páginas públicas.
Registrar leitura de proposta é outra coisa: é uma página privada, mandada a uma
pessoa que sabe que a mandou você. Ainda assim, se for feito, o documento 01 passa
a dizer isso com todas as letras, em vez de deixar a contradição implícita.

## Por que não tem senha

Senha em site estático é uma de duas coisas, e nenhuma vale aqui:

- **Esconder com JavaScript é teatro.** O conteúdo chega ao navegador e aparece no
  `DevTools`. Pior que não ter, porque promete proteção que não existe.
- **Cifrar no cliente funciona de verdade**, com chave derivada da senha no
  navegador. Mas custa um canal separado para a senha, quebra se o cliente perder
  a senha, e um segredo fraco cai em ataque offline, já que o arquivo cifrado está
  público.

Para o que a página carrega hoje — seu texto, sua metodologia, seu preço — o
endereço aleatório é o padrão do mercado e é suficiente. **A linha que muda isso
está adiante**, e é dado do cliente.

## A fronteira que precisa ficar escrita

Enquanto a página for **a sua proposta**, hash basta. No dia em que ela carregar
**dado do cliente** — a Não Conformidade real, nome de pessoa, resultado de
rodada, laudo — a resposta deixa de ser hash e não passa a ser senha: é
autenticação de verdade, e aí o lugar é a plataforma, não o site.

Isto é uma decisão, não uma opinião: `/ideias` **não recebe dado de terceiro**.
Quando alguém pedir "põe o resultado da rodada na página também", a resposta já
está escrita aqui.

## O hash

```
crypto.randomBytes(16).toString('base64url')   // 22 caracteres, 128 bits
```

Três regras:

- **Nada de nome.** `/ideias/diego-qualidade` é adivinhável e vaza o cliente no
  próprio endereço, inclusive para quem vê a tela por cima do ombro.
- **`randomBytes`, não `Math.random`.** O segundo é previsível e não serve para
  isso.
- **Base64url, não hexadecimal.** 22 caracteres contra 32, para o mesmo tamanho de
  segredo, e sem caractere que quebre ao colar em e-mail ou WhatsApp.

## Higiene da página

Vai no template, e vale para toda proposta:

| Cuidado                                                  | Por quê                                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `<meta name="robots" content="noindex,nofollow">`        | O Pages não deixa mandar cabeçalho `X-Robots-Tag`. A meta é o que resta        |
| `<meta name="referrer" content="no-referrer">`           | Sem isso, um clique para fora entrega o endereço inteiro no `Referer`          |
| Nenhum link para fora da página                          | Mesma razão. Se precisar citar algo, cite sem `href`                           |
| Fora do `sitemap.xml`                                    | O sitemap é escrito à mão e continua com duas URLs. Nada a fazer, só não mexer |
| **Não** acrescentar `Disallow: /ideias/` ao `robots.txt` | O `Disallow` anuncia o caminho e não impede indexação de URL já conhecida      |
| Data de emissão e validade visíveis no rodapé            | Proposta velha com preço antigo circulando não ajuda ninguém                   |

Um detalhe a favor, que já existe: o `404.html` é cópia do `index.html`, então um
hash errado cai na home em vez de confirmar que a pasta existe.

## Como fica o repositório privado

```
d1-app-ideias/
  causa-raiz-qualidade/
    proposta.json          cliente, data, validade, estado, hash
    index.html             a página, autocontida
  <proxima>/
```

O `proposta.json` não vai para o site. Serve para você saber, meses depois, qual
hash é de quem e o que já venceu.

## Lotes

### Lote 1 — Repositório privado e o gerador

Branch: `feat/ideias-publicadas`

| Ajuste                                                                                          |
| ----------------------------------------------------------------------------------------------- |
| Criar o repositório privado `d1-app-ideias`, com a estrutura acima                              |
| Script `scripts/nova-ideia.mjs` neste repositório: gera o hash, cria a pasta e copia o template |
| Template da proposta, com as metas de `robots` e `referrer` e o rodapé de validade              |
| Mover a apresentação da causa raiz para o privado, com hash gerado                              |
| Teste do gerador: 22 caracteres, alfabeto base64url, e dois hashes seguidos nunca iguais        |

O script mora aqui, no público, porque é ferramenta e não conteúdo. Ele não sabe
nada dos clientes: recebe um nome de pasta e cospe uma pasta com hash.

### Lote 2 — Publicação

Branch: `feat/ideias-no-deploy`

| Ajuste                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Chave de implantação somente-leitura no `d1-app-ideias`, com a parte privada em `secrets.IDEIAS_DEPLOY_KEY`                                     |
| Passo no `deploy.yml` que clona o privado em `public/ideias/`, **depois** do `prettier --check` e do `npm test`, e **antes** do `npm run build` |
| `public/ideias/` no `.gitignore`                                                                                                                |
| `.prettierignore` com `public/ideias/`, defesa em profundidade caso alguém rode o clone antes                                                   |
| O passo falha o build se o clone falhar                                                                                                         |

**Por que clonar depois dos checks:** o `prettier --check .` roda sobre o
diretório inteiro. Com o conteúdo clonado antes, a formatação de uma proposta
derrubaria o deploy do site, o que é absurdo. Depois dos checks, o conteúdo entra
já pronto e ninguém o verifica.

**Por que falhar em vez de publicar sem as propostas:** um cliente com o endereço
aberto na aba, recebendo 404 porque o clone falhou em silêncio, é pior que um
deploy vermelho que você vê e conserta.

### Lote 3 — Ciclo de vida

Branch: `feat/ideias-encerradas`

| Ajuste                                                                                  |
| --------------------------------------------------------------------------------------- |
| Estado `encerrada` no `proposta.json`, que troca a página por um aviso curto e educado  |
| Registro das decisões deste plano no `doc/09-decisoes-no-codigo.md`, na parte do script |
| Nota no `README.md` da raiz sobre a pasta que aparece só no build                       |

Opcional, e só quando a primeira proposta vencer de verdade.

## Esforço

| Lote | Horas |
| ---- | ----- |
| 1    | 2 a 3 |
| 2    | 1 a 2 |
| 3    | 1     |

## Riscos

| Risco                                                                 | Mitigação                                                             |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Proposta commitada por engano no repositório público                  | `.gitignore` e `.prettierignore`, e o conteúdo nunca nasce aqui       |
| Clone falha e o site sobe sem as propostas                            | O passo falha o build                                                 |
| Chave de implantação vazada                                           | Somente-leitura e limitada a um repositório. Rotação é trocar a chave |
| Cliente encaminha o endereço                                          | Aceito. É o mesmo risco de mandar um PDF por e-mail                   |
| Endereço no histórico do navegador ou no log do proxy da empresa dele | Aceito, e é a razão de a página não levar dado dele                   |
| Proposta antiga continua no ar                                        | Validade no rodapé, e o lote 3 fecha o ciclo                          |
