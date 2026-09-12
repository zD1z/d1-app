# Tecnologias e arquitetura

## Princípios que decidem tudo aqui

1. **Custo de operação perto de zero enquanto a ideia não estiver validada.**
   Nada de servidor ligado 24 horas esperando doze pessoas usarem o sistema uma
   vez por mês. Alvo: menos de R$ 50 por mês na POC.
2. **Nenhuma escolha pode custar reescrita depois.** Cada peça barata tem um
   substituto maior, e a troca precisa ser de adaptador, não de regra.
3. **Uma linguagem só.** TypeScript no navegador, na API e no domínio. Um
   desenvolvedor mantém o conjunto inteiro.
4. **É código do cliente.** Nada de dependência de conta pessoal, de serviço
   exótico ou de plataforma que não se possa exportar.

## Stack

| Camada          | Escolha                                            | Custo na POC | Para onde evolui                                         |
| --------------- | -------------------------------------------------- | ------------ | -------------------------------------------------------- |
| Frontend        | Angular 21 + TypeScript, SPA                       | —            | Continua. É a base que já domino                         |
| Hospedagem web  | Cloudflare Pages (ou GitHub Pages)                 | R$ 0         | Continua até tráfego grande                              |
| API             | Fastify em Node 22, empacotado em **uma** Lambda   | ~R$ 0        | Mesmo código em container (ECS/Fly) trocando o adaptador |
| Borda da API    | API Gateway HTTP API + domínio próprio             | centavos     | ALB, se virar container                                  |
| Banco           | **Postgres** gerenciado, escala a zero (Neon free) | R$ 0         | RDS/Aurora Serverless, com `pg_dump` e `restore`         |
| Acesso a dados  | Drizzle ORM + drizzle-kit (migrations)             | —            | Continua. SQL explícito, sem mágica                      |
| Autenticação    | Link mágico por e-mail + JWT em cookie `httpOnly`  | R$ 0         | Cognito, Entra ID ou SSO do cliente                      |
| E-mail          | Amazon SES                                         | ~R$ 0        | Continua                                                 |
| PDF do laudo    | Folha de impressão no próprio navegador            | R$ 0         | Chromium em Lambda, quando precisar de envio automático  |
| Infraestrutura  | Terraform, aplicado por GitHub Actions com OIDC    | R$ 0         | Continua                                                 |
| Testes          | Vitest (unidade e domínio) + Playwright (fluxo)    | R$ 0         | Continua                                                 |
| Observabilidade | CloudWatch Logs com log estruturado + 2 alarmes    | ~R$ 0        | Sentry / OpenTelemetry                                   |

**Por que Postgres e não DynamoDB**, ainda que DynamoDB seja o que já uso no
`d1-app-api`: o domínio é relacional do começo ao fim. Diagnóstico é agregação
por etapa cruzando sessões, respostas, motivos e pesos. Isso é uma consulta de
dez linhas em SQL e é modelagem de vários dias em chave-valor, refeita a cada
pergunta nova que o cliente fizer. Neon dá Postgres gerenciado que dorme sozinho
e custa zero em repouso, que era a razão de considerar DynamoDB.

**Por que uma Lambda só, e não uma por rota.** O Fastify inteiro vai dentro de
um handler, com `@fastify/aws-lambda`. Ganha-se três coisas: rodar a API local
com `node`, sem emulador; um único ponto de log; e a saída para container é
literalmente trocar o arquivo de entrada. O preço é partida a frio de cerca de
meio segundo depois de ociosidade, aceitável para doze pessoas que entram uma
vez.

## Desenho

```
navegador                          Cloudflare              AWS
---------                          ----------              ---
app.<dominio>  (Angular, estático) -> Pages (grátis)

  XHR com cookie
       |
       v
api.<dominio> ------------------------------------------> API Gateway HTTP API
                                                            |
                                                            v
                                                   Lambda (Node 22, Fastify)
                                                     rotas + casos de uso
                                                            |
                                            +---------------+---------------+
                                            |                               |
                                            v                               v
                                    Neon Postgres (HTTP)                   SES
                                    escala a zero              link mágico e convites
```

`app` e `api` são subdomínios do mesmo domínio de propósito: assim o cookie de
sessão é _same-site_, e não é preciso token no `localStorage` nem cookie
`SameSite=None`.

## Repositório

Um repositório só, do cliente, privado:

```
apps/
  web/                 Angular 21. A sala de simulação, o setup e os painéis
  api/                 Fastify. Rotas, autenticação, casos de uso
packages/
  dominio/             Regras puras: motor de diagnóstico, IAP, taxonomia
  contrato/            Tipos compartilhados entre web e api
infra/                 Terraform: Lambda, gateway, domínio, SES, segredos
doc/                   O contexto do projeto, no mesmo padrão deste aqui
```

