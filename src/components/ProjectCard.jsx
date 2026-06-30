export default function ProjectCard({ project, onSelect }) {
  const { name, year, tags, description, image } = project;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="gsap-reveal gsap-clickable-card project-card group flex flex-col border border-ink/12 text-left transition-colors duration-300"
      aria-label={`Open ${name} project details`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
        {image ? (
          <img
            src={image}
            alt={`${name} project screenshot`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.018]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-16 w-16 rounded-full border border-ink/15" aria-hidden="true" />
          </div>
        )}
        <span className="label absolute right-3 top-3 bg-cream/90 px-2 py-1 text-ink/70 backdrop-blur-sm">
          {year}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <h3 className="font-display text-xl font-semibold tracking-normal md:text-2xl">
          {name}
        </h3>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="label border border-ink/10 px-2 py-0.5 text-ink/62"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="flex-1 text-sm leading-relaxed text-ink/70">
          {description}
        </p>

        <span className="label mt-2 inline-flex items-center gap-2 text-ink/58 transition-colors duration-200 group-hover:text-ink">
          View Case Study
          <span aria-hidden="true">-&gt;</span>
        </span>
      </div>
    </button>
  );
}
