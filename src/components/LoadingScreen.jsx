import { useLayoutEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const withTimeout = (promise, ms) => Promise.race([promise, delay(ms)]);

const waitForWindowLoad = () => {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
};

const waitForFonts = () => document.fonts?.ready || Promise.resolve();

const waitForImages = async () => {
  const images = Array.from(document.images);
  if (!images.length) return;

  await Promise.allSettled(
    images.map((image) => {
      if (image.complete && image.naturalWidth > 0) return Promise.resolve();
      if (typeof image.decode === "function") {
        return image.decode().catch(
          () => new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          }),
        );
      }

      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }),
  );
};

const waitForFinalPaint = () => new Promise((resolve) => {
  requestAnimationFrame(() => requestAnimationFrame(resolve));
});

const writeCount = (node, value) => {
  if (!node) return;
  node.textContent = `${Math.round(value)}%`;
};

export default function LoadingScreen({ onComplete }) {
  const rootRef = useRef(null);
  const contentRef = useRef(null);
  const logoRef = useRef(null);
  const progressRef = useRef(null);
  const countRef = useRef(null);
  const completedRef = useRef(false);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousRootHeight = root.style.height;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyHeight = body.style.height;
    const previousBodyPosition = body.style.position;
    const previousBodyInset = body.style.inset;
    const previousBodyWidth = body.style.width;
    const previousBodyTouchAction = body.style.touchAction;

    window.scrollTo(0, 0);
    root.style.overflow = "hidden";
    root.style.height = "100%";
    body.style.overflow = "hidden";
    body.style.height = "100%";
    body.style.position = "fixed";
    body.style.inset = "0";
    body.style.width = "100%";
    body.style.touchAction = "none";

    const preventScroll = (event) => event.preventDefault();
    const preventScrollKeys = (event) => {
      const lockedKeys = ["ArrowDown", "ArrowUp", "End", "Home", "PageDown", "PageUp", " "];
      if (lockedKeys.includes(event.key)) event.preventDefault();
    };
    const restoreTop = () => window.scrollTo(0, 0);

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScrollKeys);
    window.addEventListener("scroll", restoreTop, { passive: true });

    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventScrollKeys);
      window.removeEventListener("scroll", restoreTop);
      root.style.overflow = previousRootOverflow;
      root.style.height = previousRootHeight;
      body.style.overflow = previousBodyOverflow;
      body.style.height = previousBodyHeight;
      body.style.position = previousBodyPosition;
      body.style.inset = previousBodyInset;
      body.style.width = previousBodyWidth;
      body.style.touchAction = previousBodyTouchAction;
      window.scrollTo(0, 0);
    };
  }, []);

  useGSAP(
    () => {
      let cancelled = false;
      let outro = null;
      const completeOnce = () => {
        if (completedRef.current) return;
        completedRef.current = true;
        onComplete?.();
      };
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        completeOnce();
        return () => {
          cancelled = true;
        };
      }

      const progress = { value: 0 };
      const setProgress = (value, duration = 0.38) => new Promise((resolve) => {
        gsap.to(progressRef.current, { scaleX: value / 100, duration, ease: "power2.inOut", overwrite: "auto" });
        gsap.to(progress, {
          value,
          duration,
          ease: "power2.inOut",
          overwrite: "auto",
          onUpdate: () => writeCount(countRef.current, progress.value),
          onComplete: resolve,
        });
      });

      writeCount(countRef.current, 0);
      gsap.set(rootRef.current, { yPercent: 0 });
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(contentRef.current, { opacity: 0, y: 64 }, { opacity: 1, y: 0, duration: 0.72 })
        .fromTo(logoRef.current, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.74 }, "-=0.48");

      const boot = async () => {
        await Promise.all([intro.then?.() || delay(760), setProgress(18, 0.45)]);
        if (cancelled) return;

        const minimumTime = delay(650);

        await withTimeout(waitForWindowLoad(), 1800);
        if (cancelled) return;
        await setProgress(48);

        await withTimeout(waitForFonts(), 1800);
        if (cancelled) return;
        await setProgress(68);

        await withTimeout(waitForImages(), 2400);
        if (cancelled) return;
        await setProgress(88);

        await waitForFinalPaint();
        await minimumTime;
        if (cancelled) return;
        await setProgress(100, 0.32);

        outro = gsap.timeline({ defaults: { ease: "power3.out" } });
        outro
          .to({}, { duration: 0.18 })
          .to(contentRef.current, { y: -30, opacity: 0, duration: 0.38, ease: "power2.in" })
          .to(rootRef.current, {
            yPercent: -100,
            duration: 0.82,
            ease: "expo.inOut",
            onComplete: completeOnce,
          }, "-=0.05");
      };

      boot();

      return () => {
        cancelled = true;
        intro.kill();
        outro?.kill();
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="boot-loading-screen fixed-edge fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-[#070A08] text-ink">
      <div className="section-wrapper w-full">
        <div ref={contentRef} className="mx-auto flex max-w-xl flex-col items-center gap-8 text-center">
          <img ref={logoRef} src="/hihang-hoeng-logo.svg" alt="Hihang Hoeng" className="h-auto w-[178px] object-contain md:w-[220px]" loading="lazy" />
          <div className="w-full max-w-sm">
            <div className="mb-3 flex items-center justify-between label text-ink/68">
              <span>Preparing craft</span>
              <span ref={countRef}>0%</span>
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
