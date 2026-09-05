# Le Grand Amour — inventário de mídia

Nenhum vídeo ou fotografia oficial da coleção existe hoje. A apresentação da
parceria (Flor de Maria × Patrícia Marchi) lista a diária de estúdio como um
item em **"Próximos passos"** — ou seja, a gravação ainda não aconteceu.

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

| Arquivo | Fonte (Pexels, ID da foto) | Usado para |
|---|---|---|
| `hero-editorial-desktop.webp` / `hero-editorial-mobile.webp` / `hero-editorial-loop.mp4(+webm)` | foto 19793276 (mão erguendo uma rosa) | Hero — plano de fundo (`rose-lateral-light`) |
| `petal-macro.webp` / `petal-macro-loop.mp4(+webm)` | foto 9951169 | Macro de pétala (`petal-macro`) |
| `hands-selecting.webp` / `hands-selecting-loop.mp4(+webm)` | foto 19793276 (recorte diferente) | Mãos selecionando (`hands-selecting`) |
| `bouquet-concept.webp` | foto 10217721 (rosas densas) | Referência de escala/volume — Le Bouquet (`bouquet-assembly`) |
| `coeur-concept.webp` | foto 10217721 (recorte distinto, com máscara de coração em CSS) | Le Cœur Royale (`coeur-assembly`) |
| `woman-editorial.webp` | foto 31085356, tratamento duotone vinho/preto | Placeholder não identificável para Patrícia Marchi (`patricia-film`) |
| `ribbon-detail.webp` | foto 5624975 | Detalhe de fita (`ribbon-detail`) |
| `delivery-concept.webp` | foto 14737905 (rosas sobre carro, chuva) | Referência de entrega (`delivery-moment`) |

`woman-editorial.webp` recebeu deliberadamente um tratamento gráfico
duotone (não fotorrealista) — silhueta a contraluz, irreconhecível — para que
nenhum visitante confunda a modelo do banco de imagens com Patrícia Marchi.

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
| `petal-macro` | Macro de pétalas — textura, veios, luz percorrendo lentamente | Petal Reveal, Manifesto, Ritual (seleção/preparação), O Amor Toma Forma (origem) |
| `rose-lateral-light` | Rosas recebendo luz lateral, atmosfera editorial | Hero (fundo), Ritual (estrutura) |
| `hands-selecting` | Mãos selecionando e preparando rosas | O Amor Toma Forma (gesto), Ritual (seleção) |
| `bouquet-assembly` | Montagem de Le Bouquet — volume crescendo | O Amor Toma Forma (composição/revelação), Le Bouquet (mídia principal), Escala |
| `coeur-assembly` | Abertura/montagem de Le Cœur Royale — tampa, rosas em coração | Le Cœur Royale (mídia principal), Ritual (acabamento), Escala |
| `patricia-film` | Patrícia caminhando, observando, tocando as rosas, olhando para a câmera | Hero (plano intermediário), Seção Patrícia Marchi |
| `ribbon-detail` | Fita vermelha e embalagem — acabamento, gesto | Hero (primeiro plano), The Red Thread (contexto), Ritual (fita/cartão/embalagem), detalhes de produto, Encerramento |
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
