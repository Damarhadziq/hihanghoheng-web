
import { useAchievementDocumentation } from "../hooks/useApiQueries";
import { DocumentationSkeleton } from "./PublicSkeletons";

export default function ProposalPreview({ achievementId, onBack, onOpenBrief }) {
  const { data: document, isPending } = useAchievementDocumentation(achievementId);

  if (isPending) {
    return <DocumentationSkeleton proposal />;
  }

  if (!document) {
    return (
      <main className="documentation-page documentation-empty page-shell">
        <div className="section-wrapper">
          <p className="label text-ink/48">Documentation</p>
          <h1 className="headline-md mt-5">Proposal reference not found.</h1>
          <button type="button" className="documentation-command mt-8" onClick={onBack}>Back to achievements</button>
        </div>
      </main>
    );
  }

  return (
    <main className="proposal-page page-shell">
      <header className="proposal-header border-hairline-b">
        <div className="section-wrapper">
          <button type="button" className="documentation-back label" onClick={onBack}>
            <span aria-hidden="true">&larr;</span> Achievements
          </button>
          <div className="proposal-heading">
            <div>
              <p className="label text-gold">Proposal Reference / {document.year}</p>
              <h1>{document.projectName}</h1>
              <p>Preview a reusable UI/UX competition proposal structure before downloading the PDF reference.</p>
            </div>
            <div className="proposal-actions">
              <a href={document.proposalUrl} target="_blank" rel="noreferrer">Open PDF</a>
              <a href={document.proposalUrl} download>Download PDF</a>
              <button type="button" onClick={onOpenBrief}>Read project brief</button>
            </div>
          </div>
        </div>
      </header>

      <section className="proposal-viewer-shell">
        <div className="section-wrapper">
          <div className="proposal-viewer">
            <object data={document.proposalUrl} type="application/pdf" aria-label="UI/UX competition proposal PDF preview">
              <p>PDF preview is not supported in this browser. <a href={document.proposalUrl} target="_blank" rel="noreferrer">Open the proposal PDF</a>.</p>
            </object>
          </div>
          <p className="proposal-note">Reference only. Adapt the structure to the organizer's rules, judging rubric, and required evidence.</p>
        </div>
      </section>
    </main>
  );
}
