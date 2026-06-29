"use client";

import { useEffect, useState } from "react";
import Panel from "@/components/shared/Panel";

type BotInfo = {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  verified: boolean;
};

type Guild = {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
};

type DiscordData = {
  bot: BotInfo;
  guilds: Guild[];
  guildsCount: number;
};

export default function DiscordBotPanel() {
  const [data, setData] = useState<DiscordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchDiscordData() {
      try {
        const res = await fetch("/api/discord/bot", {
          headers: {
            "x-api-secret": process.env.NEXT_PUBLIC_API_SECRET_KEY ?? "",
          },
        });
        const json = await res.json();
        if (json.error) {
          setError(true);
        } else {
          setData(json);
        }
      } catch {
        setError(true);
      }
      setLoading(false);
    }
    fetchDiscordData();
  }, []);

  if (loading) {
    return (
      <Panel title="Bot Discord connecte">
        <p className="text-sm text-zinc-500">Connexion a Discord...</p>
      </Panel>
    );
  }

  if (error || !data) {
    return (
      <Panel title="Bot Discord">
        <p className="text-sm text-red-400">Impossible de joindre l'API Discord.</p>
      </Panel>
    );
  }

  return (
    <div className="grid gap-6">
      <Panel>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            {data.bot.avatar ? (
              <img
                src={data.bot.avatar}
                alt={data.bot.username}
                className="h-16 w-16 rounded-full border border-zinc-700"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-2xl">
                🤖
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500">
                Bot connecte
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">
                {data.bot.username}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                ID : {data.bot.id}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div
              className="rounded-2xl px-4 py-3 text-center"
              style={{
                border: "1px solid rgba(16, 185, 129, 0.45)",
                background: "rgba(16, 185, 129, 0.14)",
              }}
            >
              <p className="text-xs" style={{ color: "#bbf7d0" }}>Serveurs</p>
              <p className="mt-1 text-2xl font-bold" style={{ color: "#34d399" }}>
                {data.guildsCount}
              </p>
            </div>

            <div
              className="rounded-2xl px-4 py-3 text-center"
              style={{
                border: "1px solid rgba(34, 211, 238, 0.45)",
                background: "rgba(34, 211, 238, 0.14)",
              }}
            >
              <p className="text-xs" style={{ color: "#a5f3fc" }}>Statut</p>
              <p className="mt-1 text-sm font-bold" style={{ color: "#67e8f9" }}>
                En ligne
              </p>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Serveurs rejoints">
        <div className="space-y-4">
          {data.guilds.map((guild) => (
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
                <p className="mt-1 text-xs text-zinc-500">ID : {guild.id}</p>
              </div>

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
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}