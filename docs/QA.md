# Validação da revisão · 27/10/2026

## Mudanças verificadas

- Abertura sem cidade, monograma, localização no topo, crachá, código de barras ou texto de continuação. Retrato em uma única ocorrência na página.
- Sobre mim anterior aos projetos, com informações visíveis, contatos e currículo.
- Indicador de contexto acompanha automaticamente os marcos da página e transforma sua pequena forma geométrica. Categorias e filtros manuais removidos.
- Trajetória em três capítulos; imagens trocam com a rolagem em desktop e ficam junto de cada texto nas telas menores.
- Lista exata: Cortech, FreeSB, Betterway, Roomi Reservas, Roomi Builder, Sollie. Faixas expansíveis substituem perguntas/acervo duplicado.
- Cada faixa tem dois links distintos: GitHub e deploy. Os quatro repositórios privados são identificados. Nenhuma permissão foi modificada.
- E-mail de contato e destino do formulário: mourygodoy@gmail.com. Assunto “Outro motivo” disponível.

## Verificação funcional

- `npm run check`: seleção, ordem, URLs distintas, privacidade identificada, imagens/fontes/CV presentes, e-mail atualizado, retrato só no hero e ausência dos elementos antigos.
- Build de produção com Vite.
- Navegação por âncoras com compensação da barra, incluindo carregamento direto com hash.
- Expansão por clique/Enter, troca de projeto, diálogo de imagem, Escape, retorno de foco e contenção de Tab.
- Menu móvel abre, fecha com Escape e fecha após selecionar seção.
- Galeria horizontal móvel desloca o conteúdo e deixa o próximo item parcialmente visível.
- Formulário vazio foca o primeiro campo inválido. Valores válidos geram mailto para o novo Gmail. Nenhuma mensagem enviada nos testes.
- Alternativa de movimento reduzido: scroll automático, resultado completo estático, cápsula e controle de pausa ausentes.
- Demo mantém timeline, pausa, repetição, IntersectionObserver e escuta de visibilitychange. A lógica de pausa em aba oculta foi revisada; não foi emulada uma aba oculta por ferramenta.

## Verificação visual

Browser: desktop 1280×720, tablet 768×1024 e celular 390×844. Sem overflow horizontal da página. Galerias têm rolagem horizontal intencional. Corrigida altura intrínseca de imagens da trajetória no tablet. Inspeção de imagens carregadas e logs do navegador.

Contraste mínimo dos pares de texto medidos: 5,13:1; texto principal/prata 13,20:1; placeholder/campo 7,92:1. Respeito a `prefers-reduced-motion` e alternativa manual equivalente em `?motion=reduce`.

Os seis deploys retornaram HTTP 200 em 27/10/2026. As páginas públicas de Cortech, FreeSB, Roomi Reservas e Sollie foram inspecionadas para as capturas. Não foram testados login, transações nem fluxos internos das ferramentas externas. Isso não faz parte da revisão do portfólio.

## Limitações concretas

A foto foi substituída pela imagem do perfil ArthurMoury no GitHub, conforme pedido em 28/10/2026; mantém uma única ocorrência na abertura. O currículo é o PDF original. Repositórios privados exigem acesso concedido pelo próprio GitHub. O contato é um preparador de e-mail, não um serviço de envio. Não houve medição de FPS em dispositivo físico.

## Revisão dark e certificados · 28/10/2026

- `npm run check`: seleção exata dos seis projetos, ordem informações → projetos → trajetória, 29 certificados distintos, arquivos presentes, contato correto, retrato único e ausência dos textos removidos.
- Build Vite concluído. Three.js em chunk separado carregado após o conteúdo inicial. Aviso de tamanho de chunk para bibliotecas de animação/3D; sem falha de compilação.
- Desktop 1280×720, tablet 768×1024 e mobile 390×844: ausência de overflow horizontal. Ajustes de câmera para proporções estreitas, título do carrossel e enquadramento do retrato.
- Canvas Three.js carregou; a foto foi observada com opacidade 1 durante a entrada e opacidade 0 no encerramento. Hero mobile medido com 844px, igual à altura da janela.
- Hover em certificado: escala 1,09 e deslocamento vertical de -12px, enquanto o trilho continuou de -5052,47px para -5277,09px. Não pausa ao passar o mouse.
- Pausa explícita manteve o deslocamento em -5544,73px entre observações. Menu mobile abre, navega para certificados e fecha.
- Clique abre certificado legível. Shift+Tab permanece no diálogo, Escape fecha e devolve o foco ao certificado.
- `?motion=reduce`: 29 botões únicos, sem clone, sem canvas Three.js, sem botão de autoplay, galeria com rolagem horizontal nativa e sem overflow da página.
- Todos os PDFs renderizados; folha de contato revisada. Pré-incubação e PyLab tiveram CPF removido nas cópias de apresentação, com leitura e inspeção visual posteriores. Originais do Drive intactos.
- Arraste usa Pointer Events para mouse/toque; teste automatizado não emula hardware de toque real. Suspensão por visibilidade revisada no código.

