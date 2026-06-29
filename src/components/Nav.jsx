import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#hero", section: "hero", isHome: true },
  { label: "About", href: "#about", section: "about" },
  { label: "Projects", href: "#projects", section: "projects" },
  { label: "Process", href: "#process", section: "process" },
  { label: "Achievements", href: "#achievements", section: "achievements" },
  { label: "Team", href: "#team", section: "team" },
];

const trackedIds = new Set([...navLinks.map((link) => link.section), "contact"]);

const cleanHash = () => {
  if (window.location.hash) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
};

export default function Nav({ onViewChange, activeView = "home" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    cleanHash();
  }, []);

  useEffect(() => {
    if (activeView !== "home") return undefined;

    let rafId = 0;

    const readActiveSection = () => {
      rafId = 0;
      const probeY = window.innerWidth >= 768 ? 104 : 84;
      const isAtPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 12;
      if (isAtPageEnd) {
        setActiveSection("contact");
        return;
      }

      const sections = Array.from(document.querySelectorAll("main > section, footer"));
      const current = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= probeY && rect.bottom > probeY;
      });

      const nextId = current?.id || "";
      setActiveSection(trackedIds.has(nextId) ? nextId : "");
    };

    const scheduleRead = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(readActiveSection);
    };

    scheduleRead();
    window.addEventListener("scroll", scheduleRead, { passive: true });
    window.addEventListener("resize", scheduleRead);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleRead);
      window.removeEventListener("resize", scheduleRead);
    };
  }, [activeView]);

  const scrollToSection = (section) => {
    window.setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
      cleanHash();
    }, 0);
  };

  const handleLinkClick = (event, link) => {
    event.preventDefault();
    setMobileOpen(false);
    setActiveSection(link.section);

    if (activeView !== "home" && onViewChange) {
      onViewChange("home");
    }

    scrollToSection(link.section);
  };

  const handleContactClick = (event) => {
    event.preventDefault();
    setActiveSection("contact");
    setMobileOpen(false);
    scrollToSection("contact");
  };

  const isActiveLink = (link) => {
    if (activeView === "all-projects" || activeView.startsWith("project-")) return link.section === "projects";
    return activeSection === link.section;
  };

  return (
    <nav className="fixed-edge fixed left-0 right-0 top-0 z-[120] border-b border-[#F8F5EC]/12 bg-[#0c0f0d]/92 text-[#F8F5EC] backdrop-blur-md" role="navigation" aria-label="Main navigation">
      <div className="section-wrapper flex h-16 items-center justify-between md:h-20">
        <a href="#hero" className="interactive-nav-link inline-flex items-center" aria-label="Hihang Hoeng home" onClick={(event) => handleLinkClick(event, navLinks[0])}>
          <img src="/hihang-hoeng-logo.png" alt="Hihang Hoeng" className="brand-logo" />
        </a>

        <ul className="m-0 hidden list-none items-center gap-8 p-0 md:flex">
          {navLinks.map((link) => {
            const active = isActiveLink(link);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
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

        <a href="#contact" className="contact-nav-link hidden items-center justify-center px-8 py-3.5 label md:inline-flex" onClick={handleContactClick}>
          Contact
        </a>

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
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`interactive-nav-link label block w-fit py-1 ${active ? "is-active" : ""}`}
                    onClick={(event) => handleLinkClick(event, link)}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
            <li>
              <a href="#contact" className="contact-nav-link inline-flex items-center justify-center px-8 py-3.5 label" onClick={handleContactClick}>
                Contact
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
