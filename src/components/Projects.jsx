import { useRef } from "react";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";

export default function Projects({ onSelectProject, onViewAllProjects }) {
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef, { stagger: 0.15 });

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-20 md:py-32 border-hairline-t"
    >
      <div className="section-wrapper">
        <div className="mb-12 flex flex-col justify-between gap-4 md:mb-16 md:flex-row md:items-end">
          <div>
            <span className="label mb-4 inline-flex items-center gap-2 text-ink/40 gsap-reveal">
              Selected Work
            </span>
            <h2 className="headline-lg gsap-reveal">Projects</h2>
          </div>
          <p className="max-w-md text-sm text-ink/50 gsap-reveal md:text-base">
            Competition entries from real judging stages - each one a documented step forward in our craft.
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.name} project={project} onSelect={() => onSelectProject?.(index + 1)} />
          ))}
        </div>

        <div className="flex justify-center gsap-reveal">
          <button
            type="button"
            onClick={onViewAllProjects}
            className="gsap-pill group inline-flex items-center gap-3 px-8 py-4 label"
          >
            <span>See All Projects</span>
            <span className="text-lg leading-none transition-transform duration-300 group-hover:translate-x-1 md:text-xl">-&gt;</span>
          </button>
        </div>
      </div>
    </section>
  );
}


