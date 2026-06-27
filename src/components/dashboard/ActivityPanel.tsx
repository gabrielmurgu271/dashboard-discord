import Panel from "@/components/shared/Panel";
import { quickStatus, recentActivity } from "@/data/dashboard";

function getQuickStatusStyle(value: string) {
  if (value === "OK" || value === "Actifs") {
    return {
      border: "1px solid rgba(16, 185, 129, 0.45)",
      background: "rgba(16, 185, 129, 0.14)",
      color: "#86efac",
    };
  }

  if (value === "Alerte") {
    return {
      border: "1px solid rgba(239, 68, 68, 0.5)",
      background: "rgba(239, 68, 68, 0.18)",
      color: "#fca5a5",
    };
  }

  if (value === "Stable") {
    return {
      border: "1px solid rgba(245, 158, 11, 0.5)",
      background: "rgba(245, 158, 11, 0.18)",
      color: "#fde68a",
    };
  }

  return {
    border: "1px solid rgba(63, 63, 70, 1)",
    background: "rgba(24, 24, 27, 1)",
    color: "#d4d4d8",
  };
}

export default function ActivityPanel() {
  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
      <Panel title="Activite recente">
        <div className="space-y-4">
          {recentActivity.map((item, index) => (
            <div
              key={item.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/80 px-5 py-4"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
                  {index + 1}
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Etat rapide">
        <div className="space-y-3">
          {quickStatus.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-4"
            >
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Surveillance active
                </p>
              </div>

              <span
                className="rounded-full px-3 py-1 text-sm font-medium"
                style={getQuickStatusStyle(item.value)}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}
