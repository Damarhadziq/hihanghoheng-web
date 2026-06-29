import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const writeCount = (node, value) => {
  if (!node) return;
  node.textContent = String(Math.round(value));
};

export default function ProjectTransition({ active, onCovered, onComplete }) {
  const rootRef = useRef(null);
  const progressRef = useRef(null);
  const countRef = useRef(null);
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

      const progress = { value: 0 };
      writeCount(countRef.current, 0);
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.set(rootRef.current, { yPercent: 100, autoAlpha: 1 })
        .set(progressRef.current, { scaleX: 0, transformOrigin: "left center" })
        .to(rootRef.current, { yPercent: 0, duration: 0.72, ease: "expo.out" })
        .to(progressRef.current, { scaleX: 1, duration: 1.05, ease: "power2.inOut" }, "-=0.08")
        .to(progress, {
          value: 100,
          duration: 1.05,
          ease: "power2.inOut",
          onUpdate: () => writeCount(countRef.current, progress.value),
          onComplete: () => writeCount(countRef.current, 100),
        }, "-=1.05")
        .call(() => {
          if (coveredRef.current) return;
          coveredRef.current = true;
          onCovered?.();
        })
        .to({}, { duration: 0.28 })
        .to(rootRef.current, {
          yPercent: -100,
          duration: 0.78,
          ease: "expo.inOut",
          onComplete,
        });
    },
    { scope: rootRef, dependencies: [active] },
  );

  if (!active) return null;

  return (
    <div ref={rootRef} className="fixed-edge fixed inset-0 z-[260] flex items-center bg-[#070A08] text-ink">
      <div className="section-wrapper w-full">
        <div className="max-w-3xl">
          <p className="label mb-6 text-ink/68">Opening project archive</p>
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(3rem,10vw,8.5rem)] font-semibold uppercase leading-[0.88] tracking-normal text-ink">
              All<br />Projects
            </h2>
            <span ref={countRef} className="font-mono text-2xl text-ink/78 md:text-4xl">000</span>
          </div>
          <div className="h-px w-full overflow-hidden bg-ink/18">
            <div ref={progressRef} className="h-full w-full origin-left bg-ink" />
          </div>
        </div>
      </div>
    </div>
  );
}
