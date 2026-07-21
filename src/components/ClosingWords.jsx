import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const words = "Some presences do not need to be loud to be felt. They stay beside the journey, turning uncertainty into direction, giving patience a shape, and reminding us that every meaningful work grows from trust, care, and the courage to keep moving together.".split(" ");

export default function ClosingWords() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wordEls = sectionRef.current?.querySelectorAll(".closing-word");
      if (!wordEls || wordEls.length === 0) return;

      if (prefersReduced) {
        gsap.set(wordEls, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        wordEls,
        { opacity: 0.2, y: 18 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            end: "bottom 42%",
            scrub: 0.7,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section id="mentor-note" ref={sectionRef} className="border-hairline-t pt-24 pb-14 md:pt-36 md:pb-16" aria-label="A quiet note before mentor section">
      <div className="section-wrapper">
        <span className="label mb-8 inline-flex text-ink/48">A Quiet Note</span>
        <p className="max-w-6xl font-display text-3xl font-semibold leading-tight text-ink md:text-6xl">
          {words.map((word, index) => (
            <span key={`${word}-${index}`} className="closing-word inline-block opacity-20">
              {word}{index < words.length - 1 ? "\u00a0" : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}