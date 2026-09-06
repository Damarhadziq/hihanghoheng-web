import { API_URL, apiRequest } from "./httpClient";
import { projects as fallbackProjects } from "../data/projects";
import { team as fallbackTeam } from "../data/team";
import { achievements as fallbackAchievements } from "../data/achievements";
import { process as fallbackProcess } from "../data/process";
import { competitionDocumentation as fallbackDocumentationData } from "../data/documentation";

const mapMember = (member) => ({
  ...member,
  images: member.images?.map((image) => typeof image === "string" ? image : image.url) || [],
  social: { linkedin: member.linkedinUrl, instagram: member.instagramUrl },
  linkedin: member.linkedinUrl,
  instagram: member.instagramUrl,
  role: member.contributionRole || member.role,
});

const mapDocumentation = (documentation, achievement = {}) => {
  if (!documentation) return null;
  const sections = documentation.sections || {};
  return {
    ...documentation,
    projectName: achievement.projectName,
    competitionName: achievement.competitionName,
    organizer: achievement.organizer,
    year: achievement.occurredAt ? String(new Date(achievement.occurredAt).getFullYear()) : achievement.dateLabel?.slice(-4),
    objectives: sections.objectives || [],
    users: sections.users || [],
    innovations: sections.innovations || [],
    features: sections.features || [],
    limitations: sections.limitations || [],
    userFlow: sections.userFlow || [],
  };
};

const mapProject = (project) => ({
  ...project,
  year: String(project.year),
  image: project.coverImageUrl,
  mockup16x9: project.landscapeImageUrl,
  link: project.externalUrl,
  team: project.contributors?.map(mapMember) || [],
  mockups: project.mockups?.map((mockup) => ({ ...mockup, image: mockup.imageUrl })) || [],
});

const mapAchievement = (achievement) => ({
  ...achievement,
  date: achievement.dateLabel,
  documentation: ["Project brief", "Proposal", "Prototype"],
  documentationDetail: mapDocumentation(achievement.documentation, achievement),
  contributors: achievement.contributors?.map(mapMember) || [],
});

export const publicApi = {
  site: () => apiRequest("/api/site").then((site) => ({
    ...site,
    about: site.about ? { ...site.about, stats: site.about.stats?.map((stat) => [stat.value, stat.label]) || [] } : undefined,
  })).catch(() => ({})),
  projects: () => apiRequest("/api/projects").then((items) => items.map(mapProject)).catch(() => fallbackProjects.map(mapProject)),
  project: (slug) => apiRequest(`/api/projects/${encodeURIComponent(slug)}`).then(mapProject).catch(() => {
    const found = fallbackProjects.find((p) => p.slug === slug || p.id === slug || p.name.toLowerCase().replace(/\s+/g, "-") === slug);
    return found ? mapProject(found) : null;
  }),
  achievements: () => apiRequest("/api/achievements").then((items) => items.map(mapAchievement)).catch(() => fallbackAchievements),
  achievement: (id) => apiRequest(`/api/achievements/${encodeURIComponent(id)}`).then(mapAchievement).catch(() => fallbackAchievements.find((a) => a.id === id) || null),
  documentation: (id) => Promise.all([
    apiRequest(`/api/achievements/${encodeURIComponent(id)}`),
    apiRequest(`/api/achievements/${encodeURIComponent(id)}/documentation`),
  ]).then(([achievement, documentation]) => mapDocumentation(documentation, achievement)).catch(() => fallbackDocumentationData[id] || null),
  team: () => apiRequest("/api/team").then((items) => items.map(mapMember)).catch(() => fallbackTeam),
  process: () => apiRequest("/api/process").catch(() => fallbackProcess),
  mentor: () => apiRequest("/api/mentor").catch(() => null),
  gallery: () => apiRequest("/api/media/gallery").catch(() => []),
};

const createResourceClient = (resource) => ({
  list: () => apiRequest(`/api/admin/${resource}`),
  create: (input) => apiRequest(`/api/admin/${resource}`, { method: "POST", body: input }),
  update: (id, input) => apiRequest(`/api/admin/${resource}/${encodeURIComponent(id)}`, { method: "PUT", body: input }),
  remove: (id) => apiRequest(`/api/admin/${resource}/${encodeURIComponent(id)}`, { method: "DELETE" }),
});

const uploadAdminFile = async (path, file) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    body: file,
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "X-File-Name": encodeURIComponent(file.name),
    },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error?.message || "File gagal diunggah.");
  return payload.data;
};
export const adminApi = {
  uploads: {
    image: ({ file, scope = "general" }) => uploadAdminFile(`/api/admin/uploads/image?scope=${encodeURIComponent(scope)}`, file),
  },
  projects: createResourceClient("projects"),
  achievements: {
    ...createResourceClient("achievements"),
    saveDocumentation: (id, input) => apiRequest(`/api/admin/achievements/${encodeURIComponent(id)}/documentation`, { method: "PUT", body: input }),
    uploadProposal: async (file) => {
      const response = await fetch(`${API_URL}/api/admin/uploads/proposal`, {
        method: "POST", credentials: "include", body: file,
        headers: { "Content-Type": "application/pdf", "X-File-Name": encodeURIComponent(file.name) },
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error?.message || "Proposal gagal diunggah.");
      return payload.data;
    },
  },
  teamMembers: createResourceClient("team-members"),
  process: createResourceClient("process"),
  media: createResourceClient("media"),
  settings: {
    list: () => apiRequest("/api/admin/settings"),
    update: (key, value) => apiRequest(`/api/admin/settings/${encodeURIComponent(key)}`, { method: "PUT", body: { value } }),
  },
};

export const setupApi = {
  status: () => apiRequest("/api/setup/status"),
  createAdmin: (input) => apiRequest("/api/setup/admin", { method: "POST", body: input }),
};