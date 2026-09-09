# POC, cronograma e plano de evolução

## O que a POC é, e o que ela não é

É um sistema real, rodando, com **um** caso de falha real do cliente, percorrido
pelas pessoas que de fato fazem aquele trabalho, gerando um laudo de causa raiz
automático. É pequena em escopo e inteira em profundidade: o corte é no número
de casos e de funcionalidades, nunca no rigor do experimento.

Não é protótipo de tela, não é demonstração com dado inventado, e não é a versão
1 do produto. É o experimento que responde às duas teses do documento 01. Um
protótipo navegável validaria se as telas agradam; nenhuma tela bonita responde
se a simulação revela o que o formulário esconde.

## O que precisa do cliente antes da semana 1

Sem estes cinco itens, o cronograma não começa. Vale dizer isso com todas as
letras na conversa comercial, porque é o que costuma atrasar projeto assim.

| Insumo                                                             | Quem fornece   | Sem isso                        |
| ------------------------------------------------------------------ | -------------- | ------------------------------- |
| Uma NC real, encerrada, com relato do que aconteceu                | Qualidade      | Não há caso                     |
| O POP relacionado, na versão vigente na data do incidente          | Qualidade      | Não há gabarito                 |
| 6 a 10 participantes que fazem esse trabalho                       | Gestão da área | Não há tese 2, só indício       |
| Patrocínio explícito da liderança                                  | Diretoria      | Ninguém libera hora de operação |
| Comunicação declarando que não há punição, assinada por quem manda | Diretoria      | O dado vem educado e falso      |

O último não é formalidade. É o insumo mais importante do experimento: sem ele,
os motivos `orientacao` e `pressao` — os que revelam falha de sistema — nunca
serão marcados por ninguém.

## Cronograma: seis semanas

Uma entrega demonstrável por semana. Nada de "aparece no fim".

| Semana | Foco                           | O que existe no fim dela                                                                                                                    |
| ------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **1**  | Fundação                       | Repositório, infraestrutura, banco, esteira de deploy, login por link mágico. Uma pessoa entra no sistema                                   |
| **2**  | Setup do caso                  | O gestor monta a linha do tempo, com gabarito, cenário real, pesos e checkpoints. **Oficina de 2h com a qualidade para montar o caso real** |
| **3**  | Sala de simulação              | Fluxo completo do participante: contexto congelado, decisão, consequência, motivo, checkpoint, debrief. Teste de fumaça com 2 pessoas       |
| **4**  | Motor de diagnóstico e laudo   | Regras do documento 02 implementadas e testadas em tabela; laudo em tela e em PDF                                                           |
| **5**  | Painel e **rodada real**       | Mapa de calor por etapa; os 6 a 10 participantes percorrem o caso de verdade                                                                |
| **6**  | Diagnóstico, leitura e decisão | Laudo do caso real, relatório de validação com os sete critérios, e a reunião de decisão                                                    |

As semanas 2 e 5 dependem de agenda do cliente. São elas que fazem o cronograma
escorregar, e é por isso que aparecem marcadas.

## Critérios de validação

Medidos na semana 6. São eles, e não a opinião de ninguém sobre as telas, que
dizem se o projeto continua.

| #   | Critério                        | Alvo             | Como se mede                                                                                      |
| --- | ------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------- |
| 1   | Conclusão sem ajuda             | ≥ 70%            | Sessões concluídas / convites, sem suporte durante a sessão                                       |
| 2   | Tempo da sessão                 | mediana ≤ 15 min | Cronômetro da própria plataforma                                                                  |
| 3   | **Achado novo**                 | ≥ 1              | Barreira de contexto que **não constava** no relatório de NC original                             |
| 4   | Concordância com o especialista | ≥ 70% das etapas | Teste cego: antes de ver o laudo, a qualidade escreve sua hipótese por etapa; comparam-se as duas |
| 5   | Ação corretiva gerada           | ≥ 1 aceita       | Ação registrada e aceita pelo dono do processo                                                    |
| 6   | Segurança percebida             | ≥ 80%            | Pesquisa anônima de 3 perguntas: responderia de novo com sinceridade?                             |
| 7   | Esforço de montagem do caso     | ≤ 2 h por caso   | Tempo do gestor na oficina da semana 2                                                            |

Os critérios 3 e 4 são os decisivos. O 3 responde à tese 1: se a simulação não
trouxe nada que a NC já não dissesse, o produto é um formulário mais caro. O 4
mede se o motor é confiável — e uma concordância **alta demais** (perto de 100%)
também é sinal ruim: significa que ele só confirma o que o especialista já
pensava, e ninguém vai pagar por isso.

O 7 é o mais subestimado. A montagem do caso é a maior fricção do produto: se
custar meio dia do gestor, ninguém monta o segundo caso, e a plataforma morre
com uma nota de "muito interessante".

## Depois da semana 6: três desfechos

| Desfecho                                                                     | O que fazer                                                                                       |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Validou** (critérios 3, 4, 5 e 6 atingidos)                                | Fase 1: piloto em um setor, com 5 a 8 casos e biblioteca                                          |
| **Validou em parte** (o diagnóstico convence, mas montar o caso custa caro)  | Fase 1 curta, focada só em reduzir a fricção do setup: modelos prontos e rascunho assistido       |
| **Não validou** (nada de novo apareceu, ou o motor não bate com a realidade) | Parar. Entregar o código, os dados e o relatório. Não jogar bom dinheiro em cima de tese refutada |

