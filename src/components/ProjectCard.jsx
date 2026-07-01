import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function ProjectCard({ project, onSelect }) {
  const { name, year, tags, description, image } = project;
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      const imageNode = imageRef.current;
      if (!card || !imageNode) return undefined;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return undefined;

      const enter = () => gsap.to(imageNode, { scale: 1.018, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      const leave = () => gsap.to(imageNode, { scale: 1, duration: 0.5, ease: "power3.out", overwrite: "auto" });

      card.addEventListener("pointerenter", enter);
      card.addEventListener("pointerleave", leave);
      card.addEventListener("focus", enter);
      card.addEventListener("blur", leave);

      return () => {
        gsap.killTweensOf(imageNode);
        card.removeEventListener("pointerenter", enter);
        card.removeEventListener("pointerleave", leave);
        card.removeEventListener("focus", enter);
        card.removeEventListener("blur", leave);
      };
    },
    { scope: cardRef },
  );

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onSelect}
      className="gsap-reveal gsap-clickable-card project-card group flex flex-col border border-ink/12 text-left transition-colors duration-300"
      aria-label={`Open ${name} competition details`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
        {image ? (
          <img
            ref={imageRef}
            src={image}
            alt={`${name} project screenshot`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
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
          View Competition
          <span aria-hidden="true">-&gt;</span>
        </span>
      </div>
    </button>
  );
}

