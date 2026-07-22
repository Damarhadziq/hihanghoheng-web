import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useProject, useProjects } from "../hooks/useApiQueries";

gsap.registerPlugin(ScrollTrigger);

const fallbackProject = {
  name: "Project Details",
  year: "2025",
  tags: ["Competition"],
  description: "A focused competition archive with process notes, organizer context, and delivery details.",
  type: "Competition",
  organizer: "Competition organizer",
  competition: "Competition archive",
  team: [],
  timeline: [],
  problem: "The project needs a clearer competition archive so visitors can understand the organizer, challenge, team contribution, and design direction.",
  solution: "The page presents a concise competition story with timeline, context framing, proposed submission, team credits, and visual mockup sections.",
  mockup16x9: null,
  image: null,
  mockups: [],
};

function ProjectDetailsContent({ project = fallbackProject, projects, projectId, onBack, onSelectProject }) {
  const currentIndex = Math.max(0, projects.findIndex((item) => item.slug === projectId));
  const previousIndex = (currentIndex - 1 + projects.length) % projects.length;
  const nextIndex = (currentIndex + 1) % projects.length;
  const previousProject = projects[previousIndex];
  const nextProject = projects[nextIndex];

  const featuredImage = project.mockup16x9 || project.image;
  const mockups = project.mockups?.length
    ? project.mockups
    : [
        { title: "Main mockup", image: featuredImage },
        { title: "Application screen", image: project.mockup16x9 || featuredImage },
      ].filter((item) => item.image);

  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const metaRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        gsap.set(
          [heroRef.current, metaRef.current, ...sectionsRef.current].filter(Boolean),
          { opacity: 1, y: 0 },
        );
        return;
      }

      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1 },
        );
      }

      if (metaRef.current) {
        gsap.fromTo(
          metaRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.25 },
        );
      }

      sectionsRef.current.filter(Boolean).forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none",
              invalidateOnRefresh: true,
            },
          },
        );
      });

      const images = pageRef.current?.querySelectorAll("img");
      if (images && images.length > 0) {
        Promise.allSettled(
          Array.from(images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
            });
          }),
        ).then(() => ScrollTrigger.refresh());
      }
    },
    { scope: pageRef, dependencies: [projectId] },
  );

  return (
    <div ref={pageRef} className="case-detail-page relative min-h-screen overflow-hidden bg-[#050605] pt-16 text-[#F8F5EC] md:pt-20">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(5,6,5,0.96),rgba(5,6,5,1))]" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.045] bg-[linear-gradient(90deg,rgba(248,245,236,0.2)_1px,transparent_1px),linear-gradient(0deg,rgba(248,245,236,0.16)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <article className="section-wrapper relative z-10 py-10 md:py-20 lg:py-24">
        <button onClick={onBack} className="gsap-pill label mb-8 inline-flex items-center px-5 py-3 md:mb-12 md:px-6">
          Back to gallery
        </button>

        <header
          ref={heroRef}
          className="case-detail-hero grid gap-7 md:grid-cols-[0.95fr_1.25fr] md:items-end md:gap-10"
          style={{ opacity: 0 }}
        >
          <div>
            <p className="label mb-4 text-[#F8F5EC]/58">
              Competition Archive {projectId} / {project.year}
            </p>
            <h1 className="headline-lg mb-5 text-[#F8F5EC]">{project.name}</h1>
            <p className="max-w-2xl text-sm leading-7 text-[#F8F5EC]/68 md:text-base">
              {project.description}
            </p>
          </div>

          <div className="case-detail-featured group overflow-hidden border border-[#F8F5EC]/12 bg-[#F8F5EC]/5">
            {featuredImage && (
              <img
                src={featuredImage}
                alt={`${project.name} project mockup`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </header>

        <section
          ref={metaRef}
          className="case-meta-grid my-10 grid gap-3 border-y border-[#F8F5EC]/12 py-5 sm:grid-cols-3 md:my-16 md:py-6"
          style={{ opacity: 0 }}
        >
          <div className="case-meta-item">
            <span className="label text-[#F8F5EC]/42">Type</span>
            <strong>{project.type || "Competition"}</strong>
          </div>
          <div className="case-meta-item">
            <span className="label text-[#F8F5EC]/42">Organizer</span>
            <strong>{project.organizer || "Competition"}</strong>
          </div>
          <div className="case-meta-item">
            <span className="label text-[#F8F5EC]/42">Competition</span>
            <strong>{project.competition || project.tags?.[0] || "Competition"}</strong>
          </div>
        </section>

        <section
          ref={(node) => { sectionsRef.current[0] = node; }}
          className="case-section py-10 md:py-16"
          aria-labelledby="timeline-title"
          style={{ opacity: 0 }}
        >
          <div className="case-section-heading case-reveal">
            <p className="label text-[#F8F5EC]/48">1 / Competition timeline</p>
            <h2 id="timeline-title" className="headline-md text-[#F8F5EC]">From brief to submission</h2>
          </div>

          <div className="case-timeline mt-8 md:mt-10">
            {project.timeline?.map((item, index) => (
              <article key={`${item.phase}-${index}`} className="case-timeline-item case-reveal">
                <div className="case-timeline-marker" aria-hidden="true" />
                <div className="case-timeline-content">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="label text-gold">{item.phase}</span>
                    <span className="label text-[#F8F5EC]/42">{item.duration}</span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold leading-tight text-[#F8F5EC] md:text-3xl">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#F8F5EC]/64">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          ref={(node) => { sectionsRef.current[1] = node; }}
          className="case-section grid gap-4 py-10 md:grid-cols-2 md:gap-6 md:py-16"
          aria-label="Problem and solution"
          style={{ opacity: 0 }}
        >
          <article className="case-story-panel case-reveal">
            <p className="label mb-5 text-[#F8F5EC]/48">2 / Competition context</p>
            <h2 className="font-display text-3xl font-semibold leading-tight text-[#F8F5EC] md:text-4xl">The problem brought into competition</h2>
            <p className="mt-6 text-sm leading-8 text-[#F8F5EC]/68 md:text-base">{project.problem}</p>
          </article>

          <article className="case-story-panel case-story-panel-accent case-reveal">
            <p className="label mb-5 text-[#F8F5EC]/48">3 / Submission direction</p>
            <h2 className="font-display text-3xl font-semibold leading-tight text-[#F8F5EC] md:text-4xl">The direction prepared for judging</h2>
            <p className="mt-6 text-sm leading-8 text-[#F8F5EC]/68 md:text-base">{project.solution}</p>
          </article>
        </section>

        <section
          ref={(node) => { sectionsRef.current[2] = node; }}
          className="case-section py-10 md:py-16"
          aria-labelledby="mockup-title"
          style={{ opacity: 0 }}
        >
          <div className="case-section-heading case-reveal md:max-w-3xl">
            <p className="label text-[#F8F5EC]/48">4 / Preview interface</p>
            <h2 id="mockup-title" className="headline-md text-[#F8F5EC]">Interface preview</h2>
            <p className="mt-5 text-sm leading-7 text-[#F8F5EC]/62 md:text-base">
              A visual preview of the prototype and mockups used for submission and competition presentation.
            </p>
          </div>

          <div className="case-mockup-grid mt-10">
            {mockups.map((mockup, index) => (
              <figure key={`${mockup.title}-${index}`} className="case-mockup-card case-reveal">
                <img src={mockup.image} alt={`${project.name} ${mockup.title}`} loading="lazy" decoding="async" />
                <figcaption>
                  <span className="label text-[#F8F5EC]/48">Mockup {index + 1}</span>
                  <strong>{mockup.title}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
                </section>

        <section
          ref={(node) => { sectionsRef.current[3] = node; }}
          className="case-section py-10 md:py-16"
          aria-labelledby="competition-team-title"
          style={{ opacity: 0 }}
        >
          <div className="case-section-heading case-reveal md:max-w-3xl">
            <p className="label text-[#F8F5EC]/48">5 / Competition crew</p>
            <h2 id="competition-team-title" className="headline-md text-[#F8F5EC]">Who worked on this project</h2>
            <p className="mt-5 text-sm leading-7 text-[#F8F5EC]/62 md:text-base">
              Every HIHANG HOENG project comes from a competition. These are the members who worked on the submission, along with their roles and social links.
            </p>
          </div>

          <div className="case-crew-grid mt-10">
            {(project.team || []).map((person) => (
              <article key={`${project.name}-${person.name}`} className="case-crew-card case-reveal">
                <p className="label mb-3 text-gold">{person.role}</p>
                <h3 className="font-display text-2xl font-semibold leading-tight text-[#F8F5EC]">{person.name}</h3>
                {(person.linkedin || person.instagram) && <div className="mt-5 flex flex-wrap gap-2">
                  {person.linkedin && <a href={person.linkedin} target="_blank" rel="noreferrer" className="case-social-pill">LinkedIn</a>}
                  {person.instagram && <a href={person.instagram} target="_blank" rel="noreferrer" className="case-social-pill">Instagram</a>}
                </div>}
              </article>
            ))}
          </div>
        </section>
        <nav className="case-project-nav" aria-label="Browse competition projects">
          <button type="button" onClick={() => onSelectProject?.(previousProject.slug)}>
            <span className="label text-[#F8F5EC]/42">Previous project</span>
            <strong><span aria-hidden="true">&larr;</span> {previousProject.name}</strong>
          </button>
          <button type="button" onClick={() => onSelectProject?.(nextProject.slug)}>
            <span className="label text-[#F8F5EC]/42">Next project</span>
            <strong>{nextProject.name} <span aria-hidden="true">&rarr;</span></strong>
          </button>
        </nav>
      </article>
    </div>
  );
}

export default function ProjectDetails(props) {
  const { projectId } = props;
  const { data: project, isPending } = useProject(projectId);
  const { data: projects = [] } = useProjects();
  if (isPending || !project || !projects.length) return <main className="case-page page-shell" aria-busy="true" />;
  return <ProjectDetailsContent {...props} project={project} projects={projects} />;
}
