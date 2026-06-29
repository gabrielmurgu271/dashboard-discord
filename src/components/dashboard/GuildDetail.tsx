"use client";

import { useEffect, useState } from "react";
import Panel from "@/components/shared/Panel";

type Channel = {
  id: string;
  name: string;
  topic?: string | null;
};

type Member = {
  id: string;
  username: string;
  nickname: string | null;
  avatar: string | null;
};

type GuildData = {
  guild: {
    id: string;
    name: string;
    icon: string | null;
    memberCount: number;
    onlineCount: number;
    description: string | null;
  };
  textChannels: Channel[];
  voiceChannels: Channel[];
  members: Member[];
};

type Props = {
  guildId: string;
  guildName: string;
  onClose: () => void;
};

export default function GuildDetail({ guildId, guildName, onClose }: Props) {
  const [data, setData] = useState<GuildData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGuild() {
      try {
        const res = await fetch(`/api/discord/guild/${guildId}`, {
          headers: {
            "x-api-secret": process.env.NEXT_PUBLIC_API_SECRET_KEY ?? "",
          },
        });
        const json = await res.json();
        if (!json.error) setData(json);
      } catch {
        console.error("Erreur guild detail");
      }
      setLoading(false);
    }
    fetchGuild();
  }, [guildId]);

  return (
    <div className="grid gap-6">
      <Panel>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Detail du serveur
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white">{guildName}</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800"
          >
            ← Retour
          </button>
        </div>

        {data && (
          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <div
              className="rounded-2xl p-4"
              style={{
                border: "1px solid rgba(16, 185, 129, 0.45)",
                background: "rgba(16, 185, 129, 0.14)",
              }}
            >
              <p className="text-xs" style={{ color: "#bbf7d0" }}>Membres</p>
              <p className="mt-2 text-2xl font-bold" style={{ color: "#34d399" }}>
                {data.guild.memberCount}
              </p>
            </div>

            <div
              className="rounded-2xl p-4"
              style={{
                border: "1px solid rgba(34, 211, 238, 0.45)",
                background: "rgba(34, 211, 238, 0.14)",
              }}
            >
              <p className="text-xs" style={{ color: "#a5f3fc" }}>En ligne</p>
              <p className="mt-2 text-2xl font-bold" style={{ color: "#67e8f9" }}>
                {data.guild.onlineCount}
              </p>
            </div>

            <div
              className="rounded-2xl p-4"
              style={{
                border: "1px solid rgba(139, 92, 246, 0.45)",
                background: "rgba(139, 92, 246, 0.14)",
              }}
            >
              <p className="text-xs" style={{ color: "#ddd6fe" }}>Salons texte</p>
              <p className="mt-2 text-2xl font-bold" style={{ color: "#c4b5fd" }}>
                {data.textChannels.length}
              </p>
            </div>
          </div>
        )}
      </Panel>

      {loading ? (
        <Panel>
          <p className="text-sm text-zinc-500">Chargement des details...</p>
        </Panel>
      ) : data ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Salons texte">
            <div className="space-y-2">
              {data.textChannels.slice(0, 10).map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3"
                >
                  <span className="text-zinc-500">#</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">{channel.name}</p>
                    {channel.topic && (
                      <p className="mt-0.5 truncate text-xs text-zinc-500">{channel.topic}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <div className="grid gap-6">
            <Panel title="Salons vocaux">
              <div className="space-y-2">
                {data.voiceChannels.slice(0, 6).map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3"
                  >
                    <span className="text-zinc-500">🔊</span>
                    <p className="text-sm font-medium text-white">{channel.name}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Membres recents">
              <div className="space-y-3">
                {data.members.slice(0, 5).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3"
                  >
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.username}
                        className="h-8 w-8 rounded-full border border-zinc-700"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs font-bold text-zinc-300">
                        {member.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">
                        {member.nickname ?? member.username}
                      </p>
                      {member.nickname && (
                        <p className="text-xs text-zinc-500">{member.username}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      ) : (
        <Panel>
          <p className="text-sm text-red-400">Impossible de charger les details.</p>
        </Panel>
      )}
    </div>
  );
}