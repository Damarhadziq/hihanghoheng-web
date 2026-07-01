import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const scrollToProjects = (event) => {
  event.preventDefault();
  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
  if (window.location.hash) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
};

export default function RotatingBadge() {
  const wrapperRef = useRef(null);
  const badgeRef = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced || !badgeRef.current) return undefined;

      gsap.to(badgeRef.current, {
        rotation: 360,
        duration: 12,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
    },
    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef} className="relative inline-flex items-center">
      <a
        href="#projects"
        className="relative flex h-24 w-24 items-center justify-center md:h-28 md:w-28"
        aria-label="View our projects"
        onClick={scrollToProjects}
      >
        <svg ref={badgeRef} viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
          <defs>
            <path id="circlePath" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
          </defs>
          <circle cx="100" cy="100" r="95" fill="none" stroke="var(--color-ink)" strokeWidth="0.5" />
          <text className="label" style={{ fontSize: "14px" }} fill="var(--color-ink)">
            <textPath href="#circlePath" startOffset="0%">
              VIEW OUR WORK - VIEW OUR WORK - VIEW OUR WORK {" "}
            </textPath>
          </text>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </span>
      </a>
    </div>
  );
}
