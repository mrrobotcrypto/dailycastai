import { NextApiRequest, NextApiResponse } from "next";
import { NeynarSIWNClient } from "@neynar/nodejs-sdk";

const client = new NeynarSIWNClient(process.env.NEYNAR_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { code } = req.query; // Farcaster callback -> buradan code gelir
    if (!code) throw new Error("Missing code");

    const { user, signer_token } = await client.validateLogin(code as string);

    // Kullanıcı bilgilerini session’a kaydet
    // 👇 Örn. cookie’ye veya db’ye
    res.setHeader("Set-Cookie", `fid=${user.fid}; Path=/; HttpOnly`);

    // ✅ Doğru yönlendirme
    res.redirect("/");
  } catch (e: any) {
    console.error("Callback error:", e);
    res.status(400).send("Callback failed: " + e.message);
  }
}
