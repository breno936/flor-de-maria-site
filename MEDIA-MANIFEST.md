# Le Grand Amour — inventário de mídia

## Estrutura da página (out/2026 — versão comercial)

O visitante chega pelo Instagram ou por anúncios, já atraído pela campanha.
A página tem seis blocos, nesta ordem, sem nenhuma seção fixada ou
"presa" à rolagem:

1. **Abertura** (`#inicio`, `components/hero/Hero.tsx`) — foto de campanha,
   logotipo, uma frase, "Criações a partir de R$ 999" e "Ver criações e
   valores".
2. **Criações** (`#criacoes`, `components/products/Criacoes.tsx`) — Le
   Bouquet (`#le-bouquet`) e Le Coeur Royale (`#le-coeur-royale`), cada um
   com foto, nome, preço ("a partir de" até o visitante escolher uma
   versão), uma frase, três informações, as versões com seus preços e
   "Pedir pelo WhatsApp". No desktop (aprovado pelo cliente), uma linha por
   criação com a foto principal, que amplia as quatro fotos; no celular, as
   quatro fotos em galeria de deslize (`PhotoCarousel.tsx`) com as
   informações logo abaixo. Nos dois, as fotos trocam sozinhas a cada 3 s
   enquanto o card está na tela (param com o dedo ou o mouse sobre a foto,
   com a foto ampliada aberta e com "reduzir movimento"). As âncoras de
   cada criação servem para links de anúncio.
3. **Filme** (`#filme`, `components/film/Filme.tsx`) — o filme da campanha
   num quadro 16:9: enquanto está na tela, toca sozinho um trecho de 20 s
   **sem som**; um toque ou "Assistir ao filme" abre o filme inteiro
   (1:00), com som, do início — o quadro cresce até o player (ver abaixo).
4. **Detalhes** (`#detalhes`, `components/gallery/Detalhes.tsx`) — seis
   fotos escolhidas para não se repetirem (corpo inteiro, natureza-morta da
   caixa, fundo claro, hastes, assinatura em relevo, entrega): faixa de
   quadros 4:5 com deslize no celular, mosaico vertical/horizontal no
   desktop; amplia em tela cheia.
5. **Embaixadora** (`#embaixadora`, `components/ambassador/Embaixadora.tsx`)
   — Patrícia Marchi, "musa e embaixadora da coleção", com o depoimento em
   vídeo: capa + "Assistir ao depoimento"; o vídeo (2:35, com som, sem
   legendas por decisão de 01/11/2026) só carrega no play. Enquanto o bloco
   está na tela, a capa toca um trecho curto **sem som** (os navegadores não
   deixam vídeo começar sozinho com som); um toque abre o depoimento
   inteiro com som.

   **Player dos dois filmes** (`components/media/FilmDialog.tsx`): a capa
   tocada se expande e se desloca até o player (~0,4 s, escala uniforme —
   nunca estica; a capa 4:5 do desktop se abre até o quadro 9:16 inteiro) e,
   ao fechar, encolhe de volta para ela. O fundo escurece aos poucos (no
   desktop, também com um leve desfoque), deixando a página perceptível. O
   player ocupa a altura disponível com a legenda, com contorno champagne
   finíssimo e sombra suave; o botão de fechar fica junto ao canto superior
   da moldura (44 × 44 px). A imagem da capa segura a moldura até o
   primeiro quadro do vídeo aparecer. Fechar corta o som na hora, devolve a
   rolagem exata e o foco ao botão que abriu. "Reduzir movimento": o mesmo
   player, sem o movimento.
6. **Atendimento** (`#atendimento`, `components/purchase/Atendimento.tsx`) —
   WhatsApp, informações práticas confirmadas e a assinatura compacta da
   marca (a antiga seção Autoria).

O mini menu de capítulos na lateral direita
(`components/layout/NarrativeIndicator.tsx`) acompanha os seis blocos —
links reais no desktop, selo "02 / 06 — CRIAÇÕES" no celular.

As seções Conceito, Campanha (arte do buquê branco), Experiência (sequência
fixada de quatro imagens), Autoria e a vinheta de abertura saíram nesta
versão — estão no histórico do git (até o commit
`d1e3ba9`), junto com a camada de vídeo (`ManagedVideo`, clipes provisórios
de banco de imagem).

