# Lê Grand Amour — inventário de mídia

## Estrutura da página (out/2026 — versão comercial)

O visitante chega pelo Instagram ou por anúncios, já atraído pela campanha.
A página tem quatro blocos, nesta ordem, sem nenhuma seção fixada ou
"presa" à rolagem:

1. **Abertura** (`#inicio`, `components/hero/Hero.tsx`) — foto de campanha,
   logotipo, uma frase, "Criações a partir de R$ 999" e "Ver criações e
   valores".
2. **Criações** (`#criacoes`, `components/products/Criacoes.tsx`) — Lê
   Bouquet (`#le-bouquet`) e Lê Cœur Royale (`#le-coeur-royale`), cada um
   com foto, nome, preço ("a partir de" até o visitante escolher uma
   versão), uma frase, três informações, as versões com seus preços e
   "Pedir pelo WhatsApp". No desktop (aprovado pelo cliente), uma linha por
   criação com a foto principal, que amplia as quatro fotos; no celular, as
   quatro fotos em galeria de deslize (`PhotoCarousel.tsx`) com as
   informações logo abaixo. As âncoras de cada criação servem para links de
   anúncio.
3. **Detalhes** (`#detalhes`, `components/gallery/Detalhes.tsx`) — seis
   fotos escolhidas para não se repetirem (corpo inteiro, natureza-morta da
   caixa, fundo claro, hastes, assinatura em relevo, entrega): faixa de
   quadros 4:5 com deslize no celular, mosaico vertical/horizontal no
   desktop; amplia em tela cheia.
4. **Atendimento** (`#atendimento`, `components/purchase/Atendimento.tsx`) —
   WhatsApp, informações práticas confirmadas e a assinatura compacta da
   marca (a antiga seção Autoria).

O mini menu de capítulos na lateral direita
(`components/layout/NarrativeIndicator.tsx`) acompanha os quatro blocos —
links reais no desktop, selo "02 / 04 — CRIAÇÕES" no celular.

As seções Conceito, Campanha (arte do buquê branco), Experiência (sequência
fixada de quatro imagens), Autoria e a vinheta de abertura saíram nesta
versão — estão no histórico do git (até o commit
`d1e3ba9`), junto com a camada de vídeo (`ManagedVideo`, clipes provisórios
de banco de imagem).

## Preços e WhatsApp

- **Preços** — tabela oficial enviada pelo cliente em 26/10/2026, em
  `data/products.ts → options` (e `priceNote` para condições e custos
  extras, hoje vazio):
  - Lê Bouquet — 30 rosas R$ 999 · 50 rosas R$ 1.500 · 60 rosas R$ 1.800 ·
    70 rosas R$ 2.000 · 80 rosas R$ 2.300 · 100 rosas R$ 2.900.
  - Lê Cœur Royale — rosas e chocolate R$ 1.350 · rosas R$ 1.500.

  O card mostra "a partir de" o menor valor de cada criação até o visitante
  escolher uma versão (nenhuma vem marcada); a abertura mostra o menor valor
  da coleção. Nunca deduzir nem arredondar valores.
- **WhatsApp** — `data/content.ts → contact.whatsappNumber` (número do
  responsável pelo ateliê, informado pelo cliente em 26/10/2026). Cada
  "Pedir pelo WhatsApp" abre a conversa com a mensagem pronta
  (`lib/contact/channel.ts`): com a criação e, se escolhida, a versão e o
  seu preço — "Olá! Vi o Lê Bouquet (50 rosas, R$ 1.500) no site e gostaria
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
| `produto-bouquet-escala.webp` | IMG_4606 | Criações — Lê Bouquet, foto principal |
| `detalhe-bouquet-rosas.webp` / `bouquet-embalagem.webp` / `detalhe-rosa-luva.webp` | IMG_4629 / IMG_4621 / IMG_4646 | Fotos ampliadas do Lê Bouquet |
| `produto-coeur-escala.webp` | IMG_4413 | Criações — Lê Cœur Royale, foto principal |
| `detalhe-coeur-fita.webp` / `fita-caixa.webp` / `experiencia-acabamento.webp` | IMG_4407 / IMG_3926 / IMG_4387 | Fotos ampliadas do Lê Cœur Royale |
| `detalhe-proporcao.webp` / `detalhe-caixa-laco.webp` / `detalhe-escala-coeur.webp` | IMG_4697 / IMG_3902 / IMG_4087 | Detalhes — Proporção, Caixa, Escala |
| `detalhe-hastes.webp` / `detalhe-assinatura.webp` | IMG_4513 / IMG_4183 | Detalhes — Hastes, Assinatura |
| `detalhe-entrega.webp` (1536px) | IMG_4583, versão retocada enviada pelo cliente em 26/10/2026 | Detalhes — Entrega. Se houver o arquivo retocado em resolução maior, substituir mantendo outro nome de arquivo (o otimizador de imagens guarda cache por endereço) |

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
- **Quantidade de rosas do Lê Cœur Royale por versão** — o card diz
  "Aproximadamente 60 a 70 rosas" (apresentação da parceria); confirmar se
  vale também para a versão com chocolate.
- **Antecedência necessária para pedidos.**
- **Logotipo Lê Grand Amour em arquivo vetorial** (`.svg`/`.ai`) — hoje é uma
  imagem. `components/layout/LogoMark.tsx` (cabeçalho) é um substituto
  tipográfico.
- **Autorização de uso de imagem** de todas as pessoas que aparecem nas
  fotos, e qual das modelos é Patrícia Marchi (as descrições não nomeiam
  ninguém).
- **Vídeos** da diária, se a equipe de filmagem entregar.
- **Data de lançamento oficial** — o contrato prevê vigência de 10 meses a
  partir do lançamento.
