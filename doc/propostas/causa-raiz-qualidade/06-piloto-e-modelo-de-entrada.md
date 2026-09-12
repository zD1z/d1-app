# Piloto e modelo de entrada

Decisão tomada em 2026-09-12, depois que a apresentação foi ao Diego. Ela muda a
natureza do projeto e passa a valer sobre o que os documentos 04 e 05 dizem de
comercial.

Este é o **modelo B** dos
[modelos-de-engajamento.md](../modelos-de-engajamento.md): roda na sua
infraestrutura, o código é seu, o cliente usa por licença. O modelo A, com
desenvolvimento nas contas do cliente e código cedido a ele, é o formato pago, e
continua disponível se o Diego quiser tudo dentro de casa. A migração de um para
o outro está descrita lá, custa de um a dois dias, e é cobrada.

## A decisão

O Diego é o cliente final e o dono da ideia. A primeira POC é feita **sem
cobrança de mão de obra**: ele paga apenas o custo de manter a aplicação no ar, e
a hospedagem fica na plataforma que você opera. Se a ideia se provar na empresa
dele, o desenvolvimento completo é orçado e cobrado. Depois dos primeiros
clientes, a gratuidade acaba: a POC passa a ser cobrada como qualquer outro
trabalho.

Isto não é desconto. É **investimento em aquisição**: você troca horas suas por
um caso real, uma referência e um produto que existe. O documento abaixo é o que
protege esse investimento de virar prejuízo.

## O problema que precisa ser resolvido antes de começar

"O código e a solução da POC são dele" e "depois eu levo isso a outros clientes"
**não cabem juntos**. Se a titularidade do código for cedida ao Diego, você não
pode reaproveitar o motor de diagnóstico, as telas nem a modelagem no segundo
cliente, e a estratégia de crescimento morre no primeiro caso. Pior: você não
poderia nem hospedar o produto para outra empresa, que é justamente o modelo de
receita desenhado.

Também não é preciso escolher entre ceder tudo e não ceder nada. O que o Diego
precisa está separado do que você precisa:

| O que é dele                                                             | O que é seu                                                      |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| A ideia, o conceito e a autoria dela                                     | O código-fonte e a titularidade dele                             |
| Os dados: casos, POPs, respostas, laudos, tudo que a empresa gerar       | O motor de diagnóstico, as telas e a modelagem, como componentes |
| Uma licença de uso perpétua, gratuita e irrevogável, para uso interno    | O direito de atender outros clientes com o mesmo produto         |
| O direito de levar os dados embora a qualquer momento, em formato aberto | O direito de citar o caso como referência                        |

**A recomendação é essa divisão**, e ela é honesta de defender: a ideia é dele e
você reconhece isso por escrito, inclusive publicamente se ele quiser. O que você
guarda é a ferramenta que construiu, e sem a qual não há segundo cliente nem
plataforma para hospedar.

Se o Diego insistir em cessão total do código, há duas saídas, nessa ordem:

1. **Reserva de componentes genéricos.** Ele fica com a aplicação; você reserva o
   direito de reutilizar o motor, a estrutura e os componentes que não carregam
   nada da operação dele. É o mínimo aceitável.
2. **Cessão total mesmo, e aí o trabalho é cobrado.** Se ele quer a exclusividade,
   ela tem preço, e o preço está no documento 05. Exclusividade de graça é o único
   arranjo que não faz sentido nenhum.

## O escopo do piloto: a vitrine

Teto declarado: **120 horas**. O escopo abaixo é o menor conjunto que ainda
responde às duas teses do documento 01. Menos que isso vira demonstração bonita
que não prova nada, e aí não valia a pena investir hora nenhuma.

| Bloco                                              | Horas   |
| -------------------------------------------------- | ------- |
| Fundação, ambiente e publicação                    | 10      |
| Acesso por link com token, sem e-mail transacional | 6       |
| Modelo de dados e migrations                       | 8       |
| Setup do caso: API e validação de publicação       | 10      |
| Setup do caso: telas do gestor                     | 16      |
| Sala de simulação: API etapa a etapa               | 10      |
| Sala de simulação: telas do participante           | 16      |
| Debrief do participante                            | 4       |
| Motor de diagnóstico e testes de tabela            | 14      |
| Laudo do caso em tela                              | 8       |
| Retenção e trilha mínima de auditoria              | 3       |
| Testes e revisão                                   | 6       |
| Oficina e montagem do caso real                    | 8       |
| Condução da rodada com os participantes            | 5       |
| Relatório de validação                             | 4       |
| Alinhamentos e gestão                              | 6       |
| **Total**                                          | **134** |

