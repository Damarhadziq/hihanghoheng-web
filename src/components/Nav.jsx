import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", view: "home" },
  { label: "About", view: "about" },
  { label: "Projects", view: "all-projects" },
  { label: "Achievement", view: "achievements" },
  { label: "Team", view: "team" },
];

export default function Nav({ onViewChange, activeView = "home" }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

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
          className={`mobile-nav-toggle relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-[#F8F5EC]/12 bg-[#F8F5EC]/[0.03] text-[#F8F5EC] transition-colors duration-200 hover:border-[#F8F5EC]/24 hover:bg-[#F8F5EC]/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 md:hidden ${mobileOpen ? "is-open" : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation-menu"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <Menu className="mobile-nav-icon mobile-nav-icon-menu" size={20} strokeWidth={1.7} aria-hidden="true" />
          <X className="mobile-nav-icon mobile-nav-icon-close" size={20} strokeWidth={1.7} aria-hidden="true" />
        </button>
      </div>

      <div
        id="mobile-navigation-menu"
        className={`mobile-nav-panel bg-[#0c0f0d] md:hidden ${mobileOpen ? "is-open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-nav-panel-inner">
          <ul className="section-wrapper m-0 flex list-none flex-col gap-4 p-0 px-6 py-6">
            {navLinks.map((link, index) => {
              const active = isActiveLink(link);
              return (
                <li key={link.view} className="mobile-nav-item" style={{ "--mobile-nav-index": index }}>
                  <a
                    href={`#${link.view}`}
                    className={`interactive-nav-link label block w-fit py-1 ${active ? "is-active" : ""}`}
                    onClick={(event) => handleLinkClick(event, link)}
                    aria-current={active ? "page" : undefined}
                    tabIndex={mobileOpen ? undefined : -1}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
