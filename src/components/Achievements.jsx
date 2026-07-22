import { useRef } from "react";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { useAchievements } from "../hooks/useApiQueries";
import { AchievementRowsSkeleton } from "./PublicSkeletons";

const getPlacementClass = (placement) => {
  if (placement.includes("1st")) return "achievement-badge achievement-badge-gold achievement-badge-static";
  if (placement.includes("2nd")) return "achievement-badge achievement-badge-silver achievement-badge-static";
  if (placement.includes("3rd")) return "achievement-badge achievement-badge-bronze achievement-badge-static";
  if (placement.includes("Finalist")) return "achievement-badge achievement-badge-finalist achievement-badge-static";
  return "achievement-badge achievement-badge-muted achievement-badge-static";
};

export default function Achievements({ variant = "home", onOpenDocumentation, onOpenDocument }) {
  const { data: achievements = [], isPending } = useAchievements();
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef, { stagger: 0.1, dependencies: [achievements.length] });
  const isPage = variant === "page";

  const handleOpenDocumentation = (event, itemId) => {
    event.preventDefault();
    onOpenDocumentation?.(itemId);
  };

  if (isPage) {
    return (
      <section id="achievements" ref={sectionRef} className="achievement-page py-20 md:py-32 border-hairline-t">
        <div className="section-wrapper">
          <header className="mb-14 md:mb-20">
            <span className="label mb-5 inline-flex text-ink/48 gsap-reveal">Competition Docs</span>
            <h1 className="achievement-page-title gsap-reveal">Competition journeys, documented.</h1>
          </header>

          <div className="achievement-docs">
            {isPending ? <AchievementRowsSkeleton page /> : achievements.map((item, index) => (
              <article id={item.id} key={`${item.competitionName}-${item.date}`} className="achievement-doc gsap-reveal">
                <div className="achievement-doc-marker">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="achievement-doc-body">
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span className={getPlacementClass(item.placement)}>{item.placement}</span>
                    <span className="label text-ink/48">{item.date}</span>
                    <span className="label text-ink/48">{item.scale}</span>
                  </div>
                  <h2 className="font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">{item.competitionName}</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="doc-meta"><span className="label text-ink/42">Organizer</span><strong>{item.organizer}</strong></div>
                    <div className="doc-meta"><span className="label text-ink/42">Project</span><strong>{item.projectName}</strong></div>
                    <div className="doc-meta"><span className="label text-ink/42">Result</span><strong>{item.placement}</strong></div>
                  </div>
                  <p className="mt-6 max-w-3xl text-sm leading-8 text-ink/68 md:text-base">{item.story}</p>
                  <div className="mt-7 grid gap-5 md:grid-cols-2">
                    <div>
                      <p className="label mb-3 text-gold">Documentation</p>
                      <ol className="doc-list doc-link-list">
                        {item.documentation.map((doc) => (
                          <li key={doc}>
                            {doc === "Project brief" && (
                              <button type="button" onClick={() => onOpenDocument?.("brief", item.id)}>Project brief</button>
                            )}
                            {doc === "Proposal" && (
                              <button type="button" onClick={() => onOpenDocument?.("proposal", item.id)}>Proposal</button>
                            )}
                            {doc === "Prototype" && (() => {
                              const documentation = item.documentationDetail;
                              return documentation?.prototypeUrl ? (
                                <a href={documentation.prototypeUrl} target="_blank" rel="noreferrer">Prototype <span aria-hidden="true">&nearr;</span></a>
                              ) : (
                                <span className="documentation-link-pending" aria-disabled="true">Prototype link pending</span>
                              );
                            })()}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <p className="label mb-3 text-gold">Contributors</p>
                      <div className="contributor-list">
                        {item.contributors.map((person) => (
                          <div key={`${item.competitionName}-${person.name}`} className="contributor-pill">
                            <strong>{person.name}</strong>
                            <span>{person.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="py-20 md:py-32 border-hairline-t"
    >
      <div className="section-wrapper">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 md:mb-16">
          <div>
            <span className="label text-ink/64 gsap-reveal inline-flex items-center gap-2 mb-4">
              Trophy Case
            </span>
            <h2 className="headline-lg gsap-reveal">Achievements</h2>
          </div>
          <p className="text-ink/68 text-sm md:text-base max-w-sm gsap-reveal">
            Each competition taught us something new. Some we won - all of them made us better.
          </p>
        </div>

        <div className="flex flex-col">
          <div className="hidden md:grid md:grid-cols-12 gap-4 py-3 border-hairline-b">
            <span className="label text-ink/52 md:col-span-2">Date</span>
            <span className="label text-ink/52 md:col-span-3">Competition</span>
            <span className="label text-ink/52 md:col-span-2">Placement</span>
            <span className="label text-ink/52 md:col-span-2">Project</span>
            <span className="label text-ink/52 md:col-span-3">Documentation</span>
          </div>

          {isPending ? <AchievementRowsSkeleton /> : achievements.map((item, i) => (
            <div
              key={`${item.competitionName}-${item.date}`}
              className={`gsap-reveal grid md:grid-cols-12 gap-2 md:gap-4 py-6 md:py-5 ${
                i < achievements.length - 1 ? "border-hairline-b" : ""
              }`}
            >
              <div className="md:col-span-2">
                <span className="label text-ink/64">{item.date}</span>
              </div>

              <div className="md:col-span-3">
                <p className="font-display font-semibold text-base md:text-lg tracking-tight">
                  {item.competitionName}
                </p>
              </div>

              <div className="md:col-span-2">
                <span className={getPlacementClass(item.placement)}>{item.placement}</span>
              </div>

              <div className="md:col-span-2">
                <p className="text-ink/70 text-sm">{item.projectName}</p>
              </div>

              <div className="md:col-span-3">
                <a href={`#${item.id}`} onClick={(event) => handleOpenDocumentation(event, item.id)} className="documentation-link">
                  Open Documentation <span aria-hidden="true">-&gt;</span>
                </a>
                <p className="mt-2 text-ink/52 text-sm leading-relaxed">
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
