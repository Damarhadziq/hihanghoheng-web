const footerNav = [
  { label: "Home", view: "home" },
  { label: "About", view: "about" },
  { label: "Projects", view: "all-projects" },
  { label: "Achievements", view: "achievements" },
  { label: "Team", view: "team" },
  { label: "Contact", view: "contact" },
];

export default function Footer({ onViewChange }) {
  const currentYear = new Date().getFullYear();

  const handleNavigate = (event, view) => {
    event.preventDefault();
    onViewChange?.(view);
  };

  return (
    <footer id="contact" className="border-t border-[#F8F5EC]/12 bg-[#070A08] text-[#F8F5EC]">
      <div className="section-wrapper pt-16 pb-8 md:pt-24 md:pb-10">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-6 lg:col-span-5">
            <img
              src="/hihang-hoeng-logo.png"
              alt="Hihang Hoeng"
              className="footer-logo mb-5"
              loading="lazy"
            />
            <p className="text-[#F8F5EC]/62 text-sm md:text-base leading-relaxed max-w-md mb-6">
              HIHANG HOENG is a UI/UX competition team from Universitas Negeri Semarang. We document every competition, prototype, and lesson from the journey.
            </p>
          </div>

          <div className="md:col-span-3 lg:col-span-3 lg:col-start-8">
            <h3 className="label text-[#F8F5EC]/48 mb-4">Connect</h3>
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              {[
                ["hello@hihanghoeng.com", "mailto:hello@hihanghoeng.com"],
                ["Instagram", "https://www.instagram.com/"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="text-[#F8F5EC]/68 hover:text-[#F8F5EC] transition-colors duration-200 text-sm">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="label text-[#F8F5EC]/48 mb-4">Navigate</h3>
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              {footerNav.map((item) => (
                <li key={item.view}>
                  <a href={`#${item.view}`} onClick={(event) => handleNavigate(event, item.view)} className="text-[#F8F5EC]/68 hover:text-[#F8F5EC] transition-colors duration-200 text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-5 border-t border-[#F8F5EC]/10 flex flex-col md:flex-row justify-between gap-4">
          <p className="label text-[#F8F5EC]/48">&copy; {currentYear} HIHANG HOENG. All rights reserved.</p>
          <p className="label text-[#F8F5EC]/48">Universitas Negeri Semarang - Built with craft &amp; intention.</p>
        </div>
      </div>
    </footer>
  );
}