## Preços e WhatsApp

- **Preços** — tabela oficial enviada pelo cliente em 26/10/2026, em
  `data/products.ts → options` (e `priceNote` para condições e custos
  extras, hoje vazio):
  - Le Bouquet — 30 rosas R$ 999 · 50 rosas R$ 1.500 · 60 rosas R$ 1.800 ·
    70 rosas R$ 2.000 · 80 rosas R$ 2.300 · 100 rosas R$ 2.900.
  - Le Coeur Royale — rosas e chocolate R$ 1.350 · rosas R$ 1.500.

  O card mostra "a partir de" o menor valor de cada criação até o visitante
  escolher uma versão (nenhuma vem marcada); a abertura mostra o menor valor
  da coleção. Nunca deduzir nem arredondar valores.
- **WhatsApp** — `data/content.ts → contact.whatsappNumber` (número do
  responsável pelo ateliê, informado pelo cliente em 26/10/2026). Cada
  "Pedir pelo WhatsApp" abre a conversa com a mensagem pronta
  (`lib/contact/channel.ts`): com a criação e, se escolhida, a versão e o
  seu preço — "Olá! Vi o Le Bouquet (50 rosas, R$ 1.500) no site e gostaria
  de consultar disponibilidade." A barra fixa do celular e o botão do cabeçalho no desktop só
  aparecem depois que o visitante chega às criações. O número da Florence
  Boutique de Rosas (catálogo fornecido) é de outra empresa e não deve ser
  usado aqui.
- **Antecedência** — `data/content.ts → contact.leadTime`; aparece no
  Atendimento assim que preenchida.

## Ensaio oficial — fotografias entregues (out/2026)

A diária de estúdio aconteceu em 07/10/2026 (fotógrafo Rafael Gimenes, Canon
EOS R8, tratamento em Lightroom). Foram entregues **406 fotografias** (JPG,
6000×4000, Adobe RGB), em três zips "CAMPANHA LE GRAN AMOUR". **Nenhum vídeo
foi entregue**.

Os originais **não** entram no repositório. Cada foto usada foi convertida de
Adobe RGB para sRGB e exportada em WebP (qualidade 82) para
`public/assets/le-grand-amour/campanha/`. Registro central:
`data/campaign-photos.ts`.

| Arquivo | Original | Usado em |
|---|---|---|
| `abertura-desktop.webp` (2560px) / `abertura-mobile.webp` (1290px) | IMG_4521 / IMG_4480 | Abertura — a partir de 768px / no celular (`<picture>`), com miniatura desfocada embutida para o carregamento |
| `produto-bouquet-escala.webp` | IMG_4606 | Criações — Le Bouquet, foto principal |
| `detalhe-bouquet-rosas.webp` / `bouquet-embalagem.webp` / `detalhe-rosa-luva.webp` | IMG_4629 / IMG_4621 / IMG_4646 | Fotos ampliadas do Le Bouquet |
| `produto-coeur-escala.webp` | IMG_4413 | Criações — Le Coeur Royale, foto principal |
| `detalhe-coeur-fita.webp` / `fita-caixa.webp` / `experiencia-acabamento.webp` | IMG_4407 / IMG_3926 / IMG_4387 | Fotos ampliadas do Le Coeur Royale |
| `detalhe-proporcao.webp` / `detalhe-caixa-laco.webp` / `detalhe-escala-coeur.webp` | IMG_4697 / IMG_3902 / IMG_4087 | Detalhes — Proporção, Caixa, Escala |
| `detalhe-hastes.webp` / `detalhe-assinatura.webp` | IMG_4513 / IMG_4183 | Detalhes — Hastes, Assinatura |
| `detalhe-entrega.webp` (1536px) | IMG_4583, versão retocada enviada pelo cliente em 26/10/2026 | Detalhes — Entrega. Se houver o arquivo retocado em resolução maior, substituir mantendo outro nome de arquivo (o otimizador de imagens guarda cache por endereço) |

### Depoimento de Patrícia Marchi (vídeo)

Enviado pelo cliente em 01/11/2026: `IMG_9777.MOV` (iPhone, vertical 4K
HEVC, 2:35, com som — já editado, com cortes e um plano em preto e branco).
O original (407 MB) **não** entra no repositório. Para o site:

