import type { Metadata } from "next";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";
import { RevealWords, RevealUp } from "@/components/ui/reveal-words";

export const metadata: Metadata = {
  title: "Blog – R&D",
  description:
    "Research, testing, and field experience from Taban Niroo’s R&D team. IEC-based design for demanding electrical and environmental conditions.",
  openGraph: {
    title: "Blog – R&D | Taban Niroo",
    description:
      "Insights on composite insulator design, standards, and field performance.",
  },
};

export default function BlogPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <Header />

      <section className="bg-background">
        <div className="px-6 pt-28 pb-20 md:px-12 md:pt-32 md:pb-24 lg:px-20 lg:pt-36 lg:pb-28">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Blog – R&amp;D
          </p>
          <h1 className="mt-4 text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
            <RevealWords as="span" className="block">
              Research, testing,
            </RevealWords>
            <RevealWords as="span" className="block" delay={140}>
              and field experience.
            </RevealWords>
          </h1>
          <RevealUp
            as="p"
            delay={420}
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Taban Niroo’s Research &amp; Development team focuses on the design and development of
            products that deliver additional value under demanding electrical and environmental
            conditions. Our work is guided by IEC standards and continuous feedback from the field.
          </RevealUp>
        </div>
      </section>

      <section className="bg-background">
        <div className="px-6 pb-24 md:px-12 md:pb-28 lg:px-20 lg:pb-32">
          <div className="grid gap-8 md:grid-cols-3">
            <article className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background/60 p-6 backdrop-blur">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  R&amp;D note
                </p>
                <h2 className="mt-3 text-xl font-semibold text-foreground">
                  Composite insulators under pollution.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Insights on hydrophobic performance, leakage current behaviour, and creepage
                  optimisation using silicone housings and ECR fiberglass cores in polluted
                  environments.
                </p>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">IEC 61109 · IEC 62217</p>
            </article>

            <article className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background/60 p-6 backdrop-blur">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Engineering insight
                </p>
                <h2 className="mt-3 text-xl font-semibold text-foreground">
                  Hybrid insulators in substations.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Mechanical behaviour of porcelain cores combined with silicone sheds, and the
                  role of hybrid designs in extending creepage distance on station equipment.
                </p>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">Hybrid insulators · Bushings</p>
            </article>

            <article className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background/60 p-6 backdrop-blur">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Type testing
                </p>
                <h2 className="mt-3 text-xl font-semibold text-foreground">
                  Accredited laboratory testing.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Overview of type tests, routine tests, and long-duration performance checks
                  carried out in accredited laboratories according to IEC requirements.
                </p>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">Type tests · IEC standards</p>
            </article>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}

