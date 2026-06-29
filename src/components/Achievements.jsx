import { useRef } from "react";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { achievements } from "../data/achievements";

const getPlacementClass = (placement) => {
  if (placement.includes("1st")) return "achievement-badge achievement-badge-gold";
  if (placement.includes("2nd")) return "achievement-badge achievement-badge-silver";
  if (placement.includes("3rd")) return "achievement-badge achievement-badge-bronze";
  if (placement.includes("Finalist")) return "achievement-badge achievement-badge-finalist";
  return "achievement-badge achievement-badge-muted";
};

export default function Achievements() {
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef, { stagger: 0.1 });

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
            <span className="label text-ink/52 md:col-span-3">Note</span>
          </div>

          {achievements.map((item, i) => (
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
                <button type="button" className={getPlacementClass(item.placement)} aria-label={`See documentation for ${item.competitionName}`}>
                  <span className="achievement-badge-label">{item.placement}</span>
                  <span className="achievement-badge-cta">See Documentation <span aria-hidden="true">-&gt;</span></span>
                </button>
              </div>

              <div className="md:col-span-2">
                <p className="text-ink/70 text-sm">{item.projectName}</p>
              </div>

              <div className="md:col-span-3">
                <p className="text-ink/68 text-sm leading-relaxed">
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
