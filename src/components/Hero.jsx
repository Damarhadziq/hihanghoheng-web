import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import RotatingBadge from "./RotatingBadge";

export default function Hero() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const subheadRef = useRef(null);
  const badgeAreaRef = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        gsap.set([headlineRef.current, subheadRef.current, badgeAreaRef.current].filter(Boolean), {
          opacity: 1,
          y: 0,
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(headlineRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.9 })
        .fromTo(subheadRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
        .fromTo(badgeAreaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden"
    >
      <div className="section-wrapper w-full">
        <div className="flex flex-col gap-8 md:gap-12">
          <h1
            ref={headlineRef}
            className="headline-xl max-w-5xl text-ink cursor-default"
            style={{ opacity: 0 }}
          >
            WE BUILD
            <br />
            <span>IN PUBLIC</span>
          </h1>

          <p
            ref={subheadRef}
            className="text-lg md:text-xl text-ink/68 max-w-xl font-body font-normal"
            style={{ opacity: 0 }}
          >
            A UI/UX student team from Universitas Negeri Semarang, documenting every competition,
            every prototype, every lesson learned.
          </p>

          <div
            ref={badgeAreaRef}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-4 md:mt-8"
            style={{ opacity: 0 }}
          >
            <div className="flex items-start gap-6">
              <span className="label text-ink/58 pt-1">Est. 2023</span>
              <div className="border-hairline-l pl-6">
                <p className="font-display font-semibold text-base md:text-lg">Hihang Hoheng</p>
                <p className="text-sm text-ink/64 mt-1">Universitas Negeri Semarang</p>
                <p className="text-sm text-ink/64">UI/UX Design &amp; Development</p>
              </div>
            </div>

            <RotatingBadge />
          </div>
        </div>
      </div>
    </section>
  );
}
