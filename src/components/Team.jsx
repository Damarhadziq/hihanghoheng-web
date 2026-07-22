import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTeam } from "../hooks/useApiQueries";
import { TeamCardsSkeleton } from "./PublicSkeletons";

gsap.registerPlugin(ScrollTrigger);

const chatMessages = [
  {
    sender: "Damar",
    role: "UI/UX Designer",
    message: "Can we make the first screen answer the brief in under five seconds?",
    tone: "gold",
  },
  {
    sender: "Faruq",
    role: "Business Analysis",
    message: "The judge will ask about impact. Put the value proposition before the feature list.",
    tone: "blue",
  },
  {
    sender: "Febi",
    role: "User Analysis",
    message: "I found three repeated user pains. The queue issue is still the strongest angle.",
    tone: "cream",
  },
  {
    sender: "Damar",
    role: "UI/UX Designer",
    message: "Prototype flow is ready. Need one more pass on empty states and microcopy.",
    tone: "cream",
  },
  {
    sender: "Faruq",
    role: "Business Analysis",
    message: "Pitch order: problem, evidence, solution, business fit, then demo. Keep it tight.",
    tone: "gold",
  },
  {
    sender: "Febi",
    role: "User Analysis",
    message: "User quotes are stronger than generic claims. I'll trim the findings into three cards.",
    tone: "blue",
  },
  {
    sender: "Damar",
    role: "UI/UX Designer",
    message: "The visual system should feel confident, not crowded. Fewer colors, clearer hierarchy.",
    tone: "blue",
  },
  {
    sender: "Faruq",
    role: "Business Analysis",
    message: "Let's connect every feature to scoring criteria so the deck feels intentional.",
    tone: "cream",
  },
  {
    sender: "Febi",
    role: "User Analysis",
    message: "Testing note: users understood pickup status faster when we used timeline labels.",
    tone: "gold",
  },
  {
    sender: "Damar",
    role: "UI/UX Designer",
    message: "Final slide needs breathing room. One key sentence, one strong mockup.",
    tone: "cream",
  },
];
const TeamMessageWall = ({ team }) => {
  const getChatMember = (sender) => team.find((member) => member.shortName === sender);
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!section || !viewport || !track) return undefined;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const bubbles = gsap.utils.toArray(track.querySelectorAll(".team-message-bubble"));

      if (prefersReduced) {
        gsap.set(track, { x: 0 });
        gsap.set(bubbles, { opacity: 1, y: 0, scale: 1 });
        return undefined;
      }

      const getTravelDistance = () => {
        const lastBubble = bubbles[bubbles.length - 1];
        if (!lastBubble) return Math.min(0, viewport.clientWidth - track.scrollWidth);

        const endInset = Math.max(24, Math.min(viewport.clientWidth * 0.08, 96));
        return Math.min(0, viewport.clientWidth - lastBubble.offsetLeft - lastBubble.offsetWidth - endInset);
      };
      const getScrollDistance = () => Math.max(Math.abs(getTravelDistance()) * 0.82, window.innerHeight * 0.55);

      gsap.set(bubbles, {
        autoAlpha: 0,
        y: 46,
        scale: 1,
        rotate: (index) => (index % 2 === 0 ? -3.5 : 3.5),
        transformOrigin: "50% 85%",
      });

      const tween = gsap.to(track, {
        x: getTravelDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const revealTriggers = bubbles.map((bubble, index) => {
        const bubbleTween = gsap.to(bubble, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotate: index % 2 === 0 ? -0.9 : 0.9,
          duration: 0.72,
          ease: "back.out(1.55)",
          scrollTrigger: {
            trigger: bubble,
            containerAnimation: tween,
            start: "left 84%",
            end: "left 54%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });

        return bubbleTween.scrollTrigger;
      });

      return () => {
        revealTriggers.forEach((trigger) => trigger?.kill());
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="team-message-section team-message-page border-hairline-t" aria-labelledby="team-message-title">
      <div className="section-wrapper">
        <div className="team-message-heading">
          <span className="label text-ink/48">Team Notes</span>
          <h2 id="team-message-title" className="headline-md">The group chat before submission.</h2>
          <p className="text-sm leading-7 text-ink/64 md:text-base">
            Scroll through a horizontal stack of short pre-submission messages from the team.
          </p>
        </div>
      </div>

      <div ref={viewportRef} className="team-message-viewport" aria-label="Team message stack">
        <div ref={trackRef} className="team-message-track">
          {chatMessages.map((item, index) => {
            const member = getChatMember(item.sender);

            return (
              <article key={`${item.sender}-${index}`} className={`team-message-bubble team-message-bubble-${item.tone || "cream"}`}>
                <p className="team-message-text">&ldquo;{item.message}&rdquo;</p>
                <div className="team-message-author">
                  {member?.images?.[0] && (
                    <img src={member.images[0]} alt={item.sender} loading="lazy" decoding="async" />
                  )}
                  <div>
                    <strong>{item.sender}</strong>
                    <span>{item.role}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const SocialLinks = ({ member }) => (
  <div className="team-social-links" aria-label={`${member.name} social links`}>
    <a href={member.social?.linkedin || "#"} target="_blank" rel="noreferrer" className="team-social-link">LinkedIn</a>
    <a href={member.social?.instagram || "#"} target="_blank" rel="noreferrer" className="team-social-link">Instagram</a>
  </div>
);

export default function Team({ variant = "home" }) {
  const { data: team = [], isPending } = useTeam();
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const isPage = variant === "page";

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cards = gsap.utils.toArray(section.querySelectorAll(".team-card"));
      const photoFrames = gsap.utils.toArray(section.querySelectorAll(".team-photo-frame"));
      const hoverCleanups = [];

      if (prefersReduced) {
        gsap.set([textRef.current, ...cards].filter(Boolean), { opacity: 1, xPercent: 0 });
        photoFrames.forEach((frame) => {
          const images = gsap.utils.toArray(frame.querySelectorAll("img"));
          gsap.set(images, { opacity: 0, scale: 1 });
          gsap.set(images[0], { opacity: 0.78 });
        });
        return undefined;
      }

      if (textRef.current && !isPage) {
        gsap.to(textRef.current, {
          xPercent: -28,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "center top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.fromTo(
        cards,
        { y: 42, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section.querySelector(".team-grid"),
            start: "top 78%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        },
      );

      photoFrames.forEach((frame) => {
        const card = frame.closest(".team-card");
        const images = gsap.utils.toArray(frame.querySelectorAll("img"));
        if (!card || !images.length) return;

        gsap.set(images, { opacity: 0, scale: 1 });
        gsap.set(images[0], { opacity: 0.78 });

        const cycle = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.12 });
        images.forEach((image, index) => {
          cycle.to(images, { opacity: 0, duration: 0.3, ease: "power2.inOut" }, index * 0.82);
          cycle.to(image, { opacity: 0.82, duration: 0.3, ease: "power2.inOut" }, index * 0.82);
        });
        cycle.to(images, { opacity: 0, duration: 0.34, ease: "power2.inOut" }, images.length * 0.82);
        cycle.to(images[0], { opacity: 0.78, duration: 0.34, ease: "power2.inOut" }, images.length * 0.82);

        const enter = () => {
          gsap.to(images, { scale: 1.025, duration: 1.05, ease: "power3.out", overwrite: "auto" });
          cycle.restart(true);
        };
        const leave = () => {
          cycle.pause(0);
          gsap.to(images, { opacity: 0, scale: 1, duration: 0.72, ease: "power2.out", overwrite: "auto" });
          gsap.to(images[0], { opacity: 0.78, duration: 0.72, ease: "power2.out", overwrite: "auto" });
        };

        card.addEventListener("pointerenter", enter);
        card.addEventListener("pointerleave", leave);
        card.addEventListener("focusin", enter);
        card.addEventListener("focusout", leave);

        hoverCleanups.push(() => {
          cycle.kill();
          gsap.killTweensOf(images);
          card.removeEventListener("pointerenter", enter);
          card.removeEventListener("pointerleave", leave);
          card.removeEventListener("focusin", enter);
          card.removeEventListener("focusout", leave);
        });
      });

      return () => hoverCleanups.forEach((cleanup) => cleanup());
    },
    { scope: sectionRef, dependencies: [variant, team.length] },
  );

  return (
    <>
      <section id="team" ref={sectionRef} className={`overflow-hidden border-hairline-t py-20 md:py-32 ${isPage ? "team-page" : ""}`}>
      {isPage ? (
        <div className="section-wrapper mb-12 md:mb-16">
          <span className="label mb-5 inline-flex text-ink/48">Team</span>
          <div className="grid gap-5 md:grid-cols-12 md:items-end">
            <h1 className="headline-lg md:col-span-7">Meet the makers.</h1>
            <p className="text-sm leading-7 text-ink/64 md:col-span-4 md:col-start-9 md:text-base">
              Three core roles moving from research and strategy to design and competition presentation.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="section-wrapper">
            <span className="label mb-8 inline-flex text-ink/48">The People</span>
          </div>

          <div className="mb-12 w-full overflow-hidden md:mb-16">
            <div className="flex whitespace-nowrap pl-[8vw]">
              <p ref={textRef} className="font-display text-[18vw] font-semibold uppercase leading-none text-ink/95 md:text-[11vw]">
                MEET THE <span className="text-ink">MAKERS</span> MEET THE <span className="text-ink">MAKERS</span> MEET THE <span className="text-ink">MAKERS</span>
              </p>
            </div>
          </div>
        </>
      )}

      <div className="section-wrapper">
        <div className="team-grid grid gap-6 md:grid-cols-3 md:gap-8">
          {isPending ? <TeamCardsSkeleton /> : team.map((member, index) => (
            <article key={`${member.name}-${index}`} className="team-card gsap-clickable-card group border border-hairline bg-ink/[0.018] p-3 opacity-0" tabIndex={0}>
              <div className="team-photo-frame aspect-[4/5] overflow-hidden bg-ink/5">
                {member.images.map((image, imageIndex) => (
                  <img
                    key={`${member.name}-${image}`}
                    src={image}
                    alt={imageIndex === 0 ? member.name : `${member.name} alternate ${imageIndex}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover mix-blend-luminosity"
                    draggable="false"
                  />
                ))}
                <SocialLinks member={member} />
              </div>
              <div className="pt-5">
                <p className="label mb-2 text-gold">Member {index + 1}</p>
                <h3 className="font-display text-xl font-semibold leading-tight text-ink md:text-2xl">{member.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/64">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      </section>
      {isPage && !isPending && <TeamMessageWall team={team} />}
    </>
  );
}
