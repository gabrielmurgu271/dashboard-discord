import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-api-secret");

  if (secret !== process.env.API_SECRET_KEY) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const token = process.env.DISCORD_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 500 });
  }

  try {
    const guildsRes = await fetch(
      "https://discord.com/api/v10/users/@me/guilds",
      {
        headers: { Authorization: `Bot ${token}` },
        next: { revalidate: 60 },
      }
    );

    const guilds = await guildsRes.json();

    const detailedGuilds = await Promise.all(
      guilds.map(async (g: { id: string; name: string; icon: string | null; owner: boolean }) => {
        try {
          const guildRes = await fetch(
            `https://discord.com/api/v10/guilds/${g.id}?with_counts=true`,
            {
              headers: { Authorization: `Bot ${token}` },
              next: { revalidate: 60 },
            }
          );
          const guildData = await guildRes.json();

          return {
            id: g.id,
            name: g.name,
            icon: g.icon
              ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`
              : null,
            owner: g.owner,
            memberCount: guildData.approximate_member_count ?? 0,
            onlineCount: guildData.approximate_presence_count ?? 0,
            region: "Discord",
          };
        } catch {
          return {
            id: g.id,
            name: g.name,
            icon: null,
            owner: g.owner,
            memberCount: 0,
            onlineCount: 0,
            region: "Discord",
          };
        }
      })
    );

    return NextResponse.json({ guilds: detailedGuilds });
  } catch {
    return NextResponse.json({ error: "Erreur Discord API" }, { status: 500 });
  }
}