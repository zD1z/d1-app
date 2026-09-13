# Proposta: plataforma de simulação e análise de causa raiz

Primeira ideia recebida pelo formulário do site, em 2026-09-09. Esta pasta é o
planejamento completo da resposta a ela: o que a aplicação seria, quais regras
de negócio a sustentam, com que tecnologia ela é construída, e como chegar a uma
POC validável antes de gastar dinheiro grande.

Não é documentação do `d1.app.br`. Mora aqui porque este repositório é onde o
contexto do trabalho vive; a proposta descreve um projeto separado, com
repositório próprio.

| Documento                                                                  | O que responde                                                               |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [01-visao-e-escopo.md](01-visao-e-escopo.md)                               | O problema, a tese a validar, quem usa, o que entra e o que fica de fora     |
| [02-regras-de-negocio.md](02-regras-de-negocio.md)                         | Como o caso é montado, como a simulação corre, e como o diagnóstico é gerado |
| [03-tecnologias-e-arquitetura.md](03-tecnologias-e-arquitetura.md)         | Stack, camadas, modelo de dados, API, deploy, custo e caminho de saída       |
| [04-poc-cronograma-e-evolucao.md](04-poc-cronograma-e-evolucao.md)         | Cronograma da POC, critérios de validação, riscos e roadmap por fases        |
| [05-estimativa-de-custo-e-esforco.md](05-estimativa-de-custo-e-esforco.md) | Esforço por bloco, custo de operação, grade de preço e modelo de cobrança    |
| [apresentacao.html](apresentacao.html)                                     | A versão para o cliente, sem jargão. Fonte da página publicada               |

A apresentação está publicada, como página privada, em
https://claude.ai/code/artifact/1988f911-4360-4367-8d0b-fb21baff4d46 — o link só
abre para quem o dono compartilhar pelo menu da própria página, porque artifact
publicado nasce privado. O cabeçalho traz o nome do cliente, Diego.

Para enviar por e-mail ou WhatsApp, sem depender de conta nenhuma, a mesma página
vira PDF pelo navegador: abrir, imprimir, salvar como PDF. A folha de impressão
já está no arquivo, com fundo branco, cores preservadas e quebras de página que
não partem cartão nem tabela no meio.

O texto da apresentação não usa travessão: onde havia um, entrou vírgula,
preposição ou ponto final. É só na apresentação, e a razão é de leitura, já que o
travessão pede um tempo de respiro que o leitor não técnico nem sempre dá.

## Decisões travadas

Tomadas na conversa de planejamento de 2026-09-09, e revistas em 2026-09-12,
quando a proposta virou piloto. Tudo o mais neste plano é derivado delas.

| Assunto                | Decisão                                                                         |
| ---------------------- | ------------------------------------------------------------------------------- |
| Natureza do trabalho   | Produto seu, com piloto. O Diego é o primeiro cliente e o dono da ideia         |
| Primeiro piloto        | Sem cobrança de mão de obra, com teto de 120 h. Ele paga só a infraestrutura    |
| Propriedade            | Ideia dele, código seu, licença de uso perpétua para ele. Ver documento 06      |
| Onde roda              | Na sua conta. Uma instância por cliente, até o quarto                           |
| Primeira entrega       | POC funcional, com um caso de falha real do cliente, ponta a ponta              |
| Critério da stack      | Menor custo possível de operação, sem fechar a porta para algo mais estruturado |
| Frontend               | Angular 21, estático, mesma base do `d1.app.br`                                 |
| Backend                | Fastify em Node 22 com TypeScript, empacotado como uma única Lambda             |
| Banco                  | Postgres gerenciado com escala a zero (Neon no plano gratuito)                  |
| Autenticação           | Link com token de uso único. O e-mail transacional fica para depois do piloto   |
| Infraestrutura         | Terraform aplicado por GitHub Actions com OIDC, como no `d1-app-api`            |
| Motor de diagnóstico   | Regras determinísticas e versionadas. Sem IA na POC                             |
| Entrega dos documentos | Planejamento em Markdown aqui; apresentação ao cliente como página publicada    |

## O que ainda não está decidido

- **Preço do desenvolvimento completo.** O documento 05 traz o esforço estimado e
  a grade de cálculo; falta a sua taxa-hora. Só vale a partir do terceiro cliente,
  ou antes disso se o Diego quiser exclusividade do código.
- **Titularidade do código.** O documento 06 recomenda a divisão (ideia dele,
  código seu, licença perpétua para ele). Precisa estar combinada **antes** da
  primeira linha de código.
- **Valor da hospedagem cobrada no piloto.** O custo direto é de R$ 15 a R$ 60 por
  mês. Falta escolher o número e dizer, na mesma frase, que é preço de piloto.
- **Nome do produto.** "Plataforma de simulação" é descrição, não nome.
