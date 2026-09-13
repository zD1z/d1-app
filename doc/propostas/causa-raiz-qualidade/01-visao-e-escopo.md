# Visão e escopo

## O problema, como ele aparece

Uma falha operacional acontece. O setor da qualidade abre uma Não Conformidade,
alguém preenche um formulário, e a linha de "causa raiz" termina com alguma
variação de **"falha humana"** ou **"não seguiu o procedimento"**. A ação
corretiva vira "reforçar o treinamento" ou "orientar o colaborador". Seis meses
depois, a mesma falha acontece de novo, com outra pessoa.

O formulário não mente: ele só não pergunta a coisa certa. Ele registra **o que
foi feito** e pede que o próprio envolvido explique **por que** — depois do
desfecho conhecido, na frente de quem vai avaliá-lo, e com o vocabulário do
documento oficial. Três forças puxam a resposta para o mesmo lugar:

- **Viés retrospectivo.** Sabendo como terminou, a decisão errada parece óbvia.
  Ninguém consegue mais reconstruir o que era razoável com a informação de
  antes.
- **Medo.** Se a resposta pode virar advertência, ninguém escreve "não deu tempo
  porque a meta do turno é impossível" nem "meu supervisor mandou pular a etapa".
- **Amostra de um.** O relatório olha uma pessoa. Se seis pessoas errariam
  igual, isso não aparece em lugar nenhum — e é exatamente esse dado que separa
  falha de pessoa de falha de sistema.

O resultado é uma máquina que produz evidência de auditoria e quase nenhuma
melhoria.

## A solução, em uma frase

Em vez de perguntar por que a pessoa errou, **colocá-la de novo na situação** —
com a informação que ela tinha naquele instante, sem saber o desfecho — e
observar o que ela decide. Depois, repetir com os outros envolvidos e com quem
faz o mesmo trabalho.

O que sai disso não é uma nota. É a resposta a uma pergunta que a NC nunca faz:
**quantas pessoas, no lugar dela, teriam feito a mesma coisa — e por quê.**

## As duas teses que a POC precisa validar

Este é o ponto central do projeto, e a razão de a primeira entrega ser uma POC
funcional e não um protótipo bonito.

**Tese 1 — a simulação revela o que o formulário esconde.** Reconstruindo o
cenário sem o desfecho à vista, aparecem barreiras de contexto (tempo, sistema
lento, insumo faltando, ordem contrária, procedimento ambíguo) que o relatório
de NC não capturou.

**Tese 2 — a repetição separa pessoa de sistema.** Se a maioria dos
participantes toma a mesma decisão divergente, no mesmo ponto, pelo mesmo
motivo, a causa está no processo ou no treinamento, e a evidência disso é
estatística, não opinião de ninguém.

Se as duas se sustentarem em um caso real, o produto tem razão de existir. Se
não, é melhor descobrir em seis semanas do que em seis meses.

## Quem usa

| Papel                     | O que faz na plataforma                                                                        | Quantidade típica |
| ------------------------- | ---------------------------------------------------------------------------------------------- | ----------------- |
| **Gestor da qualidade**   | Registra a falha, monta a linha do tempo, define o gabarito, convida participantes, lê o laudo | 1 a 3             |
| **Colaborador envolvido** | Entra na sala do caso, decide etapa a etapa, explica os desvios, recebe o próprio retorno      | 5 a 12 por caso   |
| **Gerência e diretoria**  | Lê o painel agregado: onde a operação falha, e o que foi feito a respeito                      | 2 a 5             |
| **Administrador**         | Cadastra pessoas, setores e POPs, controla acesso                                              | 1                 |

O colaborador é o usuário mais importante e o mais frágil. Se ele não confiar
que aquilo não vira advertência, ele responde o que a norma diz e o produto
morre com dados limpos e inúteis. As regras de visibilidade do documento 02
existem por causa disso.

## Como funciona, etapa por etapa

O enunciado original tem quatro etapas. Elas ficam de pé, com dois acréscimos
que mudam a qualidade do diagnóstico.

### 1. Setup do caso (gestor)

O gestor registra o incidente e monta a linha do tempo: `T1`, `T2`, `T3`… Em
cada instante, três coisas precisam existir:

- **O contexto de então** — o que a pessoa sabia, via e tinha à mão naquele
  momento. Nada do desfecho.
- **As opções plausíveis** — não só a certa e a errada, mas o que uma pessoa
  razoável consideraria. Uma opção obviamente absurda não mede nada.
- **Dois marcadores**: a opção do **gabarito** (o que o POP manda) e a opção do
  **cenário real** (o que de fato aconteceu).

Cada opção divergente carrega a consequência narrativa que ela produz, para que
o participante sinta o efeito da própria escolha sem que ninguém lhe diga que
errou.

### 2. Simulação (colaborador)

O convidado entra na sala do caso e avança etapa a etapa. Vê só o contexto
daquele instante, decide, e recebe a consequência da decisão. Não vê o gabarito,
não vê o que os outros responderam, não volta atrás. O tempo de cada decisão é
cronometrado — porque "demorou três minutos para achar a informação" é um dado
sobre o processo, não sobre a pessoa.

### 3. Coleta do contexto

A cada decisão diferente do gabarito, uma pergunta: **por que essa?** A resposta
sai de uma lista fechada de motivos, mais um campo livre. A lista é o que
transforma relato em estatística — está inteira no documento 02.

