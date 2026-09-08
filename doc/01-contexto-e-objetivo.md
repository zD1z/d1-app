# Contexto e objetivo

## O que é

`d1.app.br` é o site pessoal e comercial de Danilo Pereira da Silva (D1),
engenheiro de software sênior com quinze anos de carreira. É um site estático,
escrito em Angular e publicado no GitHub Pages.

## Para que existe

O site tem uma finalidade comercial explícita, e não é um portfólio de
currículo. A home inteira é uma **oferta de serviço**: alguém com um problema de
negócio chega, entende em poucos segundos que existe uma pessoa capaz de
transformar aquilo em software, e tem um caminho direto para o contato por
e-mail.

A ordem em que o conteúdo aparece traduz essa intenção:

1. **Hero** — o bordão "D1 App para sua ideia" e uma explicação em uma frase.
2. **Soluções** — quatro tipos de trabalho que podem ser contratados, mais as
   quatro etapas de como o trabalho acontece.
3. **Quem faz** — só depois da oferta aparece a credencial: quinze anos, quatro
   setores, com link para a página `/sobre`.
4. **Contato** — convite e `mailto:` com assunto pré-preenchido.

A página `/sobre` é o aprofundamento técnico, para quem já se interessou e quer
saber se a stack bate com o problema dele.

## Para quem

Dois públicos, com pesos diferentes:

- **Primário: quem não é técnico.** Dono de negócio pequeno ou médio, gestor com
  uma planilha que estourou, alguém com uma ideia parada. O texto da home é
  escrito para essa pessoa, deliberadamente sem jargão. O convite do contato
  ("descreve ela em duas linhas") existe para baixar a barreira de entrada.
- **Secundário: quem é técnico.** Recrutador, CTO, parceiro avaliando stack. É o
  público da `/sobre`, onde cada tecnologia aparece com uma frase de prova
  dizendo onde ela foi usada de verdade.

## O que o site deliberadamente não é

Estas são decisões tomadas, não pendências:

- **Não tem backend próprio no site.** O site continua sendo arquivo estático,
  sem servidor. O que existe é um endpoint de envio isolado, em outro
  repositório (`d1-app-api`), acionado só quando alguém abre o formulário de
  ideia. O `mailto:` segue vivo como alternativa e como rede de segurança se o
  endpoint cair.
- **Não tem linha do tempo de carreira.** O currículo detalhado vive no
  LinkedIn, que atualiza sozinho. No site há apenas uma linha de resumo
  (`resumoDeCarreira`), justamente para não envelhecer sem ninguém notar.
- **Não tem seção de projetos.** Existiu e foi removida no commit `dcc7ace`. A
  `/sobre` hoje gira em torno de tecnologias e das combinações típicas de stack,
  não de estudos de caso.
- **Não tem botão de tema.** Claro e escuro saem de `prefers-color-scheme`, sem
  estado guardado.
- **Não tem analytics, cookies nem banner de consentimento.** Nada é
  rastreado. O `doc/08` previa um lote de medição com GA4 e banner; ele **não
  foi executado e continua sem decisão**. Enquanto não houver decisão explícita
  registrada aqui, o estado é este: nada é rastreado.

## Por que Angular para um site estático

É uma escolha consciente, e o `README.md` da raiz a declara: o build gera HTML,
CSS e JS estáticos, e nada roda no servidor. Desde o lote de prerender, o HTML
de cada rota sai pronto do build, então o conteúdo existe na página antes de
qualquer JavaScript rodar. O framework está ali pelo que vem
depois — integração com API, área logada, formulário de contato de verdade — sem
precisar reescrever a base. Como efeito colateral, o próprio site é uma
demonstração da stack que a `/sobre` afirma dominar.
