/**
 * Social Responsibilities section.
 *
 * The three commitments below are reproduced from the Taban Niroo
 * Company Profile (2026, section "Social Responsibilities"). Each card
 * keeps the exact pillar name used in the source PDF — do not rename
 * without an updated brand document. The short descriptions paraphrase
 * the supporting sentences in the PDF to fit an editorial layout while
 * staying faithful to the original meaning.
 *
 * Design intent: matches the editorial rhythm of `WhyTabanSection` —
 * eyebrow + display heading + numbered list with hairline dividers. No
 * new colour tokens, fonts or shadows.
 */

type Commitment = {
  number: string;
  title: string;
  description: string;
};

const COMMITMENTS: readonly Commitment[] = [
  {
    number: "01",
    title: "Charitable giving",
    description:
      "We support local educational, cultural and humanitarian programmes around our Shiraz and Tehran offices — reinvesting a share of every project back into the communities our engineers and technicians come from.",
  },
  {
    number: "02",
    title: "Improve labor policies",
    description:
      "Safe working conditions, fair contracts and continuous technical training for our fifty-plus artisans and technocrats are a hard-coded part of the way the plant is run, not an HR initiative.",
  },
  {
    number: "03",
    title: "Corporate policies",
    description:
      "Environmental, occupational-health and governance commitments are documented, audited and revisited every year so that long-life power-network products are built by a long-life organisation.",
  },
];

export function SocialResponsibilitySection() {
  return (
    <section
      id="social-responsibility"
      className="bg-background"
      aria-labelledby="social-responsibility-heading"
    >
      <div className="px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Social responsibilities
              </p>
              <h2
                id="social-responsibility-heading"
                className="mt-4 text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl"
              >
                Accountable to
                <br />
                our people and place.
              </h2>
            </div>
            <div className="md:col-span-7 md:pt-3">
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Taban Niroo pairs its engineering commitments with a small
                number of social ones — kept deliberately short so we can
                actually deliver on them. They are the same three principles
                printed inside the current Company Profile.
              </p>
            </div>
          </div>

          <ol className="mt-16 border-t border-border md:mt-24">
            {COMMITMENTS.map((item) => (
              <li
                key={item.number}
                className="group grid grid-cols-1 gap-4 border-b border-border py-10 transition-colors duration-300 hover:bg-muted/25 md:grid-cols-12 md:gap-8 md:px-2 md:py-12 dark:hover:bg-white/[0.03]"
              >
                <div className="md:col-span-2">
                  <p className="font-mono text-xs tracking-widest text-muted-foreground">
                    {item.number}
                  </p>
                </div>
                <div className="md:col-span-4">
                  <h3 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">
                    {item.title}
                  </h3>
                </div>
                <div className="md:col-span-6">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
