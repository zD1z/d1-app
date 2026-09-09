# Proposta: plataforma de simulação e análise de causa raiz

Primeira ideia recebida pelo formulário do site, em 2026-09-09. Esta pasta é o
planejamento completo da resposta a ela: o que a aplicação seria, quais regras
de negócio a sustentam, com que tecnologia ela é construída, e como chegar a uma
POC validável antes de gastar dinheiro grande.

Não é documentação do `d1.app.br`. Mora aqui porque este repositório é onde o
contexto do trabalho vive; a proposta descreve um projeto separado, com
repositório próprio.

| Documento                                                          | O que responde                                                               |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| [01-visao-e-escopo.md](01-visao-e-escopo.md)                       | O problema, a tese a validar, quem usa, o que entra e o que fica de fora     |
| [02-regras-de-negocio.md](02-regras-de-negocio.md)                 | Como o caso é montado, como a simulação corre, e como o diagnóstico é gerado |
| [03-tecnologias-e-arquitetura.md](03-tecnologias-e-arquitetura.md) | Stack, camadas, modelo de dados, API, deploy, custo e caminho de saída       |
| [04-poc-cronograma-e-evolucao.md](04-poc-cronograma-e-evolucao.md) | Cronograma da POC, critérios de validação, riscos e roadmap por fases        |
| [apresentacao.html](apresentacao.html)                             | A versão para o cliente, sem jargão. Fonte da página publicada               |

A apresentação está publicada, como página privada, em
https://claude.ai/code/artifact/1988f911-4360-4367-8d0b-fb21baff4d46 — o link só
abre para quem receber. O nome do cliente aparece como `[NOME DO CLIENTE]` no
cabeçalho, para ser trocado antes de enviar.

## Decisões travadas

Tomadas na conversa de planejamento de 2026-09-09. Tudo o mais neste plano é
derivado delas.

| Assunto                | Decisão                                                                         |
| ---------------------- | ------------------------------------------------------------------------------- |
| Natureza do trabalho   | Projeto sob encomenda. Código do cliente, uma empresa só, sem multi-tenant      |
| Primeira entrega       | POC funcional, com um caso de falha real do cliente, ponta a ponta              |
| Critério da stack      | Menor custo possível de operação, sem fechar a porta para algo mais estruturado |
| Frontend               | Angular 21, estático, mesma base do `d1.app.br`                                 |
| Backend                | Fastify em Node 22 com TypeScript, empacotado como uma única Lambda             |
| Banco                  | Postgres gerenciado com escala a zero (Neon no plano gratuito)                  |
| Autenticação           | Link mágico por e-mail via SES, sem senha e sem provedor de identidade pago     |
| Infraestrutura         | Terraform aplicado por GitHub Actions com OIDC, como no `d1-app-api`            |
| Motor de diagnóstico   | Regras determinísticas e versionadas. Sem IA na POC                             |
| Entrega dos documentos | Planejamento em Markdown aqui; apresentação ao cliente como página publicada    |

## O que ainda não está decidido

- **Preço e forma de cobrança.** Marcado como `[PREENCHER]` no documento 04. Não
  invento número: depende de quanto do seu tempo o projeto ocupa e de que
  compromisso o cliente aceita assumir antes da validação.
- **Nome do produto.** "Plataforma de simulação" é descrição, não nome.
- **Quem hospeda depois da POC.** Se a conta AWS/Neon é sua ou do cliente muda o
  contrato e a operação. Tratado no documento 03, na seção de ambientes.
