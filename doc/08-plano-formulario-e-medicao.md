# Plano: formulário de contato e medição

Segunda leva de trabalho, decidida em 2026-09-06, depois de fechados os onze
pontos de [06-estado-atual-e-lacunas.md](06-estado-atual-e-lacunas.md).

Dois objetivos:

1. O botão de contato deixa de abrir o cliente de e-mail. Passa a abrir um
   formulário na própria página, onde a pessoa escreve a ideia e diz como quer
   ser respondida, e o site entrega isso na caixa de entrada.
2. O site passa a ser medido, com Google Analytics 4.

Os dois revertem decisões anteriores, tomadas quando o site era só uma página de
apresentação. Os pontos 5 e 6 do documento 06 registram o raciocínio antigo, e
este documento passa a valer sobre eles.

## Decisões travadas

| Assunto             | Decisão                                                                   |
| ------------------- | ------------------------------------------------------------------------- |
| Envio do e-mail     | AWS Lambda atrás de um HTTP API, entregando pelo SES                      |
| Linguagem do Lambda | Node 22 com TypeScript                                                    |
| Remetente           | `ideias@d1.app.br`, com o domínio verificado no SES                       |
| Anti-spam           | Campo-armadilha, trava de tempo, limite por IP **e** Cloudflare Turnstile |
| Medição             | GA4, com banner de consentimento                                          |
| Campo de contato    | Um campo só, livre: e-mail ou WhatsApp                                    |
| Infraestrutura      | Terraform, aplicado por GitHub Actions com OIDC                           |
| Onde mora o Lambda  | Repositório separado, privado                                             |

## Por que o Lambda em outro repositório

A razão não é o repositório do site ser público. Terraform e OIDC não guardam
segredo nenhum: com OIDC não existe chave da AWS para vazar, e os valores
sensíveis ficam no Parameter Store da AWS ou nos secrets do GitHub, nunca no
código. Um repositório público de infraestrutura seria seguro.

O motivo real é outro, e é mais forte: **a permissão que a esteira precisa.**
Para aplicar o Terraform, a role assumida pelo Actions precisa poder criar
Lambda, IAM, SES e DynamoDB. Se essa role for confiada ao repositório do site,
qualquer alteração que entre no repositório do site passa a ter, indiretamente,
um caminho até a infraestrutura da conta AWS. O site é uma página estática
mexida quase toda semana, muitas vezes só para trocar uma frase. Não faz sentido
que um commit de texto tenha esse alcance.

Somam-se dois motivos menores:

- **Cadência diferente.** O site muda toda semana, a infraestrutura quase nunca.
  Misturar os dois faz o deploy do Pages esperar `terraform plan` à toa.
- **Estado do Terraform.** O bucket S3 do estado, a trava e a role vivem
  naturalmente ao lado do código que os usa.

O preço da separação é ter dois lugares para manter em sincronia. O que os liga
é pequeno e está fixado abaixo, na seção do contrato: dois campos e um punhado
de códigos de resposta.

## Arquitetura do envio

```
navegador                        AWS
---------                        ---
formulário no <dialog>
  valida no cliente
  pega o token do Turnstile
  POST JSON  ------------------> HTTP API (CORS e limite de rajada no gateway)
                                   Lambda (Node 22)
                                     valida os campos
                                     confere o token no Turnstile
                                     checa o limite por IP no DynamoDB
                                     manda pelo SES  --> de ideias@d1.app.br
                                                         para a sua caixa
  <---------------------------- 202, ou 400 / 429 / 502
  mostra sucesso ou erro
  se falhar, oferece o mailto: de sempre
```

Nada disso muda a hospedagem: o site segue estático no GitHub Pages. O que muda
é que a página passa a fazer uma chamada de saída no momento do envio.

**Vale registrar a tensão:** hoje o site não faz uma única requisição externa, e
o Google Fonts saiu no lote 4 justamente por isso. O formulário reintroduz uma
chamada para fora, mais a do Turnstile. A diferença é que o endereço passa a ser
seu, e a chamada só acontece quando alguém decide falar com você.

## Contrato do endpoint

É o único acoplamento entre os dois repositórios. Mudou aqui, muda nos dois.

`POST /contato` no HTTP API, `Content-Type: application/json`:

| Campo       | Tipo   | Regra                                       |
| ----------- | ------ | ------------------------------------------- |
| `nome`      | string | 2 a 80 caracteres, com pelo menos uma letra |
| `ideia`     | string | 20 a 4000 caracteres                        |
| `contato`   | string | 5 a 200 caracteres, e-mail ou telefone      |
| `abertoEm`  | number | epoch em ms de quando o formulário abriu    |
| `armadilha` | string | precisa chegar vazia                        |
| `turnstile` | string | token do desafio                            |

O campo `nome` entrou depois do primeiro lote, quando a primeira ideia chegou
sem jeito de saber como chamar quem escreveu. **A ordem de publicação importa:
sobe o site primeiro e o endpoint depois.** O validador do endpoint ignora campo
que não conhece, então o site novo conversa com o endpoint velho sem erro — só
perde o nome no caminho. O contrário derruba o formulário que está no ar, porque
o endpoint novo recusa pedido sem `nome`.

Respostas: `202` com `{ "ok": true }` no caminho feliz; `400` para validação,
armadilha preenchida, nome fora do limite, tempo curto demais ou token recusado;
`429` para limite por IP estourado; `502` quando o SES falha.

CORS liberado só para `https://d1.app.br`, em `POST` e `OPTIONS`.

