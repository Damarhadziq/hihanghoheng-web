import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import mentorImage from "../assets/mentor.svg";
import { useMentor } from "../hooks/useApiQueries";

gsap.registerPlugin(ScrollTrigger);

export default function Mentor() {
  const { data: mentor } = useMentor();
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const revealItems = gsap.utils.toArray(section.querySelectorAll(".mentor-reveal"));
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        gsap.set(revealItems, { opacity: 1, y: 0 });
        return undefined;
      }

      gsap.fromTo(
        revealItems,
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section id="mentor" ref={sectionRef} className="relative overflow-hidden border-hairline-t pt-8 md:pt-10">
      <div className="section-wrapper relative z-20">
        <div className="grid gap-8 md:grid-cols-[1fr_minmax(280px,380px)_1fr] md:items-end md:gap-10">
          <div className="mentor-reveal order-2 pb-10 text-center md:order-1 md:text-right">
            <span className="label mb-3 inline-flex text-gold md:justify-end">Pendamping</span>
            <h2 className="font-display text-2xl font-semibold leading-tight text-ink md:text-4xl">
              A mentor who keeps our process grounded.
            </h2>
          </div>

          <div className="mentor-reveal order-1 mx-auto flex w-full max-w-[330px] items-end justify-center md:order-2 md:max-w-[380px]">
            <img
              src={mentor?.imageUrl?.startsWith("/src/") ? mentorImage : mentor?.imageUrl || mentorImage}
              alt={mentor?.imageAlt || "Dosen pembimbing Hihang Hoeng"}
              className="mentor-photo h-auto w-full object-contain opacity-90 mix-blend-luminosity"
              draggable="false"
              loading="lazy"
            />
          </div>

          <div className="mentor-reveal order-3 pb-10 text-center md:text-left">
            <p className="font-display text-2xl font-semibold leading-tight text-ink md:text-4xl">{mentor?.name || "Ajeng Rahma Sudarni, S.Pd., M.Pd.T."}</p>
            <p className="label mt-3 text-ink/56">{mentor?.role || "Dosen Pembimbing"}</p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/66 md:text-base">
              {mentor?.description || "Her guidance helps Hihang Hoeng stay honest with the problem, careful with the process, and brave enough to keep refining the work."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
