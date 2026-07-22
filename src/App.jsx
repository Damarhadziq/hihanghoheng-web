import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
import DocumentationBrief from "./components/DocumentationBrief";
import ProposalPreview from "./components/ProposalPreview";
import { useAchievementDocumentation } from "./hooks/useApiQueries";
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

const staticRoutes = new Set(["home", "about", "achievements", "team", "all-projects"]);

const getViewFromHash = () => {
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (!hash) return "home";
  if (staticRoutes.has(hash)) return hash;
  if (/^project-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(hash)) return hash;
  if (/^(brief|proposal)-[a-z0-9-]+$/.test(hash)) return hash;
  return "home";
};

const getRouteHash = (view) => (view === "home" ? "#home" : "#" + view);

const getSeoMeta = (view, documentation) => {
  const documentationMatch = view?.match(/^(brief|proposal)-(.+)$/);
  if (documentationMatch) {
    const [, type] = documentationMatch;
    if (documentation) {
      const isBrief = type === "brief";
      return {
        title: documentation.projectName + " " + (isBrief ? "Project Brief" : "Proposal Reference") + " - HIHANG HOENG",
        description: isBrief
          ? "Read the " + documentation.projectName + " UI/UX competition project brief, including objectives, target users, solution, features, scope, and user flow."
          : "Preview and download a UI/UX competition proposal reference for " + documentation.projectName + ".",
        schemaType: isBrief ? "TechArticle" : "DigitalDocument",
        name: documentation.projectName + " " + (isBrief ? "Project Brief" : "Proposal Reference"),
      };
    }
  }
  if (view?.startsWith("project-")) {
    return {
      title: "HIHANG HOENG Competition Project - Detail",
      description: "Detailed HIHANG HOENG competition project pages with type, organizer, timeline, interface preview, and contributing members.",
      schemaType: "CreativeWork",
    };
  }
  return { ...(seoByRoute[view] || seoByRoute.home), schemaType: "WebPage" };
}
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
  const [currentView, setCurrentView] = useState(getViewFromHash);
  const routeDocumentationMatch = currentView.match(/^(brief|proposal)-(.+)$/);
  const routeAchievementId = routeDocumentationMatch?.[2];
  const { data: routeDocumentation } = useAchievementDocumentation(routeAchievementId);
  const [isBootLoading, setIsBootLoading] = useState(currentView === "home");
  const [projectViewMode, setProjectViewMode] = useState("showcase");
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

  const startRouteTransition = useCallback((nextView, options = {}) => {
    if (!nextView || nextView === currentView || routeTransition) return;
    if (options.history !== "none") {
      const nextHash = getRouteHash(nextView);
      if (window.location.hash !== nextHash) window.history.pushState({ view: nextView }, "", nextHash);
    }
    pendingRouteViewRef.current = nextView;
    setRouteTransition({
      direction: options.direction || "up",
      label: options.label || getRouteLabel(nextView),
      title: options.title || getRouteTitle(nextView),
    });
  }, [currentView, routeTransition]);

  useEffect(() => {
    const handleHistoryChange = () => {
      const nextView = getViewFromHash();
      if (nextView !== currentView && !routeTransition) {
        startRouteTransition(nextView, { history: "none", direction: "down", label: "Returning to page" });
      }
    };
    handleHistoryChange();
    window.addEventListener("popstate", handleHistoryChange);
    return () => window.removeEventListener("popstate", handleHistoryChange);
  }, [currentView, routeTransition, startRouteTransition]);

  const handleViewChange = (nextView) => {
    startRouteTransition(nextView);
  };

  const handleAchievementDocument = (type, achievementId) => {
    startRouteTransition(type + "-" + achievementId, { label: "Opening documentation", title: type === "brief" ? "Project Brief" : "Proposal" });
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
    const isProjectGallery = currentView === "all-projects" && projectViewMode === "showcase";

    root.classList.toggle("is-transitioning", isTransitioning);
    root.classList.toggle("is-boot-loading", isBootLoading);
    root.classList.toggle("is-project-gallery", isProjectGallery);

    return () => {
      root.classList.remove("is-transitioning");
      root.classList.remove("is-boot-loading");
      root.classList.remove("is-project-gallery");
    };
  }, [currentView, isBootLoading, projectViewMode, routeTransition]);
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
    const seo = getSeoMeta(currentView, routeDocumentation);
    const canonicalUrl = "https://hihanghoeng.com/" + (currentView === "home" ? "" : "#" + currentView);
    const setMeta = (selector, attribute, key, content) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    document.title = seo.title;
    setMeta("meta[name='description']", "name", "description", seo.description);
    setMeta("meta[property='og:title']", "property", "og:title", seo.title);
    setMeta("meta[property='og:description']", "property", "og:description", seo.description);
    setMeta("meta[property='og:url']", "property", "og:url", canonicalUrl);
    setMeta("meta[name='twitter:title']", "name", "twitter:title", seo.title);
    setMeta("meta[name='twitter:description']", "name", "twitter:description", seo.description);

    let canonical = document.head.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    let routeSchema = document.getElementById("route-structured-data");
    if (!routeSchema) {
      routeSchema = document.createElement("script");
      routeSchema.id = "route-structured-data";
      routeSchema.type = "application/ld+json";
      document.head.appendChild(routeSchema);
    }
    routeSchema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": seo.schemaType || "WebPage",
      name: seo.name || seo.title,
      headline: seo.title,
      description: seo.description,
      url: canonicalUrl,
      author: { "@type": "Organization", name: "HIHANG HOENG" },
      publisher: { "@type": "Organization", name: "HIHANG HOENG", logo: { "@type": "ImageObject", url: "https://hihanghoeng.com/hihang-hoeng-logo.png" } },
    });
  }, [currentView, routeDocumentation]);
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
    pageContent = <><PageShell><About variant="page" /></PageShell><Footer onViewChange={handleViewChange} /></>;
  } else if (currentView === "achievements") {
    pageContent = <><PageShell><Achievements variant="page" onOpenDocument={handleAchievementDocument} /></PageShell><Footer onViewChange={handleViewChange} /></>;
  } else if (currentView === "team") {
    pageContent = <><PageShell><Team variant="page" /></PageShell><Footer onViewChange={handleViewChange} /></>;
  } else if (currentView === "all-projects") {
    pageContent = <AllProjects onSelectProject={openProjectDetail} onViewChange={handleViewChange} onViewModeChange={setProjectViewMode} />;
  } else if (currentView.startsWith("brief-")) {
    const achievementId = currentView.replace(/^brief-/, "");
    pageContent = <><DocumentationBrief achievementId={achievementId} onBack={() => startRouteTransition("achievements", { direction: "down", label: "Back to achievements", title: "Achievement" })} onOpenProposal={() => handleAchievementDocument("proposal", achievementId)} /><Footer onViewChange={handleViewChange} /></>;
  } else if (currentView.startsWith("proposal-")) {
    const achievementId = currentView.replace(/^proposal-/, "");
    pageContent = <><ProposalPreview achievementId={achievementId} onBack={() => startRouteTransition("achievements", { direction: "down", label: "Back to achievements", title: "Achievement" })} onOpenBrief={() => handleAchievementDocument("brief", achievementId)} /><Footer onViewChange={handleViewChange} /></>;
  } else if (currentView.startsWith("project-")) {
    const projectId = currentView.replace(/^project-/, "");
    pageContent = <><ProjectDetails projectId={projectId} onBack={() => startRouteTransition("all-projects", { direction: "down", label: "Back to projects", title: "Projects" })} onSelectProject={openProjectDetail} /><Footer onViewChange={handleViewChange} /></>;
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



