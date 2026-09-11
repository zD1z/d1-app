# Estimativa de custo e esforço

Insumo para montar o orçamento. **Não é o orçamento.** Aqui há horas, custos de
operação e o que o cliente gasta do lado dele. O preço é uma decisão comercial
sua, tomada em cima destes números, e a última seção mostra a conta que liga uma
coisa à outra.

## Método

Estimativa **de baixo para cima**, por bloco de trabalho, em três pontos:
otimista (`O`), provável (`M`) e pessimista (`P`). O valor usado é o PERT:

```
E = (O + 4M + P) / 6
```

Três pontos, e não um número só, porque um número único vira promessa. A coluna
`P` é onde mora a verdade do software: não é o cenário catastrófico, é o dia em
que o Angular, o CORS e a agenda do cliente resolvem aparecer juntos.

**Uma hora aqui é uma hora de trabalho concentrado**, não uma hora de expediente.
Reunião, e-mail e troca de contexto estão nos blocos de gestão e de condução, não
diluídos nos blocos técnicos.

## POC: esforço por bloco

| #   | Bloco                                                       | O   | M   | P   | PERT    |
| --- | ----------------------------------------------------------- | --- | --- | --- | ------- |
| 1   | Fundação: monorepo, Terraform, Lambda, gateway, domínio, CI | 10  | 14  | 22  | 14,7    |
| 2   | Autenticação por link mágico, papéis, SES, limites          | 10  | 14  | 20  | 14,3    |
| 3   | Modelo de dados e migrations                                | 8   | 12  | 18  | 12,3    |
| 4   | Setup do caso — API e validação de publicação               | 12  | 16  | 24  | 16,7    |
| 5   | Setup do caso — telas do gestor (linha do tempo, opções)    | 16  | 22  | 32  | 22,7    |
| 6   | Convites e e-mails                                          | 5   | 7   | 10  | 7,2     |
| 7   | Sala de simulação — API etapa a etapa                       | 10  | 14  | 20  | 14,3    |
| 8   | Sala de simulação — telas do participante                   | 18  | 24  | 34  | 24,7    |
| 9   | Debrief do participante                                     | 5   | 8   | 12  | 8,2     |
| 10  | Motor de diagnóstico e testes de tabela                     | 14  | 20  | 30  | 20,7    |
| 11  | Laudo em tela e em PDF                                      | 10  | 14  | 20  | 14,3    |
| 12  | Painel do caso e mapa de calor                              | 10  | 14  | 20  | 14,3    |
| 13  | Ações corretivas                                            | 5   | 7   | 10  | 7,2     |
| 14  | Auditoria, retenção e LGPD técnica                          | 6   | 9   | 14  | 9,3     |
| 15  | Testes de ponta a ponta, acessibilidade, revisão            | 10  | 14  | 20  | 14,3    |
| 16  | Oficina com a qualidade e montagem do caso real             | 6   | 8   | 12  | 8,3     |
| 17  | Condução da rodada e suporte aos participantes              | 5   | 8   | 12  | 8,2     |
| 18  | Relatório de validação e reunião de decisão                 | 5   | 7   | 10  | 7,2     |
| 19  | Gestão, reuniões semanais e documentação do projeto         | 12  | 16  | 24  | 16,7    |
|     | **Total**                                                   | 177 | 248 | 364 | **256** |

**256 horas** é o número para trabalhar. O desvio-padrão de PERT dá cerca de 8
horas, mas ele supõe tarefas independentes — em software elas erram juntas, e por
isso a folga vem de uma **contingência de 15%**, não do desvio:

| Cenário                        | Horas   |
| ------------------------------ | ------- |
| Otimista (tudo colabora)       | 177     |
| **PERT, o número de trabalho** | **256** |
| **PERT + 15% de contingência** | **295** |
| Pessimista (nada colabora)     | 364     |

### A tensão com as seis semanas

O documento 04 vende seis semanas. Seis semanas de dedicação integral são 240
horas, e a estimativa dá 256. **O cronograma não fecha com folga nenhuma**, e é
melhor encarar isso agora do que na semana 5. Três saídas, em ordem de
preferência:

1. **Vender sete semanas** (295 h, com a contingência dentro). É o honesto.
2. **Vender seis semanas com escopo enxuto**: os blocos 12 e 13 saem para a fase
   1, e o laudo fica só em tela com impressão do navegador. Dá ~225 h, que cabe
   em seis semanas com 6% de folga. O que o cliente perde é o painel agregado —
   a POC ainda entrega o laudo do caso, que é o que valida a tese.
3. **Vender seis semanas cheias e absorver o estouro.** Não recomendo: o
   prejuízo é seu e o cliente nem fica sabendo que houve.

| Variante da POC                 | Horas | Calendário a 40 h/semana |
| ------------------------------- | ----- | ------------------------ |
| Enxuta (sem painel e sem ações) | ~225  | 6 semanas                |
| Completa                        | 256   | 6,5 semanas              |
| Completa com contingência       | 295   | 7 a 7,5 semanas          |

