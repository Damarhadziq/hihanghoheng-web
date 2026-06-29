import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

import { projects } from "../data/projects";

const extraProjects = [
  {
    name: "Ruang Rasa",
    year: "2025",
    tags: ["Brand System", "Editorial", "Motion"],
  },
  {
    name: "Arsip Kota",
    year: "2024",
    tags: ["Web Archive", "Research", "Mapping"],
  },
];

const showcaseProjects = [...projects, ...extraProjects].map((project, index) => ({
  ...project,
  id: index + 1,
  image: project.mockup16x9 || project.image || "/optimized/gallery/hero.webp",
}));

const wrapIndex = (index, total) => ((index % total) + total) % total;

export default function AllProjects({ onSelectProject }) {
  const stageRef = useRef(null);
  const cardsRef = useRef([]);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const draggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const activeRef = useRef(0);
  const isEnteringRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const total = showcaseProjects.length;
  const activeProject = showcaseProjects[activeIndex];

  const progressItems = useMemo(
    () => Array.from({ length: total }, (_, index) => index),
    [total],
  );

  const animateCaption = useCallback(() => {
    gsap.fromTo(
      [eyebrowRef.current, titleRef.current].filter(Boolean),
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.055, ease: "power3.out" },
    );
  }, []);

  const animateToIndex = useCallback(
    (nextIndex) => {
      const safeIndex = wrapIndex(nextIndex, total);
      activeRef.current = safeIndex;
      setActiveIndex(safeIndex);

      const cards = cardsRef.current.filter(Boolean);
      const isMobile = window.innerWidth < 768;
      const sideGap = isMobile ? window.innerWidth * 0.72 : Math.min(window.innerWidth * 0.52, 870);

      cards.forEach((card, index) => {
        let distance = index - safeIndex;
        if (distance > total / 2) distance -= total;
        if (distance < -total / 2) distance += total;

        const abs = Math.abs(distance);
        const isActive = distance === 0;
        const visibleSide = abs <= 1;

        gsap.to(card, {
          x: distance * sideGap,
          y: isActive ? 0 : 10,
          z: isActive ? 80 : -180,
          rotateY: isActive ? 0 : distance * -7,
          scale: isActive ? 1 : isMobile ? 0.62 : 0.68,
          opacity: visibleSide ? (isActive ? 1 : 0.42) : 0,
          filter: isActive ? "grayscale(1) brightness(0.92) blur(0px)" : "grayscale(1) brightness(0.42) blur(0.8px)",
          pointerEvents: isActive ? "auto" : "none",
          duration: 0.9,
          ease: "power3.out",
          overwrite: true,
        });
      });

      animateCaption();
    },
    [animateCaption, total],
  );

  const openActiveProject = useCallback(() => {
    if (isEnteringRef.current) return;

    isEnteringRef.current = true;
    if (titleRef.current) titleRef.current.disabled = true;
    onSelectProject?.(activeRef.current + 1);
  }, [onSelectProject]);

  const goTo = useCallback(
    (direction) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      animateToIndex(activeRef.current + direction);
      gsap.delayedCall(0.58, () => {
        isAnimatingRef.current = false;
      });
    },
    [animateToIndex],
  );

  const handlePointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;

    isPointerDownRef.current = true;
    draggedRef.current = false;
    dragStartXRef.current = event.clientX;
    dragStartYRef.current = event.clientY;
    event.currentTarget.classList.add("is-dragging");
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isPointerDownRef.current) return;

    const distanceX = event.clientX - dragStartXRef.current;
    const distanceY = event.clientY - dragStartYRef.current;
    if (Math.hypot(distanceX, distanceY) > 8) {
      draggedRef.current = true;
    }
  };

  const handlePointerEnd = (event) => {
    if (!isPointerDownRef.current) return;

    const distance = event.clientX - dragStartXRef.current;
    const threshold = Math.min(160, Math.max(84, window.innerWidth * 0.13));

    isPointerDownRef.current = false;
    event.currentTarget.classList.remove("is-dragging");
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    if (Math.abs(distance) >= threshold) {
      goTo(distance < 0 ? 1 : -1);
    } else {
      animateToIndex(activeRef.current);
    }

    window.setTimeout(() => {
      draggedRef.current = false;
    }, Math.abs(distance) > 8 ? 150 : 0);
  };

  useEffect(() => {
    if (!stageRef.current) return undefined;

    const context = gsap.context(() => {
      gsap.set(stageRef.current, { perspective: 1200 });
      gsap.set(cardsRef.current.filter(Boolean), {
        transformStyle: "preserve-3d",
        transformOrigin: "50% 50%",
      });
      gsap.fromTo(
        ".project-showcase-ui",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: "power3.out" },
      );
      animateToIndex(0);

      const handleResize = () => animateToIndex(activeRef.current);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, stageRef);

    return () => context.revert();
  }, [animateToIndex]);

  return (
    <main
      ref={stageRef}
      className="project-carousel-stage min-h-screen overflow-hidden bg-[#050605] pt-20 text-[#F8F5EC] select-none"
      aria-label="All projects showcase carousel"
    >
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(5,6,5,0.96),rgba(5,6,5,1))]" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.045] bg-[linear-gradient(90deg,rgba(248,245,236,0.2)_1px,transparent_1px),linear-gradient(0deg,rgba(248,245,236,0.16)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <section className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col justify-start px-5 pb-10 pt-8 md:px-10 md:pt-9">
        <div className="project-showcase-ui mx-auto flex w-full max-w-[1560px] items-center justify-end pb-4">
          <p className="label text-[#F8F5EC]/58" aria-live="polite">
            {activeIndex + 1} / {total}
          </p>
        </div>

        <div className="project-showcase-ui project-mockup-drag-zone relative mx-auto h-[49vh] min-h-[310px] w-full max-w-[1560px] touch-none md:h-[55vh] md:min-h-[420px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerEnd} onPointerCancel={handlePointerEnd} onPointerLeave={handlePointerEnd}>
          <div className="absolute left-1/2 top-1/2 h-full w-[82vw] max-w-[1094px] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] md:w-[57vw]">
            {showcaseProjects.map((project, index) => (
              <article
                key={project.id}
                ref={(node) => {
                  cardsRef.current[index] = node;
                }}
                className="absolute inset-0 h-full w-full overflow-hidden rounded-[10px] border border-[#F8F5EC]/12 bg-[#0a0b0a] shadow-[0_28px_80px_rgba(0,0,0,0.42)] will-change-transform"
                aria-hidden={activeIndex !== index}

              >
                <img
                  src={project.image}
                  alt=""
                  loading={index === activeIndex ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover opacity-62 mix-blend-luminosity"
                  draggable="false"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,5,0.02),rgba(5,6,5,0.34))]" />
              </article>
            ))}
          </div>
        </div>

        <div className="project-showcase-ui mx-auto w-full max-w-[1560px] pt-7 text-center md:pt-8">
          <p ref={eyebrowRef} className="label mb-3 text-[#F8F5EC]/58">
            {activeProject.year} / {activeProject.tags?.join(" / ")}
          </p>
          <button
            ref={titleRef}
            type="button"
            onClick={openActiveProject}
            disabled={isEnteringRef.current}
            className="project-title-link font-display text-4xl font-semibold leading-none tracking-normal text-[#F8F5EC] transition-colors duration-200 hover:text-[#F8F5EC]/72 focus-visible:text-[#F8F5EC]/72 disabled:pointer-events-none md:text-5xl"
            aria-label={`Enter ${activeProject.name} project details`}
          >
            {activeProject.name}
          </button>
        </div>

        <ol className="project-showcase-ui mx-auto mt-7 flex w-full max-w-[1560px] items-center justify-center gap-3" aria-label="Project progress">
          {progressItems.map((item) => (
            <li key={item}>
              <button
                type="button"
                onClick={() => animateToIndex(item)}
                className={`block h-0.5 transition-all duration-300 ${
                  item === activeIndex ? "w-12 bg-[#F8F5EC]" : "w-7 bg-[#F8F5EC]/24 hover:bg-[#F8F5EC]/70"
                }`}
                aria-label={`Go to project ${item + 1}`}
                aria-current={item === activeIndex ? "true" : undefined}
              />
            </li>
          ))}
        </ol>
      </section>

      <section className="sr-only" aria-label="Project list fallback">
        {showcaseProjects.map((project) => (
          <article key={project.id}>
            <h2>{project.name}</h2>
            <p>{project.year}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
