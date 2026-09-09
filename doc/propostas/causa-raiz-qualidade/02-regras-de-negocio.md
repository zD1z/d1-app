# Regras de negócio

Este documento é o coração da proposta. A tela é trocável; estas regras são o
produto. Elas estão escritas em nível de implementação de propósito: o motor de
diagnóstico precisa ser determinístico, testável em tabela e explicável para um
auditor.

## Entidades

| Entidade                | O que guarda                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| **Unidade**             | Planta, setor ou área. Recorte usado nos painéis                                               |
| **Pessoa**              | Nome, e-mail, unidade, papel, função                                                           |
| **POP**                 | Procedimento, com **versão** e data de vigência                                                |
| **Caso**                | Incidente virado simulação: título, relato, data do incidente, POP e versão, gravidade, estado |
| **Etapa**               | Um instante `T_n` do caso: contexto, pergunta, peso, tempo esperado                            |
| **Opção**               | Uma escolha possível na etapa: texto, classificação, consequência narrativa                    |
| **Checkpoint**          | Pergunta de conhecimento amarrada à etapa, com a resposta correta segundo o POP                |
| **Convite**             | Pessoa × caso, com prazo e estado                                                              |
| **Sessão**              | Uma pessoa percorrendo um caso: início, fim, estado                                            |
| **Resposta**            | Sessão × etapa: opção escolhida, tempo gasto, motivo do desvio, checkpoint                     |
| **Diagnóstico**         | Resultado do motor: por etapa e do caso, com versão do motor e parâmetros usados               |
| **Ação**                | O que fazer a respeito: tipo, responsável, prazo, estado                                       |
| **Evento de auditoria** | Quem fez o quê, quando, com que dado antes e depois                                            |

## Ciclo de vida do caso

```
rascunho ──publicar──> pronto ──primeira sessão──> em execução
                                                        │
                                          fecha rodada  │
                                                        v
                                              diagnosticado ──> encerrado
                                                        │
                                        (reabrir rodada)│
                                                        v
                                                 em execução
```

**Regras de transição:**

1. Um caso só sai de `rascunho` se passar na validação de publicação (abaixo).
2. Publicado, o caso é **imutável**. Corrigir qualquer coisa gera a **versão 2**
   do caso, e as sessões antigas continuam apontando para a versão em que foram
   respondidas. Sem isso, o laudo é indefensável: ninguém consegue provar a que
   pergunta a pessoa respondeu.
3. `diagnosticado` exige rodada fechada — por prazo vencido ou por decisão do
   gestor.
4. `encerrado` exige pelo menos uma ação registrada, ou uma justificativa
   explícita de "nenhuma ação necessária". Encerrar sem desfecho é o vício da NC
   de hoje, e o produto não vai reproduzi-lo.

## Regras do setup do caso

Validação de publicação — o caso não é publicável se qualquer uma falhar:

| Regra                                                             | Por quê                                                        |
| ----------------------------------------------------------------- | -------------------------------------------------------------- |
| Mínimo de 3 e máximo de 12 etapas                                 | Menos de 3 não é linha do tempo; mais de 12 ninguém termina    |
| Toda etapa tem no mínimo 3 opções                                 | Com duas, é certo-e-errado, e o participante adivinha          |
| Toda etapa tem exatamente uma opção marcada como **gabarito**     | O diagnóstico compara contra uma referência única              |
| Toda etapa tem exatamente uma opção marcada como **cenário real** | É o que permite dizer se a simulação reproduziu a falha        |
| Nenhum texto de contexto ou de opção menciona o desfecho          | Verificação humana, com aviso na tela. Vaza o experimento      |
| Toda etapa tem peso de 1 a 5                                      | Nem todo desvio pesa igual no laudo                            |
| Toda etapa tem tempo esperado, em segundos                        | É a régua para detectar gargalo de processo                    |
| O caso aponta um POP **com versão vigente na data do incidente**  | Não se cobra de ninguém uma norma que só passou a valer depois |
| Etapas com peso 4 ou 5 têm checkpoint de conhecimento             | Onde o laudo é mais pesado, a evidência precisa ser mais forte |
| Mínimo de 3 convidados                                            | Abaixo disso o motor emite indício, nunca diagnóstico          |

**Classificação da opção**, escolhida pelo gestor no cadastro. Ela é o que
permite pesar o desvio:

