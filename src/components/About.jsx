import { useRef } from "react";
import { useGsapReveal } from "../hooks/useGsapReveal";
import GalleryMarquee from "./GalleryMarquee";

const stats = [
  ["12+", "Competitions joined"],
  ["2", "Inter/national scales"],
  ["5", "Awards & finalist runs"],
];

export default function About({ variant = "home" }) {
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef);

  if (variant === "page") {
    return (
      <section id="about" ref={sectionRef} className="about-page border-hairline-t">
        <div className="about-marquee-hero gsap-reveal">
          <GalleryMarquee variant="background" />
          <div className="about-marquee-overlay" />
          <header className="about-marquee-copy">
            <span className="label mb-5 inline-flex text-[#F8F5EC]/68">About</span>
            <h1 className="about-page-headline mb-6">
              <span>Built from briefs and research.</span>
              <span>Ready for the final pitch.</span>
            </h1>
            <p className="mx-auto max-w-4xl text-sm leading-7 text-[#F8F5EC]/72 md:text-base">
              HIHANG HOENG is a UI/UX competition team from Universitas Negeri Semarang. We turn briefs and research into prototypes, pitch decks, and clear documentation.
            </p>
          </header>
        </div>

        <div className="about-page-content section-wrapper">
          <div className="grid gap-3 border-y border-hairline py-5 sm:grid-cols-3">
            {stats.map(([value, label]) => (
              <div key={label} className="about-stat gsap-reveal">
                <strong>{value}</strong>
                <span className="label text-ink/48">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:mt-16 md:grid-cols-2">
            <article className="about-panel gsap-reveal">
              <p className="label mb-4 text-gold">Vision</p>
              <h2 className="font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">To become a consistent design competition team that carries campus-born work to broader stages.</h2>
            </article>
            <article className="about-panel gsap-reveal">
              <p className="label mb-4 text-gold">Mission</p>
              <p className="text-sm leading-8 text-ink/68 md:text-base">
                To enter competitions with intention, build a clear research process, document every design decision, and help each member grow through work that can stand in front of judges.
              </p>
            </article>
          </div>

          <div className="mt-10 grid gap-8 md:mt-16 md:grid-cols-12">
            <div className="md:col-span-3"><span className="label text-ink/48 gsap-reveal">Core story</span></div>
            <div className="md:col-span-9 lg:col-span-7">
              <div className="space-y-5 gsap-reveal">
                <p className="text-base leading-8 text-ink/70 md:text-lg">We believe competitions are honest learning rooms. Ideas need reasons, prototypes need to be explained, and every detail has to connect back to a real problem.</p>
                <p className="text-base leading-8 text-ink/70 md:text-lg">This website is the archive of HIHANG HOENG's journey: projects born from competitions, documented achievements, and the people who shape each submission from brief to judging.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 md:py-32 border-hairline-t"
    >
      <div className="section-wrapper">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-3">
            <span className="label text-ink/40 gsap-reveal inline-flex items-center gap-2">
              About Us
            </span>
          </div>

          <div className="md:col-span-9 lg:col-span-7">
            <h2 className="headline-md mb-6 gsap-reveal">
              We're a team of designers and developers from a university most
              people haven't heard of - and that's exactly what drives us.
            </h2>
            <div className="space-y-4 gsap-reveal">
              <p className="text-ink/70 text-base md:text-lg leading-relaxed">
                Hihang Hoeng was born out of a shared frustration: we saw incredible
                talent at Universitas Negeri Semarang going unnoticed. So we formed a team,
                entered competitions, and started building - not just products, but a
                reputation.
              </p>
              <p className="text-ink/70 text-base md:text-lg leading-relaxed">
                Our approach blends rigorous user research with bold visual design.
                We don't just make things look good - we make them work, we test them,
                and we document everything along the way. Every project is a competition archive.
                Every competition is a benchmark.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

