import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/header";
import { SITE_IMAGES } from "@/lib/site-images";
import { FooterSection } from "@/components/sections/footer-section";
import { RevealWords, RevealUp } from "@/components/ui/reveal-words";

export const metadata: Metadata = {
  title: "Projects & partners",
  description:
    "Taban Niroo insulators in transmission and distribution projects across the Middle East, Africa, and South America.",
  openGraph: {
    title: "Projects & partners | Taban Niroo",
    description:
      "High-voltage composite insulators for overhead lines and substations in demanding environments.",
  },
};

export default function ProjectsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <Header />

      <section className="bg-background">
        <div className="px-6 pt-28 pb-20 md:px-12 md:pt-32 md:pb-24 lg:px-20 lg:pt-36 lg:pb-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Projects &amp; partners
              </p>
              <h1 className="mt-4 text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
                <RevealWords as="span" className="block">
                  Power transmission.
                </RevealWords>
                <RevealWords as="span" className="block" delay={140}>
                  Regional reach.
                </RevealWords>
              </h1>
              <RevealUp
                as="p"
                delay={380}
                className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                Taban Niroo supports high-voltage projects across the Middle East, Africa, and South
                America. Our composite and hybrid insulators are installed on overhead lines and in
                substations in demanding climatic and pollution conditions.
              </RevealUp>
            </div>

            <div className="cine-grade relative h-[320px] overflow-hidden rounded-2xl bg-secondary md:h-[380px]">
              <Image
                src={SITE_IMAGES.projectsHero}
                alt="Transmission infrastructure in operation"
                fill
                className="object-cover grayscale"
              />
              <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-background/70 via-transparent to-background/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="px-6 pb-24 md:px-12 md:pb-28 lg:px-20 lg:pb-32">
          <div className="grid gap-10 border-t border-border pt-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Regions served
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
                Taban Niroo products are installed in projects across Africa, South America, the
                Middle East, and parts of Europe. We support utilities and industrial partners in
                both new-build and retrofit applications.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                Experience in different grid configurations, voltage levels, and environmental
                conditions allows our engineering teams to help select appropriate insulator designs
                and creepage distances for each project.
              </p>
            </div>

            <div className="grid gap-4 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Africa
                </p>
                <p className="mt-2">
                  Projects in Liberia, Morocco, Ghana, and Somalia, supporting overhead transmission
                  and distribution networks.
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  South America &amp; Europe
                </p>
                <p className="mt-2">
                  Installations in Peru and Colombia, as well as projects in Greece, using composite
                  and hybrid solutions tailored to local requirements.
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Middle East &amp; Asia
                </p>
                <p className="mt-2">
                  Projects in Iraq and Afghanistan, together with extensive experience in Iran’s
                  transmission network, across a range of voltage classes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}

