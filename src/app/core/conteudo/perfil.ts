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
    resumoDeCarreira:
      'Quatro setores até aqui: leilões online, consultoria corporativa, automação de ' +
      'estacionamento e tráfego, e o sistema bancário. Empresas, cargos e períodos estão ' +
      'no LinkedIn.',
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

  tecnologias: [
    {
      grupo: 'Frontend',
      itens: [
        {
          nome: 'Angular',
          icone: 'angular',
          prova: 'Front do Valuart e do D1 Finanças, e telas das centrais de atendimento no banco. Da versão 8 à 21, incluindo a virada para standalone components e signals.',
        },
        {
          nome: 'TypeScript',
          icone: 'typescript',
          prova: 'Todo front que escrevi na última década. Sem `any`, com as interfaces de API tipadas à mão quando o backend não gera contrato.',
        },
        {
          nome: 'Tailwind CSS',
          icone: 'tailwind',
          prova: 'Interface inteira do Valuart, com tema claro e escuro por classe.',
        },
      ],
    },
    {
      grupo: 'Backend',
      itens: [
        {
          nome: '.NET e C#',
          icone: 'dotnet',
          prova: 'A linguagem em que trabalho há mais tempo. APIs de atendimento no Itaú, o backend do Valuart em Clean Architecture, e o D1 Finanças inteiro.',
        },
        {
          nome: 'Java',
          icone: 'java',
          prova: 'Sistemas de leilão em 2011, gestão de estacionamento na Nepos, e serviços do banco hoje.',
        },
        {
          nome: 'Python',
          icone: 'python',
          prova: 'Automação e serviços de apoio nas centrais de atendimento.',
        },
        {
          nome: 'C e C++',
          icone: 'cpp',
          prova: 'Onde o software encontra o mundo físico: controle de acesso veicular, cancela e leitura de placa.',
        },
      ],
    },
    {
      grupo: 'Dados',
      itens: [
        {
          nome: 'SQL Server',
          sigla: 'SQL',
          prova: 'Onze anos de operação de estacionamento e o D1 Finanças. Modelagem, T-SQL e migração de base entre servidores.',
        },
        {
          nome: 'PostgreSQL',
          icone: 'postgresql',
          prova: 'Base do Valuart, gerenciada em RDS, com EF Core e migrations aplicadas no deploy.',
        },
        {
          nome: 'DynamoDB',
          sigla: 'DDB',
          prova: 'Dados de sessão e atendimento nas centrais do banco, onde a leitura precisa ser barata em escala.',
        },
        {
          nome: 'Oracle',
          sigla: 'ORA',
          prova: 'Primeira base com que trabalhei, na plataforma de leilões online.',
        },
      ],
    },
    {
      grupo: 'Nuvem e infraestrutura',
      itens: [
        {
          nome: 'AWS',
          sigla: 'AWS',
          prova: 'Produção de verdade: ECS Fargate, RDS, S3, CloudFront, Route 53 e CloudWatch. É onde o Valuart roda e onde as aplicações do banco vivem.',
        },
        {
          nome: 'Azure',
          sigla: 'AZ',
          prova: 'Migração de um sistema legado e da sua base para a nuvem, em 2013, quando isso ainda era decisão arriscada.',
        },
        {
          nome: 'Terraform',
          icone: 'terraform',
          prova: 'Infraestrutura e esteira descritas em código, versionadas e governadas, em vez de configuração feita à mão no console.',
        },
        {
          nome: 'Docker',
          icone: 'docker',
          prova: 'Empacotamento das APIs, do ambiente local ao registry que alimenta o ECS.',
        },
        {
          nome: 'GitHub Actions',
          icone: 'githubActions',
          prova: 'Esteira de build, teste e deploy. Inclusive a deste site, que publica sozinho a cada push.',
        },
      ],
    },
    {
      grupo: 'Qualidade',
      itens: [
        {
          nome: 'Playwright',
          sigla: 'PW',
          prova: 'Suíte ponta a ponta do D1 Finanças, com banco separado e travas que impedem o teste de tocar na base real.',
        },
        {
          nome: 'xUnit e Vitest',
          icone: 'vitest',
          prova: 'As duas pontas do Valuart, somando 2.125 testes automatizados entre backend e frontend.',
        },
      ],
    },
    {
      grupo: 'IA aplicada',
      itens: [
        {
          nome: 'Model Context Protocol',
          sigla: 'MCP',
          prova: 'Servidor MCP no D1 Finanças, referenciando a camada de aplicação direto, para consultar as finanças por um agente.',
        },
        {
          nome: 'Claude Code',
          icone: 'claude',
          prova: 'Parte do meu fluxo de trabalho, deste site ao D1 Finanças. Ferramenta, não substituto de decisão técnica.',
        },
      ],
    },
  ],

  combinacoes: [
    {
      titulo: 'SaaS completo',
      descricao:
        'Produto que atende muitos clientes, com assinatura, painel e cobrança. É o desenho do Valuart, do banco à tela.',
      pecas: ['Angular', 'TypeScript', '.NET', 'PostgreSQL', 'AWS', 'GitHub Actions'],
    },
    {
      titulo: 'Sistema interno sob medida',
      descricao:
        'Quando a planilha não aguenta mais e o software de prateleira não serve. Roda no seu servidor ou na nuvem, do jeito que fizer sentido.',
      pecas: ['Angular', '.NET', 'SQL Server', 'Docker'],
    },
    {
      titulo: 'Integração e automação',
      descricao:
        'Fazer dois sistemas que não se falam trocarem informação, ou tirar do caminho uma rotina que alguém repete toda semana.',
      pecas: ['.NET', 'Python', 'Terraform', 'AWS', 'MCP'],
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
      resumo:
        'SaaS de precificação para artesãos e pequenos produtores que vendem em ' +
        'marketplaces e redes sociais.',
      descricao:
        'Calcula o custo real de cada produto, somando materiais, embalagem, mão de obra e ' +
        'rateio dos custos fixos, e devolve o preço final já com margem e taxas de venda ' +
        'embutidas. No lugar do preço no chute.',
      destaques: [
        'Precificação de produto, cálculo de frete, dashboard de indicadores, cadastro de fornecedores e fichas técnicas reaproveitáveis entre produtos.',
        'Assinaturas Free e Premium integradas ao gateway de pagamento Asaas por webhooks, com limite de recursos por plano.',
        'Front em Angular 20, com standalone components, signals e TailwindCSS. Tema claro e escuro, e consentimento de cookies que só libera analytics e anúncios depois do aceite.',
        'Back em .NET 8 sobre PostgreSQL, em Clean Architecture de quatro camadas, com autenticação JWT e login social pelo Google.',
        'Em produção na AWS, com a API em ECS Fargate, o front estático em S3 e CloudFront, deploy contínuo por GitHub Actions e 2.125 testes automatizados entre as duas pontas.',
      ],
      stack: ['Angular 20', 'TypeScript', 'TailwindCSS', '.NET 8', 'C#', 'PostgreSQL', 'EF Core 8', 'AWS ECS Fargate', 'GitHub Actions'],
      link: 'https://valuart.com.br',
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
