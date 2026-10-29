export const profile = {
  "name": "Arthur Moury",
  "fullName": "Arthur Moury Fernandes de Godoy Santos",
  "email": "mourygodoy@gmail.com",
  "location": "Recife, Pernambuco",
  "education": "Ciência da Computação · CESAR School",
  "linkedin": "https://www.linkedin.com/in/arthur-moury-fernandes-de-godoy-santos-3b7872353/",
  "github": "https://github.com/ArthurMoury"
};

export const contexts = {
  "pessoa": {
    "label": "Quem sou",
    "verb": "Conhecer"
  },
  "faculdade": {
    "label": "Na faculdade",
    "verb": "Aprender"
  },
  "trabalho": {
    "label": "No trabalho",
    "verb": "Construir"
  },
  "iniciativa": {
    "label": "Por conta própria",
    "verb": "Explorar"
  }
};

export const projects = [
  {
    "id": "cortech",
    "name": "Cortech",
    "repo": "Amfgs/Cortech",
    "private": true,
    "live": "https://cortech-opal.vercel.app/",
    "topic": "Saúde e cuidado",
    "context": "iniciativa",
    "summary": "O cuidado continua depois da consulta.",
    "detail": "Prescrições, horários e registros de doses em um só lugar. Pacientes e profissionais acompanham a rotina de cuidado com uma conexão autorizada pelo paciente.",
    "tech": [
      "React",
      "Next.js",
      "TypeScript"
    ],
    "image": "/projects/cortech.jpg",
    "imageType": "Captura da página pública",
    "implementation": [
      {
        "label": "Aplicação",
        "text": "Next.js, React e JavaScript."
      },
      {
        "label": "Interface",
        "text": "GSAP, Motion e Lucide."
      },
      {
        "label": "Dados e documentos",
        "text": "Drizzle ORM, Vercel Blob, PDF.js e Tesseract.js para leitura de documentos."
      }
    ]
  },
  {
    "id": "freesb",
    "name": "FreeSB",
    "repo": "ArthurMoury/FreeSB",
    "private": true,
    "live": "https://free-spaceboard.vercel.app/",
    "topic": "Colaboração visual",
    "context": "iniciativa",
    "summary": "Um espaço para pensar e construir junto.",
    "detail": "Quadro colaborativo com canvas infinito para conectar notas, imagens, desenhos e decisões. Reúne trabalho em equipe, pesquisa com evidências e um espaço privado que funciona offline.",
    "tech": [
      "Canvas",
      "WebSocket",
      "MCP"
    ],
    "image": "/projects/freesb.jpg",
    "imageType": "Captura da página pública",
    "implementation": [
      {
        "label": "Aplicação",
        "text": "React, Express e Zustand."
      },
      {
        "label": "Canvas e interação",
        "text": "Konva, React Konva e Motion."
      },
      {
        "label": "Colaboração e dados",
        "text": "WebSocket (ws), MCP, Neon PostgreSQL, Vercel Blob e Zod."
      }
    ]
  },
  {
    "id": "betterway",
    "name": "Betterway",
    "repo": "Amfgs/betterway",
    "private": false,
    "live": "https://betterway-finance.vercel.app/",
    "topic": "Finanças e comportamento",
    "context": "iniciativa",
    "summary": "Mais contexto para cada escolha financeira.",
    "detail": "Uma experiência de inteligência financeira comportamental que conecta organização, planejamento e investimentos. Desenvolvimento web e mobile em torno das decisões do dia a dia.",
    "tech": [
      "React",
      "Node.js",
      "Expo"
    ],
    "image": "/projects/betterway.webp",
    "imageType": "Captura da aplicação",
    "implementation": [
      {
        "label": "Aplicação",
        "text": "React e Vite na web; Node.js e Express na API."
      },
      {
        "label": "Outras interfaces",
        "text": "Expo para a aplicação mobile."
      },
      {
        "label": "Construção",
        "text": "Organização financeira, planejamento e visualização de investimentos."
      }
    ]
  },
  {
    "id": "roomi-reservas",
    "name": "Roomi Reservas",
    "repo": "AM-Roomi/roomi-reservas",
    "private": true,
    "live": "https://roomi-reservas.vercel.app/",
    "topic": "Hotelaria e reservas",
    "context": "trabalho",
    "summary": "Encontrar um destino começa por boas respostas.",
    "detail": "Experiência de descoberta dos hotéis da rede Roomi, com destinos, promoções e informações para escolher a hospedagem. Uma jornada que conecta inspiração e reserva.",
    "tech": [
      "JavaScript",
      "CSS",
      "Serverless"
    ],
    "image": "/projects/roomi-reservas-cover.webp",
    "imageType": "Captura da página pública",
    "implementation": [
      {
        "label": "Aplicação",
        "text": "HTML, CSS e JavaScript."
      },
      {
        "label": "Integrações",
        "text": "Funções serverless para serviços da experiência de reservas."
      },
      {
        "label": "Construção",
        "text": "Exploração de destinos, hotéis, ofertas e informações de hospedagem."
      }
    ]
  },
  {
    "id": "roomi-builder",
    "name": "Roomi Builder",
    "repo": "ArthurMoury/roomi-builder",
    "private": false,
    "live": "https://roomi-builder.vercel.app/",
    "topic": "Simulação e visualização 3D",
    "context": "trabalho",
    "summary": "Um resort toma forma a partir de decisões.",
    "detail": "Simulador que transforma escolhas de destino, categoria e escala em um hotel 3D. A visualização acompanha um relatório de investimento e operação com estimativas em faixas.",
    "tech": [
      "React",
      "Three.js",
      "GSAP"
    ],
    "image": "/projects/roomi-builder-cover.webp",
    "imageType": "Captura da aplicação",
    "implementation": [
      {
        "label": "Aplicação",
        "text": "React, TypeScript, Vite e Zustand."
      },
      {
        "label": "Visualização",
        "text": "Three.js com React Three Fiber."
      },
      {
        "label": "Movimento",
        "text": "Anime.js, Motion e GSAP com ScrollTrigger."
      }
    ]
  },
  {
    "id": "sollie",
    "name": "Sollie",
    "repo": "ArthurMoury/Sollie",
    "private": true,
    "live": "https://sollie-omega.vercel.app/",
    "topic": "Gestão agrícola",
    "context": "iniciativa",
    "summary": "Tecnologia perto de quem cultiva.",
    "detail": "Plataforma de gestão agrícola com planejamento de talhões, acompanhamento de safra, insumos e finanças. A Sol.IA reúne a assistência com inteligência artificial no contexto do campo.",
    "tech": [
      "React",
      "TypeScript",
      "Vite"
    ],
    "image": "/projects/sollie.jpg",
    "imageType": "Captura da tela pública de acesso",
    "implementation": [
      {
        "label": "Aplicação",
        "text": "React, TypeScript, Vite e React Router."
      },
      {
        "label": "Interface",
        "text": "Radix UI, Tailwind CSS, Framer Motion e Recharts."
      },
      {
        "label": "Dados",
        "text": "Supabase, TanStack Query, React Hook Form e Zod."
      }
    ]
  },
  {
    "id": "dozao",
    "name": "Dozão",
    "repo": null,
    "private": false,
    "live": "https://dozao.vercel.app/",
    "topic": "Games e experiências multiplayer",
    "context": "iniciativa",
    "summary": "Uma mesa de dominó para jogar junto.",
    "detail": "Dominó com mesa e peças em 3D, partidas de quatro jogadores em duplas, modo offline com bots e salas online. A experiência inclui regras de pontuação, turnos, perfis e interação entre jogadores.",
    "tech": [
      "React",
      "Three.js",
      "PeerJS"
    ],
    "image": "/projects/dozao.jpg",
    "imageType": "Captura de uma partida de teste",
    "implementation": [
      {
        "label": "Aplicação",
        "text": "React, TypeScript e Vite."
      },
      {
        "label": "Experiência 3D",
        "text": "Three.js para mesa e peças; GSAP para as animações."
      },
      {
        "label": "Multiplayer e qualidade",
        "text": "PeerJS para comunicação entre jogadores; Vitest e jsdom nos testes."
      }
    ]
  }
];

