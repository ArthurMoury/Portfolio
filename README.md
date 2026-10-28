# Portfólio · Arthur Moury

Portfólio pessoal em React, CSS Modules e GSAP. Apresenta Arthur Moury, estudante de Ciência da Computação na CESAR School e estagiário em IA Ops na Roomi, e reúne seus projetos públicos de trabalho, faculdade e iniciativas independentes.

## Executar

```bash
npm install
npm run dev
```

```bash
npm run check
npm run build
npm run preview
```

## Experiência

1. Abertura fotográfica em tela cheia com crachá interativo, entrada coreografada, traço SVG e onda animada.
2. Navegação que aparece após a abertura, com menu móvel e links de âncora.
3. Percurso interativo e acervo de 11 projetos públicos, filtrado por contexto.
4. Quatro capítulos de trajetória com painel visual sticky no desktop e imagens individuais no mobile.
5. Demonstração automática com timeline, percurso, três etapas, pausa e repetição.
6. Três passos para explorar o trabalho.
7. Faixa sobre qualidade e testes.
8. Encerramento com dispositivo e parallax discreto.
9. Perguntas com respostas sempre visíveis e galerias acessíveis.
10. Contato com validação, preparação de e-mail e rodapé.

Rolagem nativa, teclado, foco visível, diálogo com Escape e movimento reduzido fazem parte da implementação. A demonstração pausa fora da tela e quando a aba fica oculta. O contato usa `mailto:`: o visitante revisa e envia no próprio aplicativo; não há serviço de e-mail configurado nem coleta de mensagens no servidor.

## Conteúdo

Os dados estão em `src/data/portfolio.js`. Projetos das contas públicas [ArthurMoury](https://github.com/ArthurMoury), [Amfgs](https://github.com/Amfgs) e [AM-Roomi](https://github.com/AM-Roomi), verificados em 27/10/2026. Dados profissionais e formação extraídos do currículo disponibilizado pelo titular. Idade não exibida por escolha do titular.

Capturas reais: [Roomi Maker](https://roomi-builder.vercel.app) e [Better Way](https://betterway-finance.vercel.app). Os demais projetos usam representações identificadas. O repositório Artigo-Hardware ainda não contém arquivos e é apresentado como tema de pesquisa, sem alegação de implementação concluída. Forks recebem crédito e não entram na contagem de autoria.

## Design e referências

O arquivo `DESIGN.md` registra o sistema visual. Princípios consultados no Personal Vault: materialidade pontual, profundidade como hierarquia, GSAP para coreografia, animações reversíveis e alternativas estáticas. Referências públicas: [GSAP](https://gsap.com/docs/v3/), [Refokus](https://www.refokus.com/), [React Bits Lanyard](https://reactbits.dev/components/lanyard). O crachá é uma implementação própria no DOM/CSS com GSAP, inspirada na metáfora física de um lanyard.

Fotografia da cidade: [Mia Silva / Unsplash](https://unsplash.com/photos/FYBV47iO8Ok). Fontes Sora e Hanken Grotesk distribuídas sob SIL Open Font License; licenças em `public/fonts/`.

Os dez comportamentos do briefing estão mapeados em `docs/QA.md`. Imagens vetoriais podem ser regeneradas com `node scripts/create-project-art.mjs`.
