import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
      const container = containerRef.current;
      if (!container) return undefined;

      const elements = container.querySelectorAll(target);
      if (!elements || elements.length === 0) return undefined;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        gsap.set(elements, { opacity: 1, y: 0 });
        return undefined;
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
            trigger: container,
            start,
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        },
      );

      const refreshWhenReady = () => requestAnimationFrame(() => ScrollTrigger.refresh());
      document.fonts?.ready?.then(refreshWhenReady);
      window.addEventListener("load", refreshWhenReady, { once: true });

      return () => window.removeEventListener("load", refreshWhenReady);
    },
    { scope: containerRef },
  );
}