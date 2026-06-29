export default function ProjectCard({ project }) {
  const { name, year, tags, description, link, image } = project;

  return (
    <article className="gsap-reveal gsap-clickable-card group flex flex-col border border-ink/12 transition-colors duration-300">
      {/* Image area */}
      <div className="relative aspect-[4/3] bg-ink/5 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={`${name} project screenshot`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border border-ink/15" aria-hidden="true" />
          </div>
        )}
        {/* Year badge */}
        <span className="absolute top-3 right-3 label bg-cream/90 backdrop-blur-sm px-2 py-1 text-ink/70">
          {year}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 md:p-6 flex-1">
        <h3 className="font-display font-semibold text-xl md:text-2xl tracking-tight">
          {name}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="label px-2 py-0.5 border border-ink/10 text-ink/62"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-ink/70 text-sm leading-relaxed flex-1">
          {description}
        </p>

        {/* Link */}
        {link && link !== "#" ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 label text-signal hover:text-ink transition-colors duration-200 mt-2"
          >
            View Project
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        ) : (
          <span className="label text-ink/52 mt-2">
            Case study coming soon
          </span>
        )}
      </div>
    </article>
  );
}



