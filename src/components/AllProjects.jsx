import { useMemo, useState } from "react";
import { useProjects } from "../hooks/useApiQueries";
import Footer from "./Footer";
import AccordionGallery from "./AccordionGallery";
import { ProjectArchiveSkeleton } from "./PublicSkeletons";

function AllProjectsContent({ projects, onSelectProject, onViewChange }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const accordionItems = useMemo(() => {
    return projects.map((project, i) => {
      const img =
        project.mockup16x9 ||
        project.landscapeImageUrl ||
        project.image ||
        project.coverImageUrl ||
        "/optimized/projects/mockup-landing-1200.webp";

      return {
        id: project.id || project.slug,
        slug: project.slug,
        name: project.name,
        image: img,
        alt: `${project.name} - ${project.competition || project.organizer || "UI/UX Competition"}`,
        label: (
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#F8F5EC]/70">
              {project.year} &bull; {project.organizer || project.competition}
            </span>
            <span className="font-display text-lg md:text-2xl font-semibold text-[#F8F5EC] flex items-center gap-2">
              {project.name}
            </span>
          </div>
        ),
        onActivate: () => setActiveIndex(i),
        onClick: () => onSelectProject?.(project.slug),
        project,
      };
    });
  }, [projects, onSelectProject]);

  const activeProject = projects[activeIndex] || projects[0];

  return (
    <main className="min-h-screen bg-[#070A08] pt-24 md:pt-32 text-[#F8F5EC]">
      <section className="section-wrapper pb-16 md:pb-24">
        {/* Page Header */}
        <div className="mb-10 md:mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="label mb-3 inline-flex items-center gap-2 text-ink/48">
              Competition Portfolio &bull; {projects.length} Projects
            </span>
            <h1 className="headline-lg">Competition journeys, documented.</h1>
          </div>
          <p className="max-w-md text-sm text-ink/60 md:text-base">
            Explore our competition work from real judging stages. Click any active project to open its complete case study, prototype, and jury pitch materials.
          </p>
        </div>

        {/* Accordion Gallery */}
        <div className="mb-10 md:mb-14">
          <AccordionGallery
            items={accordionItems}
            defaultIndex={0}
            expandRatio={0.48}
            trigger="hover"
            height={520}
            gap={14}
            radius={16}
            accentColor="#F8F5EC"
            overlayColor="#070A08"
            textColor="#F8F5EC"
            grayscale={true}
            parallax={0.55}
            tilt={7}
            onSelect={(item) => onSelectProject?.(item.slug || item.id)}
          />
        </div>

        {/* Active Project Highlight Bar */}
        {activeProject && (
          <div className="rounded-2xl border border-hairline bg-ink/[0.02] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="label text-gold">{activeProject.year}</span>
                <span className="text-ink/25">&bull;</span>
                <span className="label text-ink/60">{activeProject.organizer || activeProject.competition}</span>
                {activeProject.type && (
                  <>
                    <span className="text-ink/25">&bull;</span>
                    <span className="label text-ink/48">{activeProject.type}</span>
                  </>
                )}
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3 text-ink">
                {activeProject.name}
              </h2>
              <p className="text-sm md:text-base text-ink/68 line-clamp-2 leading-relaxed mb-4">
                {activeProject.description}
              </p>
              {activeProject.tags && (
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(activeProject.tags)
                    ? activeProject.tags
                    : typeof activeProject.tags === "string"
                      ? activeProject.tags.split(" ")
                      : []
                  ).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full border border-hairline text-ink/60 bg-ink/[0.02]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <button
                type="button"
                onClick={() => onSelectProject?.(activeProject.slug)}
                className="gsap-pill cursor-target group inline-flex items-center gap-3 px-6 py-3.5 label text-sm"
                aria-label={`Open case study for ${activeProject.name}`}
              >
                <span>View Full Case Study</span>
                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </button>
            </div>
          </div>
        )}
      </section>

      <Footer onViewChange={onViewChange} />
    </main>
  );
}

export default function AllProjects(props) {
  const { data: projects = [], isPending } = useProjects();
  if (isPending) return <ProjectArchiveSkeleton />;
  if (!projects.length) {
    return (
      <main className="project-index-page min-h-screen px-6 pt-32 text-ink">
        <p className="label text-ink/48">Projects</p>
        <h1 className="mt-5 font-display text-4xl font-semibold">Belum ada project yang dipublikasikan.</h1>
      </main>
    );
  }
  return <AllProjectsContent {...props} projects={projects} />;
}
