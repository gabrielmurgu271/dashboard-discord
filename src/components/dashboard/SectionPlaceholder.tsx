import Panel from "@/components/shared/Panel";

type SectionPlaceholderProps = {
  title: string;
  description: string;
};

export default function SectionPlaceholder({
  title,
  description,
}: SectionPlaceholderProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <Panel>
        <div>
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            Section
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>

          <p className="mt-4 max-w-2xl text-zinc-400">{description}</p>

          <div className="mt-8 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-5">
            <p className="text-sm font-medium text-white">
              Module en preparation
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Cette zone accueillera bientot les vrais outils, filtres,
              tableaux, journaux ou actions lies a cette section.
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="Statut">
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
            <p className="text-sm text-zinc-400">Etat</p>
            <p className="mt-1 font-medium text-emerald-400">
              Structure prete
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
            <p className="text-sm text-zinc-400">Interface</p>
            <p className="mt-1 font-medium text-yellow-400">
              En cours de construction
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
            <p className="text-sm text-zinc-400">Prochaine etape</p>
            <p className="mt-1 font-medium text-white">
              Ajouter de vrais composants
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
