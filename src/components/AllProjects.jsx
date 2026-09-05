import { useMemo } from "react";
import { useProjects } from "../hooks/useApiQueries";
import AccordionGallery from "./AccordionGallery";
import { ProjectArchiveSkeleton } from "./PublicSkeletons";

function AllProjectsContent({ projects, onSelectProject }) {
  const accordionItems = useMemo(() => {
    return projects.map((project) => {
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
        onClick: () => onSelectProject?.(project.slug),
        project,
      };
    });
  }, [projects, onSelectProject]);

  return (
    <main className="min-h-screen bg-[#070A08] pt-24 pb-16 md:pt-28 md:pb-20 text-[#F8F5EC] flex flex-col justify-center">
      <section className="section-wrapper w-full">
        {/* Judul */}
        <div className="mb-8 md:mb-12 max-w-5xl">
          <span className="label mb-3 inline-flex items-center gap-2 text-ink/48">
            Competition Portfolio &bull; {projects.length} Projects
          </span>
          <h1 className="headline-lg">
            Case Studies.
          </h1>
        </div>

        {/* Konten Accordion Gallery */}
        <div className="w-full">
          <AccordionGallery
            items={accordionItems}
            defaultIndex={0}
            expandRatio={0.5}
            trigger="hover"
            height={550}
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
      </section>
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
        <h1 className="mt-5 font-display text-4xl font-semibold">Belum Ada Project Yang Dipublikasikan.</h1>
      </main>
    );
  }
  return <AllProjectsContent {...props} projects={projects} />;
}
