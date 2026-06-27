import { sidebarItems } from "@/data/navigation";
import type { Section } from "@/types/dashboard";

type HeaderProps = {
  sectionLabel: string;
  activeSection: Section;
};

export default function Header({ sectionLabel, activeSection }: HeaderProps) {
  const currentItem = sidebarItems.find((item) => item.id === activeSection);

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 px-4 py-4 md:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          {currentItem ? (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-xl">
              {currentItem.icon}
            </div>
          ) : null}

          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Vue generale
            </p>
            <h1 className="text-2xl font-semibold text-white">
              {sectionLabel}
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex h-11 w-full max-w-xs items-center rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm text-zinc-400">
            Rechercher...
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
              <span className="text-lg">🔔</span>
              <span
                className="absolute right-2 top-2 h-2 w-2 rounded-full"
                style={{
                  background: "rgba(239, 68, 68, 0.9)",
                  boxShadow: "0 0 6px rgba(239, 68, 68, 0.6)",
                }}
              />
            </div>

            <div className="hidden items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 lg:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-white">
                G
              </div>

              <div className="leading-tight">
                <p className="text-sm font-medium text-white">Gabri</p>
                <p className="mt-1 text-xs text-zinc-400">En ligne</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}