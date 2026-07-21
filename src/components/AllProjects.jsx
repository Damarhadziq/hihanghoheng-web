import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { projects } from "../data/projects";
import Footer from "./Footer";

const showcaseProjects = projects.map((project, index) => ({
  ...project,
  id: index + 1,
  image: project.mockup16x9 || project.image || "/optimized/gallery/hero.webp",
}));

const wrapIndex = (index, total) => ((index % total) + total) % total;

function ProjectViewToggle({ viewMode, onChange }) {
  const rootRef = useRef(null);
  const indicatorRef = useRef(null);
  const buttonsRef = useRef([]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const indicator = indicatorRef.current;
    const activeIndex = viewMode === "showcase" ? 0 : 1;
    const activeButton = buttonsRef.current[activeIndex];
    const previousButton = buttonsRef.current[activeIndex === 0 ? 1 : 0];
    if (!root || !indicator || !activeButton) return undefined;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = { x: activeButton.offsetLeft, width: activeButton.offsetWidth };

    if (prefersReduced) {
      gsap.set(indicator, { ...target, opacity: 1, scale: 1 });
      return undefined;
    }

    gsap.fromTo(
      indicator,
      {
        x: previousButton?.offsetLeft ?? activeButton.offsetLeft,
        width: previousButton?.offsetWidth ?? activeButton.offsetWidth,
        opacity: 0.72,
        scale: 0.92,
      },
      { ...target, opacity: 1, scale: 1, duration: 0.48, ease: "power3.out", overwrite: true },
    );
    gsap.fromTo(root, { scale: 0.985 }, { scale: 1, duration: 0.42, ease: "back.out(1.7)", overwrite: true });

    return () => {
      gsap.killTweensOf([root, indicator]);
    };
  }, [viewMode]);

  return (
    <div ref={rootRef} className="project-view-toggle" aria-label="Project view mode">
      <span ref={indicatorRef} className="project-view-indicator" aria-hidden="true" />
      <button ref={(node) => { buttonsRef.current[0] = node; }} type="button" className={viewMode === "showcase" ? "is-active" : ""} onClick={() => onChange("showcase")} aria-pressed={viewMode === "showcase"}>Showcase</button>
      <button ref={(node) => { buttonsRef.current[1] = node; }} type="button" className={viewMode === "index" ? "is-active" : ""} onClick={() => onChange("index")} aria-pressed={viewMode === "index"}>Index</button>
    </div>
  );
}

