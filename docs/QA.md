# Verificação de entrega

Data de referência: 27/10/2026.

## Correspondência com o briefing

| Parte | Implementação |
| --- | --- |
| 1. Abertura | Fotografia de Recife em tela cheia; composição específica para mobile; logo, apresentação, uma ação principal, desenho SVG, entrada do crachá, onda que muda com a rolagem. |
| 2. Navegação | Barra fixa de borda a borda, ativada ao sair da abertura; menu acessível no mobile, CTA persistente e âncoras com compensação de altura. |
| 3. Percurso | Três pontos sobre curva progressiva, controles de tabulação com setas, painel de detalhes e links. Acervo com 11 projetos públicos e filtros por contexto. |
| 4. Capítulos | Quatro capítulos verticais; painel sticky no desktop, transições de escala e profundidade, navegação entre capítulos e ampliação em diálogo nativo. Em tablet e mobile, cada capítulo tem seu visual após o texto. |
| 5. Demonstração | Timeline de 4,4 s + 0,6 s de intervalo, cápsula sobre curva, confirmação e nova linha de resultado, três progressos sequenciais, pausa e repetição. Pausa por IntersectionObserver fora da tela e por visibilitychange com aba oculta. Percurso vertical no celular. |
| 6. Como começar | Três passos numerados, com símbolos e conexão horizontal; disposição vertical no celular. |
| 7. Destaque | Faixa azul em largura total sobre qualidade e testes, com símbolo, descrição e link para currículo. |
| 8. Encerramento | Duas colunas, convite, ação e um mockup de dispositivo com visual da Better Way e forma orgânica em parallax discreto. |
| 9. Perguntas | Respostas sempre visíveis, faixas de cores, temas e etiquetas. Galeria com três visuais abre por hover no desktop ou clique/teclado; no mobile é horizontal, com o próximo item aparente. |
| 10. Contato | Duas colunas, rótulos, seletor estilizado, foco, validação, preparação da mensagem e rodapé com navegação. |

## Validação

- Build de produção com Vite concluído. Saída estática de aproximadamente 1,3 MB, com JS de cerca de 140,5 kB gzip.
- `npm run check`: 11 repositórios únicos, quatro capítulos, arquivos de imagem, fontes, currículo e âncoras presentes.
- Revisão visual no navegador em desktop (viewport padrão e 1440 × 900), tablet (768 × 1024) e mobile (390 × 844). Sem rolagem horizontal de página ou imagens quebradas nas áreas inspecionadas.
- Crachá: frente/verso e informações acessíveis verificados.
- Percurso: seleção por clique e troca com teclas de seta verificada. Acervo atualiza o filtro.
- Diálogo: ampliação, Escape e retorno de foco ao acionador verificados. O diálogo nativo torna o restante da página inerte enquanto está aberto.
- Menu móvel: abrir, selecionar seção e fechar verificados.
- Formulário: envio vazio marca quatro campos e leva foco ao primeiro; preenchimento válido cria o link mailto com assunto e corpo codificados. Nenhuma mensagem foi enviada durante os testes.
- Movimento reduzido: respeita `prefers-reduced-motion`; a mesma lógica pode ser exercitada pela versão `?motion=reduce`, também acessível pelo rodapé. Resultado completo estático, cápsula ausente, controles automáticos ausentes e rolagem sem suavização verificados nessa versão.
- Contraste calculado a partir dos tokens OKLCH: texto principal em branco 15,6:1; texto secundário em branco 6,73:1; texto secundário em fundos escuros 7,61:1 ou mais; texto escuro sobre coral 8,38:1; sobre azul 10,67:1; sobre verde 9,85:1; placeholder nos campos 7,09:1.
- Avaliação de layout e detector realizados em dois agentes isolados, conforme a skill. Detector final: nenhum achado. A revisão corrigiu os gutters da navegação, a posição do CTA na faixa secundária e a sequência dos capítulos no tablet. Espaçamentos de seção usam tokens fluidos; deslocamentos gráficos do crachá, curvas e dispositivo são decisões específicas da composição.

## Limites explícitos

O formulário usa o aplicativo de e-mail do visitante, sem serviço de entrega ou armazenamento no servidor. A publicação pelo Sites começa privada. O repositório Artigo-Hardware é um registro de tema sem arquivos publicados; não é apresentado como software implementado. Os visuais que não são capturas reais estão identificados como representações. A classificação por contexto foi feita a partir do currículo, documentação e natureza dos trabalhos. Os três forks são separados da contagem autoral e creditados às fontes.

Não foi realizado um benchmark de FPS em aparelho físico nem emulação de aba oculta no ambiente de inspeção; a pausa por visibilidade foi revisada no código. Capturas de inspeção são mantidas localmente na pasta ignorada `.qa/`.
