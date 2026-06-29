import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function RouteSlideTransition({ active, direction = "up", label, title, onCovered, onComplete }) {
  const rootRef = useRef(null);
  const coveredRef = useRef(false);

  useGSAP(
    () => {
      if (!active || !rootRef.current) return;

      coveredRef.current = false;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        onCovered?.();
        onComplete?.();
        return;
      }

      const fromY = direction === "down" ? -100 : 100;
      const exitY = direction === "down" ? 100 : -100;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.set(rootRef.current, { yPercent: fromY, autoAlpha: 1 })
        .to(rootRef.current, { yPercent: 0, duration: 0.72, ease: "expo.out" })
        .call(() => {
          if (coveredRef.current) return;
          coveredRef.current = true;
          onCovered?.();
        })
        .to({}, { duration: 0.18 })
        .to(rootRef.current, {
          yPercent: exitY,
          duration: 0.78,
          ease: "expo.inOut",
          onComplete,
        });
    },
    { scope: rootRef, dependencies: [active, direction, label, title] },
  );

  if (!active) return null;

  return (
    <div ref={rootRef} className="fixed-edge fixed inset-0 z-[255] flex items-center bg-[#070A08] text-ink">
      <div className="section-wrapper w-full">
        <div className="max-w-3xl">
          <p className="label mb-6 text-ink/68">{label}</p>
          <h2 className="font-display text-[clamp(3rem,10vw,8.5rem)] font-semibold uppercase leading-[0.88] tracking-normal text-ink">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}