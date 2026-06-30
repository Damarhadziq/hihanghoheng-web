import { useEffect, useRef } from "react";

const COVER_DELAY_MS = 720;
const COMPLETE_DELAY_MS = 1680;

export default function RouteSlideTransition({ active, direction = "up", label, title, onCovered, onComplete }) {
  const coveredRef = useRef(false);
  const onCoveredRef = useRef(onCovered);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCoveredRef.current = onCovered;
    onCompleteRef.current = onComplete;
  }, [onCovered, onComplete]);

  useEffect(() => {
    if (!active) return undefined;

    coveredRef.current = false;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      onCoveredRef.current?.();
      onCompleteRef.current?.();
      return undefined;
    }

    const coveredId = window.setTimeout(() => {
      if (coveredRef.current) return;
      coveredRef.current = true;
      onCoveredRef.current?.();
    }, COVER_DELAY_MS);

    const completeId = window.setTimeout(() => {
      onCompleteRef.current?.();
    }, COMPLETE_DELAY_MS);

    return () => {
      window.clearTimeout(coveredId);
      window.clearTimeout(completeId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      className={`route-slide-transition route-slide-transition--${direction} fixed-edge fixed inset-0 z-[255] flex items-center bg-[#070A08] text-ink`}
    >
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
