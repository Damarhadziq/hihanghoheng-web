import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi, publicApi, setupApi } from "../services/apiClient";

export const queryKeys = {
  site: ["site"],
  projects: ["projects"],
  project: (slug) => ["projects", slug],
  achievements: ["achievements"],
  achievement: (id) => ["achievements", id],
  documentation: (id) => ["achievements", id, "documentation"],
  team: ["team"],
  process: ["process"],
  mentor: ["mentor"],
  gallery: ["gallery"],
  admin: (resource) => ["admin", resource],
  adminSetup: ["admin", "setup"],
};

const publicQuery = (queryKey, queryFn, options) => ({ queryKey, queryFn, staleTime: 5 * 60 * 1000, ...options });

export const useSiteSettings = (options) => useQuery(publicQuery(queryKeys.site, publicApi.site, options));
export const useProjects = (options) => useQuery(publicQuery(queryKeys.projects, publicApi.projects, options));
export const useProject = (slug, options) => useQuery(publicQuery(queryKeys.project(slug), () => publicApi.project(slug), { enabled: Boolean(slug), ...options }));
export const useAchievements = (options) => useQuery(publicQuery(queryKeys.achievements, publicApi.achievements, options));
export const useAchievement = (id, options) => useQuery(publicQuery(queryKeys.achievement(id), () => publicApi.achievement(id), { enabled: Boolean(id), ...options }));
export const useAchievementDocumentation = (id, options) => useQuery(publicQuery(queryKeys.documentation(id), () => publicApi.documentation(id), { enabled: Boolean(id), ...options }));
export const useTeam = (options) => useQuery(publicQuery(queryKeys.team, publicApi.team, options));
export const useProcess = (options) => useQuery(publicQuery(queryKeys.process, publicApi.process, options));
export const useMentor = (options) => useQuery(publicQuery(queryKeys.mentor, publicApi.mentor, options));
export const useGallery = (options) => useQuery(publicQuery(queryKeys.gallery, publicApi.gallery, options));

export const useAdminSetupStatus = (options) => useQuery({
  queryKey: queryKeys.adminSetup,
  queryFn: setupApi.status,
  retry: false,
  staleTime: 30 * 1000,
  ...options,
});

export function useCreateFirstAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setupApi.createAdmin,
    onSuccess: () => queryClient.setQueryData(queryKeys.adminSetup, { requiresSetup: false }),
  });
}

export function useAdminList(resource, options) {
  return useQuery({ queryKey: queryKeys.admin(resource), queryFn: adminApi[resource].list, ...options });
}

export function useAdminResourceMutations(resource) {
  const queryClient = useQueryClient();
  const client = adminApi[resource];
  const invalidate = () => Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.admin(resource) }),
    queryClient.invalidateQueries({ queryKey: [resource === "teamMembers" ? "team" : resource] }),
  ]);
  return {
    create: useMutation({ mutationFn: client.create, onSuccess: invalidate }),
    update: useMutation({ mutationFn: ({ id, input }) => client.update(id, input), onSuccess: invalidate }),
    remove: useMutation({ mutationFn: client.remove, onSuccess: invalidate }),
  };
}

export function useUploadProposal() {
  return useMutation({ mutationFn: adminApi.achievements.uploadProposal });
}

export function useSaveAchievementDocumentation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }) => adminApi.achievements.saveDocumentation(id, input),
    onSuccess: (_data, variables) => Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.achievement(variables.id) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin("achievements") }),
    ]),
  });
}

export function useUpdateSiteSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }) => adminApi.settings.update(key, value),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.site }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin("settings") }),
    ]),
  });
}
