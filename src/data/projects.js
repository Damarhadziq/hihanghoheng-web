const landingMockup = "/optimized/projects/mockup-landing-1200.webp";
const mockup16x9 = "/optimized/projects/mockup-16-9-1600.webp";

const competitionCrew = [
  {
    name: "Damar Hadziq Hidayatilah",
    role: "UI/UX Designer",
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
  },
  {
    name: "Muhammad Faruq Osama",
    role: "Business Analyst",
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
  },
  {
    name: "Febi Indra Lesmana",
    role: "User Researcher",
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
  },
];

const defaultTimeline = [
  {
    phase: "Kickoff",
    duration: "Week 1",
    title: "Reading the competition brief",
    detail: "Mapping the theme, judging criteria, submission limits, and strongest solution angle before the team starts designing.",
  },
  {
    phase: "Research",
    duration: "Week 1-2",
    title: "User and context research",
    detail: "Collecting user insights, competitor references, and problem validation so the competition proposal has a clear foundation.",
  },
  {
    phase: "Design",
    duration: "Week 3-5",
    title: "Flow and visual exploration",
    detail: "Building wireframes, prototypes, visual systems, and presentation narratives aligned with the judging criteria.",
  },
  {
    phase: "Submit",
    duration: "Week 6",
    title: "Deck and prototype finalization",
    detail: "Running final reviews, testing the prototype, preparing documentation, and polishing the pitch materials for judging.",
  },
];

const defaultMockups = [
  { title: "Competition deck preview", image: mockup16x9 },
  { title: "Prototype screen", image: mockup16x9 },
  { title: "User flow highlight", image: mockup16x9 },
  { title: "Final submission mockup", image: mockup16x9 },
];

export const projects = [
  {
    name: "Pasar Nusantara",
    year: "2025",
    tags: ["UI/UX Competition", "Mobile App", "Cultural Heritage"],
    description:
      "A competition entry for a marketplace app that helps Indonesian artisans sell traditional crafts through stronger product stories.",
    link: "#",
    image: landingMockup,
    mockup16x9,
    type: "UI/UX Competition",
    organizer: "GEMASTIK XVII",
    competition: "GEMASTIK XVII - UI/UX Design",
    team: competitionCrew,
    timeline: defaultTimeline,
    problem:
      "Traditional craft sellers often struggle to communicate product value in generic marketplaces. The maker, cultural context, and product story can disappear behind ordinary shopping patterns.",
    solution:
      "The submission builds a story-led shopping experience with artisan profiles, cultural tags, guided browsing, and a simple checkout flow that still respects the emotional value of each craft.",
    mockups: defaultMockups,
  },
  {
    name: "KampusKu",
    year: "2025",
    tags: ["UI/UX Competition", "Web App", "Education"],
    description:
      "A competition project for an academic dashboard that unifies grades, schedules, announcements, and campus events.",
    link: "#",
    image: landingMockup,
    mockup16x9,
    type: "Product Design Competition",
    organizer: "TECHCOMFEST",
    competition: "TECHCOMFEST - App Innovation",
    team: competitionCrew,
    timeline: defaultTimeline,
    problem:
      "Students often need to check separate channels for grades, schedules, academic updates, and campus events, making important information easy to miss.",
    solution:
      "KampusKu brings academic signals into one priority-based dashboard with calendar-first navigation and compact cards that support daily student decisions.",
    mockups: defaultMockups,
  },
  {
    name: "WarungCepat",
    year: "2024",
    tags: ["UX Challenge", "Mobile App", "F&B"],
    description:
      "A UX challenge entry for a campus canteen ordering flow designed to reduce queue pressure during peak hours.",
    link: "#",
    image: landingMockup,
    mockup16x9,
    type: "UX Design Challenge",
    organizer: "FIND IT",
    competition: "FIND IT - UX Design Challenge",
    team: competitionCrew,
    timeline: defaultTimeline,
    problem:
      "Peak-hour canteen queues make students lose time, while sellers have limited visibility into incoming orders and production priorities.",
    solution:
      "The concept introduces pre-ordering, real-time queue status, pickup estimates, and simple seller-side order grouping to make the process faster for both sides.",
    mockups: defaultMockups,
  },
  {
    name: "Jejak Karbon",
    year: "2024",
    tags: ["Digital Innovation", "Web App", "Sustainability"],
    description:
      "A digital innovation competition project that turns carbon footprint tracking into understandable habit feedback.",
    link: "#",
    image: landingMockup,
    mockup16x9,
    type: "Digital Innovation Competition",
    organizer: "DINACOM",
    competition: "DINACOM - Digital Innovation",
    team: competitionCrew,
    timeline: defaultTimeline,
    problem:
      "Carbon data often feels abstract and far from daily habits, so users struggle to see which small actions they can realistically take.",
    solution:
      "Jejak Karbon turns tracking into habit logs, weekly insight cards, and lightweight challenges so behavior change feels concrete and measurable.",
    mockups: defaultMockups,
  },
];
