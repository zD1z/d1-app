# Modelos de engajamento

Como cada ideia que chega pelo site vira trabalho. São dois formatos, e a escolha
entre eles é a primeira decisão de qualquer proposta, antes de escopo, de
tecnologia e de preço. Decidido em 2026-09-12, a partir do caso
[causa-raiz-qualidade](causa-raiz-qualidade/README.md).

## Os dois modelos

|                        | **A. Na casa do cliente**                       | **B. Na sua casa**                               |
| ---------------------- | ----------------------------------------------- | ------------------------------------------------ |
| Onde roda              | Contas do cliente: nuvem, banco, domínio        | Suas contas, uma instância por cliente           |
| Repositório            | Organização do cliente no GitHub, desde o dia 1 | Repositório privado seu                          |
| Código, ao final       | Dele, com a titularidade cedida                 | Seu, com licença de uso para ele                 |
| Dados                  | Nunca saem da casa dele                         | Na sua infraestrutura, e sempre dele             |
| Quem paga a infra      | Ele, direto ao provedor                         | Ele te paga o custo, ou está embutido no serviço |
| Reuso em outro cliente | Só o que o contrato reservar                    | Total                                            |
| Cobrança               | Sempre paga, por horas ou preço fechado         | Paga, de graça, ou um piloto que vira paga       |
| Receita depois         | Acaba na entrega, salvo contrato de sustentação | Pode virar assinatura                            |
| Começa em              | Dias ou semanas, conforme a TI dele             | Horas                                            |
| Seu risco              | Baixo: você é pago e não opera nada depois      | Alto: você banca horas e responde pela operação  |

## A regra que decide

Antes de qualquer coisa, duas perguntas: **quem paga** e **de quem é o código**.
O cruzamento delas tem um quadrante proibido.

```
                     cliente paga            cliente não paga
                  +-----------------------+------------------------+
  código é dele   |  MODELO A             |  nunca                 |
                  |  o trabalho normal    |  trabalho de graça     |
                  |                       |  que não vira ativo    |
                  +-----------------------+------------------------+
  código é seu    |  MODELO B pago        |  MODELO B piloto       |
                  |  ele usa por licença  |  investimento seu      |
                  +-----------------------+------------------------+
```

**Não pago somado a código do cliente é a única combinação sem saída.** Você
perde as horas e não fica com nada: nem receita, nem produto, nem direito de usar
o que construiu. Se ele não paga, o código é seu. Se ele quer o código, ele paga.
Não é dureza comercial, é a única forma de o trabalho de graça fazer sentido
algum dia.

## Quando escolher cada um

Escolha **A** quando qualquer uma for verdadeira:

- O cliente paga o projeto inteiro, e paga bem.
- A política de TI ou o setor dele não admite dado fora de casa: banco, saúde,
  governo, jurídico, ou um contrato que já diga isso.
- O problema é específico daquela operação, e não se repete em outra empresa.
- O cliente tem equipe técnica que vai manter aquilo depois de você.
- Existe auditoria ou certificação em cima do sistema.

Escolha **B** quando qualquer uma for verdadeira:

- A solução se repete: outras empresas do mesmo setor têm o mesmo problema.
- O cliente não paga as horas, ou paga pouco.
- Ele não tem TI, e a infraestrutura seria um obstáculo para começar.
- Você quer o ativo: um produto que existe depois que o projeto acaba.
- Faz sentido cobrar assinatura em vez de projeto.

**Na dúvida entre os dois, comece em B.** Migrar de B para A depois é barato; o
contrário exige renegociar propriedade com um cliente que já tem o código.

## Modelo A, na prática

**Entrada.** O repositório nasce na organização dele, e não no seu perfil para ser
transferido depois. Transferência dá trabalho, esquece permissões e cria uma
janela em que o código ainda é seu, o que é exatamente a confusão que o modelo A
deveria evitar. Se ele não tem organização no GitHub, crie uma com o e-mail dele
como dono, e você entra como membro.

Infraestrutura na conta dele, com acesso por papel nomeado e o Terraform dentro
do repositório dele. Nenhuma chave de acesso na sua máquina: o deploy sai da
esteira dele, com OIDC.

**Preço.** Horas cheias, pelo documento de estimativa da proposta. É o modelo que
paga o mês.

