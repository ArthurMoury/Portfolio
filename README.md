# Portfólio · Arthur Moury

Apresentação pessoal, projetos, trajetória e certificados. React, CSS Modules, Three.js, Motion e GSAP/ScrollTrigger.

## Experiência

- Tema escuro em todo o site, com entrada tridimensional e retrato temporário por máscara animada.
- Informações pessoais e contato antes dos seis projetos: Cortech, FreeSB, Betterway, Roomi Reservas, Roomi Builder e Sollie.
- Projetos em faixas expansíveis, cada um com captura, contexto e botões independentes para GitHub e deploy.
- Trajetória em CESAR School, Boop e Roomi, com imagens sincronizadas à rolagem.
- Carrossel com os 29 documentos da pasta fornecida pelo titular: movimento contínuo mesmo sob hover, expansão por Motion e ampliação em diálogo.
- Navegação por teclado, arraste, controles de pausa e movimento reduzido.
- Currículo e contato em mourygodoy@gmail.com.

## Executar e validar

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

A publicação na Vercel usa `vercel.json`, com saída estática em `dist/`. A configuração existente do Sites é preservada em `.openai/hosting.json`. Não publicar `.env*`, `.research/`, `.qa/` ou arquivos locais de autenticação.

## Conteúdo

Os dados estão em `src/data/portfolio.js` e `src/data/certificates.js`. As imagens são locais, com miniaturas menores no carrossel e versões maiores no diálogo. Dois documentos continham CPF; ele foi omitido nas cópias do portfólio. Os originais no Drive foram preservados. O registro do Santander é identificado como seleção para o programa, sem alegar conclusão.

Cortech, FreeSB, Roomi Reservas e Sollie têm repositórios privados, identificados nos botões. Permissões não foram alteradas. Os seis projetos têm links próprios de acesso.

Formação e experiência vêm do currículo do titular. Sem idade ou endereço residencial na página. Foto escolhida do perfil [ArthurMoury no GitHub](https://github.com/ArthurMoury). O PDF original do currículo é mantido sem edição.

O formulário valida os campos e prepara um e-mail; o visitante revisa e envia no próprio aplicativo. Não há armazenamento de mensagens nem alegação de envio automático.

## Movimento e acessibilidade

Rolagem nativa. Three.js carregado separadamente, sem bloquear o conteúdo; a renderização cessa depois da entrada até nova interação e é suspensa fora da tela ou em aba oculta. A foto surge e desaparece em aproximadamente cinco segundos; “Rever entrada” repete a sequência. Sem WebGL, uma composição SVG mantém a abertura completa.

O carrossel continua sob o mouse e pausa explicitamente pelo controle, por foco de teclado, com diálogo aberto, fora da tela ou em aba oculta. Use `?motion=reduce` para conferir o layout estático, também ativado pela preferência do sistema. Diálogos contêm o foco, aceitam Escape e devolvem o foco ao elemento que os abriu.

Direção visual em `DESIGN.md`; verificações em `docs/QA.md`. Referências: [Refokus](https://www.refokus.com/), [Motion](https://motion.dev/docs/react-animation), [Three.js](https://threejs.org/docs/) e [GSAP](https://gsap.com/docs/v3/Plugins/ScrollTrigger/). Fontes Sora e Hanken Grotesk locais sob OFL; ícone GitHub do Simple Icons, CC0.