| Classificação    | Significado                                             |
| ---------------- | ------------------------------------------------------- |
| `conforme`       | É o gabarito                                            |
| `aceitavel`      | Diverge do POP, mas chega ao mesmo resultado sem risco  |
| `desvio_menor`   | Diverge, gera retrabalho ou atraso, sem risco relevante |
| `desvio_critico` | Diverge e produz risco de segurança, qualidade ou legal |

## Regras da simulação

1. **Contexto congelado.** A etapa mostra apenas o que a pessoa sabia naquele
   instante. Nada do desfecho, nada do que outros participantes fizeram, nada do
   relatório de NC.
2. **Gabarito cego.** O participante nunca vê a resposta certa antes de
   responder. O debrief só existe no fim da sessão.
3. **Sem volta.** Decisão tomada não é editável. Voltar atrás destruiria a
   medição de tempo e permitiria caçar o gabarito por tentativa.
4. **Sessões independentes.** Ninguém vê a resposta, o resultado ou o diagnóstico
   de outra pessoa. Nunca, em nenhum papel.
5. **Cronômetro por etapa.** Marca o tempo entre exibir a etapa e registrar a
   decisão. Pausa maior que 10 minutos marca a resposta como `tempo_invalido` e
   ela sai do cálculo de gargalo — mas continua valendo para aderência.
6. **Retomada.** Sessão interrompida volta na etapa seguinte à última
   respondida. O prazo do convite continua correndo.
7. **Prazo.** Convite tem prazo (padrão: 7 dias). Vencido, a sessão vira
   `expirada` e não entra no diagnóstico.
8. **Ordem embaralhada.** As opções aparecem em ordem aleatória por sessão, com
   posição registrada. Impede que o gabarito seja sempre "a primeira".
9. **Uma sessão por pessoa por caso.** Refazer exige nova versão do caso.

## Coleta do motivo

Dispara sempre que a opção escolhida não é o gabarito. A resposta é
**obrigatória** e sai de lista fechada; o campo livre é opcional e existe para o
que a lista não previu.

| Código              | Como aparece para o colaborador                                | Família     |
| ------------------- | -------------------------------------------------------------- | ----------- |
| `desconhecia`       | Não sabia que existia procedimento para isso                   | Treinamento |
| `nao_lembrava`      | Sabia que existia, mas não lembrava do detalhe                 | Treinamento |
| `entendi_diferente` | Entendi que o procedimento mandava fazer o que eu fiz          | Treinamento |
| `tempo`             | Sabia, mas não havia tempo de fazer daquele jeito              | Processo    |
| `ferramenta`        | O sistema/equipamento estava lento, fora do ar ou não permitia | Processo    |
| `recurso`           | Faltava material, insumo ou pessoa para fazer conforme         | Processo    |
| `ambiguidade`       | O procedimento é confuso ou não cobre esta situação            | Processo    |
| `orientacao`        | Recebi orientação, formal ou informal, para fazer diferente    | Processo    |
| `pressao`           | A meta/pressão do momento não permitia seguir o procedimento   | Processo    |
| `distracao`         | Sabia e dava para fazer, mas me distraí ou pulei sem perceber  | Execução    |
| `julguei_melhor`    | Achei que meu jeito era melhor                                 | Execução    |
| `outro`             | Outro motivo (campo livre obrigatório)                         | Indefinido  |

Duas observações que valem virar decisão de projeto:

- **`orientacao` e `pressao` são os motivos mais valiosos e os mais difíceis de
  colher.** Só aparecem se o colaborador acreditar nas regras de visibilidade
  adiante. São eles que mostram à diretoria que a meta do turno está comprando
  risco.
- **`julguei_melhor` não é automaticamente execução.** Se a escolha é classificada
  como `aceitavel` e o desfecho simulado não piora, o motor a trata como
  **melhoria latente**, não como desvio.

## Checkpoint de conhecimento

Aparece depois do motivo, nas etapas de peso 4 ou 5, e é uma pergunta objetiva
sobre a norma daquele ponto. Existe porque a autodeclaração tem viés conhecido:
"não deu tempo" é socialmente mais barato do que "eu não sabia".

| Motivo declarado    | Checkpoint | Como o motor lê                                                |
| ------------------- | ---------- | -------------------------------------------------------------- |
| Família Processo    | acertou    | Confirma barreira de contexto. Sinal forte de **processo**     |
| Família Processo    | errou      | O motivo declarado não se sustenta. Conta como **treinamento** |
| Família Treinamento | errou      | Coerente. **Treinamento**                                      |
| Família Treinamento | acertou    | Sabia a norma e disse que não sabia. Conta como **execução**   |
| Família Execução    | acertou    | Coerente. **Execução**                                         |
| Família Execução    | errou      | **Treinamento**, e o autodiagnóstico da pessoa estava errado   |

