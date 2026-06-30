import { useState } from "react";

const navLinks = [
  { label: "Home", view: "home" },
  { label: "About", view: "about" },
  { label: "Projects", view: "all-projects" },
  { label: "Achievement", view: "achievements" },
  { label: "Team", view: "team" },
];

export default function Nav({ onViewChange, activeView = "home" }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (event, link) => {
    event.preventDefault();
    setMobileOpen(false);
    onViewChange?.(link.view);
  };

  const isActiveLink = (link) => {
    if ((activeView === "all-projects" || activeView.startsWith("project-")) && link.view === "all-projects") return true;
    return activeView === link.view;
  };

  return (
    <nav className="fixed-edge fixed left-0 right-0 top-0 z-[120] border-b border-[#F8F5EC]/12 bg-[#0c0f0d]/92 text-[#F8F5EC] backdrop-blur-md" role="navigation" aria-label="Main navigation">
      <div className="section-wrapper flex h-16 items-center justify-between md:h-20">
        <a href="#home" className="inline-flex items-center" aria-label="Hihang Hoeng home" onClick={(event) => handleLinkClick(event, navLinks[0])}>
          <img src="/hihang-hoeng-logo.png" alt="Hihang Hoeng" className="brand-logo" loading="lazy" />
        </a>

        <ul className="m-0 hidden list-none items-center gap-8 p-0 md:flex">
          {navLinks.map((link) => {
            const active = isActiveLink(link);
            return (
              <li key={link.view}>
                <a
                  href={`#${link.view}`}
                  onClick={(event) => handleLinkClick(event, link)}
                  className={`interactive-nav-link label ${active ? "is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          <span className={`block h-px w-5 bg-[#F8F5EC] transition-transform duration-200 ${mobileOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`block h-px w-5 bg-[#F8F5EC] transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-px w-5 bg-[#F8F5EC] transition-transform duration-200 ${mobileOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      {mobileOpen && (
        <div className="border-b border-[#F8F5EC]/12 bg-[#0c0f0d] md:hidden">
          <ul className="section-wrapper m-0 flex list-none flex-col gap-4 p-0 px-6 py-6">
            {navLinks.map((link) => {
              const active = isActiveLink(link);
              return (
                <li key={link.view}>
                  <a
                    href={`#${link.view}`}
                    className={`interactive-nav-link label block w-fit py-1 ${active ? "is-active" : ""}`}
                    onClick={(event) => handleLinkClick(event, link)}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
