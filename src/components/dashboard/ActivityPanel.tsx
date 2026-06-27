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

type QuickStatus = {
  label: string;
  value: string;
};

function getQuickStatusStyle(value: string) {
  if (value === "OK" || value === "Actifs" || value === "Connecte") {
    return {
      border: "1px solid rgba(16, 185, 129, 0.45)",
      background: "rgba(16, 185, 129, 0.14)",
      color: "#86efac",
    };
  }
  if (value === "Alerte" || value === "Critique" || value === "Hors ligne") {
    return {
      border: "1px solid rgba(239, 68, 68, 0.5)",
      background: "rgba(239, 68, 68, 0.18)",
      color: "#fca5a5",
    };
  }
  return {
    border: "1px solid rgba(245, 158, 11, 0.5)",
    background: "rgba(245, 158, 11, 0.18)",
    color: "#fde68a",
  };
}

export default function ActivityPanel() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [quickStatus, setQuickStatus] = useState<QuickStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [eventsRes, botsRes, serversRes] = await Promise.all([
        supabase
          .from("activity_events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3),
        supabase.from("bots").select("status"),
        supabase.from("servers").select("status"),
      ]);

      if (eventsRes.data) setEvents(eventsRes.data);

      const bots = botsRes.data ?? [];
      const servers = serversRes.data ?? [];

      const hasOfflineBot = bots.some((b) => b.status === "Hors ligne");
      const hasAlertEvent = eventsRes.data?.some(
        (e) => e.level === "Critique" || e.level === "Alerte"
      );
      const hasSync = servers.some((s) => s.status === "Synchronisation");

      setQuickStatus([
        { label: "API Discord", value: "OK" },
        { label: "Base de donnees", value: "OK" },
        { label: "Webhooks", value: hasAlertEvent ? "Alerte" : "OK" },
        { label: "Bots", value: hasOfflineBot ? "Alerte" : "Actifs" },
        { label: "Serveurs", value: hasSync ? "Synchronisation" : "OK" },
      ]);

      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[2fr1fr]">
      <Panel title="Activite recente">
        {loading ? (
          <p className="text-sm text-zinc-500">Chargement...</p>
        ) : (
          <div className="space-y-4">
            {events.map((item, index) => (
              <div
                key={item.id}
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
        )}
      </Panel>

      <Panel title="Etat rapide">
        {loading ? (
          <p className="text-sm text-zinc-500">Chargement...</p>
        ) : (
          <div className="space-y-3">
            {quickStatus.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="mt-1 text-xs text-zinc-500">Surveillance active</p>
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
        )}
      </Panel>
    </section>
  );
}