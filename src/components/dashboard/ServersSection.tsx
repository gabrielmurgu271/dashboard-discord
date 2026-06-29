"use client";

import { useEffect, useState } from "react";
import InfoRow from "@/components/shared/InfoRow";
import Panel from "@/components/shared/Panel";
import { supabase } from "@/lib/supabase";

type Server = {
  id: string;
  name: string;
  members: number;
  region: string;
  status: string;
  category: string;
};

type NewServer = {
  name: string;
  members: number;
  region: string;
  status: string;
  category: string;
};

function getStatusStyle(status: string) {
  if (status === "Connecte") {
    return { border: "1px solid rgba(16, 185, 129, 0.45)", background: "rgba(16, 185, 129, 0.14)", color: "#86efac" };
  }
  if (status === "Synchronisation") {
    return { border: "1px solid rgba(34, 211, 238, 0.45)", background: "rgba(34, 211, 238, 0.14)", color: "#a5f3fc" };
  }
  return { border: "1px solid rgba(245, 158, 11, 0.5)", background: "rgba(245, 158, 11, 0.18)", color: "#fde68a" };
}

function getSummaryStyle(kind: "connecte" | "synchronisation" | "verification") {
  if (kind === "connecte") {
    return { border: "1px solid rgba(16, 185, 129, 0.35)", background: "rgba(16, 185, 129, 0.08)", labelColor: "#bbf7d0", valueColor: "#34d399" };
  }
  if (kind === "synchronisation") {
    return { border: "1px solid rgba(34, 211, 238, 0.4)", background: "rgba(34, 211, 238, 0.12)", labelColor: "#a5f3fc", valueColor: "#67e8f9" };
  }
  return { border: "1px solid rgba(245, 158, 11, 0.4)", background: "rgba(245, 158, 11, 0.12)", labelColor: "#fde68a", valueColor: "#fbbf24" };
}

function getCategoryIcon(category: string) {
  if (category === "Communaute") return "🌐";
  if (category === "Developpement") return "💻";
  if (category === "Administration") return "⚙️";
  return "🖥️";
}

const defaultNewServer: NewServer = {
  name: "",
  members: 0,
  region: "Europe",
  status: "Connecte",
  category: "Communaute",
};

export default function ServersSection() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newServer, setNewServer] = useState<NewServer>(defaultNewServer);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchServers() {
      const { data } = await supabase
        .from("servers")
        .select("*")
        .order("created_at", { ascending: true });
      if (data) setServers(data);
      setLoading(false);
    }

    fetchServers();

    const channel = supabase
      .channel("servers-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "servers" }, () => {
        fetchServers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleAddServer() {
    if (!newServer.name.trim()) return;
    setSaving(true);
    await supabase.from("servers").insert([newServer]);
    setNewServer(defaultNewServer);
    setShowForm(false);
    setSaving(false);
  }

  async function handleDeleteServer(id: string) {
    await supabase.from("servers").delete().eq("id", id);
  }

  const connecteCount = servers.filter((s) => s.status === "Connecte").length;
  const syncCount = servers.filter((s) => s.status === "Synchronisation").length;
  const verifCount = servers.filter((s) => s.status === "Verification").length;

  const connecteStyle = getSummaryStyle("connecte");
  const syncStyle = getSummaryStyle("synchronisation");
  const verifStyle = getSummaryStyle("verification");

  return (
    <div className="grid gap-6">
      <Panel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">Infrastructure</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Serveurs connectes</h2>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Cette section presente les serveurs suivis par le dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
              <span className="h-2 w-2 rounded-full" style={{ background: "rgba(16, 185, 129, 0.9)", boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)" }} />
              {loading ? "..." : `${servers.length} serveurs suivis`}
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
            <p className="text-sm font-semibold text-white">Nouveau serveur</p>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-zinc-400">Nom du serveur</label>
                <input
                  type="text"
                  value={newServer.name}
                  onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                  placeholder="Ex: Atlas Community"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-zinc-400">Nombre de membres</label>
                <input
                  type="number"
                  value={newServer.members}
                  onChange={(e) => setNewServer({ ...newServer, members: parseInt(e.target.value) || 0 })}
                  placeholder="Ex: 1284"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-zinc-400">Region</label>
                <select
                  value={newServer.region}
                  onChange={(e) => setNewServer({ ...newServer, region: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-zinc-500"
                >
                  <option>Europe</option>
                  <option>Amerique du Nord</option>
                  <option>Amerique du Sud</option>
                  <option>Asie</option>
                  <option>Oceanie</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs text-zinc-400">Categorie</label>
                <select
                  value={newServer.category}
                  onChange={(e) => setNewServer({ ...newServer, category: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-zinc-500"
                >
                  <option>Communaute</option>
                  <option>Developpement</option>
                  <option>Administration</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs text-zinc-400">Statut</label>
                <select
                  value={newServer.status}
                  onChange={(e) => setNewServer({ ...newServer, status: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-zinc-500"
                >
                  <option>Connecte</option>
                  <option>Synchronisation</option>
                  <option>Verification</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddServer}
              disabled={saving || !newServer.name.trim()}
              className="mt-2 w-full rounded-xl border border-zinc-600 bg-zinc-800 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-40"
            >
              {saving ? "Enregistrement..." : "Enregistrer le serveur"}
            </button>
          </div>
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl p-5" style={{ border: connecteStyle.border, background: connecteStyle.background }}>
          <p className="text-sm font-medium" style={{ color: connecteStyle.labelColor }}>Connectes</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: connecteStyle.valueColor }}>
            {loading ? "..." : connecteCount}
          </p>
        </div>
        <div className="rounded-2xl p-5" style={{ border: syncStyle.border, background: syncStyle.background }}>
          <p className="text-sm font-medium" style={{ color: syncStyle.labelColor }}>Synchronisation</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: syncStyle.valueColor }}>
            {loading ? "..." : syncCount}
          </p>
        </div>
        <div className="rounded-2xl p-5" style={{ border: verifStyle.border, background: verifStyle.background }}>
          <p className="text-sm font-medium" style={{ color: verifStyle.labelColor }}>Verification</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: verifStyle.valueColor }}>
            {loading ? "..." : verifCount}
          </p>
        </div>
      </div>

      <Panel title="Liste des serveurs">
        {loading ? (
          <p className="text-sm text-zinc-500">Chargement...</p>
        ) : (
          <div className="space-y-4">
            {servers.map((server) => (
              <div key={server.id} className="group relative">
                <InfoRow
                  title={server.name}
                  description={`Membres : ${server.members} — Region : ${server.region} — Categorie : ${server.category}`}
                  leading={getCategoryIcon(server.category)}
                  meta={
                    <>
                      <span className="rounded-full px-3 py-1 text-sm font-medium" style={getStatusStyle(server.status)}>
                        {server.status}
                      </span>
                      <button
                        onClick={() => handleDeleteServer(server.id)}
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