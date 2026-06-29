import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const secret = req.headers.get("x-api-secret");

  if (secret !== process.env.API_SECRET_KEY) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const token = process.env.DISCORD_BOT_TOKEN;
  const { id } = params;

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 500 });
  }

  try {
    const [guildRes, channelsRes, membersRes] = await Promise.all([
      fetch(`https://discord.com/api/v10/guilds/${id}?with_counts=true`, {
        headers: { Authorization: `Bot ${token}` },
        next: { revalidate: 30 },
      }),
      fetch(`https://discord.com/api/v10/guilds/${id}/channels`, {
        headers: { Authorization: `Bot ${token}` },
        next: { revalidate: 30 },
      }),
      fetch(`https://discord.com/api/v10/guilds/${id}/members?limit=10`, {
        headers: { Authorization: `Bot ${token}` },
        next: { revalidate: 30 },
      }),
    ]);

    const guild = await guildRes.json();
    const channels = await channelsRes.json();
    const members = await membersRes.json();

    const textChannels = Array.isArray(channels)
      ? channels
          .filter((c: { type: number }) => c.type === 0)
          .map((c: { id: string; name: string; topic: string | null }) => ({
            id: c.id,
            name: c.name,
            topic: c.topic,
          }))
      : [];

    const voiceChannels = Array.isArray(channels)
      ? channels
          .filter((c: { type: number }) => c.type === 2)
          .map((c: { id: string; name: string }) => ({
            id: c.id,
            name: c.name,
          }))
      : [];

    const memberList = Array.isArray(members)
      ? members.map((m: {
          user: { id: string; username: string; avatar: string | null };
          nick: string | null;
          roles: string[];
        }) => ({
          id: m.user.id,
          username: m.user.username,
          nickname: m.nick,
          avatar: m.user.avatar
            ? `https://cdn.discordapp.com/avatars/${m.user.id}/${m.user.avatar}.png`
            : null,
          roles: m.roles,
        }))
      : [];

    return NextResponse.json({
      guild: {
        id: guild.id,
        name: guild.name,
        icon: guild.icon
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
          : null,
        memberCount: guild.approximate_member_count ?? 0,
        onlineCount: guild.approximate_presence_count ?? 0,
        description: guild.description,
      },
      textChannels,
      voiceChannels,
      members: memberList,
    });
  } catch {
    return NextResponse.json({ error: "Erreur Discord API" }, { status: 500 });
  }
}