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

| Seção | Componente | O que faz |
| --- | --- | --- |
| Hero | `secoes/hero` | `h1` com "D1 App" destacado em cor por fatiamento da string; subtítulo; dois botões (`#contato` e `#solucoes`) |
| Soluções | `secoes/solucoes` | Quatro cartões de serviço com ícone SVG inline; abaixo, as quatro etapas de "como funciona" (`#como-funciona`) |
| Quem faz | `secoes/quem-faz` | Credencial em prosa mais os três números; link para `/sobre` |
| Contato | `secoes/contato` | Convite e botão `mailto:` com assunto "Tenho uma ideia" pré-preenchido |

## Sobre (`/sobre`, carregada sob demanda)

| Seção | Componente | O que faz |
| --- | --- | --- |
| Apresentação | `secoes/apresentacao` | Nome, título, chamada, resumo de carreira e link do LinkedIn |
| Tecnologias | `secoes/tecnologias` | Seis grupos, 20 tecnologias. Cada cartão traz ícone da marca (ou monograma) e uma frase de prova. A cor oficial da marca entra só no hover, por custom property |
| Combinações | `secoes/combinacoes` | Três arranjos de stack com as peças em etiquetas |
| Chamada final | `secoes/chamada-final` | Devolve o visitante para a oferta da home |

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
