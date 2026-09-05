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
      'Quinze anos escrevendo software, do banco de dados à tela. Abaixo está o ' +
      'ferramental que eu uso e o que costumo montar com ele.',
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
          prova: 'Da versão 8 à 21. Standalone components, signals, formulários reativos tipados, lazy loading por rota e a virada de zone.js para zoneless.',
        },
        {
          nome: 'TypeScript',
          icone: 'typescript',
          prova: 'Modo estrito, sem `any`. Contrato de API tipado à mão quando o backend não gera cliente, e tipos utilitários no lugar de modelo repetido.',
        },
        {
          nome: 'Tailwind CSS',
          icone: 'tailwind',
          prova: 'Tema claro e escuro por classe, com design tokens em custom properties e componente montado sem sair do utilitário.',
        },
      ],
    },
    {
      grupo: 'Backend',
      itens: [
        {
          nome: '.NET e C#',
          icone: 'dotnet',
          prova: 'A linguagem em que trabalho há mais tempo. Minimal APIs, injeção de dependência, async em tudo que toca rede, e C# moderno: records, pattern matching e nullable habilitado.',
        },
        {
          nome: 'Java',
          icone: 'java',
          prova: 'Serviços e APIs corporativas, do Java de 2011 às versões atuais.',
        },
        {
          nome: 'Python',
          icone: 'python',
          prova: 'Automação, scripts de apoio e integração entre sistemas que não se falam.',
        },
        {
          nome: 'C e C++',
          icone: 'cpp',
          prova: 'Camada baixa, onde o software conversa com equipamento: leitura de dispositivo, protocolo serial e resposta em tempo real.',
        },
      ],
    },
    {
      grupo: 'Dados',
      itens: [
        {
          nome: 'SQL Server',
          sigla: 'SQL',
          prova: 'Modelagem, T-SQL, índice e plano de execução. Migração de base entre servidores e conserto de consulta que ficou lenta quando o volume cresceu.',
        },
        {
          nome: 'PostgreSQL',
          icone: 'postgresql',
          prova: 'Base gerenciada em RDS, com EF Core por cima e migrations aplicadas no deploy.',
        },
        {
          nome: 'DynamoDB',
          sigla: 'DDB',
          prova: 'Modelagem por padrão de acesso, chave composta e leitura barata em escala. Não é SQL, e tratar como se fosse é o erro que custa caro depois.',
        },
        {
          nome: 'Oracle',
          sigla: 'ORA',
          prova: 'PL/SQL e consulta em base legada.',
        },
      ],
    },
    {
      grupo: 'Nuvem e infraestrutura',
      itens: [
        {
          nome: 'AWS',
          sigla: 'AWS',
          prova: 'ECS Fargate, RDS, S3, CloudFront, Route 53, ACM, VPC privada e CloudWatch. Aplicação em contêiner atrás de load balancer, com HTTPS e log centralizado.',
        },
        {
          nome: 'Azure',
          sigla: 'AZ',
          prova: 'Migração de sistema e de base de on-premises para a nuvem.',
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
          prova: 'Teste ponta a ponta rodando o navegador de verdade, com banco separado do de produção e trava que aborta a suíte se ela apontar para a base errada.',
        },
        {
          nome: 'xUnit e Vitest',
          icone: 'vitest',
          prova: 'Teste de unidade nas duas pontas, com mock, asserção fluente e cobertura medida.',
        },
      ],
    },
    {
      grupo: 'IA aplicada',
      itens: [
        {
          nome: 'Model Context Protocol',
          sigla: 'MCP',
          prova: 'Servidor MCP referenciando a camada de aplicação direto, sem passar por HTTP, para um agente consultar o sistema com tools tipadas.',
        },
        {
          nome: 'Claude Code',
          icone: 'claude',
          prova: 'Parte do meu fluxo de trabalho. Ferramenta, não substituto de decisão técnica.',
        },
      ],
    },
  ],

  combinacoes: [
    {
      titulo: 'SaaS completo',
      descricao:
        'Produto que atende muitos clientes, com assinatura, painel e cobrança recorrente. Front, API, banco e esteira de deploy.',
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
