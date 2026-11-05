// Source permalinks keep the public evidence tied to the implementation described here.
export const studies = [
  {
    id: 'breath',
    tint: '#ecc09e',
    source: 'https://sites.google.com/cesar.school/g3-acessibilidade-motora/status-report-2',
    pt: {
      name: 'Gaita Hero', title: ['Jogar com', 'um sopro.'],
      copy: 'Na nossa gaita adaptada, sensores BMP180 medem a pressão do ar. Com um sopro, a pessoa toca a nota que o jogo pede. O relatório da equipe mostra como montamos o circuito no Arduino.',
      link: 'Ver o circuito da gaita',
    },
    en: {
      name: 'Gaita Hero', title: ['A game played', 'by breath.'],
      copy: 'In our adapted harmonica, BMP180 sensors measure air pressure. Players blow to hit the note the game calls for. Our team report shows how we wired the sensors to the Arduino.',
      link: 'See the harmonica circuit',
    },
  },
  {
    id: 'cycle',
    tint: '#c0b6ec',
    source: 'https://github.com/Amfgs/F-D-E-Project/blob/1aca95ad9f35b130c96311997c1e03c5e0e9c55c/structure.c#L9-L39',
    pt: {
      name: 'Processador em C', title: ['Dentro de', '256 bytes.'],
      copy: 'Cada instrução do nosso simulador ocupa três bytes. Aqui, o processador lê a operação MOV, o registrador de destino e o valor 5. Duas luzes acesas no primeiro registrador mostram esse valor em binário.',
      link: 'Ler o ciclo de execução',
    },
    en: {
      name: 'Processor in C', title: ['Inside', '256 bytes.'],
      copy: 'Each instruction in our simulator takes three bytes. Here the processor reads the MOV operation, its destination register and the value 5. Two lights in the first register show that value in binary.',
      link: 'Read the execution cycle',
    },
  },
  {
    id: 'sample',
    tint: '#9ad8cc',
    source: 'https://github.com/Amfgs/dashboard-dados-python/blob/6b8d2d8ce8cd276ac396a5c3f6d96a59990bb365/app.py#L24-L64',
    pt: {
      name: 'Dashboard de salários', title: ['Quem entra', 'na média?'],
      copy: 'Cada coluna representa um salário anual do conjunto usado no painel. A rolagem aplica quatro filtros: ano, senioridade, contrato e porte da empresa. A linha acompanha a média dos salários que ficam.',
      link: 'Ver como a média é calculada',
    },
    en: {
      name: 'Salary dashboard', title: ['Who counts', 'in the average?'],
      copy: 'Each column represents one annual salary from the dataset used in my dashboard. Scrolling filters by year, seniority, contract type and company size. The line follows the average of the salaries that remain.',
      link: 'See how the average is calculated',
    },
  },
];
