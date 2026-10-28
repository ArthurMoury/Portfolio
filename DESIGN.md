# Direção visual · Arthur Moury

## Revisão de 28/10/2026
Referência explícita: Refokus, incluindo a imagem enviada pelo titular. A página é uma apresentação de Arthur para pessoas interessadas em seus projetos, experiência e uma conversa. A identidade deve ser escura em todo o percurso, com conteúdo real e movimento espacial.

## Sistema
Paleta: carvão #101112, superfície #191b1c, painel #232527, linhas #45484b, prata #c9cccf e texto #f1f1ef. Tokens em OKLCH, cor presente nas imagens reais e nas expansões dos projetos, derivada de cada identidade. Manter Sora nos títulos e Hanken Grotesk no corpo. Títulos até 6rem; tracking mínimo -0.04em. Sem etiquetas decorativas repetidas.

## Composição
Abertura de uma tela → informações pessoais e contato → “Cada ideia, um mundo para explorar” e seis projetos → trajetória em quatro capítulos → carrossel de certificados → processo → currículo → contato.

## Assinatura
Uma fita metálica tridimensional, modelada em Three.js, se desdobra na entrada. A abertura contém apenas a escultura. O retrato do GitHub surge depois, na apresentação pessoal: título à esquerda, fotografia ao centro e texto com contato à direita. A máscara revela a foto na entrada dessa seção e a apaga na saída, acompanhando a rolagem. Texto visível por padrão, sem tela de carregamento que bloqueie a página. Indicador de rolagem com planos em cascata conduz para baixo; sem desenho de mouse.

## Movimento e interação
Three.js para a entrada espacial, Motion para escala e gestos dos certificados, GSAP/ScrollTrigger para texto, fotografia e capítulos. Sem capturar a rolagem. Interromper renderização fora da tela e em aba oculta. Preferência por movimento reduzido mostra uma composição estática completa. Foto aparece somente na seção de apresentação pessoal.

Projetos abrem ao entrar no campo de leitura, também por hover e clique. As revelações por rolagem persistem para não recolher conteúdo acima da posição de leitura. O botão permite recolher e reabrir cada faixa. Verde sálvia para Cortech, violeta para FreeSB, verde profundo para Betterway, terracota para as ferramentas Roomi e verde agrícola para Sollie, sempre sobre superfícies escuras.

Carrossel contínuo: o mouse não pausa o trilho, mas expande o certificado com transform; clique amplia em diálogo. Botão explícito para pausar, foco por teclado estável, arraste horizontal no toque e alternativa estática com movimento reduzido. Usar os 29 documentos reais da pasta fornecida. CPF omitido das cópias visuais que o contêm, originais preservados no Drive.

## Conteúdo
Somente Cortech, FreeSB, Betterway, Roomi Reservas, Roomi Builder e Sollie. Botões GitHub e Acessar separados. Nenhuma alteração de acesso a repositórios. Email mourygodoy@gmail.com; sem idade nem endereço residencial.
