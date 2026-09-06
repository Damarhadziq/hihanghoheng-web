import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTeam } from "../hooks/useApiQueries";
import { team as fallbackTeam } from "../data/team";
import { TeamCardsSkeleton } from "./PublicSkeletons";
import ProfileCard from "./ProfileCard";
import TextLoop from "./TextLoop";
import uiUxPattern from "../assets/patterns/ui-ux-pattern.svg";
import businessAnalysisPattern from "../assets/patterns/business-analysis-pattern.svg";
import userAnalysisPattern from "../assets/patterns/user-analysis-pattern.svg";

gsap.registerPlugin(ScrollTrigger);

const getRoleConfig = (role = "") => {
  const normalized = role.toLowerCase();
  if (normalized.includes("business") || normalized.includes("biz")) {
    return {
      pattern: businessAnalysisPattern,
      innerGradient:
        "linear-gradient(145deg, rgba(20, 60, 130, 0.45) 0%, rgba(70, 50, 120, 0.3) 50%, rgba(80, 180, 240, 0.25) 100%)",
      behindGlowColor: "rgba(90, 160, 255, 0.65)",
    };
  }
  if (normalized.includes("user") || normalized.includes("research")) {
    return {
      pattern: userAnalysisPattern,
      innerGradient:
        "linear-gradient(145deg, rgba(25, 95, 85, 0.45) 0%, rgba(80, 60, 105, 0.3) 50%, rgba(100, 220, 190, 0.25) 100%)",
      behindGlowColor: "rgba(95, 220, 185, 0.65)",
    };
  }
  return {
    pattern: uiUxPattern,
    innerGradient:
      "linear-gradient(145deg, rgba(96, 73, 110, 0.5) 0%, rgba(162, 137, 73, 0.35) 50%, rgba(113, 196, 255, 0.25) 100%)",
    behindGlowColor: "rgba(212, 175, 55, 0.65)",
  };
};

const getMemberHandle = (member) => {
  const handles = {
    Damar: "damarhadziq",
    Faruq: "faruqosama",
    Febi: "febiindra",
  };
  return handles[member.shortName] || member.shortName?.toLowerCase() || "maker";
};

const TeamSigningOff = () => {
  return (
    <section className="team-signing-off-section overflow-hidden py-8 md:py-12 bg-[#070A08] text-[#F8F5EC] relative" aria-label="Hihang Hoeng Signing Off">
      <div className="w-full overflow-hidden">
        <TextLoop
          text="HIHANG HOENG SIGNING OFF"
          shape="wave"
          speed={85}
          direction="forward"
          separator="✦"
          curviness={80}
          fontSize={44}
          fontWeight={800}
          letterSpacing={3}
          uppercase
          color="#070A08"
          ribbon={true}
          ribbonColor="#FFFFFF"
          ribbonWidth={88}
          pauseOnHover={true}
        />
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
  const { data: teamData, isPending } = useTeam();
  const team = teamData && teamData.length > 0 ? teamData : fallbackTeam;
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const isPage = variant === "page";

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cards = gsap.utils.toArray(
        isPage
          ? section.querySelectorAll(".team-profile-card-col")
          : section.querySelectorAll(".team-card")
      );
      const photoFrames = gsap.utils.toArray(section.querySelectorAll(".team-photo-frame"));
      const hoverCleanups = [];

      if (prefersReduced) {
        gsap.set([textRef.current, ...cards].filter(Boolean), { opacity: 1, xPercent: 0, y: 0 });
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
            start: isPage ? "top 90%" : "top 78%",
            toggleActions: isPage ? "play none none none" : "play none none reverse",
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
    { scope: sectionRef, dependencies: [variant, team.length, isPage] },
  );

  return (
    <>
      <section id="team" ref={sectionRef} className={`overflow-hidden border-hairline-t py-20 md:py-32 ${isPage ? "team-page" : ""}`}>
      {isPage ? (
        <div className="section-wrapper mb-12 text-center md:mb-16">
          <h1 className="headline-lg mx-auto">Meet The Makers.</h1>
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
        <div className={`team-grid grid gap-6 md:grid-cols-3 md:gap-8 ${isPage ? "items-stretch" : ""}`}>
          {isPending && team.length === 0 ? (
            <TeamCardsSkeleton isPage={isPage} />
          ) : isPage ? (
            team.map((member, index) => {
              const config = getRoleConfig(member.role);
              const avatar = "/assets/demo/person.webp";
              const handle = getMemberHandle(member);

              return (
                <div
                  key={`${member.name}-${index}`}
                  className="team-profile-card-col flex justify-center opacity-0"
                >
                  <ProfileCard
                    name={member.name}
                    title={member.role}
                    handle={handle}
                    contactText="LinkedIn"
                    avatarUrl={avatar}
                    miniAvatarUrl={avatar}
                    innerGradient={config.innerGradient}
                    behindGlowColor={config.behindGlowColor}
                    behindGlowEnabled={true}
                    enableTilt={true}
                    enableMobileTilt={false}
                    showShine={true}
                    showGlare={true}
                    onContactClick={() => {
                      if (member.social?.linkedin) {
                        window.open(member.social.linkedin, "_blank", "noopener,noreferrer");
                      }
                    }}
                  />
                </div>
              );
            })
          ) : (
            team.map((member, index) => (
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
            ))
          )}
        </div>
      </div>

      </section>
      {isPage && !isPending && <TeamSigningOff />}
    </>
  );
}