## Publicação Vercel

Projeto `arthur-moury-portfolio` criado no escopo existente `amfgs-5506s-projects`. Integração GitHub → Vercel recusou conexão ao repositório por falta de acesso da integração; publicação feita via CLI autenticada. Não houve concessão de permissões adicionais ao GitHub.

Contraste da revisão dark: texto/carvão 16,66:1; texto secundário/painel 6,94:1; placeholder/campo 6,64:1. Pacote Vercel inspecionado antes do envio: `.env.local`, `.research`, `.qa`, `.git`, `.openai` e `.vercel` excluídos.

## Revisão final: abertura, apresentação e expansão · 28/10/2026

- A abertura não contém imagem de perfil; a fotografia aparece uma única vez em `#sobre`, junto do texto e dos contatos. Opacidade 1 no centro da seção e redução observada na saída. Movimento reduzido mantém o retrato visível e não cria canvas WebGL.
- Desktop 1280×720: composição em três colunas. Tablet 768×1024: título acima de retrato e texto. Mobile 390×844: sequência vertical. Sem overflow horizontal nas três larguras.
- Faixas revelam suas cores de identidade pela rolagem. PageDown com ponteiro na navegação abriu os próximos projetos; clique recolheu e Enter reabriu. Hover reabriu uma faixa previamente recolhida. As revelações permanecem para evitar recolhimento automático acima da leitura.
- Corrigido deslocamento das âncoras durante expansões: preparar as linhas anteriores sem transição antes do cálculo nativo do destino; atualizar ScrollTrigger fora da rolagem ativa. Teste partindo de zero faixas abertas: trajetória terminou a 128px do topo, respeitando a navegação. Mobile também terminou a 128px, com menu fechado.
- Painel da trajetória mostrou CESAR ao entrar no primeiro capítulo e Roomi Builder no capítulo Roomi, ambos sincronizados ao texto. Quatro capítulos conectam formação, Boop, Roomi e projetos autorais; provas vêm do currículo e dos certificados fornecidos.
- Hover expandiu Cortech depois de recolhimento manual. Console sem avisos ou erros durante a verificação.
- A publicação pública inicial da Vercel respondeu HTTP 200 sem autenticação. A versão final é republicada no mesmo projeto.

## Revisão desktop publicada · nova seleção e imagens

- Escopo desta revisão: desktop na Vercel, 1280×720. Não foram feitos novos testes de mobile.
- Publicação respondeu sem autenticação. Canvas 3D carregou, com duas formas visivelmente diferentes após mover o ponteiro. Zero botões de replay na abertura; horizonte atravessa a base da tela.
- Retrato profissional e avatar corretos; dez elementos da apresentação com revelação por rolagem; sem overflow horizontal.
- PageDown avançou de Cortech para FreeSB: Cortech fechou e somente FreeSB permaneceu aberto. Painéis decorativos e slogan superior removidos; stack ao lado da captura e ações à direita.
- Âncora da trajetória terminou a 128px do topo. Card0 somente na formação acadêmica, com imagem, stack e GitHub da equipe. Seu deploy anterior retornou 404 e foi retirado conforme orientação do titular. Dozão respondeu HTTP 200; não há repositório publicado identificado.
- Wallpaper Roomi e imagens Boop/CESAR/Sollie substituem os visuais anteriores. Conteúdo essencial preservado com movimento reduzido.
- Perfil ArthurMoury recebe README com destaque visual e link do portfólio; a credencial atual não possui escopo para alterar os campos globais de perfil, portanto esses campos foram preservados. Homepage do repositório Portfolio aponta para a Vercel.