| Arquivo | Origem | Uso |
|---|---|---|
| `public/media/embaixadora/patricia-marchi-depoimento.mp4` | IMG_9777, H.264/AAC 9:16, início rápido (faststart) | Vídeo do bloco Embaixadora |
| `public/assets/le-grand-amour/embaixadora/patricia-marchi-capa.webp` (1080×1920) | quadro de 2:31 do mesmo vídeo | Capa do bloco e do player |
| `public/media/embaixadora/patricia-marchi-trecho.mp4` (720×1280, 13,6 s, sem áudio, 2,2 MB) | 2:28–2:35 + 1:18–1:25 do mesmo vídeo, com fusão nas duas emendas (repete sem corte) | Capa em movimento, sem som — só baixa quando o bloco se aproxima; não toca com "reduzir movimento" ou economia de dados |

### Filme da campanha

Enviado pelo cliente em 01/11/2026: `FILME LE GRAN AMOUR (VERSÃO 1).mov`
(4K 16:9 HEVC, 1:00, com som; abre com "11/11" e "11:11"). O original
(152 MB) **não** entra no repositório. Para o site:

| Arquivo | Origem | Uso |
|---|---|---|
| `public/media/filme/le-grand-amour-filme.mp4` (1920×1080, 19 MB) | o filme inteiro, H.264/AAC, início rápido (faststart) | Filme em tela cheia, com som — só carrega no play |
| `public/media/filme/le-grand-amour-filme-trecho.mp4` (1280×720, 20 s, sem áudio, 2,3 MB) | 0:08–0:22 + 0:29–0:37, com fusão nas duas emendas | Quadro em movimento, sem som — só baixa quando o bloco se aproxima |
| `public/assets/le-grand-amour/filme/filme-capa.webp` (1600×900) | quadro de 0:09 (primeiro quadro do trecho) | Capa do bloco e do player |

Quando chegar a versão final, refazer os três arquivos com **outros nomes**
(o navegador e o otimizador de imagens guardam cache por endereço) e
atualizar `data/campaign-photos.ts → campaignFilm`.

O logotipo é `le-grand-amour-wordmark.webp`: a arte oficial com o fundo preto
convertido em transparência e recortada rente à marca. A imagem de
compartilhamento (`public/media/og/le-grand-amour-og.jpg`, 1200×630) é um
recorte da foto da abertura.

As artes `campanha-buque-branco`, `le-bouquet-vermelho`, `le-coeur-royale` e
o logotipo quadrado original ficam no disco, sem referência ativa.

O crédito "Desenvolvido por ArpeX" no rodapé usa
`public/assets/arpex/arpex-logo.webp` (a arte enviada, com o fundo preto
convertido em transparência).

## Ainda faltam (não inventados)

- **Condições dos preços**, se houver (entrega, custos extras) — `priceNote`.
- **Quantidade de rosas do Le Coeur Royale por versão** — o card diz
  "Aproximadamente 60 a 70 rosas" (apresentação da parceria); confirmar se
  vale também para a versão com chocolate.
- **Antecedência necessária para pedidos.**
- **Logotipo Le Grand Amour em arquivo vetorial** (`.svg`/`.ai`) — hoje é uma
  imagem. `components/layout/LogoMark.tsx` (cabeçalho) é um substituto
  tipográfico.
- **Logotipo sem acento.** Desde 01/11/2026 os nomes são escritos sem acento
  (Le Grand Amour, Le Bouquet, Le Coeur Royale) em todo o texto do site, mas
  a arte oficial do logotipo (`le-grand-amour-wordmark.webp`, usada na
  Abertura e no Atendimento) ainda tem "LÊ" desenhado. Trocar quando a
  versão sem acento for entregue — com outro nome de arquivo (o otimizador
  de imagens guarda cache por endereço). As fitas, a placa e o relevo nas
  fotos do ensaio também trazem "LÊ"; são as peças físicas, não mudam.
- **Autorização de uso de imagem** de todas as pessoas que aparecem nas
  fotos, e qual das modelos é Patrícia Marchi (as descrições não nomeiam
  ninguém).
- **Versão final do filme** — o arquivo recebido é a "VERSÃO 1".
- **Data de lançamento oficial** — o contrato prevê vigência de 10 meses a
  partir do lançamento.
