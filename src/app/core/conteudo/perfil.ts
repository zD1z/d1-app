import type { Conteudo } from '../models/conteudo';

/**
 * CONTEÚDO DO SITE. Este é o único arquivo a editar para mudar a página.
 *
 * O formato está descrito em `../models/conteudo.ts`, com um comentário por
 * campo dizendo onde ele aparece e que tamanho de texto cabe.
 */
export const CONTEUDO: Conteudo = {
  perfil: {
    nome: 'Danilo Pereira da Silva',
    apelido: 'D1',
    titulo: 'Engenheiro de software sênior',
    chamada:
      'Quinze anos construindo sistemas que rodam em aeroportos, shopping centers e ' +
      'centrais de atendimento bancário. Do banco de dados à tela, com a regra de ' +
      'negócio no lugar certo.',
    sobre: [
      'Comecei em 2011 testando software e passei a analista de sistemas logo depois. De lá ' +
        'para cá passei por leilões online, consultoria corporativa, onze anos em automação ' +
        'de estacionamento e tráfego, e desde 2024 o setor bancário. Hoje estou no Itaú, ' +
        'em centrais de atendimento ao cliente pessoa física.',
      'Passar por quatro áreas bem diferentes mudou a forma como eu resolvo problema. ' +
        'Leilão online ensina a lidar com sistema que não pode travar justamente no pico. ' +
        'Consultoria ensina a entrar em código que não é seu e entregar rápido. ' +
        'Estacionamento e tráfego ensinam o ponto em que o software encontra o mundo ' +
        'físico, cancela e câmera. Banco ensina escala e rigor. Quem fica em um domínio ' +
        'só tende a repetir a mesma solução em todo lugar. Ter circulado entre eles me deu ' +
        'mais de uma saída para o mesmo problema.',
      'Fora do trabalho contratado, mantenho sistemas próprios em produção, porque a melhor ' +
        'forma de saber se uma arquitetura se sustenta é conviver com ela por anos.',
    ],
    localizacao: 'Brasil',
    desdeAno: 2011,
    disponivel: false,
  },

  oferta: {
    bordao: 'D1 App para sua ideia',
    bordaoDestaque: 'D1 App',
    subtitulo:
      'Você tem o problema e conhece o seu negócio. Eu transformo a sua ideia em software ' +
      'que funciona de verdade, sem você precisar traduzir nada para termo técnico.',
    quemFaz:
      'Quinze anos construindo software em quatro áreas diferentes: leilões online, ' +
      'consultoria corporativa, automação de estacionamento e tráfego, e o setor ' +
      'bancário. Cada uma resolve problema de um jeito próprio, e é esse repertório que ' +
      'entra também num projeto pequeno. Só muda o tamanho.',
  },

  numeros: [
    { valor: '15 anos', rotulo: 'em tecnologia, desde 2011' },
    { valor: '11 anos', rotulo: 'em automação de estacionamento e tráfego' },
    { valor: '4 setores', rotulo: 'leilões, consultoria, automação e banco' },
  ],

  habilidades: [
    {
      grupo: 'Backend',
      itens: ['C#', '.NET', 'Java', 'Python', 'C', 'C++'],
    },
    {
      grupo: 'Frontend',
      itens: ['Angular', 'TypeScript', 'RxJS', 'Signals'],
    },
    {
      grupo: 'Dados',
      itens: ['SQL Server', 'Oracle', 'DynamoDB', 'Entity Framework Core'],
    },
    {
      grupo: 'Nuvem e infraestrutura',
      itens: ['AWS', 'Azure', 'Terraform', 'CI/CD', 'GitHub Actions'],
    },
    {
      grupo: 'Integração',
      itens: ['Dynamics 365', 'APIs REST', 'Model Context Protocol (MCP)'],
    },
  ],

  trajetoria: [
    {
      organizacao: 'Itaú',
      cargo: 'Engenheiro de software sênior',
      periodo: 'desde 2024',
      atual: true,
      descricao:
        'Centrais de atendimento ao cliente pessoa física. A jornada é governada pelo ' +
        'Dynamics 365, e o trabalho é integrar as peças do banco por trás dele.',
      entregas: [
        'Centrais de contas PF, suporte digital, WhatsApp e gerentes.',
        'Infraestrutura em AWS com esteira de CI/CD.',
      ],
      stack: ['.NET', 'Java', 'Angular', 'Python', 'Terraform', 'AWS', 'DynamoDB', 'Dynamics 365'],
    },
    {
      organizacao: 'Nepos',
      cargo: 'Engenheiro de software pleno e sênior',
      periodo: 'de 2013 a 2024',
      atual: false,
      descricao:
        'Onze anos em automação de estacionamento e tráfego, do controle de acesso na ' +
        'entrada até a emissão da nota fiscal na saída.',
      entregas: [
        'Controle de acesso veicular por tag, integrado a Sem Parar, ConectCar e Veloe.',
        'Controle de acesso por LPR, com leitura automática de placa.',
        'Sistema de gestão de estacionamento cobrindo o ciclo inteiro: acesso, permanência, cobrança e nota.',
      ],
      stack: ['C', 'C++', '.NET', 'Java', 'Angular', 'SQL Server'],
    },
    {
      organizacao: 'Onione',
      cargo: 'Analista de desenvolvimento pleno',
      periodo: '2013',
      atual: false,
      descricao:
        'Passagem curta e de escopo fechado, numa consultoria de CRM, ERP e SAP: tirar um ' +
        'sistema feito em Maker de onde estava e colocá-lo na Azure.',
      entregas: [
        'Migração do sistema legado em Maker para a nuvem Azure.',
        'Migração da base SQL Server que sustentava a operação.',
        'Serviços de gestão de funcionários, emissão de notas e relatórios.',
      ],
      stack: ['Maker', 'SQL Server', 'Azure'],
    },
    {
      organizacao: 'Superbid',
      cargo: 'Analista de desenvolvimento júnior',
      periodo: 'de 2011 a 2013',
      atual: false,
      descricao:
        'Entrada na área, em leilões online. Comecei testando e passei a desenvolver na ' +
        'ferramenta que gerencia os leilões.',
      entregas: [
        'Ferramenta de gestão dos leilões online, do cadastro do lote ao encerramento.',
      ],
      stack: ['PHP', 'Java', 'Maker', 'Oracle', 'SQL'],
    },
  ],

  projetos: [
    {
      nome: 'Acesso veicular por tag e LPR',
      ano: 'de 2013 a 2024',
      papel: 'Desenvolvedor no time do produto',
      resumo: 'Entrada e saída de veículos sem interação, em aeroportos e shopping centers.',
      descricao:
        'Integração com as tags de pedágio Sem Parar, ConectCar e Veloe, além do LPR, que ' +
        'lê a placa e a transforma na credencial. O carro passa, a cancela abre e a cobrança ' +
        'acontece atrás disso, sem ninguém no meio.',
      destaques: [
        'Três operadoras de tag, cada uma com seu próprio protocolo de integração.',
        'LPR como alternativa à tag: quem não tem etiqueta usa a própria placa.',
        'Implantações em aeroportos, onde interromper a operação não é uma opção disponível.',
      ],
      stack: ['C', 'C++', '.NET', 'SQL Server'],
      privado: true,
    },
    {
      nome: 'Gestão de estacionamento ponta a ponta',
      ano: 'de 2013 a 2024',
      papel: 'Desenvolvedor no time do produto',
      resumo: 'O ciclo inteiro do estacionamento em um sistema só: do acesso à nota fiscal.',
      descricao:
        'Operado por grandes grupos de shopping centers, cobrindo acesso, permanência, ' +
        'tarifação, cobrança e emissão de nota.',
      destaques: [
        'Todas as etapas no mesmo sistema, sem transferência manual de dado entre fases.',
        'Regras de tarifação que mudam por operação, por horário e por convênio.',
        'Emissão fiscal integrada ao fluxo, em vários municípios.',
      ],
      stack: ['.NET', 'Java', 'Angular', 'SQL Server'],
      privado: true,
    },
    {
      nome: 'Atendimento digital ao cliente',
      ano: 'desde 2024',
      papel: 'Desenvolvedor no time da plataforma',
      resumo: 'Central de suporte digital e WhatsApp para o atendimento a pessoa física.',
      descricao:
        'Centrais de atendimento governadas pelo Dynamics 365, com as peças do banco ' +
        'integradas por trás. Inclui a central de suporte digital, o canal de WhatsApp e a ' +
        'frente de gerentes, com toda a infraestrutura em AWS e esteira de CI/CD.',
      destaques: [
        'Dynamics 365 como camada de governo da jornada, integrado aos sistemas internos.',
        'WhatsApp como canal de atendimento, no mesmo fluxo dos demais.',
        'Terraform descreve a infraestrutura e a esteira de deploy. Ambiente e pipeline ' +
          'ficam versionados e governados, em vez de configuração feita à mão no console.',
      ],
      stack: ['.NET', 'Java', 'Angular', 'Python', 'Terraform', 'AWS', 'DynamoDB'],
      privado: true,
    },
    {
      nome: 'D1 Finanças',
      ano: 'desde 2025',
      papel: 'Autor e único desenvolvedor',
      resumo: 'Sistema de gestão financeira pessoal que substituiu uma planilha usada desde 2023.',
      descricao:
        'Receitas, despesas, faturas de cartão, investimentos e reserva num sistema só, ' +
        'com previsto e realizado lado a lado.',
      destaques: [
        'API em .NET e front em Angular no mesmo processo, sobre SQL Server.',
        'Servidor MCP na mesma camada de aplicação, para consulta por agente de IA.',
      ],
      stack: ['C# 13', '.NET', 'EF Core', 'SQL Server', 'Angular 21', 'PrimeNG', 'Playwright', 'MCP'],
      privado: true,
    },
    {
      nome: 'Valuart',
      ano: 'em produção',
      papel: 'Autor e único desenvolvedor',
      resumo: 'SaaS de precificação para artesãos e pequenos produtores.',
      descricao:
        'Calcula o custo real de cada produto, somando materiais, embalagem, mão de obra e ' +
        'rateio dos custos fixos, e devolve o preço final já com margem e taxas de venda ' +
        'embutidas. No lugar do preço no chute.',
      destaques: [
        'O preço sai por gross-up, dividindo o preço base por um menos as taxas. Somar a taxa da maquininha ao preço, que é o erro comum, vende no prejuízo.',
        'O lucro incide sobre o custo total, com o rateio das despesas fixas dentro, e materiais podem ser precificados por área ou por unidade.',
        'Em produção na AWS, com ECS Fargate atrás de load balancer, RDS PostgreSQL e deploy contínuo por GitHub Actions.',
      ],
      stack: ['.NET 8', 'C#', 'PostgreSQL', 'EF Core 8', 'Docker', 'AWS ECS Fargate', 'GitHub Actions', 'xUnit'],
      privado: true,
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
        'Importação, limpeza e conciliação de histórico bagunçado de planilha, CSV ou sistema ' +
        'legado, até virar base confiável para decidir.',
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
        'Você descreve o problema, sem precisar traduzir para termo técnico. ' +
        'Eu pergunto até entender o que de fato precisa mudar.',
    },
    {
      titulo: 'Escopo e proposta',
      descricao:
        'Escrevo o que será entregue, em que ordem e por quanto. Se o problema for menor ' +
        'do que parecia, eu digo, porque cobrar por complexidade que não existe não me interessa.',
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
    email: 'danilop.silva.d1@gmail.com',
    linkedin: 'https://www.linkedin.com/in/danilops',
    convite:
      'Tem uma ideia parada porque não sabe por onde começar? Descreve ela em duas linhas. ' +
      'Respondo dizendo se dá para fazer, quanto custa mais ou menos, e se eu sou a pessoa certa.',
  },
};
