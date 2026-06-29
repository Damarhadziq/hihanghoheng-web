import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Attaches a ScrollTrigger-based reveal animation to `.gsap-reveal` children
 * inside the given container ref. If prefers-reduced-motion is enabled, elements
 * are shown immediately without animation.
 *
 * @param {React.RefObject} containerRef - ref to the section wrapper
 * @param {object} [options] - optional overrides
 * @param {string} [options.target=".gsap-reveal"] - selector inside container
 * @param {number} [options.y=40] - initial translateY offset
 * @param {number} [options.stagger=0.12] - stagger between children
 * @param {number} [options.duration=0.8] - animation duration
 * @param {string} [options.start="top 85%"] - ScrollTrigger start position
 */
export function useGsapReveal(containerRef, options = {}) {
  const {
    target = ".gsap-reveal",
    y = 40,
    stagger = 0.12,
    duration = 0.8,
    start = "top 85%",
  } = options;

  useGSAP(
    () => {
      // Respect prefers-reduced-motion
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const elements = containerRef.current?.querySelectorAll(target);
      if (!elements || elements.length === 0) return;

      if (prefersReduced) {
        // Just show them without animation
        gsap.set(elements, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        elements,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );
}
