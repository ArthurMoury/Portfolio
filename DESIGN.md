# Direção visual · Arthur Moury

## Revisão de 28/10/2026
Referência explícita: Refokus, incluindo a imagem enviada pelo titular. A página é uma apresentação de Arthur para pessoas interessadas em seus projetos, experiência e uma conversa. A identidade deve ser escura em todo o percurso, com conteúdo real e movimento espacial.

## Sistema
Paleta: carvão #101112, superfície #191b1c, painel #232527, linhas #45484b, prata #c9cccf e texto #f1f1ef. Tokens em OKLCH, cor presente nas imagens reais e nas expansões dos projetos, derivada de cada identidade. Manter Sora nos títulos e Hanken Grotesk no corpo. Títulos até 6rem; tracking mínimo -0.04em. Sem etiquetas decorativas repetidas.

## Composição
Abertura de uma tela → informações pessoais e contato → “Cada ideia, um mundo para explorar” e sete projetos → trajetória em quatro capítulos → carrossel de certificados → processo → currículo → contato.

## Assinatura
Uma fita metálica tridimensional, modelada em Three.js, se desdobra na entrada. A abertura contém apenas a escultura. O retrato do GitHub surge depois, na apresentação pessoal: título à esquerda, fotografia ao centro e texto com contato à direita. A máscara revela a foto na entrada dessa seção e a apaga na saída, acompanhando a rolagem. Texto visível por padrão, sem tela de carregamento que bloqueie a página. Indicador de rolagem com planos em cascata conduz para baixo; sem desenho de mouse.

## Movimento e interação
Three.js para a entrada espacial, Motion para escala e gestos dos certificados, GSAP/ScrollTrigger para texto, fotografia e capítulos. Sem capturar a rolagem. Interromper renderização fora da tela e em aba oculta. Preferência por movimento reduzido mostra uma composição estática completa. Foto aparece somente na seção de apresentação pessoal.

Projetos abrem ao entrar no campo de leitura, também por hover e clique. As revelações por rolagem persistem para não recolher conteúdo acima da posição de leitura. O botão permite recolher e reabrir cada faixa. Verde sálvia para Cortech, violeta para FreeSB, verde profundo para Betterway, terracota para as ferramentas Roomi e verde agrícola para Sollie, sempre sobre superfícies escuras.

Carrossel contínuo: o mouse não pausa o trilho, mas expande o certificado com transform; clique amplia em diálogo. Botão explícito para pausar, foco por teclado estável, arraste horizontal no toque e alternativa estática com movimento reduzido. Usar os 29 documentos reais da pasta fornecida. CPF omitido das cópias visuais que o contêm, originais preservados no Drive.

## Conteúdo
Somente Cortech, FreeSB, Betterway, Roomi Reservas, Roomi Builder e Sollie. Botões GitHub e Acessar separados. Nenhuma alteração de acesso a repositórios. Email mourygodoy@gmail.com; sem idade nem endereço residencial.

## Revisão desktop final
Priorizar desktop e validação na Vercel. Escultura interativa sem replay; horizonte animado em largura total; retrato profissional enviado pelo usuário e avatar na navegação. Todos os elementos da apresentação revelam-se ao rolar. Cabeçalho dos projetos em superfície distinta; somente uma faixa aberta por vez; imagem + descrição técnica + stack, sem slogans ou painéis decorativos. Sete projetos acessíveis, incluindo Dozão. Card0 somente na trajetória acadêmica, sem deploy. Imagens da trajetória fornecidas pelo autor, incluindo wallpaper Roomi. Carrossel sem contador, setas ou botão de pausa; link do Drive no topo. Faixa da demonstração: Da integração à entrega.

## Revisão desktop — 29 de outubro de 2026
A entrada usa duas superfícies curvas que se abrem e uma escultura Three.js que reage ao cursor e muda de forma com clique/Enter. O tamanho do renderer usa as dimensões de layout, sem incorporar a escala temporária da animação. A passagem para a apresentação não tem linha de separação. O retrato entra por máscara lateral, permanece legível e sai pela outra lateral com a rolagem. Uma superfície curva faz a transição para o título dos projetos.

Roomi Reservas e Builder usam capturas atuais de suas aberturas. A trajetória conserva os quatro capítulos e a ampliação das imagens, sem botões de repositório, etiquetas de origem ou legendas sobrepostas.

A antiga demonstração genérica foi substituída por quatro perspectivas do trabalho interno: prompts/LLMs, automação de reservas, dashboard/copiloto e evolução em produção. As métricas exibidas são seis etapas, sete verificações de regressão e horizonte de previsão de 90 dias. Não publicar economia de horas: o titular ainda vai fornecer a medição. O exemplo de prompt é uma adaptação sem dados reais de clientes.

## Refinamento acadêmico e sequências automáticas — 29/10/2026
A trajetória inclui Gaita Hero e Echo (2025), com capturas reais e links para os Google Sites do grupo. Os demais capítulos continuam sem links de repositório. Os nomes de apresentação são Site de reservas e Site Construtor de Hotéis. Cortech conserva apenas o acesso ao código na galeria.

Certificados em dois fluxos de sentidos opostos, sem repetição de documentos entre os grupos: IA/nuvem/experiências e programação/dados. O título alterna frases de aprendizado contínuo. Hover amplia sem pausar; o diálogo, foco por teclado, aba oculta e movimento reduzido continuam respeitados.

Da integração à entrega avança automaticamente com apagamento e surgimento, sem deslocamento lateral. O prompt tem papel, entradas, método, restrições, formato e revisão. As automações destacam extração, arquivos, status, processos manuais, cálculos e integrações. O espaço antes do currículo foi reduzido.
