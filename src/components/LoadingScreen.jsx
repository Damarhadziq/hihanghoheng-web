import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const waitForDocumentReady = () => {
  const domPromise = document.readyState === "loading"
    ? new Promise((resolve) => document.addEventListener("DOMContentLoaded", resolve, { once: true }))
    : Promise.resolve();

  const fontPromise = document.fonts?.ready || Promise.resolve();
  const fontWithCap = Promise.race([fontPromise, delay(700)]);
  const paintPromise = new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const minimumPromise = delay(950);

  return Promise.race([
    Promise.all([domPromise, fontWithCap, paintPromise, minimumPromise]),
    delay(1600),
  ]);
};

const writeCount = (node, value) => {
  if (!node) return;
  node.textContent = `${String(Math.round(value)).padStart(3, "0")}%`;
};

export default function LoadingScreen({ onComplete }) {
  const rootRef = useRef(null);
  const contentRef = useRef(null);
  const logoRef = useRef(null);
  const progressRef = useRef(null);
  const countRef = useRef(null);

  useGSAP(
    () => {
      let cancelled = false;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        onComplete?.();
        return () => {
          cancelled = true;
        };
      }

      const progress = { value: 0 };
      writeCount(countRef.current, 0);
      gsap.set(rootRef.current, { yPercent: 0 });
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(contentRef.current, { opacity: 0, y: 56 }, { opacity: 1, y: 0, duration: 0.72 })
        .fromTo(logoRef.current, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.74 }, "-=0.48")
        .to(progressRef.current, { scaleX: 0.82, duration: 0.9, ease: "power2.out" }, "-=0.28")
        .to(progress, {
          value: 82,
          duration: 0.9,
          ease: "power2.out",
          onUpdate: () => writeCount(countRef.current, progress.value),
        }, "-=0.9");

      waitForDocumentReady().then(() => {
        if (cancelled) return;
        intro.eventCallback("onComplete", () => {
          if (cancelled) return;
          const outro = gsap.timeline({ defaults: { ease: "power3.out" } });
          outro
            .to(progressRef.current, { scaleX: 1, duration: 0.42, ease: "power2.inOut" })
            .to(progress, {
              value: 100,
              duration: 0.42,
              ease: "power2.inOut",
              onUpdate: () => writeCount(countRef.current, progress.value),
              onComplete: () => writeCount(countRef.current, 100),
            }, "-=0.42")
            .to({}, { duration: 0.24 })
            .to(contentRef.current, { y: -30, opacity: 0, duration: 0.38, ease: "power2.in" })
            .to(rootRef.current, {
              yPercent: -100,
              duration: 0.82,
              ease: "expo.inOut",
              onComplete,
            }, "-=0.05");
        });

        if (!intro.isActive()) intro.eventCallback("onComplete")?.();
      });

      return () => {
        cancelled = true;
        intro.kill();
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="fixed inset-0 z-[300] flex items-center justify-center bg-[#070A08] text-ink">
      <div className="section-wrapper w-full">
        <div ref={contentRef} className="mx-auto flex max-w-xl flex-col items-center gap-8 text-center">
          <img ref={logoRef} src="/hihang-hoeng-logo.svg" alt="Hihang Hoeng" className="h-auto w-[178px] object-contain md:w-[220px]" />
          <div className="w-full max-w-sm">
            <div className="mb-3 flex items-center justify-between label text-ink/68">
              <span>Preparing craft</span>
              <span ref={countRef}>000%</span>
            </div>
            <div className="h-px w-full overflow-hidden bg-ink/18">
              <div ref={progressRef} className="h-full w-full origin-left bg-ink" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
