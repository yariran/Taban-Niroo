import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/header";
import { SITE_IMAGES } from "@/lib/site-images";
import { CEOSection } from "@/components/sections/ceo-section";
import { FooterSection } from "@/components/sections/footer-section";
import { SocialResponsibilitySection } from "@/components/sections/social-responsibility-section";
import { RevealWords, RevealUp } from "@/components/ui/reveal-words";
import { CountUp } from "@/components/ui/count-up";

export const metadata: Metadata = {
  title: "About",
  description:
    "Taban Niroo: high-voltage composite insulators and power transmission equipment from Shiraz Special Economic Zone. IEC-tested, serving the Middle East and beyond since 1998.",
  openGraph: {
    title: "About | Taban Niroo",
    description:
      "Manufacturer of medium and high-voltage composite insulators, hybrid insulators, and accessories.",
  },
};

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <Header />

      <section className="bg-background">
        <div className="px-6 pt-28 pb-20 md:px-12 md:pt-32 md:pb-24 lg:px-20 lg:pt-36 lg:pb-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                About Taban Niroo
              </p>
              <h1 className="mt-4 text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
                <RevealWords as="span" className="block">
                  High-voltage expertise.
                </RevealWords>
                <RevealWords as="span" className="block" delay={140}>
                  Engineered in Shiraz.
                </RevealWords>
              </h1>
              <RevealUp as="p" delay={420} className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Taban Niroo is one of the leading manufacturers in the power and electricity
                sector in the Middle East, with more than two decades of experience in high-voltage
                power transmission projects and composite insulators. Our journey began in 1998 with
                a clear focus on innovation, reliability, and a safe working environment for our people.
              </RevealUp>
              <RevealUp as="p" delay={520} className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                From Shiraz Special Economic Zone, we design and manufacture medium and high-voltage
                composite insulators, hybrid insulators, transformer bushings, and accessories, serving
                clients across the Middle East, Africa, South America, and Eastern Europe.
              </RevealUp>

              <div className="mt-8 grid max-w-xl grid-cols-2 gap-6 border-t border-border pt-8 md:grid-cols-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Founded
                  </p>
                  <p className="mt-2 text-xl font-medium text-foreground tabular">
                    <CountUp to={1998} duration={1700} />
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Projects
                  </p>
                  <p className="mt-2 text-xl font-medium text-foreground tabular">
                    <CountUp to={80} prefix="+" />
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Rated voltage
                  </p>
                  <p className="mt-2 text-xl font-medium text-foreground tabular">
                    <CountUp to={1100} suffix=" kV" />
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Countries
                  </p>
                  <p className="mt-2 text-xl font-medium text-foreground tabular">
                    <CountUp to={9} />
                  </p>
                </div>
              </div>
            </div>

            <div className="cine-grade relative h-[320px] overflow-hidden rounded-2xl bg-secondary md:h-[380px]">
              <Image
                src={SITE_IMAGES.hero}
                alt="High-voltage composite insulators at Taban Niroo"
                fill
                priority
                className="object-cover grayscale"
              />
              <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-background/70 via-transparent to-background/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="px-6 pb-8 md:px-12 md:pb-12 lg:px-20 lg:pb-16">
          <div className="grid gap-12 border-t border-border pt-12 lg:grid-cols-3 lg:gap-16">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Company profile
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Under the leadership of Managing Director Asadollah Zamani, Taban Niroo combines
                engineering discipline with a strong culture of safety and responsibility. Our team
                of skilled specialists and technocrats focuses on long-term performance and dependable
                operation in the field.
              </p>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground lg:col-span-2">
              <p>
                Our core activities include the design and manufacturing of high-voltage electrical
                composite accessories, from distribution and transmission line insulators to station
                post insulators, railway insulators, hybrid insulators, transformer bushings, and
                cable accessories.
              </p>
              <p>
                Taban Niroo’s culture is built around Excellence in Innovation, Leadership by Example,
                Integrity and Transparency, a strong client focus, and an employee-centred approach.
                These principles guide our decisions and ensure that every product is engineered for
                consistent performance over its service life.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SocialResponsibilitySection />

      <CEOSection />

      <FooterSection />
    </main>
  );
}

