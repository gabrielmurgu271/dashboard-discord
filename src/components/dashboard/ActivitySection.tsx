"use client";

import { useEffect, useState } from "react";
import Panel from "@/components/shared/Panel";
import { supabase } from "@/lib/supabase";

type ActivityEvent = {
  id: string;
  title: string;
  description: string;
  time: string;
  level: string;
};

type NewEvent = {
  title: string;
  description: string;
  time: string;
  level: string;
};

function getLevelStyle(level: string) {
  if (level === "Critique" || level === "Alerte") {
    return { border: "1px solid rgba(239, 68, 68, 0.5)", background: "rgba(239, 68, 68, 0.18)", color: "#fca5a5" };
  }
  return { border: "1px solid rgba(34, 211, 238, 0.45)", background: "rgba(34, 211, 238, 0.14)", color: "#a5f3fc" };
}

function getLevelIcon(level: string) {
  if (level === "Critique") return "🔴";
  if (level === "Alerte") return "⚠️";
  return "ℹ️";
}

function getSummaryStyle(kind: "critique" | "alerte" | "info") {
  if (kind === "critique") {
    return { border: "1px solid rgba(239, 68, 68, 0.4)", background: "rgba(239, 68, 68, 0.12)", labelColor: "#fecaca", valueColor: "#f87171" };
  }
  if (kind === "alerte") {
    return { border: "1px solid rgba(245, 158, 11, 0.4)", background: "rgba(245, 158, 11, 0.12)", labelColor: "#fde68a", valueColor: "#fbbf24" };
  }
  return { border: "1px solid rgba(34, 211, 238, 0.4)", background: "rgba(34, 211, 238, 0.12)", labelColor: "#a5f3fc", valueColor: "#67e8f9" };
}

const defaultNewEvent: NewEvent = {
  title: "",
  description: "",
  time: "Il y a quelques secondes",
  level: "Info",
};

export default function ActivitySection() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEvent>(defaultNewEvent);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from("activity_events")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setEvents(data);
      setLoading(false);
    }

    fetchEvents();

    const channel = supabase
      .channel("activity-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "activity_events" }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleAddEvent() {
    if (!newEvent.title.trim() || !newEvent.description.trim()) return;
    setSaving(true);
    await supabase.from("activity_events").insert([newEvent]);
    setNewEvent(defaultNewEvent);
    setShowForm(false);
    setSaving(false);
  }

  async function handleDeleteEvent(id: string) {
    await supabase.from("activity_events").delete().eq("id", id);
  }

  const critiqueCount = events.filter((e) => e.level === "Critique").length;
  const alerteCount = events.filter((e) => e.level === "Alerte").length;
  const infoCount = events.filter((e) => e.level === "Info").length;

  const critiqueStyle = getSummaryStyle("critique");
  const alerteStyle = getSummaryStyle("alerte");
  const infoStyle = getSummaryStyle("info");

  return (
    <div className="grid gap-6">
      <Panel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">Suivi</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Activite recente</h2>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Cette section regroupe les derniers evenements importants du dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
              <span className="h-2 w-2 rounded-full" style={{ background: "rgba(16, 185, 129, 0.9)", boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)" }} />
              {loading ? "..." : `${events.length} evenements`}
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
            <p className="text-sm font-semibold text-white">Nouvel evenement</p>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-zinc-400">Titre</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Ex: Webhook detecte"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-zinc-400">Temps</label>
                <input
                  type="text"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  placeholder="Ex: Il y a 5 min"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs text-zinc-400">Description</label>
                <input
                  type="text"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Ex: Un webhook a cesse de repondre"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-zinc-400">Niveau</label>
                <select
                  value={newEvent.level}
                  onChange={(e) => setNewEvent({ ...newEvent, level: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-zinc-500"
                >
                  <option>Info</option>
                  <option>Alerte</option>
                  <option>Critique</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddEvent}
              disabled={saving || !newEvent.title.trim() || !newEvent.description.trim()}
              className="mt-2 w-full rounded-xl border border-zinc-600 bg-zinc-800 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-40"
            >
              {saving ? "Enregistrement..." : "Enregistrer l'evenement"}
            </button>
          </div>
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl p-5" style={{ border: critiqueStyle.border, background: critiqueStyle.background }}>
          <p className="text-sm font-medium" style={{ color: critiqueStyle.labelColor }}>Critiques</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: critiqueStyle.valueColor }}>
            {loading ? "..." : critiqueCount}
          </p>
        </div>
        <div className="rounded-2xl p-5" style={{ border: alerteStyle.border, background: alerteStyle.background }}>
          <p className="text-sm font-medium" style={{ color: alerteStyle.labelColor }}>Alertes</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: alerteStyle.valueColor }}>
            {loading ? "..." : alerteCount}
          </p>
        </div>
        <div className="rounded-2xl p-5" style={{ border: infoStyle.border, background: infoStyle.background }}>
          <p className="text-sm font-medium" style={{ color: infoStyle.labelColor }}>Informatifs</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: infoStyle.valueColor }}>
            {loading ? "..." : infoCount}
          </p>
        </div>
      </div>

      <Panel title="Journal d'activite">
        {loading ? (
          <p className="text-sm text-zinc-500">Chargement...</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="group relative">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-xl">
                        {getLevelIcon(event.level)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-white">{event.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">{event.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
                      <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-400">
                        {event.time}
                      </span>
                      <span className="rounded-full px-3 py-1 text-sm font-medium" style={getLevelStyle(event.level)}>
                        {event.level}
                      </span>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
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