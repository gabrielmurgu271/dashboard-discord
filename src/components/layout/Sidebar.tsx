import { sidebarItems } from "@/data/navigation";
import type { Section } from "@/types/dashboard";

type SidebarProps = {
  activeItem: Section;
  onItemChange: (item: Section) => void;
};

export default function Sidebar({ activeItem, onItemChange }: SidebarProps) {
  return (
    <aside className="hidden w-64 border-r border-zinc-800 bg-zinc-950/95 md:block">
      <div className="flex h-full flex-col px-5 py-6">
        <div className="border-b border-zinc-800 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Discord Control
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
            Center
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            Pilotage centralise de votre ecosysteme Discord.
          </p>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          {sidebarItems.map((item) => {
            const isActive = item.id === activeItem;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onItemChange(item.id)}
                className={
                  isActive
                    ? "flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-left text-sm font-semibold text-white shadow-sm"
                    : "flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-zinc-400 transition hover:bg-zinc-900/70 hover:text-white"
                }
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-white">
              G
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Gabri</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: "rgba(16, 185, 129, 0.9)",
                    boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)",
                  }}
                />
                <p className="text-xs text-zinc-400">En ligne</p>
              </div>
            </div>

            <div className="ml-auto shrink-0">
              <div className="relative">
                <span className="text-lg">🔔</span>
                <span
                  className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full"
                  style={{
                    background: "rgba(239, 68, 68, 0.9)",
                    boxShadow: "0 0 6px rgba(239, 68, 68, 0.6)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}