import { useEffect, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { projects } from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

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

      // Hero entrance animation
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1 },
        );
      }

      // Meta grid entrance
      if (metaRef.current) {
        gsap.fromTo(
          metaRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.25 },
        );
      }

      // Case sections reveal on scroll
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
            },
          },
        );
      });

      // Refresh ScrollTrigger after images load
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
              Case Study {projectId} / {project.year}
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

        <section
          ref={(node) => { sectionsRef.current[0] = node; }}
          className="case-section py-10 md:py-16"
          aria-labelledby="timeline-title"
          style={{ opacity: 0 }}
        >
          <div className="case-section-heading">
            <p className="label text-[#F8F5EC]/48">1 / Timeline pengerjaan</p>
            <h2 id="timeline-title" className="headline-md text-[#F8F5EC]">From research to validation</h2>
          </div>

          <div className="case-timeline mt-8 md:mt-10">
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

        <section
          ref={(node) => { sectionsRef.current[1] = node; }}
          className="case-section grid gap-4 py-10 md:grid-cols-2 md:gap-6 md:py-16"
          aria-label="Problem and solution"
          style={{ opacity: 0 }}
        >
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

        <section
          ref={(node) => { sectionsRef.current[2] = node; }}
          className="case-section py-10 md:py-16"
          aria-labelledby="mockup-title"
          style={{ opacity: 0 }}
        >
          <div className="case-section-heading md:max-w-3xl">
            <p className="label text-[#F8F5EC]/48">4 / Mockup aplikasi</p>
            <h2 id="mockup-title" className="headline-md text-[#F8F5EC]">Interface preview</h2>
            <p className="mt-5 text-sm leading-7 text-[#F8F5EC]/62 md:text-base">
              A compact visual pass showing how the product direction translates into key screens and presentation-ready mockups.
            </p>
          </div>

          <div className="case-mockup-grid mt-10">
            {mockups.map((mockup, index) => (
              <figure key={`${mockup.title}-${index}`} className="case-mockup-card">
                <img src={mockup.image} alt={`${project.name} ${mockup.title}`} loading="lazy" decoding="async" />
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
