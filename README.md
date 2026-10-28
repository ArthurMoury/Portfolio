# Portfólio · Arthur Moury

Portfólio pessoal em React, CSS Modules e GSAP. Apresentação, formação, experiência e seis projetos selecionados: Cortech, FreeSB, Betterway, Roomi Reservas, Roomi Builder e Sollie.

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

- Abertura com animação abstrata e retrato, sem crachá. A foto aparece somente aqui.
- Sobre mim com formação, atuação, e-mail, LinkedIn, GitHub e currículo.
- Navegação persistente e contexto que muda automaticamente durante a rolagem.
- Trajetória simplificada em CESAR School, Boop Mídia e Roomi, com imagens sincronizadas.
- Seis faixas expansíveis com captura, contexto e recursos de cada projeto. Nome expande; botão GitHub abre o repositório; botão Acessar abre o deploy.
- Demonstração automática de processo com pausa e repetição.
- Currículo e contato para qualquer assunto em mourygodoy@gmail.com.

## Conteúdo e acesso

Dados em `src/data/portfolio.js`. A seleção corresponde à lista explícita fornecida pelo titular em 27/10/2026. Cortech, FreeSB, Roomi Reservas e Sollie têm repositórios privados, identificados nos botões; visitantes sem autorização do GitHub não acessam esse código. As permissões não foram alteradas. Todos os projetos têm deploys próprios vinculados.

Formação e experiência vêm do currículo do titular. A idade não é exibida. O retrato atual é provisório até o recebimento da nova foto. O PDF original do currículo é mantido sem edição.

Rolagem nativa, teclado, foco visível, diálogo com Escape e movimento reduzido fazem parte da implementação. Use `?motion=reduce` para conferir a alternativa estática, também acionada pela preferência do sistema. A demonstração pausa fora da tela e quando a aba fica oculta.

O formulário valida e prepara um `mailto:`; o visitante revisa e envia no próprio aplicativo. Não existe coleta de mensagens em servidor nem alegação de envio automático.

## Design e imagens

Direção documentada em `DESIGN.md`: azul noturno, cobalto, prata e azul gelo; Sora e Hanken Grotesk. Princípios de profundidade, coreografia e alternativas estáticas do Personal Vault. Referências: [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) e [Refokus](https://www.refokus.com/).

Capturas reais das páginas públicas e telas de entrada dos projetos; os dois diagramas da trajetória são identificados como representações. Foto pessoal autorizada pelo titular. Ícone GitHub do [Simple Icons](https://simpleicons.org/), CC0. Fontes Sora e Hanken Grotesk sob SIL Open Font License; licenças em `public/fonts/`.

Verificações em `docs/QA.md`.
