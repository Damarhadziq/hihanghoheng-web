import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
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
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import ProjectTransition from "./components/ProjectTransition";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [isProjectLoading, setIsProjectLoading] = useState(false);
  const pendingViewRef = useRef(null);

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
    setCurrentView(pendingViewRef.current);
    window.scrollTo(0, 0);
  };

  const handleProjectTransitionComplete = () => {
    pendingViewRef.current = null;
    setIsProjectLoading(false);
  };

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
    document.documentElement.classList.toggle("is-transitioning", isProjectLoading || isBootLoading);
    return () => document.documentElement.classList.remove("is-transitioning");
  }, [isProjectLoading, isBootLoading]);

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
  }, [currentView]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return undefined;

    const elements = gsap.utils.toArray(
      ".gsap-pill, .contact-nav-link, .gsap-icon-button, .gsap-clickable-card, button[aria-label^='Go to project'], .gallery-item, .gsap-reveal a",
    );

    const cleanups = elements.map((element) => {
      const enter = () => gsap.to(element, { y: -2, scale: 1.025, duration: 0.22, ease: "power2.out", overwrite: "auto" });
      const leave = () => gsap.to(element, { y: 0, scale: 1, duration: 0.28, ease: "power2.out", overwrite: "auto" });
      const down = () => gsap.to(element, { scale: 0.965, duration: 0.12, ease: "power2.out", overwrite: "auto" });
      const up = () => gsap.to(element, { scale: 1.025, duration: 0.18, ease: "back.out(2)", overwrite: "auto" });

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
  }, [currentView]);

  let pageContent;

  if (currentView === "all-projects") {
    pageContent = <AllProjects onSelectProject={(projectId) => setCurrentView(`project-${projectId}`)} />;
  } else if (currentView.startsWith("project-")) {
    const projectId = currentView.split("-")[1];
    pageContent = <ProjectDetails projectId={projectId} onBack={() => setCurrentView("all-projects")} />;
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
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav onViewChange={setCurrentView} activeView={currentView} />
      {pageContent}
      <ProjectTransition active={isProjectLoading} onCovered={handleProjectTransitionCovered} onComplete={handleProjectTransitionComplete} />
      {isBootLoading && <LoadingScreen onComplete={() => setIsBootLoading(false)} />}
    </>
  );
}