**Acréscimo — o checkpoint de conhecimento.** Logo depois do motivo, uma
pergunta direta sobre a norma daquele ponto ("o POP manda fazer o quê aqui?").
Serve para separar objetivamente duas coisas que a autodeclaração confunde:
quem _não sabia_ costuma dizer que _não deu tempo_, porque soa melhor. Se a
pessoa erra o motivo declarado mas acerta a norma, é barreira de contexto. Se
erra a norma, é treinamento — independentemente do que ela disse.

### 4. Diagnóstico e ação

Fechada a rodada, o sistema compara desfecho simulado com gabarito, cruza
divergências, motivos e checkpoints de todos os participantes, e classifica cada
ponto da linha do tempo:

- **Falha de processo** — o procedimento oficial é inviável, lento, ambíguo ou
  depende de algo que não existe na hora.
- **Falha de treinamento** — a norma existe e é viável, e as pessoas não a
  conhecem.
- **Falha de execução** — desvio isolado, de quem conhecia a norma e tinha
  condição de segui-la.

**Acréscimo — mais duas saídas**, porque a realidade produz as duas e o modelo
de três não tem onde colocá-las:

- **Gabarito incorreto** — a maioria diverge e aponta que o POP não cobre aquela
  situação. Aqui quem está errado é o documento, não a operação.
- **Melhoria latente** — o desvio produziu resultado igual ou melhor, por um
  caminho mais curto. Isso é candidato a virar o novo POP.

Cada classificação vem com a ação sugerida (revisar POP, reciclar treino,
corrigir ferramenta, rever carga) e com a evidência que a sustenta: quantos
divergiram, em que ponto, dizendo o quê.

## O que entra na POC

| Entra                                                                         | Por quê                                                       |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Login por link mágico no e-mail, sem senha                                    | Menor atrito possível para o colaborador entrar uma vez       |
| Cadastro de **um** caso, com linha do tempo linear, gabarito e cenário real   | É o insumo da tese 1                                          |
| Sala de simulação com contexto congelado, cronômetro e consequência por passo | É o experimento                                               |
| Coleta de motivo com taxonomia fechada + checkpoint de conhecimento           | É o que vira diagnóstico                                      |
| Retorno imediato ao participante, sem nota e sem comparação com colegas       | Sem isso, ninguém participa da segunda rodada                 |
| Motor de diagnóstico determinístico, por etapa e por caso                     | É a tese 2                                                    |
| Painel do caso para o gestor, com mapa de calor da linha do tempo             | É o que ele mostra para a diretoria                           |
| Relatório do caso em PDF                                                      | Precisa poder ser anexado à NC e ao processo de auditoria     |
| Trilha de auditoria de tudo que aconteceu                                     | ISO 9001 exige evidência, e o cliente é do setor da qualidade |

## O que fica de fora, de propósito

Nada aqui é esquecimento. É sequência: cada item destes só faz sentido depois
que as duas teses se sustentarem.

| Fora da POC                                         | Quando entra                                     |
| --------------------------------------------------- | ------------------------------------------------ |
| Ramificação de cenário (a decisão muda o caminho)   | Fase 2. Multiplica o custo de montar o caso      |
| Vários casos, biblioteca reutilizável, busca        | Fase 1                                           |
| Treinamento preventivo (simular antes de falhar)    | Fase 2. É o maior potencial comercial do produto |
| Integração com ERP/QMS e SSO corporativo            | Fase 2, quando houver contrato                   |
| Aplicativo móvel e acesso por QR no chão de fábrica | Fase 2                                           |
| IA para rascunhar a linha do tempo a partir da NC   | Fase 2. Ataca a maior fricção do produto         |
| Multi-tenant, autoatendimento, cobrança             | Fase 3, e só se virar produto                    |
| Gamificação, ranking, trilhas, pontuação pública    | Nunca, provavelmente. Ver abaixo                 |

## O que a plataforma não é

Decisões de produto, não pendências:

- **Não é ferramenta de avaliação de desempenho.** Nenhum resultado individual
  chega ao RH, ao chefe ou a qualquer painel de gestão. Isso é regra técnica no
  documento 02, não promessa de contrato.
- **Não é ranking.** Ranking transforma a simulação em prova, e prova produz a
  resposta que a norma espera em vez da resposta verdadeira. Sem pontuação
  pública, sem comparação entre colegas.
- **Não substitui o sistema de NC do cliente.** Produz um laudo para ser anexado
  ao processo que já existe.
- **Não é LMS.** Não hospeda curso, não emite certificado. Aponta que a
  reciclagem é necessária e para quem.
- **Não adivinha causa raiz com IA.** O diagnóstico é uma regra escrita, audível
  e discutível. Um setor de qualidade não assina laudo que ninguém sabe explicar.

## Vocabulário

| Termo                 | O que significa aqui                                                         |
| --------------------- | ---------------------------------------------------------------------------- |
| **POP**               | Procedimento Operacional Padrão. O documento que diz como o trabalho é feito |
| **NC**                | Não Conformidade. O registro formal da falha, no sistema da qualidade        |
| **Caso**              | Um incidente transformado em simulação                                       |
| **Etapa (`T1`…`Tn`)** | Um instante de decisão dentro do caso                                        |
| **Gabarito**          | A opção que o POP vigente na data do incidente mandava tomar                 |
| **Cenário real**      | O que de fato aconteceu, conforme apurado na NC                              |
| **Sessão**            | Uma pessoa percorrendo um caso, do início ao fim                             |
| **Desvio**            | Decisão diferente do gabarito                                                |
| **Laudo**             | O diagnóstico do caso, com evidência e ação sugerida                         |
