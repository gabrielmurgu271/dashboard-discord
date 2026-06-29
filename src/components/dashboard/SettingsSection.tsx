"use client";

import { useEffect, useState } from "react";
import InfoRow from "@/components/shared/InfoRow";
import Panel from "@/components/shared/Panel";
import { supabase } from "@/lib/supabase";

type Setting = {
  id: string;
  label: string;
  value: string;
  description: string;
  category: string;
};

type NewSetting = {
  label: string;
  value: string;
  description: string;
  category: string;
};

function getValueStyle(value: string) {
  if (value === "Active") {
    return { border: "1px solid rgba(16, 185, 129, 0.45)", background: "rgba(16, 185, 129, 0.14)", color: "#86efac" };
  }
  if (value === "Partiel") {
    return { border: "1px solid rgba(245, 158, 11, 0.5)", background: "rgba(245, 158, 11, 0.18)", color: "#fde68a" };
  }
  return { border: "1px solid rgba(34, 211, 238, 0.45)", background: "rgba(34, 211, 238, 0.14)", color: "#a5f3fc" };
}

function getSummaryStyle(kind: "active" | "partiel" | "planifie") {
  if (kind === "active") {
    return { border: "1px solid rgba(16, 185, 129, 0.35)", background: "rgba(16, 185, 129, 0.08)", labelColor: "#bbf7d0", valueColor: "#34d399" };
  }
  if (kind === "partiel") {
    return { border: "1px solid rgba(245, 158, 11, 0.4)", background: "rgba(245, 158, 11, 0.12)", labelColor: "#fde68a", valueColor: "#fbbf24" };
  }
  return { border: "1px solid rgba(34, 211, 238, 0.4)", background: "rgba(34, 211, 238, 0.12)", labelColor: "#a5f3fc", valueColor: "#67e8f9" };
}

function getCategoryIcon(category: string) {
  if (category === "Performance") return "⚡";
  if (category === "Securite") return "🛡️";
  if (category === "Notifications") return "🔔";
  if (category === "Infrastructure") return "🖥️";
  return "⚙️";
}

const defaultNewSetting: NewSetting = {
  label: "",
  value: "Active",
  description: "",
  category: "Performance",
};

export default function SettingsSection() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newSetting, setNewSetting] = useState<NewSetting>(defaultNewSetting);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("settings")
        .select("*")
        .order("created_at", { ascending: true });
      if (data) setSettings(data);
      setLoading(false);
    }

    fetchSettings();

    const channel = supabase
      .channel("settings-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "settings" }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleAddSetting() {
    if (!newSetting.label.trim() || !newSetting.description.trim()) return;
    setSaving(true);
    await supabase.from("settings").insert([newSetting]);
    setNewSetting(defaultNewSetting);
    setShowForm(false);
    setSaving(false);
  }

  async function handleDeleteSetting(id: string) {
    await supabase.from("settings").delete().eq("id", id);
  }

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
            <p className="text-sm uppercase tracking-widest text-zinc-500">Configuration</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Parametres generaux</h2>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Cette section regroupe les principaux reglages du dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
              <span className="h-2 w-2 rounded-full" style={{ background: "rgba(16, 185, 129, 0.9)", boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)" }} />
              {loading ? "..." : `${settings.length} reglages`}
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
            <p className="text-sm font-semibold text-white">Nouveau reglage</p>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-zinc-400">Nom du reglage</label>
                <input
                  type="text"
                  value={newSetting.label}
                  onChange={(e) => setNewSetting({ ...newSetting, label: e.target.value })}
                  placeholder="Ex: Mode temps reel"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-zinc-400">Categorie</label>
                <select
                  value={newSetting.category}
                  onChange={(e) => setNewSetting({ ...newSetting, category: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-zinc-500"
                >
                  <option>Performance</option>
                  <option>Securite</option>
                  <option>Notifications</option>
                  <option>Infrastructure</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs text-zinc-400">Description</label>
                <input
                  type="text"
                  value={newSetting.description}
                  onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                  placeholder="Ex: Met a jour les donnees automatiquement"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-zinc-400">Valeur</label>
                <select
                  value={newSetting.value}
                  onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-zinc-500"
                >
                  <option>Active</option>
                  <option>Partiel</option>
                  <option>Planifiee</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddSetting}
              disabled={saving || !newSetting.label.trim() || !newSetting.description.trim()}
              className="mt-2 w-full rounded-xl border border-zinc-600 bg-zinc-800 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-40"
            >
              {saving ? "Enregistrement..." : "Enregistrer le reglage"}
            </button>
          </div>
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl p-5" style={{ border: activeStyle.border, background: activeStyle.background }}>
          <p className="text-sm font-medium" style={{ color: activeStyle.labelColor }}>Actifs</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: activeStyle.valueColor }}>
            {loading ? "..." : activeCount}
          </p>
        </div>
        <div className="rounded-2xl p-5" style={{ border: partielStyle.border, background: partielStyle.background }}>
          <p className="text-sm font-medium" style={{ color: partielStyle.labelColor }}>Partiels</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: partielStyle.valueColor }}>
            {loading ? "..." : partielCount}
          </p>
        </div>
        <div className="rounded-2xl p-5" style={{ border: planifieStyle.border, background: planifieStyle.background }}>
          <p className="text-sm font-medium" style={{ color: planifieStyle.labelColor }}>Planifies</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: planifieStyle.valueColor }}>
            {loading ? "..." : planifieCount}
          </p>
        </div>
      </div>

      <Panel title="Configuration actuelle">
        {loading ? (
          <p className="text-sm text-zinc-500">Chargement...</p>
        ) : (
          <div className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.id} className="group relative">
                <InfoRow
                  title={setting.label}
                  description={`${setting.description} — Categorie : ${setting.category}`}
                  leading={getCategoryIcon(setting.category)}
                  meta={
                    <>
                      <span className="rounded-full px-3 py-1 text-sm font-medium" style={getValueStyle(setting.value)}>
                        {setting.value}
                      </span>
                      <button
                        onClick={() => handleDeleteSetting(setting.id)}
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