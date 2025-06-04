import {
  ListTodo,
  FolderKanban,
  StickyNote,
  Timer,
  Hash,
  Utensils,
  Repeat,
  Bookmark,
  Tag,
  BarChart2,
  Settings2,
  Calendar,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { useUserStore } from "@/stores/user";
import { useModeStore } from "@/stores/mode";
import type { LucideIcon } from "lucide-react";

// Map string icon names to LucideIcon components
const iconMap: Record<string, LucideIcon> = {
  ListTodo,
  FolderKanban,
  StickyNote,
  Timer,
  Hash,
  Utensils,
  Repeat,
  Bookmark,
  Tag,
  BarChart2,
  Settings2,
  Calendar,
};
const defaultModeIcon = Tag;

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useUserStore((s) => s.user);
  const modesRaw = useModeStore((s) => s.modes);

  // Filter out deleted modes and map icon string to LucideIcon
  const modes = modesRaw
    .filter((m) => !m.deleted)
    .map((m) => ({
      id: m.id,
      name: m.name,
      icon: (m.icon && iconMap[m.icon]) || defaultModeIcon,
    }));

  const data = {
    modes,
    navMain: [
      {
        title: "Tasks",
        url: "/tasks",
        icon: ListTodo,
        isActive: true,
      },
      {
        title: "Projects",
        url: "/projects",
        icon: FolderKanban,
      },
      {
        title: "Notes",
        url: "/notes",
        icon: StickyNote,
      },
      {
        title: "Timers",
        url: "/timers",
        icon: Timer,
      },
      {
        title: "Counters",
        url: "/counters",
        icon: Hash,
      },
      {
        title: "Nutrition",
        url: "/nutrition",
        icon: Utensils,
      },
      {
        title: "Habits",
        url: "/habits",
        icon: Repeat,
      },
      {
        title: "Bookmarks",
        url: "/bookmarks",
        icon: Bookmark,
      },
      {
        title: "Tags",
        url: "/tags",
        icon: Tag,
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Calendar,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart2,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
      },
    ],
    user: {
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
    },
  };

  return (
    <SidebarProvider>
      <AppSidebar data={data} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
