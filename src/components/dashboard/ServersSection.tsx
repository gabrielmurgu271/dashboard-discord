"use client";

import { useEffect, useState } from "react";
import Panel from "@/components/shared/Panel";
import { supabase } from "@/lib/supabase";

type DiscordGuild = {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  memberCount: number;
  onlineCount: number;
  region: string;
};

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
  const [discordGuilds, setDiscordGuilds] = useState<DiscordGuild[]>([]);
  const [loadingSupabase, setLoadingSupabase] = useState(true);
  const [loadingDiscord, setLoadingDiscord] = useState(true);
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
      setLoadingSupabase(false);
    }

    async function fetchDiscordGuilds() {
      try {
        const res = await fetch("/api/discord/guilds", {
          headers: {
            "x-api-secret": process.env.NEXT_PUBLIC_API_SECRET_KEY ?? "",
          },
        });
        const json = await res.json();
        if (json.guilds) setDiscordGuilds(json.guilds);
      } catch {
        console.error("Erreur Discord guilds");
      }
      setLoadingDiscord(false);
    }

    fetchServers();
    fetchDiscordGuilds();

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
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Discord
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Serveurs Discord reels
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Serveurs ou votre bot est actuellement present.
            </p>
          </div>

          <div
            className="rounded-2xl px-4 py-3 text-center"
            style={{
              border: "1px solid rgba(16, 185, 129, 0.45)",
              background: "rgba(16, 185, 129, 0.14)",
            }}
          >
            <p className="text-xs" style={{ color: "#bbf7d0" }}>Serveurs actifs</p>
            <p className="mt-1 text-2xl font-bold" style={{ color: "#34d399" }}>
              {loadingDiscord ? "..." : discordGuilds.length}
            </p>
          </div>
        </div>

        {loadingDiscord ? (
          <p className="mt-6 text-sm text-zinc-500">Chargement depuis Discord...</p>
        ) : (
          <div className="mt-6 space-y-3">
            {discordGuilds.map((guild) => (
              <div
                key={guild.id}
                className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4"
              >
                {guild.icon ? (
                  <img
                    src={guild.icon}
                    alt={guild.name}
                    className="h-10 w-10 rounded-full border border-zinc-700"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-sm font-bold text-zinc-300">
                    {guild.name.charAt(0)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">{guild.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {guild.memberCount} membres · {guild.onlineCount} en ligne
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {guild.owner && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        border: "1px solid rgba(245, 158, 11, 0.5)",
                        background: "rgba(245, 158, 11, 0.18)",
                        color: "#fde68a",
                      }}
                    >
                      Proprietaire
                    </span>
                  )}
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      border: "1px solid rgba(16, 185, 129, 0.45)",
                      background: "rgba(16, 185, 129, 0.14)",
                      color: "#86efac",
                    }}
                  >
                    Connecte
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">Infrastructure</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Serveurs suivis</h2>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Serveurs enregistres manuellement dans le dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
              <span className="h-2 w-2 rounded-full" style={{ background: "rgba(16, 185, 129, 0.9)", boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)" }} />
              {loadingSupabase ? "..." : `${servers.length} serveurs`}
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
                <label className="mb-2 block text-xs text-zinc-400">Nom</label>
                <input
                  type="text"
                  value={newServer.name}
                  onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                  placeholder="Ex: Atlas Community"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-zinc-400">Membres</label>
                <input
                  type="number"
                  value={newServer.members}
                  onChange={(e) => setNewServer({ ...newServer, members: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-zinc-500"
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
            {loadingSupabase ? "..." : connecteCount}
          </p>
        </div>
        <div className="rounded-2xl p-5" style={{ border: syncStyle.border, background: syncStyle.background }}>
          <p className="text-sm font-medium" style={{ color: syncStyle.labelColor }}>Synchronisation</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: syncStyle.valueColor }}>
            {loadingSupabase ? "..." : syncCount}
          </p>
        </div>
        <div className="rounded-2xl p-5" style={{ border: verifStyle.border, background: verifStyle.background }}>
          <p className="text-sm font-medium" style={{ color: verifStyle.labelColor }}>Verification</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: verifStyle.valueColor }}>
            {loadingSupabase ? "..." : verifCount}
          </p>
        </div>
      </div>

      <Panel title="Liste des serveurs">
        {loadingSupabase ? (
          <p className="text-sm text-zinc-500">Chargement...</p>
        ) : (
          <div className="space-y-4">
            {servers.map((server) => (
              <div key={server.id} className="group relative">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-xl">
                        {getCategoryIcon(server.category)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-white">{server.name}</h3>
                        <p className="mt-2 text-sm text-zinc-400">
                          {server.members} membres · {server.region} · {server.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full px-3 py-1 text-sm font-medium" style={getStatusStyle(server.status)}>
                        {server.status}
                      </span>
                      <button
                        onClick={() => handleDeleteServer(server.id)}
                        className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400 opacity-0 transition group-hover:opacity-100"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}