### Se o regime não for integral

| Dedicação por semana | 256 h dão   | 295 h dão   |
| -------------------- | ----------- | ----------- |
| 40 h (integral)      | 6,5 semanas | 7,5 semanas |
| 30 h                 | 8,5 semanas | 10 semanas  |
| 20 h (meio período)  | 13 semanas  | 15 semanas  |

Duas coisas pioram no regime parcial, e o orçamento precisa refleti-las: o
projeto atravessa mais fronteiras de contexto (cada retomada custa), e a janela
de atenção do cliente é mais longa que o interesse dele. Meio período custa mais
que o dobro do calendário em risco de morte do projeto, não em horas.

## Custo de operação durante a POC

Da tabela do documento 03, projetada para os dois meses de projeto:

| Item                           | Mensal | Na POC (2 meses) |
| ------------------------------ | ------ | ---------------- |
| Cloudflare Pages               | R$ 0   | R$ 0             |
| Neon Postgres (plano gratuito) | R$ 0   | R$ 0             |
| Lambda + API Gateway           | < R$ 5 | < R$ 10          |
| SES                            | < R$ 1 | < R$ 2           |
| S3 (backup)                    | < R$ 2 | < R$ 4           |
| Domínio (anual, rateado)       | ~R$ 3  | ~R$ 7            |
| **Total de infraestrutura**    |        | **< R$ 25**      |

O custo de infraestrutura da POC é irrelevante diante do custo de mão de obra, e
isso é um argumento de venda: **o risco financeiro do cliente é quase todo em
horas, e as horas têm data para acabar.**

Cuidado com um detalhe que costuma escapar: se a conta AWS for aberta no nome do
cliente, o cartão é dele e o valor não passa pelo seu orçamento — mas alguém
precisa configurar acesso, e isso são as 4 a 8 horas do bloco de riscos abaixo.

## O que o cliente gasta do lado dele

Entra no orçamento como transparência, não como cobrança. É o número que
responde à pergunta "quanto isso vai atrapalhar a operação?".

| Quem                                   | Horas       |
| -------------------------------------- | ----------- |
| Qualidade: oficina, revisão, validação | 8 a 12      |
| Participantes: 8 pessoas × 0,5 h       | 4           |
| Liderança: alinhamento e comunicação   | 2           |
| TI do cliente: acessos, se houver      | 0 a 6       |
| **Total**                              | **14 a 24** |

Vinte horas de uma equipe inteira, espalhadas em seis semanas, para descobrir a
causa de uma falha que provavelmente já custou mais que isso só em retrabalho.

## Da hora ao preço

A conta é esta, e cada linha é uma decisão sua:

```
preço = horas × taxa-hora
      + custo de infraestrutura (se não for repassado ao cliente)
      + prêmio de risco (preço fechado custa mais que horas com teto)
      − desconto de piloto (se houver intenção de caso de referência)
      ÷ (1 − carga tributária)          se a taxa-hora for líquida
```

Grade de referência, para ver o tamanho da conta. **Os valores de taxa são
apenas degraus de cálculo, não recomendação de mercado**: a sua taxa depende do
seu custo, da sua agenda e do que este cliente representa.

| Taxa-hora | Enxuta (225 h) | Completa (256 h) | Com contingência (295 h) |
| --------- | -------------- | ---------------- | ------------------------ |
| R$ 120    | R$ 27.000      | R$ 30.700        | R$ 35.400                |
| R$ 150    | R$ 33.750      | R$ 38.400        | R$ 44.250                |
| R$ 180    | R$ 40.500      | R$ 46.080        | R$ 53.100                |
| R$ 220    | R$ 49.500      | R$ 56.320        | R$ 64.900                |

Três avisos sobre essa tabela:

- **Imposto não está dentro.** Se a taxa que você tem na cabeça é o que quer
  receber, o preço de venda precisa subir pela alíquota do seu regime. `[PREENCHER]`
- **Preço fechado não é a mesma taxa de horas com teto.** No preço fechado o
  risco de estouro é seu, e ele se paga: a contingência de 15% é o mínimo, e 20%
  é mais realista para o primeiro projeto com um cliente novo.
- **Desconto de piloto é decisão, não gentileza.** Se houver, que seja trocado
  por algo: autorização para citar o caso, depoimento, ou preferência nas fases
  seguintes. Desconto sem contrapartida vira o preço de referência do cliente
  para sempre.

## Modelos de cobrança

| Modelo                       | Quando cabe                                              | Risco      |
| ---------------------------- | -------------------------------------------------------- | ---------- |
| **Preço fechado por marcos** | Escopo travado, como está no documento 01. É o caso aqui | Seu        |
| Horas com teto               | Cliente indeciso sobre o escopo, ou POP inexistente      | Dividido   |
| Horas puras                  | Não cabe numa POC que precisa ter fim combinado          | Do cliente |

