import { Award, FileImage, FolderKanban, ListChecks, Settings, Users } from "lucide-react";

export const adminPageMeta = {
  overview: { title: "Overview", icon: FolderKanban },
  projects: { title: "Projects", icon: FolderKanban },
  achievements: { title: "Achievements", icon: Award },
  team: { title: "Team", icon: Users },
  process: { title: "Process", icon: ListChecks },
  media: { title: "Media", icon: FileImage },
  settings: { title: "Settings", icon: Settings },
};
