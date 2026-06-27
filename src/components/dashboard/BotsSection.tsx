"use client";

import { useEffect, useState } from "react";
import InfoRow from "@/components/shared/InfoRow";
import Panel from "@/components/shared/Panel";
import { supabase } from "@/lib/supabase";

type Bot = {
  id: string;
  name: string;
  status: string;
  type: string;
  server: string;
};

type NewBot = {
  name: string;
  status: string;
  type: string;
  server: string;
};

function getStatusStyle(status: string) {
  if (status === "En ligne") {
    return { border: "1px solid rgba(16, 185, 129, 0.45)", background: "rgba(16, 185, 129, 0.14)", color: "#86efac" };
  }
  if (status === "Maintenance") {
    return { border: "1px solid rgba(245, 158, 11, 0.5)", background: "rgba(245, 158, 11, 0.18)", color: "#fde68a" };
  }
  if (status === "Hors ligne") {
    return { border: "1px solid rgba(239, 68, 68, 0.5)", background: "rgba(239, 68, 68, 0.18)", color: "#fca5a5" };
  }
  return { border: "1px solid rgba(63, 63, 70, 1)", background: "rgba(24, 24, 27, 1)", color: "#d4d4d8" };
}

function getSummaryStyle(kind: "online" | "maintenance" | "offline") {
  if (kind === "online") {
    return { border: "1px solid rgba(16, 185, 129, 0.35)", background: "rgba(16, 185, 129, 0.08)", labelColor: "#bbf7d0", valueColor: "#34d399" };
  }
  if (kind === "maintenance") {
    return { border: "1px solid rgba(245, 158, 11, 0.4)", background: "rgba(245, 158, 11, 0.12)", labelColor: "#fde68a", valueColor: "#fbbf24" };
  }
  return { border: "1px solid rgba(239, 68, 68, 0.4)", background: "rgba(239, 68, 68, 0.12)", labelColor: "#fecaca", valueColor: "#f87171" };
}

function getBotIcon(type: string) {
  if (type === "Moderation") return "🛡️";
  if (type === "Journalisation") return "📝";
  if (type === "Divertissement") return "🎵";
  if (type === "Onboarding") return "👋";
  return "🤖";
}

const defaultNewBot: NewBot = {
  name: "",
  status: "En ligne",
  type: "Moderation",
  server: "",
};

export default function BotsSection() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newBot, setNewBot] = useState<NewBot>(defaultNewBot);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchBots() {
      const { data } = await supabase
        .from("bots")
        .select("*")
        .order("created_at", { ascending: true });
      if (data) setBots(data);
      setLoading(false);
    }

    fetchBots();

    const channel = supabase
      .channel("bots-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "bots" }, () => {
        fetchBots();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleAddBot() {
    if (!newBot.name.trim() || !newBot.server.trim()) return;
    setSaving(true);
    await supabase.from("bots").insert([newBot]);
    setNewBot(defaultNewBot);
    setShowForm(false);
    setSaving(false);
  }

  async function handleDeleteBot(id: string) {
    await supabase.from("bots").delete().eq("id", id);
  }

  const onlineCount = bots.filter((b) => b.status === "En ligne").length;
  const maintenanceCount = bots.filter((b) => b.status === "Maintenance").length;
  const offlineCount = bots.filter((b) => b.status === "Hors ligne").length;

  const onlineStyle = getSummaryStyle("online");
  const maintenanceStyle = getSummaryStyle("maintenance");
  const offlineStyle = getSummaryStyle("offline");

  return (
    <div className="grid gap-6">
      <Panel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">Gestion</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Vos bots</h2>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Cette section affiche une premiere vue d'ensemble de vos bots avec
              leur statut, leur role principal et leur serveur de reference.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
              <span className="h-2 w-2 rounded-full" style={{ background: "rgba(16, 185, 129, 0.9)", boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)" }} />
              {loading ? "..." : `${bots.length} bots suivis`}
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              {showForm ? "Annuler" : "+ Ajouter"}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mt-6 grid gap-4 rounded-2xl border border-zinc-700 bg-zinc-950 p-5">
            <p className="text-sm font-semibold text-white">Nouveau bot</p>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-zinc-400">Nom du bot</label>
                <input
                  type="text"
                  value={newBot.name}
                  onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
                  placeholder="Ex: Moderation Bot"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-zinc-400">Serveur principal</label>
                <input
                  type="text"
                  value={newBot.server}
                  onChange={(e) => setNewBot({ ...newBot, server: e.target.value })}
                  placeholder="Ex: Atlas Community"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-zinc-400">Type</label>
                <select
                  value={newBot.type}
                  onChange={(e) => setNewBot({ ...newBot, type: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-zinc-500"
                >
                  <option>Moderation</option>
                  <option>Journalisation</option>
                  <option>Divertissement</option>
                  <option>Onboarding</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs text-zinc-400">Statut</label>
                <select
                  value={newBot.status}
                  onChange={(e) => setNewBot({ ...newBot, status: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-zinc-500"
                >
                  <option>En ligne</option>
                  <option>Maintenance</option>
                  <option>Hors ligne</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddBot}
              disabled={saving || !newBot.name.trim() || !newBot.server.trim()}
              className="mt-2 w-full rounded-xl border border-zinc-600 bg-zinc-800 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-40"
            >
              {saving ? "Enregistrement..." : "Enregistrer le bot"}
            </button>
          </div>
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl p-5" style={{ border: onlineStyle.border, background: onlineStyle.background }}>
          <p className="text-sm font-medium" style={{ color: onlineStyle.labelColor }}>En ligne</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: onlineStyle.valueColor }}>
            {loading ? "..." : onlineCount}
          </p>
        </div>
        <div className="rounded-2xl p-5" style={{ border: maintenanceStyle.border, background: maintenanceStyle.background }}>
          <p className="text-sm font-medium" style={{ color: maintenanceStyle.labelColor }}>Maintenance</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: maintenanceStyle.valueColor }}>
            {loading ? "..." : maintenanceCount}
          </p>
        </div>
        <div className="rounded-2xl p-5" style={{ border: offlineStyle.border, background: offlineStyle.background }}>
          <p className="text-sm font-medium" style={{ color: offlineStyle.labelColor }}>Hors ligne</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: offlineStyle.valueColor }}>
            {loading ? "..." : offlineCount}
          </p>
        </div>
      </div>

      <Panel title="Liste des bots">
        {loading ? (
          <p className="text-sm text-zinc-500">Chargement...</p>
        ) : (
          <div className="space-y-4">
            {bots.map((bot) => (
              <div key={bot.id} className="group relative">
                <InfoRow
                  title={bot.name}
                  description={`Type : ${bot.type} - Serveur principal : ${bot.server}`}
                  leading={getBotIcon(bot.type)}
                  meta={
                    <>
                      <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
                        {bot.type}
                      </span>
                      <span className="rounded-full px-3 py-1 text-sm font-medium" style={getStatusStyle(bot.status)}>
                        {bot.status}
                      </span>
                      <button
                        onClick={() => handleDeleteBot(bot.id)}
                        className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400 opacity-0 transition group-hover:opacity-100"
                      >
                        Supprimer
                      </button>
                    </>
                  }
                />
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}