export const chapters = [
  {
    "id": "formacao",
    "marker": "2025 → agora",
    "organization": "CESAR School",
    "role": "Ciência da Computação",
    "title": "Aprender. Fazer. Compartilhar.",
    "context": "faculdade",
    "text": "Na graduação, venho construindo uma base em desenvolvimento de software, com projetos que passam por acessibilidade, hardware e aplicações full-stack.",
    "proof": "Projeto em equipe para comparar o impacto ambiental de cartões físicos e pagamentos digitais. Reúne simulações de ciclo de vida, cenários de migração, logística reversa e indicadores de custo e impacto.",
    "image": "/projects/card0.webp",
    "caption": "Card0 · projeto em equipe na formação acadêmica",
    "fit": "contain",
    "background": "#1a1d29",
    "brandImage": "/projects/cesar.webp",
    "stack": "Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Recharts, Axios, Nodemailer e Cypress."
  },
  {
    "id": "boop",
    "marker": "jan — mar / 2026",
    "organization": "Boop Mídia",
    "role": "Estágio em automações de processos",
    "title": "Transformar rotinas em fluxos.",
    "context": "trabalho",
    "text": "Trabalhei com automação de processos usando n8n, Make e Zapier, além da gestão de dados no CRM Go High Level. O trabalho começava por entender a rotina e as informações que precisavam circular.",
    "proof": "Conectei ferramentas e etapas de processos, aproximando a operação das possibilidades da automação.",
    "image": "/projects/boop.webp",
    "caption": "Boop Mídia · automações de processos",
    "fit": "brand",
    "background": "#000000"
  },
  {
    "id": "roomi",
    "marker": "mar / 2026 → agora",
    "organization": "Roomi",
    "role": "Estágio em IA Ops",
    "title": "Da operação à experiência digital.",
    "context": "trabalho",
    "text": "Atuo com dashboards, ferramentas de análise, automações e validação de software. Também pesquiso aplicações de IA e RAG para aproximar informação e contexto de uso.",
    "proof": "Entre os projetos, o Roomi Reservas conecta destinos e hospedagens. No Roomi Builder, escolhas de configuração ganham forma em um resort 3D, acompanhado de estimativas de investimento e operação.",
    "image": "/projects/roomi-wallpaper.webp",
    "caption": "Roomi · desenvolvimento, IA e operação",
    "fit": "cover",
    "background": "#1c1c1a"
  },
  {
    "id": "autoria",
    "marker": "2026 · em construção",
    "organization": "Projetos autorais",
    "role": "Desenvolvimento de produtos",
    "title": "Tirar ideias do papel.",
    "context": "iniciativa",
    "text": "Exploro problemas diferentes construindo ferramentas: colaboração visual no FreeSB, cuidado no Cortech, decisões financeiras no Betterway e gestão agrícola na Sollie. No Dozão, levo essa exploração para games, visualização 3D e partidas multiplayer.",
    "proof": "Com a Sollie, participei da pré-incubação 2026.1 do Porto Digital. Uma oportunidade de olhar para o produto além do código e amadurecer sua proposta.",
    "image": "/projects/sollie-brand.webp",
    "caption": "Sollie · gestão inteligente no campo",
    "fit": "contain",
    "background": "#22291b"
  }
];