O terceiro desfecho precisa estar escrito e combinado antes de começar. Uma POC
que não pode falhar não é POC, é primeira parcela.

## Evolução por fases

### Fase 1 — Piloto em um setor (6 a 8 semanas)

Objetivo: sair de um caso para uma rotina.

- Vários casos, biblioteca com busca, casos derivados de um modelo
- Modelos de linha do tempo por tipo de falha, que é a resposta direta à fricção
  do critério 7
- Painel da diretoria com série histórica: onde a operação falha, ao longo do tempo
- Ciclo da ação corretiva fechado: prazo, responsável, cobrança, e a checagem de
  reincidência ("a mesma etapa voltou a falhar?")
- Ambiente de homologação, papéis mais finos, importação de pessoas por planilha

### Fase 2 — Produto interno (3 a 4 meses)

Objetivo: deixar de ser ferramenta de post-mortem.

- **Treinamento preventivo**: o mesmo caso, usado para treinar quem ainda não
  errou. É aqui que o valor muda de patamar, porque deixa de custar uma falha
  para gerar aprendizado
- Ramificação de cenário: a decisão muda o caminho e o desfecho
- Rascunho da linha do tempo assistido por IA, a partir do relato da NC e do POP
- Agrupamento automático dos motivos em campo livre
- Integração com o QMS/ERP do cliente e SSO corporativo
- Acesso móvel, com QR no posto de trabalho
- Indicadores de reincidência e de eficácia da ação corretiva — o que a ISO 9001
  cobra em auditoria e quase ninguém consegue provar

### Fase 3 — Produto para o mercado (só se fizer sentido)

Objetivo: transformar um sistema sob encomenda em produto vendável. Exige
decisão comercial que hoje não está tomada, e cujo primeiro item é **de quem é a
propriedade intelectual** — como o trabalho é sob encomenda, hoje é do cliente.

- Multi-tenant, autoatendimento, cobrança por assinatura
- Biblioteca de casos por setor (alimentos, farmacêutico, metalmecânico...)
- Comparação anônima entre empresas do mesmo ramo

## Riscos

| Risco                                                            | Peso  | Mitigação                                                                                |
| ---------------------------------------------------------------- | ----- | ---------------------------------------------------------------------------------------- |
| Colaborador responde o que a norma manda, por medo               | Alto  | Regras de visibilidade do documento 02, comunicação da liderança, anonimato com n mínimo |
| Montar o caso custa caro demais para o gestor                    | Alto  | Critério 7 mede isso na POC; modelos e IA atacam na fase 1                               |
| O caso é montado com o desfecho vazando no texto                 | Médio | Revisão a quatro olhos antes de publicar, com aviso na tela                              |
| Poucos participantes concluem, e o diagnóstico fica em "indício" | Médio | Convidar 10 para chegar a 6; prazo de 7 dias; sessão de 15 minutos                       |
| O gabarito está errado e ninguém percebe                         | Médio | A classificação "gabarito incorreto" existe justamente para isso surgir                  |
| Sindicato ou jurídico barram a coleta                            | Médio | Consulta **antes** da semana 1; termo de uso não punitivo; LGPD documentada              |
| A plataforma vira ferramenta de punição depois de entregue       | Alto  | Restrição é técnica, não contratual: o dado individual não existe para a gestão          |
| Cliente muda o caso escolhido no meio                            | Baixo | Caso definido e congelado na semana 2                                                    |
| Agenda da operação atrasa a rodada da semana 5                   | Alto  | Data marcada na semana 1, não na semana 4                                                |

## Premissas

- O cliente tem POP escrito. Se não tiver, o gabarito não existe e o projeto
  muda de natureza — vira consultoria de processo antes de virar software.
- A falha escolhida envolve decisão humana em sequência. Falha de equipamento ou
  de fornecedor não se simula assim.
- Os participantes têm e-mail e acesso a um navegador por quinze minutos.
- Uma pessoa desenvolve. O cronograma é de seis semanas de trabalho dedicado, e
  se o regime for parcial, a régua muda proporcionalmente.

## Fora do escopo da POC

Repetido aqui de propósito, porque é o que costuma virar discussão na entrega:
vários casos, ramificação de cenário, integração com sistema do cliente, SSO,
aplicativo, IA, multi-tenant, treinamento preventivo, aplicativo móvel, e
qualquer migração de histórico de NC antigas.

## Comercial

Deliberadamente em aberto até a conversa com o cliente. As variáveis a fechar:

- **Modelo**: preço fechado pela POC, ou horas com teto? `[PREENCHER]`
- **Valor da POC**: `[PREENCHER]`
- **Forma de pagamento**: parcelas por marco (semana 1, 4 e 6) é o formato que
  protege os dois lados. `[PREENCHER]`
- **Propriedade do código**: sob encomenda, entregue ao cliente. Vale registrar
  em contrato a reserva de uso das ideias genéricas do motor, se houver intenção
  de fase 3. `[PREENCHER]`
- **Sustentação depois da POC**: quem opera, quem paga a infraestrutura, qual o
  tempo de resposta. `[PREENCHER]`
- **Custo da infraestrutura**: repassado ao cliente ou incluso. `[PREENCHER]`