**Reserva de componentes.** A cláusula que decide se o modelo A é sustentável: o
cliente recebe a aplicação; você reserva o direito de reutilizar bibliotecas,
motores e estruturas genéricas, que não carregam nada da operação dele. Sem ela,
cada projeto começa do zero e quinze anos de carreira não acumulam nada. Com ela,
o modelo A alimenta o B.

**Saída.** Entrega não é o último `git push`. É uma lista:

- Repositório com o histórico inteiro, e você removido da organização
- Infraestrutura aplicando pela esteira dele, sem nenhum acesso seu
- Segredos rotacionados depois da sua saída, não antes
- Domínio, DNS e certificados no nome dele
- Documentação de operação: subir, derrubar, restaurar backup, quem chamar
- Termo de aceite assinado, que fecha o escopo e inicia a garantia

## Modelo B, na prática

**Entrada.** Repositório privado seu, contas suas, uma instância por cliente. Sobe
em horas porque a infraestrutura é código e já existe.

**O que o cliente recebe por escrito**, e é mais do que ele imagina:

- Licença de uso perpétua, gratuita e irrevogável, para uso interno dele
- Os dados dele, sempre dele, exportáveis em formato aberto quando quiser
- O reconhecimento da autoria da ideia, se a ideia for dele
- O direito de sair, com prazo combinado de exportação e de exclusão

**O que você assume**, e não é pouco:

- Você vira operador de dado pessoal, o que pede acordo de tratamento por escrito:
  finalidade, retenção, incidente, exclusão ao fim
- Disponibilidade, backup e restauração passam a ser sua responsabilidade
- Cada cliente hospedado custa tempo de operação, e tempo de operação precisa
  estar no preço

**Cobrança.** Três formas, e a terceira é a do piloto:

| Forma             | Quando                                                              |
| ----------------- | ------------------------------------------------------------------- |
| Projeto + licença | Ele paga o desenvolvimento e usa sob licença. Você mantém o produto |
| Assinatura        | Sem projeto: ele paga por mês pelo uso, e você amortiza no volume   |
| Piloto            | Primeiros clientes, sem cobrar horas, com teto e data de fim        |

O piloto tem regras próprias, e elas estão em
[causa-raiz-qualidade/06](causa-raiz-qualidade/06-piloto-e-modelo-de-entrada.md):
teto de horas, gatilhos que encerram a gratuidade, e a frase que evita ancorar o
preço no custo da infraestrutura.

## De B para A, quando o cliente exigir

Acontece: o piloto dá certo, a TI acorda, e a empresa decide que quer tudo dentro
de casa. Isso **não é um problema**, e é bom saber disso antes de começar em B.

O caminho é curto porque a infraestrutura é código e o banco é Postgres:

1. Criar a organização e as contas dele
2. Aplicar o mesmo Terraform na conta dele
3. `pg_dump` e restauração, com janela combinada
4. Apontar o domínio, validar, desligar a instância antiga
5. Entregar pela lista de saída do modelo A

São um a dois dias, e **são cobrados**. O que muda de verdade não é técnico: é a
propriedade. Ele quer o código, então o desenvolvimento passa a ser orçado pelo
documento de estimativa, com crédito do que ele já pagou de piloto, se você
quiser ser generoso.

## O que vale para os dois

- **NDA antes da primeira conversa técnica.** Barato, rápido, e muda o tom.
- **Nada de credencial de cliente na sua máquina.** Acesso nomeado, revogável,
  com segundo fator.
- **Uma conta por cliente.** Nunca misturar cliente na mesma conta de nuvem, nem
  no mesmo estado de Terraform.
- **A estimativa é a mesma.** O modelo muda quem paga e de quem é o código, não o
  esforço de construir.
- **O modelo escolhido vira a primeira linha da proposta.** Cliente que descobre
  na entrega que o código não é dele tem razão de reclamar.

## Onde cada proposta caiu

| Proposta                                               | Modelo    | Por quê                                                                                    |
| ------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------ |
| [causa-raiz-qualidade](causa-raiz-qualidade/README.md) | B, piloto | Não é pago, o problema se repete em qualquer indústria, e o Diego não tem TI para hospedar |
