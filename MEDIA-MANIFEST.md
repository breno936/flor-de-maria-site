# Le Grand Amour — inventário de mídia

Nenhum vídeo ou fotografia oficial da coleção existe hoje. A apresentação da
parceria (Flor de Maria × Patrícia Marchi) lista a diária de estúdio como um
item em **"Próximos passos"** — ou seja, a gravação ainda não aconteceu.

## As três cenas de composição (`feat/editorial-scroll-scenes`)

Cada uma é uma única timeline GSAP `ScrollTrigger` (scrub) por cena, sobre
uma faixa de rolagem alta (`h-[…svh]`) com um estágio `position: sticky`
dentro — o mesmo padrão já usado por "O Amor Toma Forma" na versão anterior,
reaplicado às três cenas em vez de introduzido do zero:

1. **`components/hero/HeroExpand.tsx`** — a janela de mídia cresce por
   `clip-path` entre as duas linhas do título (que se afastam via
   `yPercent`), com três planos reais (fundo/gesto/primeiro-plano) em
   velocidades diferentes. Substitui `PetalReveal` + `HeroFilm`, que foram
   removidos — não há mais preloader obrigatório.
2. **`components/products/LeCoeurRoyale.tsx`** — substitui `LoveTakesShape`.
   A câmera reenquadra de um detalhe da caixa até a caixa inteira; ver nota
   de pendência de asset abaixo.
3. **`components/reservation/ReservationScene.tsx`** — substitui `Closing` +
   o topo de `Reservation`. Uma imagem editorial ancora a tela, encolhe por
   `clip-path` para um painel à esquerda enquanto o título/CTA da reserva
   entram à direita, e o formulário (`id="reserva"`) segue em fluxo normal
   — nunca dentro da faixa de pin, para que o link `#reserva` sempre caia
   direto nele.

Em mobile e com `prefers-reduced-motion`, as três cenas trocam para uma
variante sem pin/scrub (`HeroStatic`, `BoxStatic`, `TransitionStatic`) com
todo o conteúdo já visível.

`components/layout/HashScrollFix.tsx` corrige um efeito colateral do
`scroll-behavior: smooth` global: o salto nativo do navegador para `#hash`
pode ficar "preso" a meio caminho quando as fontes web trocam (swap) e
deslocam o layout logo depois do primeiro paint. O componente reemite o
`scrollIntoView` depois que fontes e `load` terminam.

## Pacote de mídia editorial provisória (`public/media/temporary/`)

Enquanto o ensaio oficial não existe, cada clipe usa uma fotografia de banco
licenciada (Pexels License — uso comercial livre, sem atribuição obrigatória),
color-graded para uma única direção coerente (preto/vinho, rosas vermelhas
profundas, luz lateral, dourado discreto). Os três clipes mais visíveis (hero,
macro de pétala, mãos) ganharam também um loop de vídeo Ken Burns (zoom lento
gerado via `ffmpeg zoompan` a partir da própria fotografia) para que o site
deixe de depender só de estáticas.

Registro central: `data/temporary-media.ts`. `components/media/ManagedVideo.tsx`
resolve, para cada `clipId`, nesta ordem: **(1)** clipe oficial em
`AVAILABLE_CLIPS` → **(2)** vídeo provisório → **(3)** imagem provisória →
**(4)** gradiente de último recurso. Todo elemento provisório carrega
`data-temporary-media="true"` e um `alt`/descrição que deixa explícito que é
uma imagem conceitual, não a fotografia final — nunca é apresentado como se
fosse Patrícia Marchi ou o produto real.

| Arquivo | Fonte | Usado para |
|---|---|---|
| `hero-editorial-desktop.webp` / `hero-editorial-mobile.webp` / `hero-editorial-loop.mp4(+webm)` | Pexels 19793276 (mão erguendo uma rosa) | Cena 1 (Hero) — plano de fundo (`rose-lateral-light`) |
| `hands-selecting.webp` / `hands-selecting-loop.mp4(+webm)` | Pexels 19793276 (recorte diferente) | Cena 1 (Hero) — plano intermediário (`hands-selecting`); Ritual (seleção); Escala |
| `ribbon-detail.webp` | Pexels 30412959 (fita de cetim vermelha, borda metálica) | Cena 1 (Hero) — primeiro plano desfocado (`ribbon-detail`); detalhe em Le Bouquet; Ritual (fita/cartão/embalagem) |
| `petal-macro.webp` / `petal-macro-loop.mp4(+webm)` | Pexels 9951169 | Manifesto, Ritual (preparação) (`petal-macro`) |
| `bouquet-full.webp` | Pexels 12032362 (buquê real, embalagem em papel kraft) | Le Bouquet — mídia principal (`bouquet-assembly`) |
| `coeur-box.webp` | Pixabay 3976583/3976584 (caixa rígida real em formato de coração, laço, fechada) | Cena 2 (Le Cœur Royale) — mídia principal (`coeur-assembly`) |
| `closing-editorial.webp` / `closing-editorial-mobile.webp` | Pexels 9951169 (recorte panorâmico distinto do petal-macro) | Cena 3 (transição para reserva) — âncora editorial |
| `woman-editorial.webp` | Pexels 31085356, tratamento duotone vinho/preto | Placeholder não identificável para Patrícia Marchi (`patricia-film`) |
| `delivery-concept.webp` | Pexels 14737905 (rosas sobre carro, chuva) | Referência de entrega (`delivery-moment`) |

