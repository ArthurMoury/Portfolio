export const profile = {
  "name": "Arthur Moury",
  "fullName": "Arthur Moury Fernandes de Godoy Santos",
  "email": "mourygodoy@gmail.com",
  "location": "Recife, Pernambuco",
  "education": "Ciência da Computação, CESAR School",
  "linkedin": "https://www.linkedin.com/in/arthur-moury-fernandes-de-godoy-santos-3b7872353/",
  "github": "https://github.com/ArthurMoury"
};

export const contexts = {
  "estudos": {
    "label": "Na prática",
    "verb": "Explorar"
  },
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
    "id": "nexo-ai",
    "name": "Nexo AI",
    "repo": "ArthurMoury/nexo-suporte-ia",
    "private": false,
    "live": "https://nexo-suporte-arthurmoury.netlify.app/",
    "topic": "Inteligência artificial e suporte",
    "context": "iniciativa",
    "summary": "Um agente que consulta antes de responder.",
    "detail": "Assistente de suporte com LLMs, ferramentas em Python e RAG sobre documentos. Responde com fontes verificadas e permite acompanhar as consultas executadas. O cenário usa uma empresa fictícia e dados sintéticos.",
    "tech": [
      "Python",
      "JavaScript",
      "RAG",
      "Tool calling"
    ],
    "image": "/projects/nexo-ai.webp",
    "imageType": "Captura da aplicação",
    "implementation": [
      {
        "label": "Aplicação",
        "text": "HTML, CSS e JavaScript, sem dependências de runtime de terceiros."
      },
      {
        "label": "Agente e recuperação",
        "text": "Orquestração em Python, APIs Gemini e OpenAI, tool calling e busca lexical BM25 em documentos Markdown."
      },
      {
        "label": "Entrega e qualidade",
        "text": "Interface na Netlify e backend Python na Vercel, com testes automatizados e avaliação contínua."
      }
    ]
  },
  {
    "id": "tyde",
    "name": "Tyde",
    "repo": "Gustavotorrescastro/tyde",
    "private": true,
    "live": "https://tyde-coral.vercel.app/",
    "topic": "Inteligência territorial",
    "context": "colaboracao",
    "summary": "Um mapa para conectar dados e território.",
    "detail": "Atuo como colaborador no Tyde, um painel de inteligência territorial do Recife. Mapas e indicadores de saneamento, chuva, maré e histórico epidemiológico conectam os oito Distritos Sanitários e os 94 bairros da cidade.",
    "tech": [
      "Next.js",
      "React",
      "TypeScript",
      "MapLibre GL"
    ],
    "image": "/projects/tyde.webp",
    "imageType": "Captura da aplicação",
    "implementation": [
      {
        "label": "Aplicação",
        "text": "Next.js, React e TypeScript."
      },
      {
        "label": "Mapas",
        "text": "MapLibre GL e GeoJSON para as camadas de distritos e bairros."
      },
      {
        "label": "Dados e validação",
        "text": "Scripts em Node.js e Python para dados públicos; testes unitários e de navegador com Playwright."
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
    "image": "/projects/sollie-landing.webp",
    "imageType": "Captura da landing page",
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
    "client": "Edenred",
    "clientLogo": "/clients/edenred.svg",
    "marker": "2025 até agora",
    "organization": "CESAR School",
    "role": "Ciência da Computação",
    "title": "Aprender. Fazer. Compartilhar.",
    "context": "faculdade",
    "text": "Na graduação, venho construindo uma base em desenvolvimento de software, com projetos que passam por acessibilidade, hardware e aplicações full-stack.",
    "proof": "Projeto em equipe para comparar o impacto ambiental de cartões físicos e pagamentos digitais. Reúne simulações de ciclo de vida, cenários de migração, logística reversa e indicadores de custo e impacto.",
    "image": "/projects/card0.webp",
    "caption": "Card0, projeto em equipe na formação acadêmica",
    "fit": "contain",
    "background": "#1a1d29",
    "stack": "Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Recharts, Axios, Nodemailer e Cypress."
  },
  {
    "id": "gaita-hero",
    "client": "CESAR School",
    "clientLogo": "/clients/cesar-school.png",
    "marker": "2025, projeto acadêmico",
    "organization": "Gaita Hero",
    "role": "CESAR School, acessibilidade motora",
    "title": "Jogar também pode começar com um sopro.",
    "context": "faculdade",
    "text": "Participei do desenvolvimento de um jogo figital pensado para pessoas com deficiência motora. Uma gaita adaptada transforma a pressão do sopro em comandos para acompanhar o ritmo da música.",
    "proof": "O trabalho conectou prototipação física, sensores e experiência de uso: suporte com ajuste de altura e inclinação, montagem do circuito e testes do protótipo.",
    "image": "/projects/gaita-hero.webp",
    "caption": "Google Sites do Gaita Hero, projeto de acessibilidade motora",
    "fit": "contain",
    "background": "#1b233e",
    "stack": "Arduino, sensores de pressão BMP180, montagem eletrônica e prototipação física.",
    "site": "https://sites.google.com/cesar.school/g3-acessibilidade-motora/in%C3%ADcio"
  },
  {
    "id": "echo",
    "client": "Jornal do Comércio",
    "clientLogo": "/clients/jornal-do-commercio.svg",
    "marker": "2025, projeto acadêmico",
    "organization": "Echo",
    "role": "CESAR School, Agile Coach no time de desenvolvimento",
    "title": "Uma relação mais próxima com quem lê.",
    "context": "faculdade",
    "text": "No grupo Echo, trabalhamos o desafio de fidelização dos usuários do Jornal do Commercio. Participei do time de desenvolvimento como Agile Coach, em colaboração com estudantes de design e computação.",
    "proof": "O portal reuniu perfis de usuário, notícias salvas e curtidas, recomendações e uma navegação renovada. Pesquisa, prototipação e implementação se encontraram no mesmo projeto.",
    "image": "/projects/echo.webp",
    "caption": "Google Sites do grupo Echo, projeto acadêmico de 2025",
    "fit": "contain",
    "background": "#2e5d49",
    "stack": "Python, Django, HTML, CSS, JavaScript, Selenium e Azure.",
    "site": "https://sites.google.com/cesar.school/projetos2-g15/home"
  },
  {
    "id": "boop",
    "marker": "jan a mar / 2026",
    "organization": "Boop Mídia",
    "role": "Estágio em automações de processos",
    "title": "Transformar rotinas em fluxos.",
    "context": "trabalho",
    "text": "Trabalhei com automação de processos usando n8n, Make e Zapier, além da gestão de dados no CRM Go High Level. O trabalho começava por entender a rotina e as informações que precisavam circular.",
    "proof": "Conectei ferramentas e etapas de processos, aproximando a operação das possibilidades da automação.",
    "image": "/projects/boop.webp",
    "caption": "Boop Mídia, automações de processos",
    "fit": "brand",
    "background": "#000000"
  },
  {
    "id": "roomi",
    "marker": "mar / 2026 até agora",
    "organization": "Roomi",
    "role": "Estágio em IA Ops",
    "title": "Da operação à experiência digital.",
    "context": "trabalho",
    "text": "Atuo com dashboards, ferramentas de análise, automações e validação de software. Também pesquiso aplicações de IA e RAG para aproximar informação e contexto de uso.",
    "proof": "Entre os projetos, o Site de reservas conecta destinos e hospedagens. No Site Construtor de Hotéis, escolhas de configuração ganham forma em um resort 3D, acompanhado de estimativas de investimento e operação.",
    "image": "/projects/roomi-wallpaper.webp",
    "caption": "Roomi, desenvolvimento, IA e operação",
    "fit": "cover",
    "background": "#1c1c1a"
  },
  {
    "id": "autoria",
    "marker": "2026, em construção",
    "organization": "Projetos autorais",
    "role": "Desenvolvimento de produtos",
    "title": "Ideação de startups",
    "context": "iniciativa",
    "text": "No Cortech, exploro como acompanhar um tratamento. No Betterway, como apoiar decisões financeiras. Na Sollie, como ajudar o produtor a planejar a safra.",
    "proof": "A Sollie, por exemplo, participou da pré-incubação 2026.1 do Porto Digital, onde trabalhamos a proposta de valor com a equipe.",
    "image": "/projects/sollie-brand.webp",
    "caption": "Sollie, gestão inteligente no campo",
    "fit": "contain",
    "background": "#22291b"
  }
];