export default function AllProjects({ onSelectProject, onViewChange, onViewModeChange }) {
  const stageRef = useRef(null);
  const indexRef = useRef(null);
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
  const [viewMode, setViewMode] = useState("showcase");

  useEffect(() => {
    onViewModeChange?.(viewMode);
    return () => onViewModeChange?.("showcase");
  }, [onViewModeChange, viewMode]);

  const total = showcaseProjects.length;
  const activeProject = showcaseProjects[activeIndex];

  const progressItems = useMemo(
    () => Array.from({ length: total }, (_, index) => index),
    [total],
  );

  const animateCaption = useCallback(() => {
    gsap.fromTo(
      [eyebrowRef.current, titleRef.current].filter(Boolean),
      { opacity: 0 },
      { opacity: 1, duration: 0.5, stagger: 0.055, ease: "power3.out" },
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

  useGSAP(
    () => {
      if (!stageRef.current) return undefined;
      gsap.set(stageRef.current, { perspective: 1200 });
      gsap.set(cardsRef.current.filter(Boolean), {
        transformStyle: "preserve-3d",
        transformOrigin: "50% 50%",
      });
      gsap.fromTo(
        ".project-showcase-ui",
        { opacity: 0 },
        { opacity: 1, duration: 0.75, stagger: 0.08, ease: "power3.out" },
      );
      animateToIndex(0);

      const handleResize = () => animateToIndex(activeRef.current);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
    { scope: stageRef, dependencies: [animateToIndex, viewMode] },
  );

  useGSAP(
    () => {
      if (viewMode !== "index" || !indexRef.current) return undefined;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const leadElements = gsap.utils.toArray(
        indexRef.current.querySelectorAll(".project-index-header > *"),
      );
      const cards = gsap.utils.toArray(indexRef.current.querySelectorAll(".project-index-card"));

      if (prefersReduced) {
        gsap.set([...leadElements, ...cards], { opacity: 1, y: 0, scale: 1 });
        return undefined;
      }

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline.fromTo(
        leadElements,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.62, stagger: 0.075, clearProps: "transform" },
      );
      timeline.fromTo(
        cards,
        { opacity: 0, y: 38, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 0.72, stagger: 0.1, clearProps: "transform" },
        "-=0.3",
      );

      return () => timeline.kill();
    },
    { scope: indexRef, dependencies: [viewMode] },
  );


  if (viewMode === "index") {
    return (
      <main ref={indexRef} className="project-index-page">
        <section className="section-wrapper project-index-shell" aria-labelledby="project-index-title">
          <div className="project-index-switch">
            <ProjectViewToggle viewMode={viewMode} onChange={setViewMode} />
          </div>

          <header className="project-index-header">
            <div>
              <p className="label text-ink/48">Competition Documentation / {showcaseProjects.length} Projects</p>
              <h1 id="project-index-title" className="headline-lg mt-4">Projects, at a glance.</h1>
            </div>
          </header>

          <div className="project-index-grid">
              {showcaseProjects.map((project) => (
                <article key={project.id} className="project-index-card">
                  <button
                    type="button"
                    className="project-index-media"
                    onClick={() => onSelectProject?.(project.id)}
                    aria-label={"Open " + project.name + " project details"}
                  >
                    <img src={project.image} alt="" loading="lazy" decoding="async" />
                    <span aria-hidden="true">View case</span>
                  </button>
                  <div className="project-index-card-copy">
                    <div className="project-index-meta">
                      <span>{project.year}</span>
                      <span>{project.organizer}</span>
                    </div>
                    <button type="button" className="project-index-title" onClick={() => onSelectProject?.(project.id)}>
                      {project.name}
                    </button>
                    <p>{project.description}</p>
                    <div className="project-index-tags" aria-label="Project topics">
                      {project.tags?.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
        </section>
        <Footer onViewChange={onViewChange} />
      </main>
    );
  }

  return (
    <main
      ref={stageRef}
      className="project-carousel-stage h-screen overflow-hidden bg-[#050605] pt-16 text-[#F8F5EC] select-none md:pt-20"
      aria-label="Competition projects showcase carousel"
    >
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(5,6,5,0.96),rgba(5,6,5,1))]" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.045] bg-[linear-gradient(90deg,rgba(248,245,236,0.2)_1px,transparent_1px),linear-gradient(0deg,rgba(248,245,236,0.16)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <section className="relative z-10 flex h-[calc(100vh-4rem)] min-h-0 flex-col justify-start px-4 pb-5 pt-4 md:h-[calc(100vh-5rem)] md:px-10 md:pb-8 md:pt-8">
        <div className="project-showcase-ui mx-auto flex w-full max-w-[1560px] shrink-0 items-center justify-between gap-4 pb-3">
          <ProjectViewToggle viewMode={viewMode} onChange={setViewMode} />
          <p className="label text-[#F8F5EC]/58" aria-live="polite">
            {activeIndex + 1} / {total}
          </p>
        </div>

        <div className="project-showcase-ui project-mockup-drag-zone relative mx-auto h-[min(42vh,420px)] min-h-[190px] w-full max-w-[1560px] shrink-0 touch-none sm:min-h-[230px] md:h-[min(50vh,560px)] md:min-h-[320px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerEnd} onPointerCancel={handlePointerEnd} onPointerLeave={handlePointerEnd}>
          <div className="project-card-stack absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]">
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
                  className="h-full w-full object-cover opacity-62 grayscale brightness-90"
                  draggable="false"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,5,0.02),rgba(5,6,5,0.34))]" />
              </article>
            ))}
          </div>
        </div>

        <div className="project-showcase-ui project-caption-nav mx-auto flex w-full max-w-[980px] shrink-0 items-center justify-center pt-5 text-center md:pt-6">
          <div className="project-caption-copy min-w-0 px-16 md:px-24">
            <p ref={eyebrowRef} className="label mb-3 text-[#F8F5EC]/58">
              {activeProject.year} / {activeProject.tags?.join(" / ")}
            </p>
            <button
              ref={titleRef}
              type="button"
              onClick={openActiveProject}
              disabled={isEnteringRef.current}
              className="project-title-link font-display text-[clamp(2.1rem,10vw,3.75rem)] font-semibold leading-none tracking-normal text-[#F8F5EC] disabled:pointer-events-none md:text-5xl"
              aria-label={`Enter ${activeProject.name} competition details`}
            >
              {activeProject.name}
            </button>
          </div>

          <div className="project-arrow-group" aria-label="Project navigation">
            <button
              type="button"
              onClick={() => goTo(-1)}
              className="project-arrow-button"
              aria-label="Previous project"
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              className="project-arrow-button"
              aria-label="Next project"
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>

        <ol className="project-showcase-ui mx-auto mt-5 flex w-full max-w-[1560px] shrink-0 items-center justify-center gap-3" aria-label="Project progress">
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

