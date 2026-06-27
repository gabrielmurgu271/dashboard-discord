import InfoRow from "@/components/shared/InfoRow";
import Panel from "@/components/shared/Panel";
import { bots } from "@/data/bots";

function getStatusStyle(status: string) {
  if (status === "En ligne") {
    return {
      border: "1px solid rgba(16, 185, 129, 0.45)",
      background: "rgba(16, 185, 129, 0.14)",
      color: "#86efac",
    };
  }

  if (status === "Maintenance") {
    return {
      border: "1px solid rgba(245, 158, 11, 0.5)",
      background: "rgba(245, 158, 11, 0.18)",
      color: "#fde68a",
    };
  }

  if (status === "Hors ligne") {
    return {
      border: "1px solid rgba(239, 68, 68, 0.5)",
      background: "rgba(239, 68, 68, 0.18)",
      color: "#fca5a5",
    };
  }

  return {
    border: "1px solid rgba(63, 63, 70, 1)",
    background: "rgba(24, 24, 27, 1)",
    color: "#d4d4d8",
  };
}

function getSummaryCardStyle(kind: "online" | "maintenance" | "offline") {
  if (kind === "online") {
    return {
      border: "1px solid rgba(16, 185, 129, 0.35)",
      background: "rgba(16, 185, 129, 0.08)",
      labelColor: "#bbf7d0",
      valueColor: "#34d399",
    };
  }

  if (kind === "maintenance") {
    return {
      border: "1px solid rgba(245, 158, 11, 0.4)",
      background: "rgba(245, 158, 11, 0.12)",
      labelColor: "#fde68a",
      valueColor: "#fbbf24",
    };
  }

  return {
    border: "1px solid rgba(239, 68, 68, 0.4)",
      background: "rgba(239, 68, 68, 0.12)",
      labelColor: "#fecaca",
      valueColor: "#f87171",
    };
}

function getBotIcon(type: string) {
  if (type === "Moderation") return "🛡️";
  if (type === "Journalisation") return "📝";
  if (type === "Divertissement") return "🎵";
  if (type === "Onboarding") return "👋";
  return "🤖";
}

export default function BotsSection() {
  const onlineCount = bots.filter((bot) => bot.status === "En ligne").length;
  const maintenanceCount = bots.filter(
    (bot) => bot.status === "Maintenance"
  ).length;
  const offlineCount = bots.filter((bot) => bot.status === "Hors ligne").length;

  const onlineStyle = getSummaryCardStyle("online");
  const maintenanceStyle = getSummaryCardStyle("maintenance");
  const offlineStyle = getSummaryCardStyle("offline");

  return (
    <div className="grid gap-6">
      <Panel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Gestion
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Vos bots
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Cette section affiche une premiere vue d'ensemble de vos bots avec
              leur statut, leur role principal et leur serveur de reference.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
            {bots.length} bots suivis
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div
          className="rounded-2xl p-5"
          style={{
            border: onlineStyle.border,
            background: onlineStyle.background,
          }}
        >
          <p className="text-sm font-medium" style={{ color: onlineStyle.labelColor }}>
            En ligne
          </p>
          <p className="mt-3 text-3xl font-bold" style={{ color: onlineStyle.valueColor }}>
            {onlineCount}
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            border: maintenanceStyle.border,
            background: maintenanceStyle.background,
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: maintenanceStyle.labelColor }}
          >
            Maintenance
          </p>
          <p
            className="mt-3 text-3xl font-bold"
            style={{ color: maintenanceStyle.valueColor }}
          >
            {maintenanceCount}
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            border: offlineStyle.border,
            background: offlineStyle.background,
          }}
        >
          <p className="text-sm font-medium" style={{ color: offlineStyle.labelColor }}>
            Hors ligne
          </p>
          <p className="mt-3 text-3xl font-bold" style={{ color: offlineStyle.valueColor }}>
            {offlineCount}
          </p>
        </div>
      </div>

      <Panel title="Liste des bots">
        <div className="space-y-4">
          {bots.map((bot) => (
            <InfoRow
              key={bot.id}
              title={bot.name}
              description={`Type : ${bot.type} - Serveur principal : ${bot.server}`}
              leading={getBotIcon(bot.type)}
              meta={
                <>
                  <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
                    {bot.type}
                  </span>

                  <span
                    className="rounded-full px-3 py-1 text-sm font-medium"
                    style={getStatusStyle(bot.status)}
                  >
                    {bot.status}
                  </span>
                </>
              }
            />
          ))}
        </div>
      </Panel>
    </div>
  );
}
