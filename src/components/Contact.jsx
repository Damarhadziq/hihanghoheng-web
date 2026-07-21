import { useState } from "react";

const email = "hello@hihanghoeng.com";

export default function Contact({ onViewChange }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <section className="contact-page" aria-labelledby="contact-title">
      <div className="section-wrapper">
        <header className="contact-hero">
          <div>
            <p className="label text-ink/48">Contact / Collaboration</p>
            <h1 id="contact-title" className="headline-lg mt-5 max-w-4xl">
              Have a brief, a competition, or an idea worth exploring?
            </h1>
          </div>
          <p className="contact-intro">
            We are open to competition collaborations, design conversations, and opportunities where research, strategy, and interface design can work together.
          </p>
        </header>

        <div className="contact-grid">
          <article className="contact-primary">
            <p className="label text-ink/48">Email</p>
            <a className="contact-email" href={`mailto:${email}`}>{email}</a>
            <div className="contact-actions">
              <a className="gsap-pill label px-5 py-3" href={`mailto:${email}`}>Write an email</a>
              <button className="contact-copy label" type="button" onClick={copyEmail} aria-live="polite">
                {copied ? "Email copied" : "Copy email"}
              </button>
            </div>
          </article>

          <aside className="contact-aside" aria-label="Availability and response information">
            <div>
              <p className="label text-ink/42">Based in</p>
              <strong>Semarang, Indonesia</strong>
            </div>
            <div>
              <p className="label text-ink/42">Best for</p>
              <strong>Competition & design collaboration</strong>
            </div>
            <div>
              <p className="label text-ink/42">Social</p>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">-&gt;</span></a>
            </div>
          </aside>
        </div>

        <div className="contact-project-cta">
          <p className="label text-ink/42">See the work first</p>
          <button type="button" onClick={() => onViewChange?.("all-projects")}>
            Explore competition projects <span aria-hidden="true">-&gt;</span>
          </button>
        </div>
      </div>
    </section>
  );
}