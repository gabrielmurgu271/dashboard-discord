import type { Section } from "@/types/dashboard";
export const sectionContent: Record<
  Exclude<Section, "dashboard">,
  { title: string; description: string }
> = {
  bots: {
    title: "Gestion des bots",
    description:
      "Cette section affichera la liste de vos bots, leur statut, leurs commandes et leurs journaux d'execution.",
  },
  activite: {
    title: "Activite recente",
    description:
      "Cette section affichera les evenements importants, les actions critiques et les journaux recents du systeme.",
  },
  serveurs: {
    title: "Serveurs",
    description:
      "Cette section affichera les serveurs connectes, leurs informations principales et leur etat de synchronisation.",
  },
  parametres: {
    title: "Parametres",
    description:
      "Cette section affichera la configuration generale du dashboard, les preferences et les integrations.",
  },
};