import { scaleSection } from "@/data/content";
import ManagedVideo from "@/components/media/ManagedVideo";

const factLabels: Record<keyof typeof scaleSection.facts, string> = {
  prazo: "Prazo",
  personalizacao: "Personalização",
  disponibilidade: "Disponibilidade",
  entregaOuRetirada: "Entrega ou retirada",
};

export default function ScaleDetails() {
  const facts = (
    Object.entries(scaleSection.facts) as [keyof typeof scaleSection.facts, string][]
  ).filter(([, value]) => value.trim().length > 0);

  return (
    <section className="py-20 md:py-28" aria-labelledby="scale-title">
      <div className="container-lga">
        <div className="rule-gold mb-6" />
        <h2 id="scale-title" className="max-w-2xl font-display text-3xl text-ivory sm:text-4xl">
          {scaleSection.title}
        </h2>
      </div>

      <div className="container-lga mt-12 grid gap-4 sm:grid-cols-3">
        <div className="aspect-[3/4] overflow-hidden sm:col-span-2 sm:row-span-2 sm:aspect-auto">
          <ManagedVideo
            clipId="delivery-moment"
            description="A criação sendo transportada e entregue, percepção real de escala junto ao corpo e ao ambiente."
            aspectClassName="h-full w-full"
            priority
          />
        </div>
        <div className="aspect-square overflow-hidden">
          <ManagedVideo
            clipId="bouquet-assembly"
            description="Detalhe do buquê próximo às mãos, evidenciando volume e escala."
            aspectClassName="h-full w-full"
          />
        </div>
        <div className="aspect-square overflow-hidden">
          <ManagedVideo
            clipId="coeur-assembly"
            description="Caixa Le Cœur Royale junto ao corpo, evidenciando dimensão real."
            aspectClassName="h-full w-full"
          />
        </div>
      </div>

      {facts.length > 0 && (
        <dl className="container-lga mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-gold/10 pt-8 sm:grid-cols-4">
          {facts.map(([key, value]) => (
            <div key={key}>
              <dt className="eyebrow">{factLabels[key]}</dt>
              <dd className="mt-2 font-display text-lg text-ivory">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
