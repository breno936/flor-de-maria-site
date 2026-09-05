import { manifesto } from "@/data/content";
import ManagedVideo from "@/components/media/ManagedVideo";

export default function Manifesto() {
  return (
    <section id="colecao" className="relative py-24 md:py-36" aria-labelledby="manifesto-title">
      <div className="container-lga grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7 lg:col-start-1">
          <div className="rule-gold mb-6" />
          <h2
            id="manifesto-title"
            className="font-display text-3xl leading-[1.15] text-ivory sm:text-4xl lg:text-[2.75rem]"
          >
            {manifesto.title}
          </h2>
          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted">
            {manifesto.body}
          </p>
        </div>

        <div className="relative lg:col-span-5 lg:col-start-8">
          <div
            className="relative ml-auto aspect-[3/4] w-full max-w-sm overflow-hidden"
            style={{
              clipPath:
                "polygon(6% 0%, 100% 4%, 96% 100%, 0% 94%)",
            }}
          >
            <ManagedVideo
              clipId="petal-macro"
              description="Macro de pétalas vermelhas com luz percorrendo lentamente a textura."
              aspectClassName="h-full w-full"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full opacity-60 blur-2xl"
            style={{ background: "radial-gradient(circle, rgba(146,9,20,0.4), transparent 70%)" }}
          />
        </div>
      </div>
    </section>
  );
}
