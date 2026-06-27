import InfoRow from "@/components/shared/InfoRow";
import Panel from "@/components/shared/Panel";
import { settings } from "@/data/settings";

function getValueStyle(value: string) {
  if (value === "Active") {
    return {
      border: "1px solid rgba(16, 185, 129, 0.45)",
      background: "rgba(16, 185, 129, 0.14)",
      color: "#86efac",
    };
  }

  if (value === "Partiel") {
    return {
      border: "1px solid rgba(245, 158, 11, 0.5)",
      background: "rgba(245, 158, 11, 0.18)",
      color: "#fde68a",
    };
  }

  return {
    border: "1px solid rgba(34, 211, 238, 0.45)",
    background: "rgba(34, 211, 238, 0.14)",
    color: "#a5f3fc",
  };
}

function getSummaryStyle(kind: "active" | "partiel" | "planifie") {
  if (kind === "active") {
    return {
      border: "1px solid rgba(16, 185, 129, 0.35)",
      background: "rgba(16, 185, 129, 0.08)",
      labelColor: "#bbf7d0",
      valueColor: "#34d399",
    };
  }

  if (kind === "partiel") {
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

function getCategoryIcon(category: string) {
  if (category === "Performance") return "⚡";
  if (category === "Securite") return "🛡️";
  if (category === "Notifications") return "🔔";
  if (category === "Infrastructure") return "🖥️";
  return "⚙️";
}

export default function SettingsSection() {
  const activeCount = settings.filter((s) => s.value === "Active").length;
  const partielCount = settings.filter((s) => s.value === "Partiel").length;
  const planifieCount = settings.filter((s) => s.value === "Planifiee").length;

  const activeStyle = getSummaryStyle("active");
  const partielStyle = getSummaryStyle("partiel");
  const planifieStyle = getSummaryStyle("planifie");

  return (
    <div className="grid gap-6">
      <Panel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Configuration
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Parametres generaux
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Cette section regroupe les principaux reglages du dashboard pour
              garder une vue claire sur les options actives et l'etat global de
              la configuration.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
            {settings.length} reglages visibles
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div
          className="rounded-2xl p-5"
          style={{
            border: activeStyle.border,
            background: activeStyle.background,
          }}
        >
          <p className="text-sm font-medium" style={{ color: activeStyle.labelColor }}>
            Actifs
          </p>
          <p className="mt-3 text-3xl font-bold" style={{ color: activeStyle.valueColor }}>
            {activeCount}
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            border: partielStyle.border,
            background: partielStyle.background,
          }}
        >
          <p className="text-sm font-medium" style={{ color: partielStyle.labelColor }}>
            Partiels
          </p>
          <p className="mt-3 text-3xl font-bold" style={{ color: partielStyle.valueColor }}>
            {partielCount}
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            border: planifieStyle.border,
            background: planifieStyle.background,
          }}
        >
          <p className="text-sm font-medium" style={{ color: planifieStyle.labelColor }}>
            Planifies
          </p>
          <p className="mt-3 text-3xl font-bold" style={{ color: planifieStyle.valueColor }}>
            {planifieCount}
          </p>
        </div>
      </div>

      <Panel title="Configuration actuelle">
        <div className="space-y-4">
          {settings.map((setting) => (
            <InfoRow
              key={setting.id}
              title={setting.label}
              description={`${setting.description} — Categorie : ${setting.category}`}
              leading={getCategoryIcon(setting.category)}
              meta={
                <span
                  className="rounded-full px-3 py-1 text-sm font-medium"
                  style={getValueStyle(setting.value)}
                >
                  {setting.value}
                </span>
              }
            />
          ))}
        </div>
      </Panel>
    </div>
  );
}