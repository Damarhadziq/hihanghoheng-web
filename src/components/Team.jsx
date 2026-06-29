import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroImage from "../assets/hero.png";
import { team } from "../data/team";

gsap.registerPlugin(ScrollTrigger);

export default function Team() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        gsap.set([".team-card", textRef.current].filter(Boolean), { opacity: 1, y: 0, xPercent: 0 });
        return;
      }

      gsap.to(textRef.current, {
        xPercent: -28,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "center top",
          scrub: 1,
        },
      });

      gsap.fromTo(
        ".team-card",
        { y: 42, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".team-grid",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section id="team" ref={sectionRef} className="overflow-hidden border-hairline-t py-20 md:py-32">
      <div className="section-wrapper">
        <span className="label mb-8 inline-flex text-ink/48">The People</span>
      </div>

      <div className="mb-12 w-full overflow-hidden md:mb-16">
        <div className="flex whitespace-nowrap pl-[8vw]">
          <p ref={textRef} className="font-display text-[18vw] font-semibold uppercase leading-none text-ink/95 md:text-[11vw]">
            MEET THE <span className="text-signal">MAKERS</span> MEET THE <span className="text-gold">MAKERS</span> MEET THE <span className="text-sage">MAKERS</span>
          </p>
        </div>
      </div>

      <div className="section-wrapper">
        <div className="team-grid grid gap-6 md:grid-cols-3 md:gap-8">
          {team.map((member, index) => (
            <article key={`${member.name}-${index}`} className="team-card gsap-clickable-card group border border-hairline bg-ink/[0.018] p-3 opacity-0">
              <div className="aspect-[4/5] overflow-hidden bg-ink/5">
                <img
                  src={heroImage}
                  alt={member.name}
                  className="h-full w-full object-cover opacity-78 mix-blend-luminosity transition duration-500 group-hover:scale-105"
                  draggable="false"
                />
              </div>
              <div className="pt-5">
                <p className="label mb-2 text-gold">{member.role}</p>
                <h3 className="font-display text-2xl font-semibold leading-tight text-ink md:text-3xl">{member.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/64">{member.programStudy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


