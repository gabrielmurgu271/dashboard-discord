"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import { supabase } from "@/lib/supabase";

export default function StatsCards() {
  const [botsCount, setBotsCount] = useState<number | null>(null);
  const [serversCount, setServersCount] = useState<number | null>(null);
  const [eventsCount, setEventsCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      const [botsRes, serversRes, eventsRes] = await Promise.all([
        supabase.from("bots").select("*", { count: "exact", head: true }),
        supabase.from("servers").select("*", { count: "exact", head: true }),
        supabase.from("activity_events").select("*", { count: "exact", head: true }),
      ]);
      setBotsCount(botsRes.count ?? 0);
      setServersCount(serversRes.count ?? 0);
      setEventsCount(eventsRes.count ?? 0);
    }
    fetchCounts();
  }, []);

  const fmt = (n: number | null) => (n === null ? "..." : String(n).padStart(2, "0"));

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Bots actifs" value={fmt(botsCount)} icon="🤖" />
      <StatCard label="Serveurs suivis" value={fmt(serversCount)} icon="🖥️" />
      <StatCard label="Evenements" value={fmt(eventsCount)} icon="📈" />
      <StatCard label="Disponibilite" value="99.9%" icon="⚡" />
    </section>
  );
}