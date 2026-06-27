import Panel from "@/components/shared/Panel";

export default function SystemOverview() {
  return (
    <Panel className="mt-6">
      <div className="flex flex-col gap-6">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            Synthese systeme
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Etat general du dashboard
          </h2>
          <p className="mt-3 text-zinc-400">
            Votre environnement est globalement stable. Les services
            principaux sont operationnels, avec une vigilance particuliere sur
            les webhooks et les evenements critiques recents.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div
            className="rounded-2xl p-5"
            style={{
              border: "1px solid rgba(16, 185, 129, 0.45)",
              background: "rgba(16, 185, 129, 0.14)",
            }}
          >
            <p className="text-sm font-medium" style={{ color: "#bbf7d0" }}>
              Services sains
            </p>
            <p className="mt-3 text-3xl font-bold" style={{ color: "#34d399" }}>
              12
            </p>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{
              border: "1px solid rgba(239, 68, 68, 0.5)",
              background: "rgba(239, 68, 68, 0.18)",
            }}
          >
            <p className="text-sm font-medium" style={{ color: "#fecaca" }}>
              Alertes actives
            </p>
            <p className="mt-3 text-3xl font-bold" style={{ color: "#f87171" }}>
              02
            </p>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{
              border: "1px solid rgba(34, 211, 238, 0.45)",
              background: "rgba(34, 211, 238, 0.14)",
            }}
          >
            <p className="text-sm font-medium" style={{ color: "#a5f3fc" }}>
              Synchronisations
            </p>
            <p className="mt-3 text-3xl font-bold" style={{ color: "#67e8f9" }}>
              08
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
