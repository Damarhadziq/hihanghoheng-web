import MarqueeModule from "react-fast-marquee";
import { useGallery } from "../hooks/useApiQueries";

const Marquee = MarqueeModule.default || MarqueeModule;

const fallbackGalleryImages = [
  { src: "/optimized/gallery/team-damar.webp" },
  { src: "/optimized/gallery/team-faruq.webp" },
  { src: "/optimized/gallery/team-febi.webp" },
  { src: "/optimized/gallery/team-hover-green.webp" },
  { src: "/optimized/gallery/team-hover-pink.webp" },
  { src: "/optimized/gallery/mockup-16-9.webp" },
  { src: "/optimized/gallery/mockup-landing.webp" },
  { src: "/optimized/gallery/hero.webp" },
];

const rows = [
  { offset: 0, speed: 22, hoverDuration: 170, direction: "left" },
  { offset: 3, speed: 18, hoverDuration: 185, direction: "right" },
  { offset: 6, speed: 20, hoverDuration: 175, direction: "left" },
  { offset: 2, speed: 16, hoverDuration: 200, direction: "right" },
  { offset: 5, speed: 19, hoverDuration: 180, direction: "left" },
];

const ratioClasses = [
  "ratio-portrait",
  "ratio-wide",
  "ratio-square",
  "ratio-tall",
  "ratio-landscape",
  "ratio-card",
  "ratio-banner",
  "ratio-poster",
];
const heightClasses = ["height-xs", "height-sm", "height-md", "height-lg"];

const rotateImages = (images, offset) => [
  ...images.slice(offset),
  ...images.slice(0, offset),
];

const getVariantClass = (rowIndex, imageIndex) => {
  const seed = (rowIndex * 17 + imageIndex * 11 + rowIndex * imageIndex * 3) % (ratioClasses.length * heightClasses.length);
  const ratio = ratioClasses[seed % ratioClasses.length];
  const height = heightClasses[(seed + rowIndex * 2 + imageIndex) % heightClasses.length];

  return `${ratio} ${height}`;
};

export default function GalleryMarquee({ variant = "section" }) {
  const { data: gallery = [] } = useGallery();
  const galleryImages = gallery.length ? gallery.map((image) => ({ src: image.url })) : fallbackGalleryImages;
  const isBackground = variant === "background";

  return (
    <section
      id={isBackground ? undefined : "gallery"}
      className={`gallery-marquee-section relative overflow-hidden bg-[#070A08] ${isBackground ? "gallery-marquee-background" : "border-hairline-t"}`}
      aria-label={isBackground ? undefined : "Hihang Hoeng visual gallery"}
      aria-hidden={isBackground ? "true" : undefined}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,8,0.96),rgba(7,10,8,0.88)_45%,rgba(7,10,8,0.98))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(90deg,rgba(248,245,236,0.2)_1px,transparent_1px),linear-gradient(0deg,rgba(248,245,236,0.16)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="gallery-marquee-field relative z-10" aria-hidden="true">
        {rows.map((row, rowIndex) => (
          <div
            className="gallery-marquee-row"
            key={`${row.offset}-${row.speed}`}
            style={{ "--gallery-hover-duration": `${row.hoverDuration}s` }}
          >
            <Marquee
              autoFill
              direction={row.direction}
              gradient={false}
              pauseOnClick={false}
              pauseOnHover={false}
              speed={row.speed}
            >
              {rotateImages(galleryImages, row.offset).map((image, imageIndex) => (
                <figure
                  key={`${rowIndex}-${image.src}-${imageIndex}`}
                  className={`gallery-marquee-photo ${getVariantClass(rowIndex, imageIndex)} tone-${(imageIndex + rowIndex) % 4}`}
                >
                  <img src={image.src} alt="" draggable="false" loading="lazy" decoding="async" />
                </figure>
              ))}
            </Marquee>
          </div>
        ))}
      </div>
    </section>
  );
}
