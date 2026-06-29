const footerNav = [
  ["Home", "hero"],
  ["Projects", "projects"],
  ["Achievements", "achievements"],
  ["Team", "team"],
];

const scrollToSection = (event, section) => {
  event.preventDefault();
  document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
  if (window.location.hash) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-[#F8F5EC]/12 bg-[#070A08] text-[#F8F5EC]">
      <div className="section-wrapper pt-16 pb-8 md:pt-24 md:pb-10">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-6 lg:col-span-5">
            <img
              src="/hihang-hoeng-logo.png"
              alt="Hihang Hoeng"
              className="footer-logo mb-5"
            />
            <p className="text-[#F8F5EC]/62 text-sm md:text-base leading-relaxed max-w-md mb-6">
              A UI/UX design team from Universitas Negeri Semarang. We build things, break things,
              and share what we learn.
            </p>
          </div>

          <div className="md:col-span-3 lg:col-span-3 lg:col-start-8">
            <h3 className="label text-[#F8F5EC]/48 mb-4">Connect</h3>
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              {[
                ["hello@hihanghoheng.com", "mailto:hello@hihanghoheng.com"],
                ["Instagram", "#"],
                ["LinkedIn", "#"],
                ["Behance", "#"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-[#F8F5EC]/68 hover:text-[#F8F5EC] transition-colors duration-200 text-sm">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="label text-[#F8F5EC]/48 mb-4">Navigate</h3>
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              {footerNav.map(([label, section]) => (
                <li key={label}>
                  <a href={`#${section}`} onClick={(event) => scrollToSection(event, section)} className="text-[#F8F5EC]/68 hover:text-[#F8F5EC] transition-colors duration-200 text-sm">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-5 border-t border-[#F8F5EC]/10 flex flex-col md:flex-row justify-between gap-4">
          <p className="label text-[#F8F5EC]/48">&copy; {currentYear} Hihang Hoheng. All rights reserved.</p>
          <p className="label text-[#F8F5EC]/48">Universitas Negeri Semarang - Built with craft &amp; intention.</p>
        </div>
      </div>
    </footer>
  );
}
