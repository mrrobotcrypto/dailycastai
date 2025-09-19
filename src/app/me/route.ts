import { NextResponse } from "next/server";
import { getSessionFromCookie } from "@/lib/session";

export async function GET() {
  const s = getSessionFromCookie();
  return NextResponse.json({ session: s || null });
}
