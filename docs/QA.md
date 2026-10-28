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
