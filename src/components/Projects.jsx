import { useRef } from "react";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";

export default function Projects({ onViewChange }) {
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef, { stagger: 0.15 });

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-20 md:py-32 border-hairline-t"
    >
      <div className="section-wrapper">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 md:mb-16">
          <div>
            <span className="label text-ink/40 gsap-reveal inline-flex items-center gap-2 mb-4">
              Selected Work
            </span>
            <h2 className="headline-lg gsap-reveal">Projects</h2>
          </div>
          <p className="text-ink/50 text-sm md:text-base max-w-md gsap-reveal">
            Competition entries, class projects, and self-initiated work -
            each one a step forward in our craft.
          </p>
        </div>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>

        {/* See All Button */}
        <div className="flex justify-center gsap-reveal">
          <button 
            onClick={() => onViewChange && onViewChange("all-projects")}
            className="gsap-pill group inline-flex items-center gap-3 px-8 py-4 label"
          >
            <span>See All Projects</span>
            <span className="text-lg leading-none transition-transform duration-300 group-hover:translate-x-1 md:text-xl">&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
}