Todas as fotos-fonte são Pexels License ou Pixabay Content License (uso
comercial livre, sem atribuição obrigatória), regradadas com `ffmpeg`
(`eq`/`curves`/`vignette`/`colorbalance`) para a mesma direção de cor
preto/vinho/dourado. `woman-editorial.webp` recebeu deliberadamente um
tratamento gráfico duotone (não fotorrealista) — silhueta a contraluz,
irreconhecível — para que nenhum visitante confunda a modelo do banco de
imagens com Patrícia Marchi.

### Cena 2 (Le Cœur Royale) — pendente de asset

`coeur-box.webp` é uma fotografia real de uma caixa rígida em formato de
coração, fechada, com laço — corrige o problema da versão anterior (máscara
de coração aplicada sobre textura de rosas, que não mostrava a caixa real).
Nenhuma foto com a tampa aberta/rosas visíveis foi encontrada sob licença de
uso livre para o mesmo produto. Por isso `LeCoeurRoyale.tsx` implementa **só**
a parte honesta do pedido: a câmera reenquadra (zoom/pan real, guiado pelo
scroll) de um detalhe do laço até a caixa inteira, e o nome/descrição/CTA
entram quando o reenquadramento termina. **O movimento físico de abertura da
tampa (fita se soltando, tampa subindo, rosas aparecendo) não foi
implementado** — não existe o segundo frame necessário para isso ser real, e
o briefing é explícito em não fabricar um movimento fisicamente incoerente.
Quando a diária de estúdio acontecer, gravar a abertura real da caixa
(mesma caixa, mesma câmera, mesma luz) resolve isso sem precisar tocar no
componente além de trocar o asset.

## Como ativar um clipe real

1. Grave/exporte o clipe.
2. Crie a pasta `public/media/<id>/` (os 8 ids abaixo).
3. Coloque dentro, com esses nomes exatos:
   - `desktop.mp4` (H.264, ~1920×1080 ou nativo do plano, GOP curto se for usado em scrubbing)
   - `desktop.webm` (VP9 — opcional, mas preferível)
   - `mobile.mp4` (H.264, recorte vertical/quadrado, arquivo mais leve)
   - `poster.jpg` (primeiro frame, still)
4. Abra `lib/video/availableClips.ts` e adicione o id ao `Set`. Só isso —
   nenhum componente precisa mudar.

## Os 8 clipes (conforme o briefing: 5–8 clipes reaproveitados)

| id | O que mostrar | Usado em |
|---|---|---|
| `petal-macro` | Macro de pétalas — textura, veios, luz percorrendo lentamente | Manifesto, Ritual (preparação) |
| `rose-lateral-light` | Rosas recebendo luz lateral, atmosfera editorial | Cena 1 — Hero (plano de fundo), Ritual (estrutura) |
| `hands-selecting` | Mãos selecionando e preparando rosas | Cena 1 — Hero (plano intermediário), Ritual (seleção), Escala |
| `bouquet-assembly` | Buquê completo — flores, embalagem, volume | Le Bouquet (mídia principal), Ritual (montagem) |
| `coeur-assembly` | Caixa em formato de coração | Cena 2 — Le Cœur Royale (mídia principal), Ritual (acabamento) |
| `patricia-film` | Patrícia caminhando, observando, tocando as rosas, olhando para a câmera | Seção Patrícia Marchi, Escala |
| `ribbon-detail` | Fita de cetim vermelha — acabamento, gesto | Cena 1 — Hero (primeiro plano), Le Bouquet (detalhe), Ritual (fita/cartão/embalagem) |
| `delivery-moment` | Entrega ou reação autorizada, produto em ambiente real | Escala e Detalhes, Ritual (entrega) |

## Ainda faltam (não inventados)

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
  esse número, o botão secundário "Falar diretamente pelo WhatsApp" fica
  oculto (não aparece um botão sem ação).
- **Instagram oficial da Le Grand Amour** — `contact.instagramHandle`.
- **Dados de escala confirmados** (prazo, personalização, disponibilidade,
  entrega/retirada) — `data/content.ts → scaleSection.facts`. A seção
  "Escala e Detalhes" já filtra e omite qualquer campo vazio, então nada
  técnico aparece ao público até esses dados serem preenchidos.
- **Data de lançamento oficial** — o contrato prevê vigência de 10 meses a
  partir do lançamento, mas a data ainda não foi definida ("Próximos
  passos" na apresentação da parceria).
