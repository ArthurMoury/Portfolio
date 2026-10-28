# Direção visual · Arthur Moury

## Conceito
Uma pessoa em primeiro plano; ao redor, uma geometria que muda com o percurso. A assinatura é um conjunto de órbitas SVG que envolve o retrato somente na abertura. Referência de linguagem: movimento espacial e transições de portfólios de estúdio como Refokus, com os princípios de hierarquia e coreografia consultados no Personal Vault.

## Paleta
Azul noturno, cobalto, prata, azul gelo e ardósia. Valores de referência: #111824, #304ce0, #e3e6ec, #b7caff e #26374d. Implementação em OKLCH em `src/global.css`; imagens dos projetos preservam suas próprias marcas. As superfícies claras são prata, não branco dominante. Os azuis saturados aparecem nas faixas de projetos e na demonstração, com texto de alto contraste.

## Tipografia
Sora para títulos e Hanken Grotesk para texto, preservando as famílias locais existentes. Títulos no máximo 6rem, espaçamento entre letras não inferior a -0.04em. Hierarquia por escala e espaço, sem etiquetas decorativas repetidas ou monograma na abertura.

## Composição
Abertura de uma tela → sobre mim e contatos → três momentos de carreira → seis projetos expansíveis → demonstração de processo → currículo → contato e rodapé. O acervo e as perguntas foram consolidados na seleção pedida, evitando duplicação de projetos.

## Movimento
Entrada coordenada do texto, do retrato e das órbitas em GSAP; órbitas continuam respondendo à rolagem nativa. Indicador inferior sem texto, com dois ciclos curtos. Barra persistente após a abertura, com forma, verbo e contexto que mudam automaticamente conforme os marcos da página. Imagens da carreira sincronizadas com ScrollTrigger, sticky a partir de 900px. Nos tamanhos menores, as imagens pertencem aos próprios capítulos.

Projetos abrem por mouse, clique ou teclado, com opção de fixar a expansão por clique. Escape recolhe e mantém foco. Galeria horizontal em mobile/tablet, com parte do próximo item à vista. Demonstração de aproximadamente cinco segundos com pausa, repetição e suspensão por visibilidade. Movimento reduzido usa estados completos e sem deslocamentos.

## Fontes visuais
Retrato público do perfil ArthurMoury no GitHub, escolhido pelo titular em 28/10/2026, usado em sua cor original. Capturas das páginas públicas de Cortech, FreeSB, Roomi Reservas e Sollie; capturas existentes de Betterway e Roomi Builder. Diagramas de formação e automação identificados como representações. Nenhuma imagem de conta autenticada ou dado de paciente é utilizada. Ícone GitHub do Simple Icons, CC0; fontes locais sob OFL.

## Contraste
Pares de texto principais calculados: texto/prata 13,20:1; secundário/prata 6,50:1; secundário/azul gelo 5,13:1; texto claro/cobalto 6,54:1; secundário/cobalto 5,15:1; placeholder/campo 7,92:1.
