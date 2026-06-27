import type { Section } from "@/types/dashboard";

export const sidebarItems: { id: Section; label: string; icon: string }[] = [
  { id: "dashboard", label: "Tableau de bord", icon: "🏠" },
  { id: "bots", label: "Bots", icon: "🤖" },
  { id: "activite", label: "Activite", icon: "📈" },
  { id: "serveurs", label: "Serveurs", icon: "🖥️" },
  { id: "parametres", label: "Parametres", icon: "⚙️" },
];

export const mobileNavItems: { id: Section; label: string; icon: string }[] = [
  { id: "dashboard", label: "Accueil", icon: "🏠" },
  { id: "bots", label: "Bots", icon: "🤖" },
  { id: "activite", label: "Activite", icon: "📈" },
  { id: "serveurs", label: "Serveurs", icon: "🖥️" },
  { id: "parametres", label: "Reglages", icon: "⚙️" },
];

export const sectionLabels: Record<Section, string> = {
  dashboard: "Dashboard",
  bots: "Bots",
  activite: "Activite",
  serveurs: "Serveurs",
  parametres: "Parametres",
};