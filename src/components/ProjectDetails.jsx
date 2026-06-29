import { useEffect } from "react";

export default function ProjectDetails({ projectId, onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050605] pt-20 text-[#F8F5EC]">
      <article className="section-wrapper py-20 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <button onClick={onBack} className="gsap-pill label mb-12 inline-flex items-center px-6 py-3">
            Back to gallery
          </button>

          <p className="label mb-4 text-[#F8F5EC]/58">Case Study {projectId}</p>
          <h1 className="headline-lg mb-10 text-[#F8F5EC]">Project Details</h1>

          <div className="mx-auto mb-10 aspect-video max-w-4xl border border-[#F8F5EC]/12 bg-[#F8F5EC]/5" />

          <div className="mx-auto grid max-w-3xl gap-4 border-y border-[#F8F5EC]/12 py-8 text-center md:grid-cols-3">
            <div>
              <h3 className="label mb-2 text-[#F8F5EC]/42">Role</h3>
              <p className="font-medium">UI/UX Design</p>
            </div>
            <div>
              <h3 className="label mb-2 text-[#F8F5EC]/42">Timeline</h3>
              <p className="font-medium">8 Weeks</p>
            </div>
            <div>
              <h3 className="label mb-2 text-[#F8F5EC]/42">Client</h3>
              <p className="font-medium">Internal Project</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
