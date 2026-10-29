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