A família efetiva usada pelo motor é sempre esta, a corrigida — nunca a
declarada crua.

## Métricas por sessão

Calculadas ao fechar a sessão:

- **Aderência ao POP (IAP)**, de 0 a 100:

  ```
  IAP = 100 × Σ(peso das etapas conformes) / Σ(peso de todas as etapas)
  ```

  Opções `aceitavel` entram com metade do peso. `desvio_critico` entra com zero e
  marca a sessão.

- **Reprodução da falha**: verdadeiro quando a sequência de decisões da sessão
  chega ao mesmo desfecho do cenário real em pelo menos uma etapa de peso 4 ou 5.
  É a métrica mais importante do produto: se pessoas diferentes, com o mesmo
  contexto, chegam ao mesmo erro, o erro não é da pessoa.

- **Atraso relativo por etapa**:

  ```
  atraso = tempo gasto / tempo esperado
  ```

  Acima de 1,5 em etapa conforme é sinal de gargalo: a pessoa acertou, mas o
  procedimento custou caro.

O IAP **não é nota**, não é exibido em ranking e não sai do relatório individual
da própria pessoa. Existe para medir a etapa, não o participante.

## Motor de diagnóstico

Roda por **etapa**, sobre todas as sessões concluídas da rodada. As decisões são
tomadas na ordem abaixo; a primeira que casar vence.

Definições, para a etapa `e`:

```
n        = sessões concluídas
divergem = sessões com escolha ≠ gabarito
taxa     = divergem / n
familia  = família efetiva predominante entre as divergências (após checkpoint)
```

| Ordem | Condição                                                                                        | Classificação                             |
| ----- | ----------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 1     | `taxa ≥ 0,60` **e** ≥ 50% das divergências têm motivo `ambiguidade`                             | **Gabarito incorreto**                    |
| 2     | `taxa ≥ 0,50` **e** todas as escolhas divergentes são `aceitavel` **e** atraso mediano < 1,0    | **Melhoria latente**                      |
| 3     | `taxa ≥ 0,50` **e** `familia = Processo`                                                        | **Falha de processo**                     |
| 4     | `taxa < 0,50` **e** `familia = Processo` **e** motivo ∈ {`orientacao`, `pressao`, `ferramenta`} | **Falha de processo**                     |
| 5     | `taxa ≥ 0,40` **e** `familia = Treinamento`                                                     | **Falha de treinamento**                  |
| 6     | `taxa < 0,40` **e** `familia = Treinamento`                                                     | **Falha de treinamento**, pontual         |
| 7     | `taxa ≤ 0,25` **e** `familia = Execução`                                                        | **Falha de execução**                     |
| 8     | `taxa = 0` **e** atraso mediano ≥ 1,5                                                           | **Falha de processo**, gargalo sem desvio |
| 9     | Nenhuma das anteriores                                                                          | **Inconclusivo**                          |

Três coisas que a ordem carrega, e que precisam ficar explícitas:

- **A regra 4 quebra o limiar de propósito.** Uma única declaração de "recebi
  orientação para fazer diferente" ou "a meta não permitia" é achado de sistema
  mesmo isolado. Tratar isso como desatenção individual seria exatamente o erro
  que o produto existe para corrigir.
- **A regra 8 é a que o formulário de NC nunca acha.** Todo mundo acertou e todo
  mundo demorou o dobro: o procedimento está certo no papel e é caro na prática.
  É candidato a falha futura.
- **`Inconclusivo` é um resultado legítimo**, e o painel o mostra como tal. Um
  motor que sempre acha causa é um motor que inventa causa.

### Causa do caso

A classificação do caso é a da etapa de maior peso entre as classificadas.
Empate resolve pela ordem: processo > treinamento > execução. A justificativa é
de missão: quando processo e pessoa concorrem como explicação, a plataforma olha
primeiro para o sistema.

### Confiança

| Sessões concluídas | O que o sistema emite                                 |
| ------------------ | ----------------------------------------------------- |
| 1 a 2              | **Indício.** Nenhuma ação corretiva formal é sugerida |
| 3 a 5              | **Diagnóstico com confiança baixa**                   |
| 6 ou mais          | **Diagnóstico**                                       |

A palavra na tela e no PDF muda conforme a faixa. É a diferença entre um laudo
que sobrevive a uma auditoria e um que não sobrevive.