**São 134 horas, não 120.** Três alavancas fecham a diferença, e a ordem importa:

| Corte                                                       | Economia | Custo do corte                                       |
| ----------------------------------------------------------- | -------- | ---------------------------------------------------- |
| Laudo sem mapa de calor, só a lista por etapa               | 3 h      | Perde o impacto visual na reunião com a diretoria    |
| Debrief em texto simples, sem comparação lado a lado        | 2 h      | Pouco: o participante ainda recebe o retorno         |
| Relatório de validação só na reunião, sem documento escrito | 4 h      | Perde o material que você levaria ao segundo cliente |
| Você monta o caso sozinho, sem a oficina                    | 8 h      | **Alto. Não recomendo**: mata o critério de fricção  |

Os três primeiros dão 9 horas e levam a 125. O último fecha em 117, e é o único
que eu não faria: o tempo que o gestor leva para montar um caso é o número que
decide se este produto tem futuro, e ele só aparece se o gestor montar.

**Fica fora da vitrine**, e cada item vira orçamento se pedido: painel agregado,
laudo em PDF, registro de ações corretivas, convite por e-mail automático, mais
de um caso, biblioteca, SSO, ramificação de cenário, IA e acesso móvel.

A ausência do e-mail transacional é deliberada: tira o SES, a verificação de
domínio e a saída do modo de teste do caminho crítico. O gestor recebe os links
de acesso em uma lista e distribui do jeito que já distribui tudo.

## Onde a gratuidade termina

Sem isto escrito, o piloto vira assinatura vitalícia de graça, uma
"pequena melhoria" por vez. Qualquer um dos gatilhos abaixo encerra o piloto e
abre orçamento:

| Gatilho                                           |
| ------------------------------------------------- |
| O segundo caso, seja qual for o motivo            |
| Qualquer item da lista "fica fora da vitrine"     |
| Mais de 12 participantes, ou uma segunda unidade  |
| Uso continuado além de 60 dias depois da rodada   |
| Pedido de suporte com prazo de resposta combinado |
| Qualquer integração com sistema da empresa dele   |

Nada disso é dito com aspereza. É uma frase no e-mail de alinhamento: "o piloto
cobre um caso; a partir do segundo, eu passo um orçamento".

## Hospedagem, custo e o preço-âncora

Você hospeda, e ele paga o custo. Os números reais:

| Item                                      | Por cliente, por mês      |
| ----------------------------------------- | ------------------------- |
| Lambda, API Gateway, S3                   | < R$ 10                   |
| Banco (Neon), enquanto couber no gratuito | R$ 0                      |
| Banco, a partir do segundo cliente        | ~US$ 19 no total, rateado |
| Domínio ou subdomínio                     | ~R$ 3                     |
| **Custo direto**                          | **R$ 15 a R$ 60**         |

**Três coisas a decidir aqui, e a terceira é a que dói:**

1. **O plano gratuito do Neon é um projeto.** No segundo cliente hospedado, ou
   entra o plano pago, ou os dois clientes dividem o mesmo projeto com bancos
   separados, o que é aceitável tecnicamente e ruim de explicar. Orce o plano pago
   a partir do cliente 2.
2. **Você vira operador de dados pessoais.** Os dados são de trabalhadores da
   empresa dele, e estão na sua infraestrutura. Isso pede um acordo de tratamento
   por escrito, com finalidade, prazo de retenção, o que acontece no encerramento e
   quem responde por incidente. Duas páginas, e não é opcional.
3. **Cobrar "só o custo" ancora o preço em R$ 30.** Depois, a assinatura de
   verdade vai parecer um aumento de dez vezes. A frase que evita isso vai no mesmo
   e-mail: _"durante o piloto você paga só a infraestrutura, cerca de R$ X por mês;
   o preço do serviço em produção é outro, e a gente conversa quando chegar lá"_.
   Custa uma linha e economiza uma negociação inteira.

