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


const seoByRoute = {
  home: {
    title: "HIHANG HOENG - UI/UX Competition Team UNNES",
    description: "HIHANG HOENG is a UI/UX competition team from Universitas Negeri Semarang documenting competition projects, achievements, prototypes, and team journeys.",
  },
  about: {
    title: "About HIHANG HOENG - UI/UX Competition Team",
    description: "The HIHANG HOENG profile, vision, mission, competition numbers, and team story from Universitas Negeri Semarang.",
  },
  achievements: {
    title: "HIHANG HOENG Achievements - Competition Documentation",
    description: "A documented timeline of HIHANG HOENG achievements, organizers, competition scale, winning projects, and contributing members.",
  },
  team: {
    title: "Team HIHANG HOENG - UI/UX Competition Members",
    description: "Profiles of HIHANG HOENG members with roles, LinkedIn, and Instagram links behind each competition project.",
  },
  "all-projects": {
    title: "HIHANG HOENG Projects - Competition Project Archive",
    description: "A collection of HIHANG HOENG competition projects, including competitions, organizers, prototypes, and UI/UX submission documentation.",
  },
};

const getSeoMeta = (view) => {
  if (view?.startsWith("project-")) {
    return {
      title: "HIHANG HOENG Competition Project - Detail",
      description: "Detailed HIHANG HOENG competition project pages with type, organizer, timeline, interface preview, and contributing members.",
    };
  }
  return seoByRoute[view] || seoByRoute.home;
};
const getRouteTitle = (view) => {
  if (view?.startsWith("project-")) return "Project Details";
  return routeTitles[view] || "Page";
};

const getRouteLabel = (view) => {
  if (view?.startsWith("project-")) return "Opening competition archive";
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
  const pendingAchievementIdRef = useRef(null);

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

  const handleAchievementDocumentation = (achievementId) => {
    pendingAchievementIdRef.current = achievementId;
    startRouteTransition("achievements", { label: "Opening documentation", title: "Achievement" });
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
      { autoAlpha: 0.98 },
      { autoAlpha: 1, duration: 0.3, ease: "power2.out", clearProps: "opacity,visibility" },
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

  useLayoutEffect(() => {
    const root = viewShellRef.current;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root || prefersReduced || isBootLoading || routeTransition) return undefined;

    const elements = gsap.utils.toArray(
      root.querySelectorAll(".gsap-pill, .gsap-clickable-card, button[aria-label^='Go to project'], .gallery-item, .gsap-reveal a"),
    );

    const cleanups = elements
      .filter((element) => !element.classList.contains("project-title-link"))
      .map((element) => {
        const hoverScale = element.classList.contains("project-card") ? 1.006 : 1.025;
        const enter = () => gsap.to(element, { y: -2, scale: hoverScale, duration: 0.36, ease: "power2.out", overwrite: "auto" });
        const leave = () => gsap.to(element, { y: 0, scale: 1, duration: 0.42, ease: "power2.out", overwrite: "auto" });
        const down = () => gsap.to(element, { scale: 0.985, duration: 0.1, ease: "power2.out", overwrite: "auto" });
        const up = () => gsap.to(element, { scale: hoverScale, duration: 0.26, ease: "power2.out", overwrite: "auto" });

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


  useEffect(() => {
    if (currentView !== "achievements" || routeTransition || !pendingAchievementIdRef.current) return undefined;

    const targetId = pendingAchievementIdRef.current;
    const timeoutId = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      pendingAchievementIdRef.current = null;
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [currentView, routeTransition]);

  useEffect(() => {
    const seo = getSeoMeta(currentView);
    document.title = seo.title;
    let description = document.querySelector("meta[name='description']");
    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.appendChild(description);
    }
    description.setAttribute("content", seo.description);
  }, [currentView]);
  const openProjectDetail = (projectId) => {
    startRouteTransition(`project-${projectId}`, { label: "Opening competition archive", title: "Project Details" });
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
          <Achievements onOpenDocumentation={handleAchievementDocumentation} />
          <Team />
          <ClosingWords />
          <Mentor />
          <GalleryMarquee />
        </main>
        <Footer onViewChange={handleViewChange} />
      </>
    );
  } else if (currentView === "about") {
    pageContent = <PageShell><About variant="page" /></PageShell>;
  } else if (currentView === "achievements") {
    pageContent = <PageShell><Achievements variant="page" /></PageShell>;
  } else if (currentView === "team") {
    pageContent = <PageShell><Team variant="page" /></PageShell>;
  } else if (currentView === "all-projects") {
    pageContent = <AllProjects onSelectProject={openProjectDetail} />;
  } else if (currentView.startsWith("project-")) {
    const projectId = currentView.split("-")[1];
    pageContent = <ProjectDetails projectId={projectId} onBack={() => startRouteTransition("all-projects", { direction: "down", label: "Back to projects", title: "Projects" })} />;
  }

  return (
    <>
      <Nav onViewChange={handleViewChange} activeView={currentView} />
      <div ref={viewShellRef} className="route-view-shell" aria-hidden={isBootLoading ? "true" : undefined}>
        {pageContent}
      </div>
      <RouteSlideTransition active={Boolean(routeTransition)} direction={routeTransition?.direction} label={routeTransition?.label} title={routeTransition?.title} onCovered={handleRouteTransitionCovered} onComplete={handleRouteTransitionComplete} />
      {isBootLoading && <LoadingScreen onComplete={() => setIsBootLoading(false)} />}
    </>
  );
}



