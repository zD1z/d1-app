# Features

O site tem duas páginas e oito seções ao todo.

## Shell (em todas as páginas)

- **Skip link** `Pular para o conteúdo`, visível só no foco de teclado.
- **Cabeçalho fixo** com a marca (o mesmo `favicon.svg`, uma fonte da verdade
  para o desenho e já em cache no navegador), menu de três itens mais o botão de
  ação `Falar comigo`. Em telas pequenas vira hambúrguer controlado por
  `signal`, com `aria-expanded` e `aria-controls`.
- **Rodapé** com domínio, título e localização, links para e-mail e LinkedIn, e
  o crédito "feito em Angular, servido como HTML estático". O ano é calculado em
  runtime.
- **Tema claro e escuro automáticos** por `prefers-color-scheme`, sem botão nem
  estado salvo.

## Home (`/`)

| Seção    | Componente        | O que faz                                                                                                                                               |
| -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero     | `secoes/hero`     | `h1` com "D1 App" destacado em cor por fatiamento da string; subtítulo; dois botões (`#contato` e `#solucoes`)                                          |
| Soluções | `secoes/solucoes` | Quatro cartões de serviço com ícone SVG inline; abaixo, as quatro etapas de "como funciona" (`#como-funciona`)                                          |
| Quem faz | `secoes/quem-faz` | Credencial em prosa mais os três números; link para `/sobre`                                                                                            |
| Contato  | `secoes/contato`  | Botão que abre o formulário de ideia num `<dialog>`, com o `mailto:` logo abaixo como alternativa. Sem endpoint configurado, volta a ser só o `mailto:` |

## Sobre (`/sobre`, carregada sob demanda)

| Seção         | Componente             | O que faz                                                                                                                                                       |
| ------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Apresentação  | `secoes/apresentacao`  | Nome, título, chamada, resumo de carreira e link do LinkedIn                                                                                                    |
| Tecnologias   | `secoes/tecnologias`   | Seis grupos, 20 tecnologias. Cada cartão traz ícone da marca (ou monograma) e uma frase de prova. A cor oficial da marca entra só no hover, por custom property |
| Combinações   | `secoes/combinacoes`   | Três arranjos de stack com as peças em etiquetas                                                                                                                |
| Chamada final | `secoes/chamada-final` | Devolve o visitante para a oferta da home                                                                                                                       |

## Formulário de ideia

Abre no botão da seção de contato, dentro de um `<dialog>` nativo.

- Dois campos: a ideia, e um campo livre de contato que aceita e-mail ou
  WhatsApp.
- Validação na hora do envio, com a mensagem sob o campo que falhou.
- Campo-armadilha invisível, carimbo de abertura e desafio do Turnstile, os três
  conferidos do lado do servidor.
- Estados de envio na própria caixa: enviando, recebido, ou o erro com uma frase
  por caso, sempre oferecendo o e-mail como saída.
- Enquanto envia, uma camada cobre a caixa inteira com "Enviando minha ideia..."
  e o formulário fica `inert`. O botão desabilitado sozinho não bastava: o
  `Enter` dentro do campo de texto continuaria submetendo.
- O desafio é descartado ao fechar e desenhado de novo ao abrir. O token vale uma
  vez só, e sem isso a caixa da Cloudflare vinha vazia na segunda abertura.
- Estourada a cota de envios da hora, a caixa troca de conteúdo por um alerta com
  saída, em vez de um aviso embaixo do formulário: insistir não adianta, e deixar
  os campos ali convidaria a tentar de novo. O botão fecha e devolve a página ao
  topo. O texto escrito é preservado para a tentativa seguinte.
- Uma linha dizendo que o contato serve só para responder.

**Enquanto `core/config/contato.ts` estiver vazio, o formulário não aparece** e
a seção volta a ser o `mailto:` de sempre. É o estado do site antes de a
infraestrutura de envio subir, e a rede de segurança se ela cair.

## Comportamentos transversais

- **Navegação por âncora entre páginas.** Os itens de menu carregam rota e
  fragmento, então `Soluções` funciona tanto na home quanto a partir de
  `/sobre`.
- **Rolagem com offset de 96 px**, para o cabeçalho fixo não cobrir o título de
  destino.
- **`prefers-reduced-motion`** zera animações e transições.
- **Rota curinga** devolve qualquer caminho desconhecido para a home.
- **Zero requisição externa em runtime**, com uma exceção: as fontes Inter e
  JetBrains Mono vêm do Google Fonts, com `preconnect`.
