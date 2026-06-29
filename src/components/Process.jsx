import { useRef } from "react";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { process } from "../data/process";

export default function Process() {
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef, { stagger: 0.18 });

  return (
    <section
      id="process"
      ref={sectionRef}
      className="py-20 md:py-32 border-hairline-t"
    >
      <div className="section-wrapper">
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <span className="label text-ink/40 gsap-reveal inline-flex items-center gap-2 mb-4">
            How We Work
          </span>
          <h2 className="headline-lg gsap-reveal">Our Process</h2>
        </div>

        {/* Process steps */}
        <div className="flex flex-col">
          {process.map((step, i) => (
            <div
              key={step.label}
              className={`gsap-reveal grid md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-12 ${
                i < process.length - 1 ? "border-hairline-b" : ""
              }`}
            >
              {/* Step number */}
              <div className="md:col-span-2">
                <span
                  className="font-display font-semibold text-5xl md:text-6xl text-ink/10 leading-none"
                  aria-hidden="true"
                >
                  {step.label}
                </span>
              </div>

              {/* Step content */}
              <div className="md:col-span-3">
                <h3 className="font-display font-semibold text-xl md:text-2xl tracking-tight">
                  {step.title}
                </h3>
              </div>

              <div className="md:col-span-7 lg:col-span-5">
                <p className="text-ink/60 text-sm md:text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

