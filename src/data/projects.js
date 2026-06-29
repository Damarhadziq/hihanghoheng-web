const landingMockup = "/optimized/projects/mockup-landing-1200.webp";
const mockup16x9 = "/optimized/projects/mockup-16-9-1600.webp";

const defaultTimeline = [
  {
    phase: "Discover",
    duration: "Week 1-2",
    title: "Research and user mapping",
    detail: "Collecting user habits, competitor references, and product constraints before defining the core experience.",
  },
  {
    phase: "Define",
    duration: "Week 3",
    title: "Problem framing",
    detail: "Turning research signals into focused user pain points, feature priorities, and measurable design goals.",
  },
  {
    phase: "Design",
    duration: "Week 4-6",
    title: "Wireframe to visual system",
    detail: "Exploring flows, interface hierarchy, interaction patterns, and a consistent UI direction for the product.",
  },
  {
    phase: "Validate",
    duration: "Week 7-8",
    title: "Prototype testing",
    detail: "Testing the prototype, refining edge cases, and preparing the final mockup presentation for handoff.",
  },
];

const defaultMockups = [
  { title: "Landing experience", image: landingMockup, ratio: "portrait" },
  { title: "Product overview", image: mockup16x9, ratio: "wide" },
  { title: "Interaction preview", image: landingMockup, ratio: "portrait" },
];

export const projects = [
  {
    name: "Pasar Nusantara",
    year: "2025",
    tags: ["UI/UX Design", "Mobile App", "Cultural Heritage"],
    description:
      "A marketplace app reimagining how Indonesian artisans sell traditional crafts - combining e-commerce UX with cultural storytelling.",
    link: "#",
    image: landingMockup,
    mockup16x9,
    role: "UI/UX Design",
    timeline: defaultTimeline,
    problem:
      "Traditional craft sellers often struggle to communicate product value online. Buyers see items as ordinary goods, while the story, maker, and cultural context are hidden behind generic marketplace patterns.",
    solution:
      "The solution frames each item as a story-led shopping experience with maker profiles, cultural tags, guided browsing, and a checkout flow that keeps commerce simple without losing the emotional value of the craft.",
    mockups: defaultMockups,
  },
  {
    name: "KampusKu",
    year: "2025",
    tags: ["UI/UX Design", "Web App", "Education"],
    description:
      "An academic dashboard for university students to track grades, schedules, and campus events in one unified, accessible interface.",
    link: "#",
    image: landingMockup,
    mockup16x9,
    role: "Product Design",
    timeline: defaultTimeline,
    problem:
      "Students usually jump between separate tools for grades, schedule updates, announcements, and campus events. This creates missed information and makes daily academic planning feel fragmented.",
    solution:
      "KampusKu combines academic signals into one dashboard with clear priority states, calendar-first navigation, and quick-glance cards that help students know what needs attention today.",
    mockups: defaultMockups,
  },
  {
    name: "WarungCepat",
    year: "2024",
    tags: ["Product Design", "Mobile App", "F&B"],
    description:
      "A food ordering system for campus canteens - reducing wait times by 40% through smart queue management and pre-order flows.",
    link: "#",
    image: landingMockup,
    mockup16x9,
    role: "Product Design",
    timeline: defaultTimeline,
    problem:
      "Peak-hour canteen queues make students waste time waiting, while sellers have limited visibility into incoming demand and preparation priority.",
    solution:
      "The proposed flow supports pre-ordering, live queue status, pickup estimation, and simplified seller-side order grouping so both buyers and vendors can move faster.",
    mockups: defaultMockups,
  },
  {
    name: "Jejak Karbon",
    year: "2024",
    tags: ["UI/UX Design", "Web App", "Sustainability"],
    description:
      "A personal carbon footprint tracker with gamified challenges, helping users understand and reduce their environmental impact.",
    link: "#",
    image: landingMockup,
    mockup16x9,
    role: "UI/UX Design",
    timeline: defaultTimeline,
    problem:
      "Carbon data is often abstract and hard to connect with daily habits. Users need feedback that feels understandable, immediate, and realistic enough to act on.",
    solution:
      "Jejak Karbon turns footprint tracking into simple habit logs, weekly insight cards, and challenge-based goals that connect small behavior changes with visible progress.",
    mockups: defaultMockups,
  },
];
