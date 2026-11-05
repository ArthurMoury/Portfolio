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

## Adaptação mobile — 31/10/2026
Preservar carvão/prata, Sora/Hanken e o mesmo percurso, conteúdo e bibliotecas de movimento do desktop. Abertura em uma tela com nome acima da escultura 3D centralizada; toque ou Enter muda sua forma, sem impedir a rolagem vertical. Na horizontal, o layout volta a duas colunas.

A apresentação empilha título, retrato com máscara GSAP, texto e contatos. Projetos passam a uma coluna: título, ações à direita, captura em largura útil e stack legível abaixo. Mantém uma expansão por vez, por rolagem e toque. A trajetória organiza cada capítulo seguido de sua própria imagem, com entrada em profundidade e parallax GSAP; o painel fixo e suas trocas permanecem no desktop.

Menu com foco contido e bloqueio da página enquanto aberto; CTA sempre acessível. Safe areas respeitadas. Certificados continuam em dois fluxos opostos, com resposta ao toque e diálogo. A apresentação automática de IA permanece; o prompt tem uma área de leitura vertical no mobile para manter o texto inteiro disponível sem alongar excessivamente a seção.

## Revisão de movimento — 31/10/2026
A abertura mobile centraliza saudação, nome e descrição, e retira Conheça meu universo. O link do Drive usa somente texto, sem o glifo de seta. Ícones funcionais vetoriais, como GitHub e controles de reprodução, permanecem.

Projetos abrem e fecham em uma timeline GSAP compartilhada (entrada 560 ms, saída 440 ms). Compensar somente a variação de altura dos painéis anteriores ao cabeçalho em leitura, sem capturar wheel/touch. Recalcular ScrollTrigger ao terminar a troca; âncoras e movimento reduzido usam o estado final imediato.

No mobile, a trajetória agora mantém o palco de imagens fixo abaixo da navegação, com troca por capítulo, máscara e profundidade GSAP. Na horizontal, divide o espaço entre texto e imagem. Esta direção substitui a decisão anterior de imagens estáticas abaixo de cada capítulo.

Da integração à entrega torna-se uma cena conduzida pela rolagem: um circuito desenha conexões, transporta uma cápsula e constrói barras, verificações e horizonte de previsão. Pause congela a cena; Play reproduz a timeline de forma contínua. Sem intervalos para trocar textos. Os detalhes e o prompt integral abrem em diálogo; preferência por movimento reduzido mantém navegação manual e texto acessível.

## Prompt visível — 02/11/2026
O painel Prompts & LLMs exibe o texto de um exemplo completo, com leitura vertical dentro da cena. Os quatro blocos usam linguagem de uma conversa de trabalho: Contexto, O que preciso, Cuidados e Como responder. A ampliação e a cópia usam esse mesmo texto. O cenário é identificado como fictício.

## Leitura mais curta e movimento contínuo — 04/11/2026
Na seção de trabalho, retirar as superfícies azuladas, cobre e verde em favor de carvão #101112, painéis #191b1e, prata #c9cccf e texto #f1f1ef. Cada tema se reconhece pela composição: trecho de prompt, fluxos conectados, contexto compartilhado e etapas de evolução. Prompt integral sob demanda, sem bloco extenso na leitura principal. A chegada dos certificados abre cinco faixas em sentidos alternados. Apresentação com sequência espaçada; trajetória com revelação por máscara e profundidade, texto em cascata e linha de progresso. Projetos centralizados na área livre abaixo da navegação, inclusive no hover. Seletor de assunto em camada própria, com foco no campo, setas, Enter, Escape, busca por digitação e seleção por toque.

## Coreografias distintas — 05/11/2026
Manter as seis faixas e a composição tipográfica da abertura, assim como a transição aprovada para “O trabalho por dentro”. Não repetir faixas nos projetos ou na trajetória.

Referências: Blur Text e Scroll Reveal do React Bits para foco e leitura progressiva; useAnimate e stagger do Motion para montagem lateral. Implementação com Motion nos detalhes dos projetos e GSAP/ScrollTrigger na trajetória. Título dos projetos converge horizontalmente; descrição começa pelo centro e se acomoda sem máscara; rótulos e stack chegam de lados diferentes. Trajetória: título resolve o desfoque, palavras dos capítulos giram delicadamente sobre o próprio eixo, parágrafos ganham contraste conforme são lidos. Manter paleta, imagens, expansão suave e centralização já existentes.

## Português e inglês — 05/11/2026
Controle segmentado discreto no canto superior da abertura, integrado ao carvão e prata. PT/EN têm estado selecionado, foco de teclado e nomes acessíveis completos. No mobile, reservar espaço acima da saudação centralizada. Tradução editorial completa, inclusive no prompt e mensagens de interação. A preferência persiste entre visitas; URLs com parâmetro de idioma permitem compartilhar cada versão.
