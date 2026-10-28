# Arthur Moury · Direção visual

## Conceito

Um encontro com Arthur em Recife: fotografia da cidade em tela cheia, luz de entardecer, um crachá físico em primeiro plano e um traço que conecta pessoa, projetos e trajetória. O crachá é a assinatura; o resto da página usa espaço, tipografia e evidências dos projetos para manter a leitura clara.

## Paleta configurável

Quatro papéis principais, em `src/global.css`: cor profunda `--deep: oklch(.285 .038 185)`, destaque coral `--accent: oklch(.79 .147 38)`, superfície clara `--light: oklch(1 0 0)` e secundária azul `--secondary: oklch(.87 .071 232)`. Verde suave aparece apenas em estados e galerias. A cor coral deriva da semente de marca e do repertório de materiais estudado no Personal Vault. Não reproduz a marca Roomi.

## Tipografia

Sora nos títulos e Hanken Grotesk na leitura e interface; arquivos WOFF2 locais. Títulos fluidos, até 92 px no desktop e sem comprimir abaixo de -0.04em. Corpo entre 13 e 17 px, com contraste e entrelinha generosa.

## Estrutura e ritmo

As dez partes do briefing são preservadas: abertura; navegação persistente; percurso; quatro capítulos; demonstração; como começar; faixa secundária; encerramento com dispositivo; perguntas com galerias; contato e rodapé. A seção de percurso incorpora o acervo completo, com filtros por contexto. A página alterna fotografia, superfície clara, fundo profundo e faixas de cor; evita uma sequência de cartões idênticos.

## Movimento

GSAP com ScrollTrigger e MotionPathPlugin. Entrada com fotografia, texto, desenho SVG e crachá em tempos diferentes. Onda morfada por rolagem. Linha curva progressiva. Capítulos com painel sticky apenas no desktop, transição por escala e profundidade. Demonstração em timeline de cerca de cinco segundos, pausada fora da tela e com aba oculta. Parallax discreto no dispositivo. Galerias com mouse, toque e teclado. Sem captura da rolagem nativa.

## Materialidade e acessibilidade

O crachá usa materialidade pontual, conforme as notas de Skeuomorphism e Spatial UI do Personal Vault. Conteúdo principal permanece no DOM, visível sem animações. Movimento reduzido usa resultado estático e elimina deslocamentos. Diálogos nativos contêm foco e fecham com Escape. Links de âncora consideram a barra fixa. Os controles e campos têm foco visível e rótulos. O formulário prepara um e-mail e não informa envio sem comprovação.

## Imagens e autoria

Foto pessoal fornecida localmente. Fotografia de Recife de Mia Silva, via Unsplash, com crédito no rodapé. Capturas reais do Roomi Maker e da Better Way. Projetos sem interface gráfica recebem diagramas explicitamente identificados como representações. Forks são identificados e creditados às fontes originais.
