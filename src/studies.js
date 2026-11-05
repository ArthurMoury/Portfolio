// Source permalinks keep the public evidence tied to the implementation described here.
export const studies = [
  {
    id: 'breath',
    image: 'diaphragm',
    detail: 'BMP180 → Arduino',
    tint: '#ecc09e',
    source: 'https://sites.google.com/cesar.school/g3-acessibilidade-motora/status-report-2',
    pt: {
      tab: 'Sopro', name: 'Gaita Hero', title: ['Jogar com', 'um sopro.'],
      copy: 'Na nossa gaita adaptada, sensores BMP180 medem a pressão do ar. Com um sopro, a pessoa toca a nota que o jogo pede. O relatório da equipe mostra como montamos o circuito no Arduino.',
      link: 'Ver o circuito da gaita',
    },
    en: {
      tab: 'Breath', name: 'Gaita Hero', title: ['A game played', 'by breath.'],
      copy: 'In our adapted harmonica, BMP180 sensors measure air pressure. Players blow to hit the note the game calls for. Our team report shows how we wired the sensors to the Arduino.',
      link: 'See the harmonica circuit',
    },
  },
  {
    id: 'cycle',
    image: 'processor',
    detail: 'uint8_t mem[256]',
    tint: '#c0b6ec',
    source: 'https://github.com/Amfgs/F-D-E-Project/blob/1aca95ad9f35b130c96311997c1e03c5e0e9c55c/structure.c#L9-L39',
    pt: {
      tab: 'Ciclo', name: 'Processador em C', title: ['Dentro de', '256 bytes.'],
      copy: 'No simulador que desenvolvemos em grupo, cada instrução ocupa três bytes. Um deles escolhe a operação. Os outros dois trazem os operandos. Dá para acompanhar os quatro registradores a cada ciclo.',
      link: 'Ler o ciclo de execução',
    },
    en: {
      tab: 'Cycle', name: 'Processor in C', title: ['Inside', '256 bytes.'],
      copy: 'In the simulator we built as a team, each instruction takes three bytes. One selects the operation. The other two hold its operands. You can trace all four registers after each cycle.',
      link: 'Read the execution cycle',
    },
  },
  {
    id: 'sample',
    image: 'optics',
    detail: "df_filtrado['usd'].mean()",
    tint: '#9ad8cc',
    source: 'https://github.com/Amfgs/dashboard-dados-python/blob/6b8d2d8ce8cd276ac396a5c3f6d96a59990bb365/app.py#L24-L64',
    pt: {
      tab: 'Filtro', name: 'Dashboard de salários', title: ['Quem entra', 'na média?'],
      copy: 'Quanto ganha quem trabalha com dados? No meu painel, ano, senioridade, contrato e porte da empresa definem a amostra. Só então o Python calcula o salário médio anual em dólares.',
      link: 'Ver como a média é calculada',
    },
    en: {
      tab: 'Filter', name: 'Salary dashboard', title: ['Who counts', 'in the average?'],
      copy: 'What do people working in data earn? In my dashboard, year, seniority, contract type and company size define the sample. Only then does Python calculate the average annual salary in US dollars.',
      link: 'See how the average is calculated',
    },
  },
];
