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
    const [userRes, guildsRes] = await Promise.all([
      fetch("https://discord.com/api/v10/users/@me", {
        headers: { Authorization: `Bot ${token}` },
        next: { revalidate: 30 },
      }),
      fetch("https://discord.com/api/v10/users/@me/guilds", {
        headers: { Authorization: `Bot ${token}` },
        next: { revalidate: 30 },
      }),
    ]);

    const user = await userRes.json();
    const guilds = await guildsRes.json();

    const avatar = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : null;

    return NextResponse.json({
      bot: {
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar,
        verified: user.verified,
      },
      guilds: guilds.map((g: { id: string; name: string; icon: string | null; owner: boolean }) => ({
        id: g.id,
        name: g.name,
        icon: g.icon
          ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`
          : null,
        owner: g.owner,
      })),
      guildsCount: guilds.length,
    });
  } catch {
    return NextResponse.json({ error: "Erreur Discord API" }, { status: 500 });
  }
}