# Le Grand Amour — inventário de mídia

Nenhum vídeo ou fotografia oficial da coleção existe hoje. A apresentação da
parceria (Flor de Maria × Patrícia Marchi) lista a diária de estúdio como um
item em **"Próximos passos"** — ou seja, a gravação ainda não aconteceu.

## Hero — abertura editorial automática (referência: Codrops "Rapid Layers Animation")

`components/hero/Hero.tsx` foi reescrito por completo: a mecânica anterior
(janela vertical crescendo pela rolagem, adaptada do "Scroll media expansion
hero" do 21st.dev) foi removida — esta rodada de briefing a substitui
explicitamente por uma abertura automática, disparada por tempo, inspirada em
[Rapid Image Layers Animation](https://tympanus.net/Development/RapidLayersAnimation/)
([artigo](https://tympanus.net/codrops/2020/04/07/rapid-image-layers-animation/),
[código](https://github.com/codrops/RapidLayersAnimation/), MIT, Codrops).

**O que foi possível inspecionar de fato:** o artigo (texto completo,
acessível) descreve a técnica em prosa — um wrapper com `overflow: hidden`
que translada numa direção enquanto a imagem-filha translada na direção
oposta, simulando um `clip-path` animado sem o custo de performance de
animar `clip-path` diretamente; GSAP coordena o tempo/atraso de cada camada.
**Não há trechos de código no artigo**, e o repositório do GitHub retornou
apenas a listagem de arquivos (`src/`, `dist/`, `LICENSE` MIT) — o conteúdo
de `src/*.js` com os valores exatos de duração/easing/delay não foi
acessível pela ferramenta de busca automatizada usada. A coreografia abaixo
foi construída a partir da descrição comportamental do artigo e do briefing,
não copiada de um código-fonte inspecionado.

**Mecânica implementada** — uma única `gsap.timeline()` de ~2,3s, sem
`ScrollTrigger`, sem pin, sem qualquer propriedade vinculada à rolagem:

1. Três camadas absolutas empilhadas (pétala → detalhe de fita/acabamento →
   filme principal do buquê), cada uma com uma máscara (`clip-path:
   inset(...)`, wipe vertical de cima para baixo) e uma imagem interna que
   deriva alguns % na direção oposta enquanto a máscara abre — a "camada 2
   cobre a camada 1" acontece por ordem de `z-index` (pétala mais embaixo,
   fita no meio, filme principal por cima) combinada com a máscara da camada
   de cima abrindo — não há necessidade de esconder a camada de baixo
   separadamente, ela é naturalmente coberta.
2. Os tempos se sobrepõem propositalmente (a camada seguinte começa a abrir
   antes da anterior terminar) para que nunca exista um quadro sem imagem
   nenhuma visível.
3. Título, assinatura, frase e CTAs entram por último (1,3s–2,3s),
   sobrepostos à cauda da revelação do filme principal.

**Comportamento automático e gating** — a sequência roda independente de
rolagem; rolar durante a abertura não a interrompe nem trava a página. Uma
ação "Pular abertura" (canto superior direito) chama `timeline.progress(1)`,
que conclui todas as tweens instantaneamente. A sessão é controlada via
`sessionStorage` (`lga-hero-opened`), lida uma única vez por carregamento de
módulo via `useSyncExternalStore` (não um `useState`+`useEffect`, para nunca
precisar de uma chamada de `setState` dentro de um efeito — o snapshot do
servidor é sempre "não tocar", e o React reconcilia o valor real do cliente
sozinho). Em navegação direta por âncora (`location.hash` presente e
diferente de `#topo`) ou com `prefers-reduced-motion`, a abertura nunca
roda — o hero nasce já no estado final.

**Bug encontrado e corrigido durante a verificação visual:** a primeira
versão empilhava as camadas na ordem errada (pétala com `z-index` mais alto
que fita e filme principal) — como a máscara da pétala nunca se fecha de
volta (só o `autoAlpha` dela é zerado no fim, como limpeza), ela cobria as
camadas de baixo o tempo todo e a "revelação" da fita e do filme principal
nunca aparecia visualmente, apesar da timeline estar progredindo
corretamente (confirmado lendo `timeline.progress()` diretamente). Corrigido
invertendo a ordem de `z-index` (pétala embaixo, fita no meio, filme em
cima) — capturas em `timeline.progress()` = 0.15/0.4/0.65 confirmam a
revelação em cascata correta depois do ajuste.

## Interlúdio — "O último cuidado" (substitui a fita desenhada)

`components/experience/RedThread.tsx` (um `<svg>` com um `<path>` sendo
desenhado pela rolagem, conectando Le Bouquet a Le Cœur Royale) foi removido
por completo — sem substituto abstrato. `components/interlude/LastTouch.tsx`
ocupa o mesmo lugar em `app/page.tsx`: uma seção compacta, mesmo fundo
escuro, com uma revelação curta e discreta (uma vez, ao entrar na tela,
**não** vinculada ao progresso da rolagem) e a frase "Amor que se vê.
Presença que fica." ao lado.

**Pendência de mídia documentada, não contornada:** a referência indicada
(Pexels 5399933, "female hands tying flower bouquet close-up") foi baixada e
inspecionada quadro a quadro — mostra rosas **rosa e branca** (não vermelhas)
sobre uma **toalha branca, luz de estúdio clara**, e o rosto identificável de
uma modelo aparece nos últimos segundos. Nenhum desses três pontos é
compatível com a direção da coleção (rosas vermelhas, embalagem escura, sem
identificar uma modelo). Uma segunda busca por vídeos e fotos alternativos
("hands tying red ribbon dark background", "florist hands wrapping bouquet
dark moody" etc.) não encontrou nenhum clipe de mãos amarrando um laço sob
licença livre que combinasse fundo escuro + rosas vermelhas. Por isso, e
seguindo a autorização explícita do briefing para esse caso ("use uma
fotografia de acabamento na mesma composição"), o bloco usa a foto macro da
fita já existente na biblioteca (`ribbon-detail.webp` — vermelha, fundo
escuro, já no grade de cor da coleção) **sem mãos**. O gesto de mãos
terminando o laço continua sendo uma captação pendente.

## Reserva — redesenho do atendimento

`components/reservation/ReservationScene.tsx` foi simplificado: a transição
de imagem grande (foto ancorando a tela e encolhendo num painel enquanto o
título/CTA entravam, controlada por scroll) foi removida por completo —
não fazia parte do redesenho pedido e a citação que ela usava ("Amor que se
vê. Presença que fica.") passou a ser a frase do interlúdio "O último
cuidado" (não repetida aqui). No lugar: duas colunas estáticas (introdução
editorial + formulário) no mesmo fundo escuro, sem card claro.

`components/reservation/ReservationForm.tsx`: a criação desejada virou um
grupo de três opções sempre visíveis (`role="radiogroup"`, Le Bouquet / Le
Cœur Royale / Quero orientação) em vez de um `<select>` escondido. Ocasião e
mensagem foram movidos para uma área expansível ("Adicionar detalhes do
presente") — um erro de validação nesses dois campos abre a área
automaticamente e leva o foco para lá, nunca fica escondido. Um CTA de
produto (`?criacao=le-bouquet#reserva`, adicionado nos botões "Tenho
interesse nesta criação" de Le Bouquet e Le Cœur Royale) pré-seleciona a
opção correspondente sem apagar nada que o visitante já tenha digitado.

## Rodapé — assinatura de encerramento

`components/layout/Footer.tsx` foi reorganizado em quatro grupos (marca +
assinatura da parceria, navegação, contato, localização) mais uma faixa
inferior com direitos autorais — sem repetir um CTA grande de reserva. O
link do WhatsApp (antes um botão dentro da cena de reserva) foi movido para
cá, condicionado à mesma variável `contact.whatsappNumber` (hoje vazia,
então o link fica oculto — nada de link fictício).

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
| `hero-bouquet.webp` | Pexels 6616439 (Engin Akyurt, "Red Roses in Black Background") — 3 rosas com caules, fundo preto, margem generosa em todos os lados no arquivo original (8192×5464) | Hero — poster/imagem-base do filme principal (camada 3) |
| `hero-bouquet-loop.mp4` / `.webm` / `-poster.jpg` | Gerado a partir de `hero-bouquet.webp` via `ffmpeg zoompan` (zoom lento, ~6s, sem áudio) — **não é filmagem real**, é a mesma fotografia em zoom lento; disclosure no `alt` | Hero — filme principal (camada 3, estado final) |
| `ribbon-detail.webp` | Pexels 30412959 (fita de cetim vermelha, borda metálica) | Hero — abertura (camada 2); "O último cuidado" — mídia principal; Le Bouquet (detalhe); Ritual (fita/cartão/embalagem) |
| `petal-macro.webp` / `petal-macro-loop.mp4(+webm)` | Pexels 9951169 | Hero — abertura (camada 1); Manifesto; Reserva (detalhe); Ritual (preparação) |
| `hero-editorial-desktop.webp` / `hero-editorial-mobile.webp` | Pexels 19793276 (mão erguendo uma rosa) | Não usado no Hero; disponível em `rose-lateral-light` para o Ritual |
| `hands-selecting.webp` / `hands-selecting-loop.mp4(+webm)` | Pexels 19793276 (recorte diferente) | Ritual (seleção); Escala |
| `bouquet-full.webp` | Pexels 12032362 (buquê real, embalagem em papel kraft) | Le Bouquet — mídia principal (`bouquet-assembly`) |
| `coeur-box.webp` | Pixabay 3976583/3976584, quadro quase completo (não recortado ao limite da caixa) | Le Cœur Royale — mídia principal (`coeur-assembly`) |
| `closing-editorial.webp` / `closing-editorial-mobile.webp` | Pexels 9951169, espelhado horizontalmente | Não usado mais (era da transição de reserva removida nesta rodada) — mantido no disco, sem referência ativa |
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
| `hero-bouquet` | Buquê de rosas vermelhas, composição central, luz lateral | Hero — abertura (camada 3) e estado final |
| `petal-macro` | Macro de pétalas — textura, veios, luz percorrendo lentamente | Hero (camada 1), Manifesto, Reserva (detalhe), Ritual (preparação) |
| `rose-lateral-light` | Rosas recebendo luz lateral, atmosfera editorial | Ritual (estrutura) |
| `hands-selecting` | Mãos selecionando e preparando rosas | Ritual (seleção), Escala |
| `bouquet-assembly` | Buquê completo — flores, embalagem, volume | Le Bouquet (mídia principal), Ritual (montagem) |
| `coeur-assembly` | Caixa em formato de coração | Le Cœur Royale (mídia principal), Ritual (acabamento) |
| `patricia-film` | Patrícia caminhando, observando, tocando as rosas, olhando para a câmera | Seção Patrícia Marchi, Escala |
| `ribbon-detail` | Fita de cetim vermelha — acabamento, gesto | Hero (camada 2), "O último cuidado", Le Bouquet (detalhe), Ritual (fita/cartão/embalagem) |
| `delivery-moment` | Entrega ou reação autorizada, produto em ambiente real | Escala e Detalhes, Ritual (entrega) |

## Ainda faltam (não inventados)

- **Filmagem real do gesto de "O último cuidado"** (mãos terminando o laço,
  rosas vermelhas, embalagem escura) — ver seção acima.
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
