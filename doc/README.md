# Documentação do d1.app.br

Esta pasta descreve o projeto para quem for trabalhar nele: humano ou agente.
Não é documentação de usuário final; é o contexto necessário para tomar decisões
técnicas e de conteúdo sem precisar reler o código inteiro.

| Documento                                                            | O que responde                                                          |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [01-contexto-e-objetivo.md](01-contexto-e-objetivo.md)               | Para que o site existe, para quem, e o que ele **não** é                |
| [02-arquitetura.md](02-arquitetura.md)                               | Stack, estrutura de pastas, decisões técnicas e o porquê de cada uma    |
| [03-conteudo.md](03-conteudo.md)                                     | O modelo de conteúdo, onde editar texto, quais campos existem           |
| [04-features.md](04-features.md)                                     | O que o site faz hoje, tela por tela                                    |
| [05-publicacao-e-infra.md](05-publicacao-e-infra.md)                 | Build, deploy, domínio, DNS, SEO                                        |
| [06-estado-atual-e-lacunas.md](06-estado-atual-e-lacunas.md)         | O que está pronto, o que está faltando, dívidas conhecidas              |
| [07-plano.md](07-plano.md)                                           | O plano dos onze pontos do documento 06, e o que foi feito em cada lote |
| [08-plano-formulario-e-medicao.md](08-plano-formulario-e-medicao.md) | A segunda leva: formulário de contato com envio de e-mail, e medição    |
| [09-decisoes-no-codigo.md](09-decisoes-no-codigo.md)                 | O porquê de cada decisão do fonte, arquivo por arquivo                  |
| [10-plano-ideias-publicadas.md](10-plano-ideias-publicadas.md)       | A terceira leva: propostas publicadas em `/ideias`, só por endereço     |

## Propostas

[`propostas/`](propostas/README.md) guarda o planejamento das ideias que chegam
pelo formulário do site, e o
[modelos-de-engajamento.md](propostas/modelos-de-engajamento.md) com os dois
formatos de trabalho que qualquer proposta pode tomar. Não é documentação do `d1.app.br`: cada pasta ali descreve um
projeto separado, com repositório próprio. A primeira é
[causa-raiz-qualidade](propostas/causa-raiz-qualidade/README.md), recebida em
2026-09-09.

O `README.md` da raiz continua sendo o ponto de entrada rápido (como rodar,
onde fica o conteúdo). Esta pasta é a versão longa.

**O código não tem comentários.** Toda justificativa de escolha técnica mora no
[09-decisoes-no-codigo.md](09-decisoes-no-codigo.md), organizado por arquivo. Ao
mexer no fonte, a explicação vai para lá, e não para dentro do código.