## Quantos clientes de graça

Dois. No máximo três. Cada um custa 130 horas suas, então três clientes são quase
400 horas, ou dois meses e meio de trabalho sem faturar.

| Cliente     | Mão de obra           | Hospedagem       | O que você leva embora          |
| ----------- | --------------------- | ---------------- | ------------------------------- |
| 1 (Diego)   | Grátis, teto de 120 h | Custo direto     | O caso, a referência, o produto |
| 2           | Grátis ou metade      | Custo direto     | A prova de que repete           |
| 3 em diante | Cobrada desde a POC   | Preço de serviço | Receita                         |

O cliente 2 existe por uma razão específica: um caso pode ser sorte. Dois casos,
em empresas diferentes, é o que permite dizer que o método funciona, e é o que
sustenta a cobrança a partir do terceiro.

## O que isso muda na arquitetura

O documento 03 desenhou single-tenant porque o trabalho era sob encomenda. Não é
mais: agora são vários clientes na sua infraestrutura. **A resposta continua sendo
não construir multi-tenant agora.**

Até o terceiro cliente, o certo é **uma instância por cliente**: mesmo código,
mesma infraestrutura como código, um deploy e um banco para cada. Sobe em minutos
porque o Terraform já existe, isola os dados por construção, e o custo é o da
tabela acima. Multi-tenant custaria de duas a três semanas agora e resolveria um
problema que você ainda não tem.

O gatilho para mudar é operacional, não filosófico: **quando a operação dos
deploys passar de quatro horas por mês**, ou no quarto cliente, o que vier
primeiro.

## E-mail de alinhamento

Para mandar ao Diego se ele aprovar. Não é contrato, é o combinado por escrito
que evita mal-entendido depois.

```
Diego,

Fechado. Como combinamos, o piloto funciona assim:

Eu desenvolvo a plataforma sem cobrar as horas. Você paga só o custo de
manter no ar, cerca de R$ [X] por mês, na minha infraestrutura. Esse é o
preço de piloto: o valor do serviço em produção é outro, e a gente conversa
quando fizer sentido.

O piloto cobre um caso real, com até 12 participantes, do começo ao fim:
montagem, simulação, diagnóstico e laudo. A partir do segundo caso, ou de
qualquer coisa fora disso, eu passo um orçamento antes de fazer.

O que preciso de vocês:
- uma Não Conformidade real, já encerrada, com o relato
- o POP da época do incidente
- de 6 a 10 pessoas, quinze minutos cada
- duas horas suas para montarmos o caso juntos
- uma mensagem da liderança deixando claro que isso não gera punição

Duas coisas do meu lado:
- a ideia é sua, e eu digo isso em qualquer lugar onde o projeto apareça
- a plataforma é minha, e você tem licença de uso permanente e gratuita
  dela, com seus dados sempre seus e exportáveis quando quiser
- se der certo, quero poder contar o caso a outros clientes, com o nome da
  empresa omitido se você preferir

Prazo: [X] semanas a partir do dia em que os insumos chegarem.

Se estiver certo assim, me responde confirmando e eu começo.
```

## Riscos deste modelo

| Risco                                                                | Mitigação                                                                   |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Projeto de graça vira o último da fila, seu e dele                   | Datas combinadas por escrito, e a rodada marcada na semana 1                |
| "Só mais um ajustezinho" consome meses                               | A lista de gatilhos acima, dita na primeira conversa                        |
| A empresa dele nunca libera os participantes                         | Sem participantes não há tese 2. Combine o mínimo de 6 antes de começar     |
| Ele some depois da entrega, sem validar                              | O piloto tem data de fim: 60 dias depois da rodada                          |
| Você cede o código e perde o produto                                 | A divisão da segunda seção, resolvida **antes** da primeira linha de código |
| A hospedagem barata de hoje vira obrigação de disponibilidade amanhã | Diga desde já que o piloto não tem prazo de resposta combinado              |
| O caso dá "inconclusivo" e ele lê como fracasso                      | Combine na oficina que inconclusivo é resultado, e o que ele significa      |
