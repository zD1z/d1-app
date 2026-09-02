import type { Conteudo } from '../models/conteudo';

/**
 * CONTEÚDO DO SITE — este é o único arquivo a editar para mudar a página.
 *
 * Os campos marcados com `[PREENCHER]` são rascunho: estão aí para a página ter
 * forma e espaçamento reais, não porque sejam verdade — e aparecem assim no ar.
 * Troque todos antes de apontar o domínio. Tudo que não está marcado já é
 * informação verificada.
 */
export const CONTEUDO: Conteudo = {
  perfil: {
    nome: '[PREENCHER] Danilo P.',
    apelido: 'D1',
    titulo: 'Desenvolvedor de software',
    chamada:
      'Construo sistemas que resolvem problema real de gente real — do banco de dados à tela, ' +
      'com a regra de negócio no lugar certo.',
    sobre: [
      '[PREENCHER] Um parágrafo sobre quem você é profissionalmente: em que trabalha hoje, há quanto tempo, e o tipo de problema que gosta de resolver.',
      '[PREENCHER] Um parágrafo sobre como você trabalha: as decisões técnicas que defende, o que aprendeu a evitar, o que entrega de diferente.',
      'Fora do trabalho contratado, mantenho sistemas próprios em produção — porque a melhor forma de saber se uma arquitetura se sustenta é conviver com ela por anos.',
    ],
    localizacao: 'Brasil',
    desdeAno: 2017,
    disponivel: true,
  },

  numeros: [
    { valor: '[PREENCHER] 8+', rotulo: 'anos escrevendo software' },
    { valor: '[PREENCHER] 20+', rotulo: 'projetos entregues' },
    { valor: '3', rotulo: 'anos de dado real em produção no D1 Finanças' },
  ],

  habilidades: [
    {
      grupo: 'Backend',
      itens: ['C#', '.NET', 'Entity Framework Core', 'Minimal APIs', 'SQL Server', 'T-SQL'],
    },
    {
      grupo: 'Frontend',
      itens: ['Angular', 'TypeScript', 'RxJS', 'Signals', 'PrimeNG', 'HTML/CSS'],
    },
    {
      grupo: 'Qualidade e entrega',
      itens: ['Playwright', 'Vitest', 'Git', 'GitHub Actions', 'PowerShell'],
    },
    {
      grupo: 'IA aplicada',
      itens: ['Model Context Protocol (MCP)', 'Claude Code', 'Automação com agentes'],
    },
  ],

  trajetoria: [
    {
      organizacao: '[PREENCHER] Empresa atual',
      cargo: '[PREENCHER] Cargo',
      periodo: '[PREENCHER] 2023 — hoje',
      atual: true,
      descricao:
        '[PREENCHER] Uma ou duas frases sobre o escopo: que produto, que time, que responsabilidade.',
      entregas: [
        '[PREENCHER] Entrega concreta, com o resultado no fim da frase.',
        '[PREENCHER] Outra entrega — prefira número a adjetivo.',
      ],
      stack: ['[PREENCHER]', 'C#', 'Angular'],
    },
    {
      organizacao: '[PREENCHER] Empresa anterior',
      cargo: '[PREENCHER] Cargo',
      periodo: '[PREENCHER] 2020 — 2023',
      atual: false,
      descricao: '[PREENCHER] O que você fazia ali.',
      entregas: ['[PREENCHER] Entrega concreta.'],
      stack: ['[PREENCHER]'],
    },
  ],

  projetos: [
    {
      nome: 'D1 Finanças',
      ano: '2025 — hoje',
      papel: 'Autor e único desenvolvedor',
      resumo: 'Sistema de gestão financeira pessoal que substituiu uma planilha usada desde 2023.',
      descricao:
        'Roda como serviço do Windows na rede de casa, servindo API e front no mesmo processo. ' +
        'Importou três anos de histórico real da planilha original — 1.097 despesas, 232 receitas e ' +
        '231 movimentos de investimento, misturando lançamentos realizados e previsões futuras.',
      destaques: [
        'Arquitetura em camadas sem CQRS nem repositório genérico: cerimônia custa caro em projeto de um dev.',
        'Servidor MCP que referencia a camada de aplicação direto, sem passar por HTTP — a regra de negócio mora em um lugar só.',
        'Suíte E2E em Playwright com banco próprio e três travas independentes que abortam se apontar para a base de produção.',
        'Dinheiro em decimal(18,2) e quantidade de ativo em decimal(18,8). Nunca float.',
        'Sem delete físico: cadastro inativa, lançamento cancela. O histórico é imutável.',
      ],
      stack: ['C# 13', '.NET', 'EF Core', 'SQL Server', 'Angular 21', 'PrimeNG', 'Playwright', 'MCP'],
      privado: true,
    },
    {
      nome: '[PREENCHER] Nome do projeto',
      ano: '[PREENCHER] 2024',
      papel: '[PREENCHER] Seu papel no time',
      resumo: '[PREENCHER] Uma linha dizendo o que o projeto resolve.',
      descricao: '[PREENCHER] Dois ou três períodos: o contexto, o problema e o que foi construído.',
      destaques: [
        '[PREENCHER] Uma decisão técnica que valeu a pena.',
        '[PREENCHER] Um problema difícil e como foi resolvido.',
      ],
      stack: ['[PREENCHER]'],
      privado: false,
    },
    {
      nome: '[PREENCHER] Outro projeto',
      ano: '[PREENCHER] 2022',
      papel: '[PREENCHER] Seu papel',
      resumo: '[PREENCHER] Uma linha.',
      descricao: '[PREENCHER] O contexto e a entrega.',
      destaques: ['[PREENCHER] O que teve de interessante.'],
      stack: ['[PREENCHER]'],
      privado: false,
    },
  ],

  servicos: [
    {
      icone: 'sistema',
      titulo: 'Sistema sob medida',
      descricao:
        'Quando a planilha não aguenta mais e o software de prateleira não serve. ' +
        'Do modelo de dados à tela, com a regra do seu negócio dentro.',
    },
    {
      icone: 'automacao',
      titulo: 'Automação de processo',
      descricao:
        'Aquela rotina manual que alguém repete toda semana e erra de vez em quando. ' +
        'Vira processo automático, com registro do que aconteceu.',
    },
    {
      icone: 'dados',
      titulo: 'Dados que você já tem',
      descricao:
        'Importação, limpeza e conciliação de histórico bagunçado — planilha, CSV, sistema legado — ' +
        'até virar base confiável para decidir.',
    },
    {
      icone: 'integracao',
      titulo: 'Integração entre sistemas',
      descricao:
        'API, webhook, servidor MCP para agentes de IA. Fazer duas coisas que não se falam ' +
        'trocarem informação sem intervenção humana no meio.',
    },
  ],

  processo: [
    {
      titulo: 'Conversa',
      descricao:
        'Você descreve o problema em português, sem precisar traduzir para termo técnico. ' +
        'Eu pergunto até entender o que de fato precisa mudar.',
    },
    {
      titulo: 'Escopo e proposta',
      descricao:
        'Escrevo o que será entregue, em que ordem e por quanto. Se o problema for menor ' +
        'do que parecia, eu digo — cobrar por complexidade que não existe não me interessa.',
    },
    {
      titulo: 'Construção com entregas visíveis',
      descricao:
        'Você vê a coisa funcionando em partes, não só no fim. E cedo o suficiente para mudar de ideia.',
    },
    {
      titulo: 'Entrega e continuidade',
      descricao:
        'O sistema sobe, o código é seu e fica documentado. Suporte e evolução continuam se você quiser.',
    },
  ],

  contato: {
    email: '[PREENCHER] contato@d1.app.br',
    github: 'https://github.com/zD1z',
    linkedin: '[PREENCHER] https://www.linkedin.com/in/seu-usuario',
    convite:
      'Tem uma ideia parada porque não sabe por onde começar? Descreve ela em duas linhas. ' +
      'Respondo dizendo se dá para fazer, quanto custa mais ou menos, e se eu sou a pessoa certa.',
  },
};