### Parâmetros

Todos os limiares acima vivem em uma tabela de parâmetros, versionada, não no
código. Todo diagnóstico grava a **versão do motor** e o **conjunto de
parâmetros** usados. Reprocessar um caso antigo com regra nova gera um
diagnóstico novo, e o antigo permanece — a rastreabilidade é requisito de ISO
9001, não capricho.

## Da causa à ação

| Classificação              | Ação sugerida                                                                 | Responsável natural |
| -------------------------- | ----------------------------------------------------------------------------- | ------------------- |
| Falha de processo          | Revisar o POP: viabilidade, tempo, recurso ou ferramenta                      | Dono do processo    |
| Falha de processo, gargalo | Medir o tempo real da etapa e redesenhar                                      | Dono do processo    |
| Falha de treinamento       | Reciclagem dirigida ao ponto específico, não ao POP inteiro                   | Qualidade / RH      |
| Falha de execução          | Conversa individual, checagem de condição de trabalho. Sem punição automática | Liderança direta    |
| Gabarito incorreto         | Corrigir ou completar o POP, e reemitir versão                                | Qualidade           |
| Melhoria latente           | Estudar a alternativa e, se confirmada, promovê-la a POP                      | Qualidade           |
| Inconclusivo               | Ampliar a rodada ou revisar a montagem do caso                                | Qualidade           |

A ação é um registro com responsável, prazo e estado. O caso não encerra sem ela.

## Cultura sem culpa, como regra técnica

Isto não é seção de marketing. São restrições que o software impõe, e sem elas o
produto coleta mentira educada.

| Regra                                                                                 | Efeito                                                        |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Resultado individual é visível **só para a própria pessoa**                           | Nem gestor da qualidade, nem chefia, nem diretoria            |
| Painéis de gestão só exibem agregado, e **apenas com 3 ou mais** sessões no recorte   | Recorte com 1 ou 2 pessoas identifica indivíduo por dedução   |
| Motivo em campo livre chega ao gestor **sem identificação**                           | É onde aparece "meu supervisor mandou". Com nome, não aparece |
| Nenhuma exportação inclui identificação de participante                               | Vale para PDF, CSV e API                                      |
| Nenhum recorte por chefia, turno ou matrícula com menos de 3 pessoas                  | Anonimato de fato, não de intenção                            |
| O gestor vê **quem foi convidado e quem concluiu**, nunca **o que cada um respondeu** | Ele precisa cobrar participação, não desempenho               |
| A tela do participante diz, antes de começar, quem vê o quê                           | O consentimento é informado, e a confiança é o insumo do dado |

**Relação de trabalho e LGPD.** Resposta de simulação é dado pessoal de
trabalhador. A base legal, o aviso ao participante, o prazo de retenção (sugestão:
24 meses para dado identificado, indefinido para agregado anonimizado) e a
proibição de uso disciplinar precisam estar escritos na política do cliente e no
termo exibido na entrada. Se o cliente tiver acordo coletivo ou comissão
interna, isso passa por eles **antes** do piloto. É risco de projeto, não
detalhe jurídico.

## Auditoria

- Resposta é **append-only**. Nada é editado nem apagado; correção gera novo
  registro.
- Todo evento relevante — publicar caso, convidar, concluir sessão, rodar
  diagnóstico, exportar, encerrar — vira evento de auditoria com autor, momento e
  conteúdo.
- O PDF do laudo carrega: versão do caso, versão do POP, versão do motor,
  parâmetros, número de sessões e data. Um laudo sem isso não vale como evidência.

## Casos de borda

| Situação                                                        | Regra                                                                                                                   |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Participante abandona no meio                                   | Sessão `abandonada` após o prazo. Não entra no diagnóstico. Aparece no painel                                           |
| Menos de 3 sessões concluídas na rodada                         | Motor roda, emite **indício**, e não sugere ação corretiva formal                                                       |
| Todas as sessões conformes                                      | Caso classificado como não reproduzido: a falha real foi pontual, ou o caso está mal montado. As duas leituras aparecem |
| Gestor participa do próprio caso                                | Bloqueado. Ele conhece o gabarito                                                                                       |
| Pessoa convidada para caso da própria unidade que não vivenciou | Permitido e desejável: é o que mede se a falha se repetiria                                                             |
| Empate entre famílias de motivo                                 | Vence a família Processo, pela mesma razão da causa do caso                                                             |
| POP mudou depois do incidente                                   | O gabarito é sempre a versão vigente **na data do incidente**                                                           |
