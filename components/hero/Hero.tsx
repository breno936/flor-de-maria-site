import Image, { getImageProps } from "next/image";
import { hero } from "@/data/content";
import { heroPhoto } from "@/data/campaign-photos";
import { formatPrice, pricesConfirmed, startingPrice } from "@/lib/price";
import AtelierButton from "@/components/ui/AtelierButton";

/**
 * ABERTURA. The campaign photograph with impact, the mark, one line, the
 * starting price once it is confirmed, and the way to the creations.
 * Visitors arrive from Instagram and ads already drawn in, so nothing here
 * makes them wait: no intro, no JS-driven timeline. The photograph settles
 * from a slightly closer frame and the text rises in (CSS, from the first
 * paint, done in under a second); a blurred 24px copy of the photo sits
 * underneath so a slow connection still opens on the campaign's colours.
 *
 * Art direction through <picture>: the landscape frame (IMG_4521) from
 * 768px up, the portrait one (IMG_4480) on phones — only the one that
 * applies is downloaded, at high priority.
 */
export default function Hero() {
  const common = { alt: heroPhoto.alt, sizes: "100vw", quality: 80, fetchPriority: "high" as const, loading: "eager" as const };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, ...heroPhoto.desktop });
  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({ ...common, ...heroPhoto.mobile });

  const ctaLabel = pricesConfirmed ? "Ver criações e valores" : "Ver as criações";

  return (
    <section
      id="inicio"
      className="relative flex min-h-[88svh] w-full flex-col overflow-hidden bg-noir md:min-h-[100svh]"
      aria-label="Lê Grand Amour — amor em sua forma mais grandiosa"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 scale-110 blur-2xl md:hidden" style={{ backgroundImage: `url(${heroPhoto.blur.mobile})`, backgroundSize: "cover", backgroundPosition: "55% 30%" }} />
        <div aria-hidden="true" className="absolute inset-0 hidden scale-110 blur-2xl md:block" style={{ backgroundImage: `url(${heroPhoto.blur.desktop})`, backgroundSize: "cover", backgroundPosition: "64% 34%" }} />
        <picture>
          <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="100vw" />
          <source srcSet={mobileSrcSet} sizes="100vw" />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- art-directed next/image props (getImageProps), alt included */}
          <img
            {...imgProps}
            className="hero-settle absolute inset-0 h-full w-full object-cover object-[55%_30%] md:object-[64%_34%]"
          />
        </picture>
        {/* Contrast for the text — a bottom block on phones (where the copy
            sits over the lower frame), a left column on wider screens. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(0deg, rgba(7,5,4,0.92) 0%, rgba(7,5,4,0.6) 34%, rgba(7,5,4,0.15) 58%, transparent 72%, rgba(7,5,4,0.5) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(7,5,4,0.78) 0%, rgba(7,5,4,0.42) 42%, rgba(7,5,4,0.12) 68%, transparent 100%), linear-gradient(0deg, rgba(7,5,4,0.8) 0%, rgba(7,5,4,0.28) 34%, transparent 55%, transparent 75%, rgba(7,5,4,0.5) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-[88svh] w-full flex-col justify-end px-6 pb-14 pt-28 sm:px-10 md:min-h-[100svh] md:justify-center md:pb-0 md:pl-16 lg:pl-24">
        <div className="max-w-xl text-center md:text-left">
          {/* The official logo as an image — never rebuilt in a web font —
              and the page's h1: the alt text is the accessible name. */}
          <h1 className="hero-rise inline-block">
            <span className="relative inline-block aspect-[1171/530] w-[15rem] sm:w-[19rem] lg:w-[23rem]">
              <Image
                src="/assets/le-grand-amour/le-grand-amour-wordmark.webp"
                alt={hero.logoAlt}
                fill
                loading="eager"
                sizes="(max-width: 640px) 15rem, (max-width: 1024px) 19rem, 23rem"
                className="object-contain object-center md:object-left"
              />
            </span>
          </h1>
          <p className="hero-rise mono-label mt-3 text-champagne-light/85" style={{ animationDelay: "80ms" }}>
            {hero.signature}
          </p>

          <p
            className="hero-rise mt-6 font-display text-[clamp(1.9rem,3.4vw,2.9rem)] italic leading-[1.08] text-champagne-light"
            style={{ animationDelay: "160ms" }}
          >
            {hero.phrase}
          </p>

          {startingPrice !== null && (
            <p data-hero-price className="hero-rise mt-4 font-sans text-[0.95rem] text-ivory/90" style={{ animationDelay: "220ms" }}>
              Criações a partir de <span className="font-medium text-ivory">{formatPrice(startingPrice)}</span>
            </p>
          )}

          <div className="hero-rise mt-8 flex justify-center md:justify-start" style={{ animationDelay: "280ms" }}>
            <AtelierButton href="#criacoes">{ctaLabel}</AtelierButton>
          </div>
        </div>
      </div>
    </section>
  );
}
