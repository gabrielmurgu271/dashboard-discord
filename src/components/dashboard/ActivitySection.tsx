import Panel from "@/components/shared/Panel";
import { activityEvents } from "@/data/activity";

function getLevelStyle(level: string) {
  if (level === "Critique") {
    return {
      border: "1px solid rgba(239, 68, 68, 0.5)",
      background: "rgba(239, 68, 68, 0.18)",
      color: "#fca5a5",
    };
  }

  if (level === "Alerte") {
    return {
      border: "1px solid rgba(239, 68, 68, 0.5)",
      background: "rgba(239, 68, 68, 0.18)",
      color: "#fca5a5",
    };
  }

  return {
    border: "1px solid rgba(34, 211, 238, 0.45)",
    background: "rgba(34, 211, 238, 0.14)",
    color: "#a5f3fc",
  };
}

function getLevelIcon(level: string) {
  if (level === "Critique") return "🔴";
  if (level === "Alerte") return "⚠️";
  return "ℹ️";
}

function getSummaryStyle(kind: "critique" | "alerte" | "info") {
  if (kind === "critique") {
    return {
      border: "1px solid rgba(239, 68, 68, 0.4)",
      background: "rgba(239, 68, 68, 0.12)",
      labelColor: "#fecaca",
      valueColor: "#f87171",
    };
  }

  if (kind === "alerte") {
    return {
      border: "1px solid rgba(245, 158, 11, 0.4)",
      background: "rgba(245, 158, 11, 0.12)",
      labelColor: "#fde68a",
      valueColor: "#fbbf24",
    };
  }

  return {
    border: "1px solid rgba(34, 211, 238, 0.4)",
    background: "rgba(34, 211, 238, 0.12)",
    labelColor: "#a5f3fc",
    valueColor: "#67e8f9",
  };
}

export default function ActivitySection() {
  const critiqueCount = activityEvents.filter(
    (e) => e.level === "Critique"
  ).length;
  const alerteCount = activityEvents.filter(
    (e) => e.level === "Alerte"
  ).length;
  const infoCount = activityEvents.filter((e) => e.level === "Info").length;

  const critiqueStyle = getSummaryStyle("critique");
  const alerteStyle = getSummaryStyle("alerte");
  const infoStyle = getSummaryStyle("info");

  return (
    <div className="grid gap-6">
      <Panel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Suivi
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Activite recente
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Cette section regroupe les derniers evenements importants du
              dashboard pour vous aider a suivre l'etat de votre ecosysteme
              Discord.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
            {activityEvents.length} evenements recents
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div
          className="rounded-2xl p-5"
          style={{
            border: critiqueStyle.border,
            background: critiqueStyle.background,
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: critiqueStyle.labelColor }}
          >
            Critiques
          </p>
          <p
            className="mt-3 text-3xl font-bold"
            style={{ color: critiqueStyle.valueColor }}
          >
            {critiqueCount}
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            border: alerteStyle.border,
            background: alerteStyle.background,
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: alerteStyle.labelColor }}
          >
            Alertes
          </p>
          <p
            className="mt-3 text-3xl font-bold"
            style={{ color: alerteStyle.valueColor }}
          >
            {alerteCount}
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            border: infoStyle.border,
            background: infoStyle.background,
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: infoStyle.labelColor }}
          >
            Informatifs
          </p>
          <p
            className="mt-3 text-3xl font-bold"
            style={{ color: infoStyle.valueColor }}
          >
            {infoCount}
          </p>
        </div>
      </div>

      <Panel title="Journal d'activite">
        <div className="space-y-4">
          {activityEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-xl">
                    {getLevelIcon(event.level)}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-white">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {event.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
                  <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-400">
                    {event.time}
                  </span>

                  <span
                    className="rounded-full px-3 py-1 text-sm font-medium"
                    style={getLevelStyle(event.level)}
                  >
                    {event.level}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}