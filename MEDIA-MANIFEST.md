# Le Grand Amour — inventário de mídia

Nenhum vídeo ou fotografia oficial da coleção existe hoje. A apresentação da
parceria (Flor de Maria × Patrícia Marchi) lista a diária de estúdio como um
item em **"Próximos passos"** — ou seja, a gravação ainda não aconteceu.

## Hero — segunda reconstrução (a primeira foi reprovada visualmente)

A primeira versão (commit `9732046`) foi reprovada em revisão visual: usava
`hero-bouquet.webp` (três rosas com caules expostos) como mídia principal —
não comunica buquê monumental, alta floricultura ou luxo silencioso —, a
primeira dobra ficava vazia durante boa parte da abertura, a transição
passou dos 2s previstos, e o botão "Pular abertura" ficava visível tempo
demais para uma animação tão curta. `components/hero/Hero.tsx` foi
reconstruído (não ajustado) mantendo a ideia de abertura automática
inspirada em
[Rapid Image Layers Animation](https://tympanus.net/Development/RapidLayersAnimation/)
([artigo](https://tympanus.net/codrops/2020/04/07/rapid-image-layers-animation/),
[código](https://github.com/codrops/RapidLayersAnimation/), MIT, Codrops) —
mesma ressalva de acesso ao código-fonte da rodada anterior: o artigo (texto
completo) descreve a técnica em prosa, o repositório do GitHub só retornou a
listagem de arquivos, o conteúdo de `src/*.js` não foi acessível. A
coreografia abaixo reinterpreta a descrição comportamental, não copia um
código-fonte inspecionado.

**Mudança de mídia principal** — `hero-bouquet` foi removido da composição
principal. A camada de "presença" (mão erguendo uma rosa vermelha,
`rose-lateral-light` / `hero-editorial-loop.mp4`) passou a ser o filme
principal do hero — direção visual mais adequada a alta floricultura do que
o buquê de caules expostos. `hero-bouquet` permanece no disco, sem
referência ativa (ver tabela de clipes).

**Arquitetura corrigida — base sempre pronta, abertura como overlay** — a
composição final (filme principal, título, assinatura, tagline, CTAs) agora
está sempre no DOM com seus valores finais; nada depende de um `useEffect`
rodando para aparecer. Sem JavaScript, com `prefers-reduced-motion`, ou
antes da hidratação, o que se vê já é o hero completo (poster do vídeo via
o atributo nativo `poster`, texto no lugar certo, contraste correto) — a
verificação anterior confundia isso porque as camadas "ocultas" eram
aplicadas via `gsap.set()` dentro de um `useEffect`, ou seja, só depois do
primeiro paint; havia uma janela real (por vezes perceptível) em que a tela
mostrava o estado final e então "saltava" para o estado oculto antes de
animar — lido erroneamente como "vazio". Agora o estado inicial (aberto ou
fechado) é derivado diretamente de `playOpening` no próprio JSX (`style={{
clipPath: playOpening ? HIDDEN : OPEN }}`), nunca via efeito — não há salto.
As camadas transitórias (pétala, fita) só existem no DOM enquanto
`playOpening && !overlaysDone` — são desmontadas de verdade ao final da
timeline, não deixadas invisíveis consumindo GPU.

**Segundo bug encontrado e corrigido durante esta verificação visual:** a
primeira tentativa desta reconstrução dava à pétala (a primeira camada,
prevista para já estar visível em t=0) um `clip-path` que começava
totalmente fechado e um `z-index` mais alto que as camadas de fita/presença
— ou seja, a própria camada que deveria aparecer primeiro estava
invisível, e por estar por cima das outras duas (que também começam
fechadas), a tela inteira ficava preta em t=0 (confirmado capturando o
frame exato em `timeline.progress(0)`, não por estimativa de tempo).
Corrigido invertendo a lógica: a pétala agora nasce com `clip-path` aberto
(z-index mais baixo, primeira coisa visível, sem wipe de entrada) e cada
camada seguinte — fita, depois a cortina da presença — recebe um
`z-index` mais alto e cobre a de baixo conforme a própria máscara abre,
igual à mecânica corrigida na rodada anterior.

**Timeline** — uma única `gsap.timeline()` de ~1,95s (dentro do teto de 2s),
sem `ScrollTrigger`, sem pin:

1. 0–350ms — matéria: macro de pétala (`petal-macro`), já totalmente
   aberta desde o primeiro frame (nenhum wipe partindo do preto — ver bug
   corrigido abaixo), apenas escala 1.04→1 e deslocamento ≤3%.
2. 220–820ms (sobreposição de ~130ms) — acabamento: detalhe de
   fita/embalagem (`ribbon-detail`), entra por cima da pétala com wipe de
   baixo para cima (`z-index` mais alto cobrindo a camada abaixo — mesma
   mecânica de ordem de camadas da rodada anterior), leve contra-movimento.
3. 650–1350ms — presença: a camada final (mão + rosa, `z-index` mais alto
   de todas) abre do centro para as bordas via `clip-path: inset(0 50% 0
   50%) → inset(0 0 0 0)` sobre a fita — cortina central se abrindo,
   revelando a composição completa e o espaço reservado ao título.
4. 1000–1900ms — assinatura: eyebrow, "LE GRAND", "AMOUR" (máscara de
   linha — `overflow: hidden` + `translateY`), frase e CTAs, cada um ≤16px
   de deslocamento.

**Controles** — como a duração é menor que 2s, o botão permanente "Pular
abertura" foi removido, conforme pedido. O controle de pausar/retomar o
vídeo só aparece depois que a abertura termina (ou imediatamente quando ela
não roda) — nunca disputa atenção com a sequência. `sessionStorage`
(`lga-hero-opened`) só é gravado depois que a timeline conclui (não no
início) — se a aba fechar no meio da abertura, ela roda de novo na próxima
sessão. Navegação direta por âncora ou `prefers-reduced-motion` nunca
disparam a abertura.

## Le Cœur Royale — corrigida a aparência de cena travada

A escala inicial de `2.1` fazia a caixa começar como textura vermelha quase
abstrata, ilegível por boa parte da rolagem. Corrigido: escala inicial
`1.12` (a silhueta da caixa já é reconhecível desde o progresso 0%),
eyebrow e título sempre visíveis (não dependem mais de rolagem para
aparecer), tagline/lista de atributos/CTA revelam entre 45–70% de
progresso. O gradiente de contraste atrás do texto deixou de ser
vinculado à rolagem (antes começava em apenas 30% de opacidade) — agora
tem força fixa, garantindo contraste AA para o texto em qualquer ponto da
cena. Altura reduzida para `135svh`/`145svh` (mobile/desktop), dentro do
teto de ~150svh pedido. `ScrollTrigger.refresh()` é chamado no `onLoad` da
imagem para recalcular posições depois que a mídia crítica informa suas
dimensões.

## Interlúdio — "O último cuidado" (segunda reconstrução)

A primeira versão de `components/interlude/LastTouch.tsx` (commit
`9732046`) mostrava uma única fotografia ampliada da fita — não constituía
uma sequência editorial, lia como um recorte solto entre duas seções.
Reconstruído como três quadros editoriais assimétricos que entram uma única
vez quando a seção alcança ~70% do viewport (não vinculados à rolagem
contínua): quadro 1 vertical (seleção da rosa, vídeo), quadro 2 horizontal
dominante (o gesto de cuidado, vídeo), quadro 3 estreito e sobreposto
(acabamento da fita, foto). A frase "O luxo também está no último gesto
antes da entrega." entra entre os quadros. No mobile os três momentos ficam
empilhados verticalmente, sem tentar reproduzir a sobreposição do desktop.

**Pendência de mídia documentada, não contornada:** a referência indicada
(Pexels 5399933, "female hands tying flower bouquet close-up") foi baixada e
inspecionada quadro a quadro — mostra rosas **rosa e branca** (não vermelhas)
sobre uma **toalha branca, luz de estúdio clara**, e o rosto identificável de
uma modelo aparece nos últimos segundos. Nenhum desses três pontos é
compatível com a direção da coleção. Uma segunda busca por vídeos e fotos
alternativos não encontrou nenhum clipe de mãos amarrando um laço sob
licença livre com fundo escuro + rosas vermelhas. Por isso os três quadros
usam assets já existentes na biblioteca, captionados honestamente pelo que
de fato mostram: `hands-selecting` (mão segurando uma rosa — não é o ritual
de seleção oficial), `rose-lateral-light` (mesmo filme do hero — reutilizado
como quadro dominante), `ribbon-detail` (macro da fita, sem mãos). Nenhum
dos três mostra mãos amarrando um laço; essa captação continua pendente.

## Reserva — restaurada a cena "Da emoção ao gesto", form mantido

A versão anterior (commit `9732046`) havia removido por completo a cena de
transição da rosa que existia no commit `9020f57` (~206 linhas) — uma
regressão, não um redesenho pedido. `components/reservation/RoseClosing.tsx`
restaura essa cena a partir do `9020f57`: uma fotografia (`closing-editorial.webp`)
ancora a tela em escala 1 com a frase "Amor que se vê. Presença que fica."
centralizada; ao rolar, a mesma imagem (nunca duas fotos em crossfade, nunca
recortada — só escala, com `transform-origin` à esquerda) encolhe para um
painel editorial à esquerda enquanto o título "Algumas pessoas merecem mais
do que um presente." e o CTA de WhatsApp entram à direita. Progressão
recalibrada para a tabela do briefing (recuo a partir de 20%, título a 60%,
texto/ação a 80%, estável a partir de ~90%) e para eliminar o efeito de
"estado intermediário" apontado na reprovação anterior. Altura `150svh`,
dentro do teto de 140–160svh.

O formulário (`components/reservation/ReservationForm.tsx`) permanece fora
da faixa fixada, em fluxo normal, com o próprio título prático "Sua
declaração começa aqui." — `#reserva` aponta para essa seção, nunca para a
cena da rosa, então um link direto sempre chega a um formulário pronto e
usável. Lógica de validação, Zod, endpoint, consentimento e feedback de
envio não foram tocados — apenas o acabamento visual: campos com fundo
integrado ao preto (sem card claro), rótulos em dourado fosco, números de
etapa discretos (01 Criação · 02 Seus dados · 03 Detalhes), linhas finas em
vez de caixas fechadas. A criação desejada continua um grupo de três opções
sempre visíveis (`role="radiogroup"`, Le Bouquet / Le Cœur Royale / Quero
orientação). Ocasião e mensagem seguem numa área expansível cujo erro de
validação a abre automaticamente e leva o foco para lá. O CTA de produto
(`?criacao=le-bouquet#reserva`) pré-seleciona a opção correspondente sem
apagar o que o visitante já digitou. `AtelierButton` (usado em todas as
ações principais) teve a altura mínima elevada de 48px para 50px.

## Rodapé — assinatura de encerramento

`components/layout/Footer.tsx` ganhou uma área de assinatura própria — "LE
GRAND AMOUR" em escala grande, régua dourada fina, "Flor de Maria Ateliê ×
Patrícia Marchi" abaixo — separada por uma linha do bloco prático
(navegação, atendimento, localização) e da faixa de direitos autorais. O
link do WhatsApp continua condicionado à mesma variável
`contact.whatsappNumber` (hoje vazia, então o link fica oculto — nada de
link fictício); colunas sem dado configurado não renderizam vazias.

`components/layout/HashScrollFix.tsx` corrige um efeito colateral do
`scroll-behavior: smooth` global: o salto nativo do navegador para `#hash`
pode ficar "preso" a meio caminho quando as fontes web trocam (swap) e
deslocam o layout logo depois do primeiro paint. O componente reemite o
`scrollIntoView` depois que fontes e `load` terminam.

## Pacote de mídia editorial provisória (`public/media/temporary/`)

Enquanto o ensaio oficial não existe, cada clipe usa uma fotografia de banco
licenciada (Pexels License — uso comercial livre, sem atribuição obrigatória),
color-graded para uma única direção coerente (preto/vinho, rosas vermelhas
profundas, luz lateral, dourado discreto).

Registro central: `data/temporary-media.ts`. `components/media/ManagedVideo.tsx`
resolve, para cada `clipId`, nesta ordem: **(1)** clipe oficial em
`AVAILABLE_CLIPS` → **(2)** vídeo provisório → **(3)** imagem provisória →
**(4)** gradiente de último recurso. Todo elemento provisório carrega
`data-temporary-media="true"` e um `alt`/descrição que deixa explícito que é
uma imagem conceitual, não a fotografia final — nunca é apresentado como se
fosse Patrícia Marchi ou o produto real. `ManagedVideo` agora também aceita
um `onVideoElement` opcional (usado pelo Hero para o controle acessível de
pausar/retomar o filme de fundo) sem mudar nada no comportamento existente.

| Arquivo | Fonte | Usado para |
|---|---|---|
| `hero-bouquet.webp` | Pexels 6616439 (Engin Akyurt, "Red Roses in Black Background") — 3 rosas com caules, fundo preto | **Sem uso ativo** — removido da composição principal do Hero por não comunicar buquê monumental/alta floricultura; mantido no disco |
| `hero-bouquet-loop.mp4` / `.webm` / `-poster.jpg` | Gerado a partir de `hero-bouquet.webp` via `ffmpeg zoompan` | **Sem uso ativo** (idem acima) |
| `hero-editorial-desktop.webp` / `hero-editorial-mobile.webp` / `hero-editorial-loop.mp4(+webm)` | Pexels 19793276 (mão erguendo uma rosa vermelha) | Hero — filme principal (presença) e estado final; "O último cuidado" — quadro 2 (dominante); Ritual (estrutura) |
| `ribbon-detail.webp` | Pexels 30412959 (fita de cetim vermelha, borda metálica) | Hero — abertura (acabamento); "O último cuidado" — quadro 3; Le Bouquet (detalhe); Ritual (fita/cartão/embalagem) |
| `petal-macro.webp` / `petal-macro-loop.mp4(+webm)` | Pexels 9951169 | Hero — abertura (matéria); Manifesto; Reserva (detalhe); Ritual (preparação) |
| `hands-selecting.webp` / `hands-selecting-loop.mp4(+webm)` | Pexels 19793276 (recorte diferente) | "O último cuidado" — quadro 1 (seleção); Ritual (seleção); Escala |
| `bouquet-full.webp` | Pexels 12032362 (buquê real, embalagem em papel kraft) | Le Bouquet — mídia principal (`bouquet-assembly`) |
| `coeur-box.webp` | Pixabay 3976583/3976584, quadro quase completo (não recortado ao limite da caixa) | Le Cœur Royale — mídia principal (`coeur-assembly`) |
| `closing-editorial.webp` / `closing-editorial-mobile.webp` | Pexels 9951169, espelhado horizontalmente | Reserva — cena "Da emoção ao gesto" (`RoseClosing.tsx`), restaurada do commit `9020f57` |
| `woman-editorial.webp` | Pexels 31085356, tratamento duotone vinho/preto | Placeholder não identificável para Patrícia Marchi (`patricia-film`) |
| `delivery-concept.webp` | Pexels 14737905 (rosas sobre carro, chuva) | Referência de entrega (`delivery-moment`) |

Todas as fotos-fonte são Pexels License ou Pixabay Content License (uso
comercial livre, sem atribuição obrigatória), regradadas com `ffmpeg`
(`eq`/`curves`/`vignette`/`colorbalance`) para a mesma direção de cor
preto/vinho/dourado. `woman-editorial.webp` recebeu deliberadamente um
tratamento gráfico duotone (não fotorrealista) — silhueta a contraluz,
irreconhecível — para que nenhum visitante confunda a modelo do banco de
imagens com Patrícia Marchi.

### Le Cœur Royale — pendente de asset

`coeur-box.webp` é uma fotografia real de uma caixa rígida em formato de
coração, fechada, com laço. Nenhuma foto com a tampa aberta/rosas visíveis
foi encontrada sob licença de uso livre para o mesmo produto — o movimento
físico de abertura da tampa não foi implementado; a cena atual reenquadra
(zoom/pan real) do laço até a caixa inteira e para por aí. Quando a diária
de estúdio acontecer, gravar a abertura real da caixa resolve isso sem
precisar tocar no componente além de trocar o asset.

## Como ativar um clipe real

1. Grave/exporte o clipe.
2. Crie a pasta `public/media/<id>/` (os 9 ids abaixo).
3. Coloque dentro, com esses nomes exatos:
   - `desktop.mp4` (H.264, ~1920×1080 ou nativo do plano, GOP curto se for usado em scrubbing)
   - `desktop.webm` (VP9 — opcional, mas preferível)
   - `mobile.mp4` (H.264, recorte vertical/quadrado, arquivo mais leve)
   - `poster.jpg` (primeiro frame, still)
4. Abra `lib/video/availableClips.ts` e adicione o id ao `Set`. Só isso —
   nenhum componente precisa mudar.

## Os 9 clipes (o briefing original pedia 5–8; `hero-bouquet` foi somado numa rodada anterior porque o Hero precisava de uma direção de mídia própria, distinta do que `rose-lateral-light` já serve no Ritual)

| id | O que mostrar | Usado em |
|---|---|---|
| `hero-bouquet` | Buquê de rosas vermelhas, composição central, luz lateral | **Sem uso ativo** — removido do Hero, mantido no inventário |
| `petal-macro` | Macro de pétalas — textura, veios, luz percorrendo lentamente | Hero (matéria), Manifesto, Reserva (detalhe), Ritual (preparação) |
| `rose-lateral-light` | Mão erguendo uma rosa vermelha, luz lateral, atmosfera editorial | Hero (presença/estado final), "O último cuidado" (quadro dominante), Ritual (estrutura) |
| `hands-selecting` | Mãos selecionando e preparando rosas | "O último cuidado" (quadro 1), Ritual (seleção), Escala |
| `bouquet-assembly` | Buquê completo — flores, embalagem, volume | Le Bouquet (mídia principal), Ritual (montagem) |
| `coeur-assembly` | Caixa em formato de coração | Le Cœur Royale (mídia principal), Ritual (acabamento) |
| `patricia-film` | Patrícia caminhando, observando, tocando as rosas, olhando para a câmera | Seção Patrícia Marchi, Escala |
| `ribbon-detail` | Fita de cetim vermelha — acabamento, gesto | Hero (acabamento), "O último cuidado" (quadro 3), Le Bouquet (detalhe), Ritual (fita/cartão/embalagem) |
| `delivery-moment` | Entrega ou reação autorizada, produto em ambiente real | Escala e Detalhes, Ritual (entrega) |

## Ainda faltam (não inventados)

- **Filmagem real do gesto de "O último cuidado"** (mãos terminando o laço,
  rosas vermelhas, embalagem escura) — ver seção acima.
- **Vídeo do Hero com recorte específico para mobile** — `hero-editorial-loop.mp4`
  é um único arquivo (enquadramento paisagem); em telas estreitas o mesmo
  vídeo é cortado por `object-cover` com uma posição fixa (`object-[64%_34%]`)
  em vez de um recorte vertical dedicado. Funciona e mantém mão/rosa em
  quadro, mas um encode 9:16 do mesmo material resolveria melhor.
- **Logotipo Le Grand Amour em arquivo vetorial** (`.svg`/`.ai`) — hoje existe
  apenas como imagem de chat. `components/layout/LogoMark.tsx` é um
  substituto tipográfico; troque pelo arquivo real quando disponível.
- **Logotipo Flor de Maria Ateliê** em arquivo.
- **Depoimento real e autorizado de Patrícia Marchi** — `data/content.ts →
  ambassadorSection.testimonialQuote` está vazio de propósito; a seção usa a
  nota de curadoria da Susan (Diretora Criativa) enquanto isso.
- **WhatsApp/telefone oficial da Flor de Maria** — `data/content.ts →
  contact.whatsappNumber` está vazio. O número da Florence Boutique de Rosas
  (catálogo fornecido) é de outra empresa e não deve ser usado aqui. Sem
  esse número, o link de WhatsApp no rodapé fica oculto (não aparece um link
  sem destino).
- **Integração real de encaminhamento da reserva** —
  `lib/reservation/adapter.ts` aceita e registra (`console.info`) toda
  submissão válida, mas só reencaminha de fato para um webhook/CRM se
  `RESERVATION_WEBHOOK_URL` estiver configurada no ambiente — hoje não está.
  O formulário continua honesto sobre isso: a mensagem de sucesso confirma
  o recebimento pelo site, não uma resposta humana.
- **Instagram oficial da Le Grand Amour** — `contact.instagramHandle`.
- **Dados de escala confirmados** (prazo, personalização, disponibilidade,
  entrega/retirada) — `data/content.ts → scaleSection.facts`. A seção
  "Escala e Detalhes" já filtra e omite qualquer campo vazio, então nada
  técnico aparece ao público até esses dados serem preenchidos.
- **Data de lançamento oficial** — o contrato prevê vigência de 10 meses a
  partir do lançamento, mas a data ainda não foi definida ("Próximos
  passos" na apresentação da parceria).