## Revisão de 29/10/2026 — desktop na Vercel
- Build de produção e verificação de conteúdo aprovados.
- 1280 × 720: sem overflow horizontal; abertura curva termina e libera conteúdo; canvas ocupa a dimensão real do palco após o GSAP.
- Escultura muda de forma por clique e Enter; pointer tracking mantém a resposta do material/rotação.
- Retrato totalmente revelado ao chegar à apresentação e recolhido lateralmente ao sair. Borda superior da apresentação: 0px.
- Transição curva entre apresentação e projetos verificada na rolagem.
- Roomi Reservas abre com a nova capa; PageDown abre Builder e fecha Reservas (um único projeto expandido).
- Hash direto e navegação para seções distantes preservam o destino, sem a expansão intermediária interromper a rolagem.
- Seção Na prática: copiar prompt confirmado; ArrowRight/Home/End trocam as abas; as quatro perspectivas têm conteúdo próprio.
- Texto antigo da demonstração e etiquetas/links da trajetória ausentes da página.
- Economia de horas deliberadamente não quantificada até o titular fornecer a medição.
- Mobile não foi revalidado nesta rodada, conforme escopo solicitado.

## Projetos acadêmicos e revisão geral — 29/10/2026

Escopo: desktop, 1280 × 720, na Vercel. Esta seção substitui os testes antigos de abas manuais: Na prática agora avança automaticamente, com apagamento/entrada e pausa durante foco por teclado.

- Echo e Gaita Hero confirmados nos Google Sites dos respectivos grupos; capturas públicas reais, stack e atuação descritas a partir da documentação e dos repositórios. O endereço antigo do app Echo está indisponível; o link utilizado é a documentação publicada.
- Cortech não tem botão de deploy; os outros seis acessos permanecem. Nomes atualizados para Site de reservas e Site Construtor de Hotéis, inclusive no texto da experiência.
- Dois trilhos de certificados: 12 em IA/nuvem/experiências e 17 em programação/dados. Sem documentos compartilhados entre as listas; os clones visuais não entram na navegação acessível. Ampliação e Escape verificados.
- Conteúdo essencial, sete projetos, 29 certificados e ordem das seções validados pelo script de conteúdo. Build aprovado. Nenhuma imagem quebrada ou overflow horizontal na sessão de inspeção.
- Referências comparadas: https://brittanychiang.com/ (clareza da atuação, tecnologias e acessibilidade), https://bruno-simon.com/ (interação 3D com resposta e propósito) e Refokus, referência do titular. A apresentação própria e a rolagem nativa foram preservadas.
- Achados corrigidos: identificação da seção atual na navegação; rótulos das fileiras desalinhados devido ao limite global de largura de parágrafo; texto do prompt pequeno e troca precoce; nomes antigos no texto profissional; imagem ampliada sem texto alternativo quando a legenda era vazia.
- Prompt com maior tempo de leitura (42 s), demais perspectivas com 13 s. Leitura com foco por teclado e pausa explícita suspendem o avanço. Não há necessidade de clicar para trocar.
- Antes do currículo: removida altura mínima ociosa; margem inferior da seção anterior reduzida. Nenhuma estimativa de horas economizadas foi inventada.
- Limites: mobile não revalidado nesta rodada; o módulo Three.js continua acima de 500 kB antes de compressão, carregado dinamicamente. Formulário prepara um e-mail, não faz envio em servidor.

## Mobile — 31/10/2026
- Validação por viewport no navegador: 320×667, 390×844, 430×932, 844×390 (horizontal), 768×1024 (tablet) e regressão desktop 1280×720. Sem overflow horizontal da página nos tamanhos inspecionados.
- Corrigida cascata desktop que mantinha duas colunas e margens negativas nas expansões mobile. Na largura de 390 px, a captura do Construtor de Hotéis passou a ocupar 350 px; descrição e stack aparecem abaixo. Apenas uma faixa fica expandida.
- Three.js preservado: canvas presente no mobile, mudança de forma por clique/teclado e evento click compatível com toque. Distância da câmera móvel inclui margem para as deformações. GSAP de entrada, nome, máscara do retrato, superfície de transição e revelações continuam ativos.
- Trajetória mobile com uma imagem por capítulo e GSAP de entrada com perspectiva, escala e parallax por rolagem. Matrizes de escala/posição e opacidade observadas durante a entrada; imagens ampliáveis. Desktop conserva painel fixo e troca entre capítulos.
- Menu abre/fecha, contém Tab/Shift+Tab, fecha por Escape, restaura foco e bloqueia interação/rolagem do conteúdo enquanto aberto. CTA compacto nas telas menores; safe areas e viewport-fit configurados.
- Dois trilhos de certificados preservados, captions maiores e feedback Motion ao toque. Certificado Claude Code 101 abre no diálogo correto e Escape fecha/restaura foco. Prefers-reduced-motion mantém 29 documentos únicos e nenhum canvas.
- Na prática adapta indicadores a duas colunas; o prompt inteiro fica disponível em área vertical de leitura. Alternativa reduzida troca os quatro conteúdos por botões, sem rótulos duplicados.
- Formulário: erros obrigatórios, preparo de rascunho e destino de e-mail corretos; campos usam fonte de 16 px no celular. Nenhum e-mail foi enviado.
- Build e verificação de conteúdo aprovados. Testes em emulação de viewport, sem acesso a aparelhos iOS/Android físicos nem medição de desempenho neles; gestos touch revisados pelo código de Pointer Events, não por hardware de toque.

