import { closing } from "@/data/content";
import ManagedVideo from "@/components/media/ManagedVideo";

export default function Closing() {
  return (
    <section className="relative flex min-h-[60svh] items-center overflow-hidden" aria-label="Encerramento">
      <div className="absolute inset-0 opacity-70">
        <ManagedVideo
          clipId="ribbon-detail"
          description="Uma fita repousando na penumbra, luz se apagando lentamente sobre a criação."
          aspectClassName="h-full w-full"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 50%, rgba(7,5,4,0.35) 0%, rgba(7,5,4,0.92) 100%)",
        }}
      />

      <div className="container-lga relative z-10 py-20 text-center">
        <p className="eyebrow">{closing.collabLine}</p>
        <p className="mt-4 font-display text-3xl tracking-[0.12em] text-ivory sm:text-4xl">
          {closing.title}
        </p>
        <p className="mt-5 font-signature text-2xl text-gold">{closing.signature}</p>
      </div>
    </section>
  );
}