**`packages/dominio` não importa nada.** Sem banco, sem HTTP, sem data do
sistema, sem aleatoriedade. Entra um objeto com as sessões da rodada e os
parâmetros; sai o diagnóstico. Três razões:

1. O motor é o produto. Ele precisa ser testado em tabela, com dezenas de
   cenários, em milissegundos e sem infraestrutura.
2. É o que o cliente vai questionar ("por que isso deu processo e não
   treinamento?"). Uma função pura tem resposta; uma consulta com regra
   espalhada em três lugares, não.
3. Quando a Lambda virar container, ou quando o motor rodar em lote noturno,
   nada dele muda.

## Modelo de dados

Resumo das tabelas e das colunas que carregam regra. Chaves e datas de auditoria
omitidas por brevidade.

| Tabela            | Colunas que importam                                                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `unidade`         | `nome`                                                                                                                                  |
| `pessoa`          | `nome`, `email`, `unidade_id`, `papel`, `funcao`, `anonimizada_em`                                                                      |
| `pop`             | `codigo`, `titulo`, `versao`, `vigente_de`, `vigente_ate`                                                                               |
| `caso`            | `titulo`, `relato`, `data_do_incidente`, `pop_id`, `gravidade`, `estado`, `versao`, `caso_origem_id`                                    |
| `etapa`           | `caso_id`, `ordem`, `contexto`, `pergunta`, `peso`, `tempo_esperado_s`                                                                  |
| `opcao`           | `etapa_id`, `texto`, `classificacao`, `consequencia`, `e_gabarito`, `e_cenario_real`                                                    |
| `checkpoint`      | `etapa_id`, `pergunta`, `opcoes`, `correta`                                                                                             |
| `convite`         | `caso_id`, `pessoa_id`, `prazo`, `estado`, `token_hash`                                                                                 |
| `sessao`          | `caso_id`, `caso_versao`, `pessoa_id`, `estado`, `iniciada_em`, `concluida_em`, `iap`, `reproduziu_falha`                               |
| `resposta`        | `sessao_id`, `etapa_id`, `opcao_id`, `tempo_ms`, `motivo`, `motivo_livre`, `checkpoint_acertou`, `familia_efetiva`                      |
| `diagnostico`     | `caso_id`, `caso_versao`, `escopo` (etapa/caso), `etapa_id`, `classificacao`, `confianca`, `n_sessoes`, `versao_do_motor`, `parametros` |
| `acao`            | `caso_id`, `tipo`, `descricao`, `responsavel_id`, `prazo`, `estado`                                                                     |
| `evento`          | `ator_id`, `tipo`, `entidade`, `entidade_id`, `dados`, `em`                                                                             |
| `parametro_motor` | `versao`, `chave`, `valor`, `vigente`                                                                                                   |

Três decisões embutidas na tabela:

- **`sessao.caso_versao`**: a sessão aponta para a versão do caso que ela viu.
  Editar um caso publicado cria versão nova e não contamina o histórico.
- **`resposta` é append-only**, e `familia_efetiva` é gravada no momento da
  resposta, já com a correção do checkpoint aplicada. O diagnóstico não precisa
  recalcular semântica de motivo para desenhar um painel.
- **`diagnostico.versao_do_motor` e `parametros`**: o laudo é reproduzível anos
  depois, mesmo com a regra tendo mudado.

## API

Rotas principais. REST simples, JSON, cookie de sessão.

| Método e rota                   | Quem                | O que faz                                       |
| ------------------------------- | ------------------- | ----------------------------------------------- |
| `POST /auth/link`               | qualquer            | Envia link mágico para o e-mail cadastrado      |
| `GET  /auth/entrar?t=`          | qualquer            | Consome o token de uso único e abre a sessão    |
| `POST /casos`, `PUT /casos/:id` | gestor              | Rascunho do caso e da linha do tempo            |
| `POST /casos/:id/publicar`      | gestor              | Roda a validação de publicação e congela o caso |
| `POST /casos/:id/convites`      | gestor              | Convida participantes, dispara e-mail           |
| `GET  /sessoes/minha/:casoId`   | participante        | Estado da sessão e a **etapa corrente apenas**  |
| `POST /sessoes/:id/respostas`   | participante        | Registra decisão, tempo, motivo e checkpoint    |
| `GET  /sessoes/:id/debrief`     | participante (dono) | Comparação com o POP, só depois de concluída    |
| `POST /casos/:id/diagnostico`   | gestor              | Fecha a rodada e roda o motor                   |
| `GET  /casos/:id/laudo`         | gestor, diretoria   | Diagnóstico, evidências e ações                 |
| `GET  /painel`                  | gestor, diretoria   | Agregado por unidade e por classificação        |
| `POST /casos/:id/acoes`         | gestor              | Registra a ação corretiva                       |

**A regra de ouro da API**: `GET /sessoes/minha/:casoId` devolve **uma etapa por
vez**, sem gabarito e sem as etapas seguintes. Mandar o caso inteiro para o
navegador e esconder o gabarito na tela é entregar o experimento no
`DevTools`. Toda a proteção do estudo mora no servidor.

## Autenticação e autorização

- **Link mágico**: token aleatório de 32 bytes, guardado como hash, uso único,
  validade de 30 minutos. Sem senha: nada de "esqueci a senha", nada de senha
  repetida do trabalho, nada de vazamento com valor.
- **Sessão**: JWT curto (8 horas) em cookie `httpOnly`, `Secure`, `SameSite=Lax`.
- **Papéis**: `admin`, `qualidade`, `participante`, `direcao`. A verificação é no
  servidor, por rota **e** por registro — participante só alcança a própria
  sessão.
- **Limites**: 5 pedidos de link por e-mail por hora; limite de rajada no
  gateway.
- Quando o cliente exigir SSO corporativo, entra um provedor de identidade e o
  resto da aplicação não muda: continua lendo papel e identidade do mesmo lugar.

## Ambientes, deploy e dados

| Ambiente     | Como é                                                                 |
| ------------ | ---------------------------------------------------------------------- |
| Local        | Postgres em Docker, API com `node --watch`, Angular com `ng serve`     |
| Produção POC | Uma conta AWS, um projeto Neon, um domínio. Sem homologação nesta fase |

Homologação separada entra na fase 1, quando existir dado real que não se pode
sujar. Na POC, o custo dela não se paga.

- **Deploy**: push na `main` roda testes, `drizzle-kit migrate`, publica a Lambda
  e sobe o front. Terraform em workflow próprio, com OIDC e sem chave da AWS
  guardada em lugar nenhum.
- **Backup**: além do ponto-no-tempo do Neon, um `pg_dump` diário para um bucket
  S3 com ciclo de vida de 30 dias. Custa centavos e é o que permite dizer ao
  cliente que o dado dele é dele.
- **Retenção e LGPD**: rotina mensal que anonimiza participante além do prazo de
  retenção — apaga nome e e-mail, mantém respostas ligadas a um identificador
  sem pessoa. O agregado sobrevive, a identificação não.

## Segurança

Nada de exótico, e nada dispensável: validação de entrada por esquema (Zod) em
toda rota; consultas parametrizadas pelo ORM; segredos no Parameter Store, nunca
no repositório; CORS restrito ao domínio do app; cabeçalhos de segurança e CSP no
front; trilha de auditoria de toda leitura de laudo. O dado aqui é sensível na
relação de trabalho: o estrago de um vazamento não é técnico, é humano.

## Custo mensal estimado na POC

| Item                              | Estimativa        |
| --------------------------------- | ----------------- |
| Cloudflare Pages                  | R$ 0              |
| Neon (plano gratuito)             | R$ 0              |
| Lambda + API Gateway              | < R$ 5            |
| SES (algumas centenas de e-mails) | < R$ 1            |
| S3 (backup)                       | < R$ 2            |
| Domínio                           | ~R$ 40 / ano      |
| **Total**                         | **até R$ 10/mês** |

O que muda esse número na fase 1: sair do plano gratuito do Neon (a partir de
~US$ 19/mês) quando o volume ou a janela de retenção crescerem.

## Caminho de saída, peça por peça

Serve para responder à pergunta do cliente: "e se der certo, tem que jogar tudo
fora?"

| Quando                                         | O que troca                                    | Esforço        |
| ---------------------------------------------- | ---------------------------------------------- | -------------- |
| Partida a frio incomodar, ou entrar tempo real | Lambda → container. Troca o arquivo de entrada | 1 a 2 dias     |
| Volume ou retenção crescerem                   | Neon → Aurora Serverless. Mesmo SQL, mesmo ORM | 1 dia + janela |
| Cliente exigir SSO                             | Link mágico → provedor de identidade           | 3 a 5 dias     |
| Laudo precisar sair por e-mail automaticamente | Impressão → Chromium em Lambda                 | 2 dias         |
| Virar produto para várias empresas             | Coluna de organização + isolamento por linha   | 2 a 3 semanas  |

A última é a única cara, e é cara **de propósito**: como o trabalho é sob
encomenda, pagar hoje por multi-tenant que talvez nunca exista seria queimar
orçamento do cliente para financiar hipótese minha.

## Onde a POC roda

**Na sua conta**, decidido em 2026-09-12 junto com o modelo de piloto do
[06-piloto-e-modelo-de-entrada.md](06-piloto-e-modelo-de-entrada.md): você hospeda
e o cliente paga o custo. Começa em uma semana, sem depender da TI da empresa
dele.

Duas consequências que o documento 06 detalha e que não podem ficar só aqui: você
passa a ser operador de dado pessoal de trabalhador de outra empresa, o que pede
acordo de tratamento por escrito; e, com mais de um cliente hospedado, a regra é
**uma instância por cliente** até o quarto, em vez de multi-tenant.
