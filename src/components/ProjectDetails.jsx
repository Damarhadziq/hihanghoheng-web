import { useEffect, useMemo } from "react";

import { projects } from "../data/projects";

const fallbackProject = {
  name: "Project Details",
  year: "2025",
  tags: ["Case Study"],
  description: "A focused project archive with process notes, design decisions, and delivery details.",
  role: "UI/UX Design",
  timeline: [],
  problem: "The project needs a clearer case study structure so visitors can understand the context, challenge, and design direction.",
  solution: "The page presents a concise story with timeline, problem framing, proposed solution, and visual mockup sections.",
  mockup16x9: null,
  image: null,
  mockups: [],
};

export default function ProjectDetails({ projectId, onBack }) {
  const project = useMemo(() => {
    const index = Number(projectId) - 1;
    return projects[index] || fallbackProject;
  }, [projectId]);

  const featuredImage = project.mockup16x9 || project.image;
  const mockups = project.mockups?.length
    ? project.mockups
    : [
        { title: "Main mockup", image: featuredImage, ratio: "wide" },
        { title: "Application screen", image: project.image || featuredImage, ratio: "portrait" },
      ].filter((item) => item.image);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  return (
    <div className="case-detail-page relative min-h-screen overflow-hidden bg-[#050605] pt-20 text-[#F8F5EC]">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(5,6,5,0.96),rgba(5,6,5,1))]" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.045] bg-[linear-gradient(90deg,rgba(248,245,236,0.2)_1px,transparent_1px),linear-gradient(0deg,rgba(248,245,236,0.16)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <article className="section-wrapper relative z-10 py-16 md:py-24">
        <button onClick={onBack} className="gsap-pill label mb-12 inline-flex items-center px-6 py-3">
          Back to gallery
        </button>

        <header className="case-detail-hero grid gap-10 md:grid-cols-[0.95fr_1.25fr] md:items-end">
          <div>
            <p className="label mb-4 text-[#F8F5EC]/58">
              Case Study {projectId} / {project.year}
            </p>
            <h1 className="headline-lg mb-6 text-[#F8F5EC]">{project.name}</h1>
            <p className="max-w-2xl text-sm leading-7 text-[#F8F5EC]/68 md:text-base">
              {project.description}
            </p>
          </div>

          <div className="case-detail-featured group overflow-hidden border border-[#F8F5EC]/12 bg-[#F8F5EC]/5">
            {featuredImage && (
              <img
                src={featuredImage}
                alt={`${project.name} project mockup`}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </header>

        <section className="case-meta-grid my-12 grid gap-3 border-y border-[#F8F5EC]/12 py-6 md:my-16 md:grid-cols-3">
          <div className="case-meta-item">
            <span className="label text-[#F8F5EC]/42">Role</span>
            <strong>{project.role || "UI/UX Design"}</strong>
          </div>
          <div className="case-meta-item">
            <span className="label text-[#F8F5EC]/42">Timeline</span>
            <strong>{project.timeline?.at(-1)?.duration || "8 Weeks"}</strong>
          </div>
          <div className="case-meta-item">
            <span className="label text-[#F8F5EC]/42">Focus</span>
            <strong>{project.tags?.[0] || "Case Study"}</strong>
          </div>
        </section>

        <section className="case-section py-12 md:py-16" aria-labelledby="timeline-title">
          <div className="case-section-heading">
            <p className="label text-[#F8F5EC]/48">1 / Timeline pengerjaan</p>
            <h2 id="timeline-title" className="headline-md text-[#F8F5EC]">From research to validation</h2>
          </div>

          <div className="case-timeline mt-10">
            {project.timeline?.map((item, index) => (
              <article key={`${item.phase}-${index}`} className="case-timeline-item">
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

        <section className="case-section grid gap-5 py-12 md:grid-cols-2 md:gap-6 md:py-16" aria-label="Problem and solution">
          <article className="case-story-panel">
            <p className="label mb-5 text-[#F8F5EC]/48">2 / Rumusan masalah</p>
            <h2 className="font-display text-3xl font-semibold leading-tight text-[#F8F5EC] md:text-4xl">What needed to be solved</h2>
            <p className="mt-6 text-sm leading-8 text-[#F8F5EC]/68 md:text-base">{project.problem}</p>
          </article>

          <article className="case-story-panel case-story-panel-accent">
            <p className="label mb-5 text-[#F8F5EC]/48">3 / Solusi yang ditawarkan</p>
            <h2 className="font-display text-3xl font-semibold leading-tight text-[#F8F5EC] md:text-4xl">The proposed direction</h2>
            <p className="mt-6 text-sm leading-8 text-[#F8F5EC]/68 md:text-base">{project.solution}</p>
          </article>
        </section>

        <section className="case-section py-12 md:py-16" aria-labelledby="mockup-title">
          <div className="case-section-heading md:max-w-3xl">
            <p className="label text-[#F8F5EC]/48">4 / Mockup aplikasi</p>
            <h2 id="mockup-title" className="headline-md text-[#F8F5EC]">Interface preview</h2>
            <p className="mt-5 text-sm leading-7 text-[#F8F5EC]/62 md:text-base">
              A compact visual pass showing how the product direction translates into key screens and presentation-ready mockups.
            </p>
          </div>

          <div className="case-mockup-grid mt-10">
            {mockups.map((mockup, index) => (
              <figure key={`${mockup.title}-${index}`} className={`case-mockup-card ${mockup.ratio === "wide" ? "is-wide" : "is-portrait"}`}>
                <img src={mockup.image} alt={`${project.name} ${mockup.title}`} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
                <figcaption>
                  <span className="label text-[#F8F5EC]/48">Mockup {index + 1}</span>
                  <strong>{mockup.title}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