**Recomendação: preço fechado, em três parcelas por marco.** O escopo já está
travado documento por documento, e parcelar por entrega protege os dois lados:

| Parcela | Quando                                          | Peso |
| ------- | ----------------------------------------------- | ---- |
| 1       | Assinatura, antes da semana 1                   | 30%  |
| 2       | Semana 4, com laudo automático funcionando      | 40%  |
| 3       | Semana 6, com o relatório de validação entregue | 30%  |

A segunda parcela é a maior de propósito: é onde o grosso do trabalho já foi
feito e ainda falta a parte que depende da agenda do cliente.

## Depois da POC

Estimativas grossas, com margem de ±40%. Servem para o cliente saber a ordem de
grandeza do que vem, não para virar proposta.

| Fase                          | Horas     | Calendário a 40 h/semana |
| ----------------------------- | --------- | ------------------------ |
| **Fase 1** — piloto num setor | 240 a 320 | 6 a 8 semanas            |
| **Fase 2** — uso permanente   | 480 a 640 | 3 a 4 meses              |

O que pesa em cada uma:

- **Fase 1**: biblioteca de casos e modelos prontos (60 a 80 h, e é o que ataca a
  fricção que mais ameaça o produto), painel histórico (40 a 60 h), ciclo da ação
  corretiva com reincidência (50 a 70 h), homologação e importação de pessoas
  (40 a 60 h).
- **Fase 2**: treinamento preventivo (100 a 140 h), ramificação de cenário (120 a
  160 h, é o item mais caro do roadmap inteiro), rascunho assistido por IA (60 a
  90 h, mais custo de uso), integração com o QMS e SSO (80 a 140 h, e depende
  inteiramente do sistema do cliente), acesso móvel (60 a 90 h).

### Sustentação mensal

A partir da entrega, o sistema precisa de alguém. Três desenhos, para escolher
com o cliente:

| Desenho            | Horas/mês | O que cobre                                             |
| ------------------ | --------- | ------------------------------------------------------- |
| Garantia (3 meses) | incluída  | Só defeito do que foi entregue. Sem funcionalidade nova |
| Manutenção mínima  | 4 a 6     | Correções, atualização de dependências, monitoramento   |
| Evolução contínua  | 16 a 24   | O acima, mais uma leva pequena de melhorias por mês     |

Infraestrutura à parte, e o número dela cresce com o uso: sair do plano gratuito
do Neon é o primeiro degrau, por volta de US$ 19/mês.

## O que faz a conta estourar

Cada linha é um adicional que **precisa estar escrito na proposta** como fora do
preço fechado, com o valor já combinado. É o que evita a conversa difícil na
semana 4.

| Situação                                              | Impacto                                   |
| ----------------------------------------------------- | ----------------------------------------- |
| Cliente não tem POP escrito para a falha escolhida    | +16 a 24 h, ou muda a natureza do projeto |
| TI do cliente exige rodar na infraestrutura dela      | +16 a 24 h                                |
| Jurídico ou sindicato exigem adequação formal de LGPD | +8 a 16 h                                 |
| SSO corporativo antecipado para a POC                 | +24 a 40 h                                |
| Trocar o caso escolhido depois da semana 2            | +16 a 24 h                                |
| Mais de 12 participantes, ou mais de um caso          | +8 h por caso extra                       |
| Acessibilidade formal (WCAG AA auditada)              | +24 a 40 h                                |
| Identidade visual própria do produto                  | +16 a 24 h, ou terceirizar                |
| Participantes sem e-mail corporativo                  | +8 a 16 h (outro caminho de acesso)       |

## Fora do preço, sempre

Design de marca, treinamento presencial, migração de NCs antigas, integração com
qualquer sistema do cliente, suporte fora do horário comercial, hospedagem em
nome do cliente e qualquer idioma além do português.

## Esqueleto do orçamento

Para copiar quando for escrever a proposta comercial:

```
Objeto      Prova de conceito da plataforma de simulação e análise de causa raiz,
            conforme escopo dos documentos 01 a 04, com um caso real.
Prazo       [6 ou 7] semanas a partir da entrega dos insumos (doc 04).
Esforço     [225 / 256 / 295] horas.
Valor       R$ [PREENCHER], fechado.
Pagamento   30% na assinatura, 40% na semana 4, 30% na entrega.
Inclui      Código-fonte, infraestrutura como código, documentação, laudo do
            caso real e relatório de validação.
Não inclui  Os itens da seção "fora do preço", mais os adicionais tabelados.
Infra       Conta em nome de [PREENCHER]. Custo estimado até R$ 25 no período.
Garantia    90 dias para defeito do que foi entregue.
Propriedade Código entregue ao cliente na quitação.
Validade    [PREENCHER] dias.
```