## Movimento e continuidade — 31/10/2026
- Mobile 390×844: saudação, nome e descrição centralizados; CTA da abertura sem caixa visível. Three.js preservado.
- A transição de Reservas para Construtor foi inspecionada pela rolagem nativa: durante a troca, o painel de saída tinha 224 px e o de entrada 254 px. Ao terminar, somente Construtor permaneceu com 695,98 px e seu cabeçalho ficou em 390,64 px, preservando a posição de leitura. Hover suspenso durante rolagem e transição para evitar seleção acidental de faixas movidas sob o ponteiro.
- Trajetória mobile: palco passou de sua posição inicial (288,83 px) para sticky a 108 px; a imagem mudou de Card0 para Gaita Hero durante a rolagem. Sem imagens duplicadas abaixo dos capítulos. Desktop conserva palco lateral.
- Da integração à entrega não usa mais setInterval nem troca de textos por tempo. O progresso da rolagem moveu a cápsula para (300,26; 103,95), desenhou a conexão e ativou Automações em progresso 0,288879. A reprodução explícita percorreu a timeline e terminou em 1; pausa manteve o mesmo progresso mesmo com rolagem adicional.
- Pause e Play presentes em mobile e desktop. Em preferência de movimento reduzido, ambos ficam desativados e os quatro botões de etapa mantêm o conteúdo acessível.
- Tela 320×667: painel terminou em 649,63 px, dentro da área visível, sem overflow horizontal. Desktop 1280×720: painel terminou em 638,28 px. Prompt integral abriu em diálogo com os seis campos e Escape/foco corretos.
- Glifo de seta retirado do link do Drive; ícones vetoriais funcionais mantidos. Nenhum emoji textual nas interfaces alteradas.
- Verificações por navegador/emulação de viewport; desempenho em hardware iOS/Android físico não medido.

## Prompt de exemplo — 02/11/2026
A etapa Prompts & LLMs mostra um prompt escrito, em lugar das três etiquetas ilustrativas. Cenário fictício de pedidos de uma loja: contexto, objetivo, perguntas que mudam a recomendação, riscos, suposições, comparação e teste inicial. O mesmo conteúdo alimenta o painel, o diálogo e a ação de copiar. Linguagem direta, sem XML, variáveis ou atribuição do exemplo a um projeto real do titular. Conteúdo verificado e build aprovado.

## Trajetória alternada em partículas — 09/11/2026
- Seis capítulos verificados no Chrome em 900×700, 1024×768, 1280×720, 1440×900 e 1920×1080, incluindo texto em inglês no menor desktop. Textos e imagens alternam de lado, sem sobreposição nos momentos de leitura nem overflow horizontal.
- Cinco transições e retorno pela rolagem: partículas de imagem e de texto têm trajetórias independentes. Ao parar a rolagem, a composição permanece na mesma fase. HTML legível e logos dos clientes preservados nas pausas.
- Links dos Google Sites recebem cliques e foco. Setas avançam para o capítulo seguinte e transferem o foco à imagem; Enter abre a ampliação, Escape fecha. Controles invisíveis ficam fora da interação.
- Mobile 390×844 conserva seis imagens estáticas por capítulo. Sem WebGL, com movimento reduzido e em desktop com pouca altura, o conteúdo continua no fluxo original e o módulo de partículas não é carregado.
- Redimensionamento desktop/mobile/desktop, perda e restauração do contexto WebGL verificados, sem erros de JavaScript. Verificação por navegador e emulação de viewport; não representa medição em aparelhos físicos.

## Transição para certificados — 09/11/2026
Borda superior removida e continuidade visual inspecionada em 1440×900 e 390×844. O campo difuso atravessa a junção sem recorte horizontal e acompanha a rolagem; no desktop, a cena anterior desaparece gradualmente e retorna ao rolar para trás. Movimento reduzido mantém o fundo estático. Sem overflow horizontal ou erros de JavaScript; ampliação de certificados por teclado e Escape preservadas. Conteúdo e build aprovados.
