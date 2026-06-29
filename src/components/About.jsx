import { useRef } from "react";
import { useGsapReveal } from "../hooks/useGsapReveal";

export default function About() {
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 md:py-32 border-hairline-t"
    >
      <div className="section-wrapper">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          {/* Label column */}
          <div className="md:col-span-3">
            <span className="label text-ink/40 gsap-reveal inline-flex items-center gap-2">
              About Us
            </span>
          </div>

          {/* Content column */}
          <div className="md:col-span-9 lg:col-span-7">
            <h2 className="headline-md mb-6 gsap-reveal">
              We're a team of designers and developers from a university most
              people haven't heard of - and that's exactly what drives us.
            </h2>
            <div className="space-y-4 gsap-reveal">
              <p className="text-ink/70 text-base md:text-lg leading-relaxed">
                Hihang Hoheng was born out of a shared frustration: we saw incredible
                talent at Universitas Negeri Semarang going unnoticed. So we formed a team,
                entered competitions, and started building - not just products, but a
                reputation.
              </p>
              <p className="text-ink/70 text-base md:text-lg leading-relaxed">
                Our approach blends rigorous user research with bold visual design.
                We don't just make things look good - we make them work, we test them,
                and we document everything along the way. Every project is a case study.
                Every competition is a benchmark.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


