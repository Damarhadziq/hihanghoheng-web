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
import Process from "./components/Process";
import Achievements from "./components/Achievements";
import Team from "./components/Team";
import ClosingWords from "./components/ClosingWords";
import Mentor from "./components/Mentor";
import GalleryMarquee from "./components/GalleryMarquee";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import ProjectTransition from "./components/ProjectTransition";
import RouteSlideTransition from "./components/RouteSlideTransition";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [isProjectLoading, setIsProjectLoading] = useState(false);
  const pendingViewRef = useRef(null);
  const pendingRouteViewRef = useRef(null);
  const [routeTransition, setRouteTransition] = useState(null);
  const viewShellRef = useRef(null);
  const skipNextShellAnimationRef = useRef(false);

  const handleViewChange = (nextView) => {
    if (nextView === "all-projects") {
      if (isProjectLoading) return;
      pendingViewRef.current = nextView;
      setIsProjectLoading(true);
      return;
    }

    setCurrentView(nextView);
  };

  const handleProjectTransitionCovered = () => {
    if (!pendingViewRef.current) return;
    skipNextShellAnimationRef.current = true;
    setCurrentView(pendingViewRef.current);
    scrollToTopInstant();
  };

  const handleProjectTransitionComplete = () => {
    pendingViewRef.current = null;
    setIsProjectLoading(false);
  };

  const startRouteTransition = (nextView, options) => {
    if (routeTransition) return;
    pendingRouteViewRef.current = nextView;
    setRouteTransition(options);
  };

  const scrollToTopInstant = () => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    root.style.scrollBehavior = previousBehavior;
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

  useEffect(() => {
    const cleanHash = () => {
      window.setTimeout(() => {
        if (window.location.hash) {
          window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
        }
      }, 0);
    };

    cleanHash();
    window.addEventListener("hashchange", cleanHash);

    return () => window.removeEventListener("hashchange", cleanHash);
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const isTransitioning = isProjectLoading || isBootLoading || Boolean(routeTransition);
    const isProjectGallery = currentView === "all-projects";
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    root.classList.toggle("is-transitioning", isTransitioning);
    root.classList.toggle("is-project-gallery", isProjectGallery);
    root.style.setProperty("--scrollbar-compensation", isTransitioning && scrollbarWidth > 0 ? `${scrollbarWidth}px` : "0px");

    return () => {
      root.classList.remove("is-transitioning");
      root.classList.remove("is-project-gallery");
      root.style.removeProperty("--scrollbar-compensation");
    };
  }, [currentView, isProjectLoading, isBootLoading, routeTransition]);

  useLayoutEffect(() => {
    const shell = viewShellRef.current;
    if (!shell) return undefined;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return undefined;
    if (routeTransition || skipNextShellAnimationRef.current) {
      skipNextShellAnimationRef.current = false;
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
  }, [currentView, routeTransition]);

  useEffect(() => {
    if (currentView !== "home") return;

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, [currentView, routeTransition]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || routeTransition) return undefined;

    const elements = gsap.utils.toArray(
      ".gsap-pill, .contact-nav-link, .gsap-icon-button, .gsap-clickable-card, button[aria-label^='Go to project'], .gallery-item, .gsap-reveal a",
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
        element.removeEventListener("pointerenter", enter);
        element.removeEventListener("pointerleave", leave);
        element.removeEventListener("pointerdown", down);
        element.removeEventListener("pointerup", up);
        element.removeEventListener("focus", enter);
        element.removeEventListener("blur", leave);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [currentView, routeTransition]);

  let pageContent;

  if (currentView === "all-projects") {
    pageContent = <AllProjects onSelectProject={(projectId) => startRouteTransition(`project-${projectId}`, { direction: "up", label: "Opening case study", title: "Project Details" })} />;
  } else if (currentView.startsWith("project-")) {
    const projectId = currentView.split("-")[1];
    pageContent = <ProjectDetails projectId={projectId} onBack={() => startRouteTransition("all-projects", { direction: "down", label: "Back to project archive", title: "Gallery" })} />;
  } else {
    pageContent = (
      <>
        <main>
          <Hero />
          <About />
          <Projects onViewChange={handleViewChange} />
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
  }

  return (
    <>
      <Nav onViewChange={setCurrentView} activeView={currentView} />
      <div ref={viewShellRef} className="route-view-shell">
        {pageContent}
      </div>
      <ProjectTransition active={isProjectLoading} onCovered={handleProjectTransitionCovered} onComplete={handleProjectTransitionComplete} />
      <RouteSlideTransition active={Boolean(routeTransition)} direction={routeTransition?.direction} label={routeTransition?.label} title={routeTransition?.title} onCovered={handleRouteTransitionCovered} onComplete={handleRouteTransitionComplete} />
      {isBootLoading && <LoadingScreen onComplete={() => setIsBootLoading(false)} />}
    </>
  );
}