> **A porta de entrada mudou durante a execução.** O plano previa Function URL,
> que é mais curta e sai de graça. Ela não funcionou: esta conta da AWS recusa
> invocação anônima, e toda chamada voltava 403 mesmo com `AuthType = NONE`, com
> a política de recurso liberando `lambda:InvokeFunctionUrl` para `*`, numa URL
> recém-criada e sem nenhuma política de organização em vigor. O HTTP API não
> depende de permissão anônima: quem invoca é o gateway, com principal
> identificado. Custa cerca de US$ 1 por milhão de requisições, contra zero da
> Function URL, e em troca resolve o preflight sem invocar Lambda e limita
> rajada antes de virar execução.

## Lote 6 — Infraestrutura de envio

Repositório novo, privado. Nada aqui toca o repositório do site.

- **Bootstrap manual, uma vez:** bucket S3 do estado com versionamento, provedor
  OIDC do GitHub na conta, e a role de deploy com confiança restrita àquele
  repositório e à branch `main`. É o mínimo que precisa existir antes de a
  esteira conseguir aplicar qualquer coisa.
- **Terraform:** função Lambda, HTTP API com CORS, tabela DynamoDB do limite
  por IP com TTL, identidade e configuração do SES, política IAM de execução no
  mínimo necessário, e alarme no CloudWatch para pico de invocação.
- **Lambda em TypeScript:** validação, verificação do Turnstile, contagem por
  IP, montagem e envio do e-mail. `Reply-To` preenchido com o contato quando ele
  se parecer com um e-mail, para responder direto da caixa.
- **Testes:** Vitest sobre a validação e sobre a montagem do e-mail, sem subir
  nada na AWS.
- **Esteira:** em pull request, formatação, teste e `terraform plan`; na `main`,
  build, teste, `terraform apply` e publicação da função.
- **DNS no Registro.br:** três CNAME de DKIM e um TXT para o SES, mais um
  registro DMARC. Sem isso o e-mail sai, mas cai em spam.
- **Trava de custo:** concorrência reservada de 5 na função. O uso real custa uns
  dez centavos de dólar por mês; o cenário que assusta é abuso, porque cada
  requisição, mesmo recusada, paga uma invocação e uma escrita no DynamoDB.
  Invocação barrada por concorrência não é cobrada, e é isso que fecha a
  torneira. **Orçamento não entra neste módulo:** a conta da AWS é compartilhada
  com outro projeto, e um orçamento mede a conta inteira, então ele dispararia
  pelo vizinho. Esse alerta pertence ao nível da conta.
- **Sandbox do SES não atrapalha.** O destino é sempre a sua caixa, que se
  verifica em um clique. Pedir saída do sandbox só faria falta se o Lambda
  precisasse escrever para terceiros.

## Lote 7 — Formulário no site — **feito**

- Componente novo em `paginas/home/secoes/contato/`, com `<dialog>` nativo: foco
  preso, `Esc` fecha, sem biblioteca.
- Formulário reativo tipado, com estados de envio em `signal`: parado, enviando,
  enviado, erro.
- Campo-armadilha invisível, carimbo de abertura, e o widget do Turnstile.
- Uma linha dizendo que o contato é usado só para responder. Não é banner, é
  frase, e é o que a LGPD pede para esse uso.
- O `mailto:` de hoje continua vivo como saída de emergência, para quando o
  envio falhar ou o JavaScript não subir.
- A URL do endpoint entra como constante em `core/config`. Não é segredo:
  qualquer pessoa vê o endereço no tráfego da página.
- Testes: validação, armadilha, montagem do corpo do POST, e os estados de erro.

Três coisas mudaram na execução:

- **Os colaboradores entram por injeção.** O sistema de teste do Angular recusa
  `vi.mock` em import relativo e manda usar o TestBed, então o envio e o desafio
  ganharam duas cascas injetáveis em `core/contato/servicos.ts`. As funções por
  baixo continuam puras e testadas direto. É concessão ao teste, e está
  comentada como tal no código.
- **Entrou um `.gitattributes` com `eol=lf`.** Sem ele o Git entrega CRLF no
  Windows, e o `prettier --check` que o lote 2b pôs no CI reprovava na máquina
  de quem desenvolve, mesmo passando no CI, que roda em Linux.
- **A configuração nasce vazia.** Com `endpoint` e `chaveDoTurnstile` em branco,
  o formulário não aparece e a seção volta a ser o `mailto:`. Meio configurado
  seria pior que desligado: a caixa apareceria e o envio morreria no desafio ou
  no CORS, com a pessoa achando que mandou.

## Lote 8 — Medição e consentimento

- Banner de consentimento próprio, sem biblioteca, guardando a escolha no
  `localStorage`.
- Consent Mode v2 com tudo negado por padrão. O `gtag.js` só é carregado depois
  do aceite, e quem recusa não baixa script nenhum do Google.
- `page_view` disparado no `NavigationEnd` do router: o GA4 não acompanha troca
  de rota de aplicação de página única de forma confiável.
- Eventos que interessam, e só eles: abertura do formulário, envio com sucesso,
  falha no envio.
- Rota `/privacidade` nova, curta, dizendo o que é coletado e por quê. Entra no
  `sitemap.xml`.
- Search Console verificado e ligado ao GA4.

**O custo desta escolha, dito na cara:** o banner volta. Ele foi evitado de
propósito quando a decisão era não medir, e reaparece porque o GA4 usa cookie e
manda dado pessoal para fora do país. A alternativa sem banner, avaliada e
recusada, era uma medição sem cookie, que não dá o funil do formulário.

## Ordem e dependência

O lote 6 primeiro, porque o lote 7 precisa da URL do endpoint para funcionar de
verdade. O lote 8 é independente e pode entrar em qualquer momento, mas faz mais
sentido depois do formulário, para o funil já ter o que medir desde o primeiro
dia.
