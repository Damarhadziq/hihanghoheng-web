import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import AllProjects from "./components/AllProjects";
import ProjectDetails from "./components/ProjectDetails";
import Achievements from "./components/Achievements";
import Team from "./components/Team";
import Process from "./components/Process";
import ClosingWords from "./components/ClosingWords";
import Mentor from "./components/Mentor";
import GalleryMarquee from "./components/GalleryMarquee";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import RouteSlideTransition from "./components/RouteSlideTransition";

gsap.registerPlugin(ScrollTrigger);

const routeTitles = {
  home: "Home",
  about: "About",
  achievements: "Achievement",
  team: "Team",
  "all-projects": "Projects",
};

const getRouteTitle = (view) => {
  if (view?.startsWith("project-")) return "Project Details";
  return routeTitles[view] || "Page";
};

const getRouteLabel = (view) => {
  if (view?.startsWith("project-")) return "Opening case study";
  if (view === "all-projects") return "Opening projects";
  return "Opening page";
};

const PageShell = ({ children }) => (
  <main className="page-shell">
    {children}
  </main>
);

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [isBootLoading, setIsBootLoading] = useState(true);
  const pendingRouteViewRef = useRef(null);
  const [routeTransition, setRouteTransition] = useState(null);
  const viewShellRef = useRef(null);
  const skipNextShellAnimationRef = useRef(false);
  const scrollLockRef = useRef({ x: 0, y: 0 });

  const scrollToTopInstant = () => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    scrollLockRef.current = { x: 0, y: 0 };
    root.style.scrollBehavior = previousBehavior;
  };

  const startRouteTransition = (nextView, options = {}) => {
    if (!nextView || nextView === currentView || routeTransition) return;
    pendingRouteViewRef.current = nextView;
    setRouteTransition({
      direction: options.direction || "up",
      label: options.label || getRouteLabel(nextView),
      title: options.title || getRouteTitle(nextView),
    });
  };

  const handleViewChange = (nextView) => {
    startRouteTransition(nextView);
  };

  const handleRouteTransitionCovered = () => {
    if (!pendingRouteViewRef.current) return;
    skipNextShellAnimationRef.current = true;
    setCurrentView(pendingRouteViewRef.current);
    scrollToTopInstant();
  };

  const handleRouteTransitionComplete = () => {
    pendingRouteViewRef.current = null;
    setRouteTransition(null);
  };

  useEffect(() => {
    if (!isBootLoading) return undefined;

    const bootFallbackId = window.setTimeout(() => {
      setIsBootLoading(false);
    }, 8200);

    return () => window.clearTimeout(bootFallbackId);
  }, [isBootLoading]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const isTransitioning = isBootLoading || Boolean(routeTransition);
    const isProjectGallery = currentView === "all-projects";

    root.classList.toggle("is-transitioning", isTransitioning);
    root.classList.toggle("is-boot-loading", isBootLoading);
    root.classList.toggle("is-project-gallery", isProjectGallery);

    return () => {
      root.classList.remove("is-transitioning");
      root.classList.remove("is-boot-loading");
      root.classList.remove("is-project-gallery");
    };
  }, [currentView, isBootLoading, routeTransition]);
  useEffect(() => {
    const shouldLockScroll = isBootLoading || Boolean(routeTransition);
    if (!shouldLockScroll) return undefined;

    if (isBootLoading) {
      scrollLockRef.current = { x: 0, y: 0 };
      window.scrollTo(0, 0);
    } else {
      scrollLockRef.current = { x: window.scrollX, y: window.scrollY };
    }
    let restoreFrame = 0;

    const preventScrollInput = (event) => {
      event.preventDefault();
    };

    const preventScrollKeys = (event) => {
      const lockedKeys = ["ArrowDown", "ArrowUp", "End", "Home", "PageDown", "PageUp", " "];
      if (lockedKeys.includes(event.key)) event.preventDefault();
    };

    const restoreScrollPosition = () => {
      if (restoreFrame) return;
      restoreFrame = window.requestAnimationFrame(() => {
        restoreFrame = 0;
        const { x, y } = scrollLockRef.current;
        if (window.scrollX !== x || window.scrollY !== y) {
          window.scrollTo(x, y);
        }
      });
    };

    window.addEventListener("wheel", preventScrollInput, { passive: false });
    window.addEventListener("touchmove", preventScrollInput, { passive: false });
    window.addEventListener("keydown", preventScrollKeys);
    window.addEventListener("scroll", restoreScrollPosition, { passive: true });

    return () => {
      if (restoreFrame) window.cancelAnimationFrame(restoreFrame);
      window.removeEventListener("wheel", preventScrollInput);
      window.removeEventListener("touchmove", preventScrollInput);
      window.removeEventListener("keydown", preventScrollKeys);
      window.removeEventListener("scroll", restoreScrollPosition);
    };
  }, [isBootLoading, routeTransition]);

  useLayoutEffect(() => {
    const shell = viewShellRef.current;
    if (!shell) return undefined;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return undefined;
    if (routeTransition) {
      gsap.killTweensOf(shell);
      gsap.set(shell, { clearProps: "filter,transform,opacity,visibility" });
      return undefined;
    }

    if (skipNextShellAnimationRef.current) {
      skipNextShellAnimationRef.current = false;
      gsap.killTweensOf(shell);
      gsap.set(shell, { clearProps: "filter,transform,opacity,visibility" });
      return undefined;
    }

    gsap.killTweensOf(shell);
    gsap.fromTo(
      shell,
      { autoAlpha: 0.98, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out", clearProps: "transform,opacity,visibility" },
    );

    return () => gsap.killTweensOf(shell);
  }, [currentView, isBootLoading, routeTransition]);

  useEffect(() => {
    if (isBootLoading || currentView === "all-projects" || routeTransition) return undefined;

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after images/fonts settle to fix trigger positions
    const refreshAfterLoad = () => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    window.addEventListener("load", refreshAfterLoad, { once: true });
    document.fonts?.ready?.then(refreshAfterLoad);

    return () => {
      window.removeEventListener("load", refreshAfterLoad);
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, [currentView, isBootLoading, routeTransition]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || isBootLoading || routeTransition) return undefined;

    const elements = gsap.utils.toArray(
      ".gsap-pill, .gsap-clickable-card, button[aria-label^='Go to project'], .gallery-item, .gsap-reveal a",
    );

    const cleanups = elements
      .filter((element) => !element.classList.contains("project-title-link"))
      .map((element) => {
        const hoverScale = element.classList.contains("project-card") ? 1.006 : 1.025;
        const enter = () => gsap.to(element, { y: -2, scale: hoverScale, duration: 0.22, ease: "power2.out", overwrite: "auto" });
        const leave = () => gsap.to(element, { y: 0, scale: 1, duration: 0.28, ease: "power2.out", overwrite: "auto" });
        const down = () => gsap.to(element, { scale: 0.985, duration: 0.1, ease: "power2.out", overwrite: "auto" });
        const up = () => gsap.to(element, { scale: hoverScale, duration: 0.18, ease: "back.out(2)", overwrite: "auto" });

        element.addEventListener("pointerenter", enter);
        element.addEventListener("pointerleave", leave);
        element.addEventListener("pointerdown", down);
        element.addEventListener("pointerup", up);
        element.addEventListener("focus", enter);
        element.addEventListener("blur", leave);

        return () => {
          gsap.killTweensOf(element);
          element.removeEventListener("pointerenter", enter);
          element.removeEventListener("pointerleave", leave);
          element.removeEventListener("pointerdown", down);
          element.removeEventListener("pointerup", up);
          element.removeEventListener("focus", enter);
          element.removeEventListener("blur", leave);
        };
      });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [currentView, isBootLoading, routeTransition]);

  const openProjectDetail = (projectId) => {
    startRouteTransition(`project-${projectId}`, { label: "Opening case study", title: "Project Details" });
  };

  let pageContent;

  if (currentView === "home") {
    pageContent = (
      <>
        <main>
          <Hero />
          <About />
          <Projects onSelectProject={openProjectDetail} onViewAllProjects={() => handleViewChange("all-projects")} />
          <Process />
          <Achievements />
          <Team />
          <ClosingWords />
          <Mentor />
          <GalleryMarquee />
        </main>
        <Footer />
      </>
    );
  } else if (currentView === "about") {
    pageContent = <PageShell><About /></PageShell>;
  } else if (currentView === "achievements") {
    pageContent = <PageShell><Achievements /></PageShell>;
  } else if (currentView === "team") {
    pageContent = <PageShell><Team /></PageShell>;
  } else if (currentView === "all-projects") {
    pageContent = <AllProjects onSelectProject={openProjectDetail} />;
  } else if (currentView.startsWith("project-")) {
    const projectId = currentView.split("-")[1];
    pageContent = <ProjectDetails projectId={projectId} onBack={() => startRouteTransition("all-projects", { direction: "down", label: "Back to projects", title: "Projects" })} />;
  }

  if (isBootLoading) {
    return <LoadingScreen onComplete={() => setIsBootLoading(false)} />;
  }

  return (
    <>
      <Nav onViewChange={handleViewChange} activeView={currentView} />
      <div ref={viewShellRef} className="route-view-shell">
        {pageContent}
      </div>
      <RouteSlideTransition active={Boolean(routeTransition)} direction={routeTransition?.direction} label={routeTransition?.label} title={routeTransition?.title} onCovered={handleRouteTransitionCovered} onComplete={handleRouteTransitionComplete} />
    </>
  );
}
