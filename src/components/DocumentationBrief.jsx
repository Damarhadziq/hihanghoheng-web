
import { useEffect, useRef, useState } from "react";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { useAchievementDocumentation } from "../hooks/useApiQueries";

const briefSections = [
  { id: "background", number: "01", label: "Latar Belakang Masalah" },
  { id: "objectives", number: "02", label: "Tujuan Aplikasi" },
  { id: "users", number: "03", label: "Target Pengguna" },
  { id: "solution", number: "04", label: "Solusi yang Ditawarkan" },
  { id: "innovations", number: "05", label: "Nilai Inovasi UI/UX" },
  { id: "features", number: "06", label: "Fitur Inti" },
  { id: "limitations", number: "07", label: "Batasan Fitur" },
  { id: "positioning", number: "08", label: "Positioning Statement" },
  { id: "flow", number: "09", label: "User Flow" },
];

const BulletList = ({ items }) => (
  <ul className="brief-bullet-list">
    {items.map((item) => <li key={item}>{item}</li>)}
  </ul>
);

export default function DocumentationBrief({ achievementId, onBack, onOpenProposal }) {
  const pageRef = useRef(null);
  const [activeSection, setActiveSection] = useState(briefSections[0].id);
  const { data: document, isPending } = useAchievementDocumentation(achievementId);
  useGsapReveal(pageRef, { stagger: 0.06, dependencies: [document?.id] });

  useEffect(() => {
    let frameId;

    const updateActiveSection = () => {
      frameId = undefined;
      const activationLine = Math.min(window.innerHeight * 0.32, 240);
      let currentSection = briefSections[0].id;

      briefSections.forEach(({ id }) => {
        const section = globalThis.document.getElementById("brief-" + id);
        if (section && section.getBoundingClientRect().top <= activationLine) currentSection = id;
      });

      setActiveSection(currentSection);
    };

    const handleScroll = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [achievementId]);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    globalThis.document.getElementById("brief-" + sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isPending) {
    return <main className="documentation-page documentation-empty page-shell" aria-busy="true" />;
  }

  if (!document) {
    return (
      <main className="documentation-page documentation-empty page-shell">
        <div className="section-wrapper">
          <p className="label text-ink/48">Documentation</p>
          <h1 className="headline-md mt-5">Project brief not found.</h1>
          <button type="button" className="documentation-command mt-8" onClick={onBack}>Back to achievements</button>
        </div>
      </main>
    );
  }

  return (
    <main ref={pageRef} className="documentation-page page-shell">
      <header className="documentation-hero border-hairline-b">
        <div className="section-wrapper">
          <button type="button" className="documentation-back label gsap-reveal" onClick={onBack}>
            <span aria-hidden="true">&larr;</span> Achievements
          </button>
          <p className="label mt-12 text-gold gsap-reveal">Project Brief / {document.year}</p>
          <h1 className="documentation-title gsap-reveal">{document.projectName}</h1>
          <p className="documentation-summary gsap-reveal">{document.summary}</p>
          <dl className="documentation-meta gsap-reveal">
            <div><dt>Competition</dt><dd>{document.competitionName}</dd></div>
            <div><dt>Organizer</dt><dd>{document.organizer}</dd></div>
            <div><dt>Category</dt><dd>{document.category}</dd></div>
          </dl>
        </div>
      </header>

      <div className="section-wrapper documentation-layout">
        <aside className="documentation-toc gsap-reveal" aria-label="Project brief contents">
          <p className="label text-ink/42">Contents</p>
          <nav>
            {briefSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={activeSection === section.id ? "is-active" : ""}
                aria-current={activeSection === section.id ? "location" : undefined}
                onClick={() => scrollToSection(section.id)}
              >
                <span>{section.number}</span>{section.label}
              </button>
            ))}
          </nav>
        </aside>

        <article className="documentation-content">
          <section id="brief-background" className="brief-section gsap-reveal">
            <p className="brief-section-number">01</p>
            <div><p className="label text-gold">Latar Belakang Masalah</p><h2>Why this problem matters.</h2><p>{document.background}</p></div>
          </section>
          <section id="brief-objectives" className="brief-section gsap-reveal">
            <p className="brief-section-number">02</p>
            <div><p className="label text-gold">Tujuan Aplikasi</p><h2>What the experience must achieve.</h2><BulletList items={document.objectives} /></div>
          </section>
          <section id="brief-users" className="brief-section gsap-reveal">
            <p className="brief-section-number">03</p>
            <div><p className="label text-gold">Target Pengguna</p><h2>People at the center of the system.</h2><BulletList items={document.users} /></div>
          </section>
          <section id="brief-solution" className="brief-section gsap-reveal">
            <p className="brief-section-number">04</p>
            <div><p className="label text-gold">Solusi yang Ditawarkan</p><h2>The proposed product direction.</h2><p>{document.solution}</p></div>
          </section>
          <section id="brief-innovations" className="brief-section gsap-reveal">
            <p className="brief-section-number">05</p>
            <div><p className="label text-gold">Nilai Inovasi UI/UX</p><h2>How the design creates value.</h2><BulletList items={document.innovations} /></div>
          </section>
          <section id="brief-features" className="brief-section gsap-reveal">
            <p className="brief-section-number">06</p>
            <div><p className="label text-gold">Fitur Inti</p><h2>The minimum meaningful experience.</h2><BulletList items={document.features} /></div>
          </section>
          <section id="brief-limitations" className="brief-section gsap-reveal">
            <p className="brief-section-number">07</p>
            <div><p className="label text-gold">Batasan Fitur</p><h2>What stays outside the scope.</h2><BulletList items={document.limitations} /></div>
          </section>
          <section id="brief-positioning" className="brief-section brief-positioning gsap-reveal">
            <p className="brief-section-number">08</p>
            <div><p className="label text-gold">Positioning Statement</p><blockquote>{document.positioning}</blockquote></div>
          </section>
          <section id="brief-flow" className="brief-section gsap-reveal">
            <p className="brief-section-number">09</p>
            <div>
              <p className="label text-gold">User Flow</p>
              <h2>Primary low-fidelity journey.</h2>
              <ol className="brief-flow-list">{document.userFlow.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
            </div>
          </section>
        </article>
      </div>

      <section className="documentation-next border-hairline-t">
        <div className="section-wrapper">
          <p className="label text-ink/42">Continue documentation</p>
          <div className="documentation-next-actions">
            <button type="button" onClick={onOpenProposal}>Preview proposal <span aria-hidden="true">&rarr;</span></button>
            {document.prototypeUrl ? (
              <a href={document.prototypeUrl} target="_blank" rel="noreferrer">Open Figma prototype <span aria-hidden="true">&nearr;</span></a>
            ) : (
              <span className="documentation-pending">Figma prototype link pending</span>
            )}
            <a href={document.proposalUrl} download>Download proposal PDF</a>
          </div>
        </div>
      </section>
    </main>
  );
}
