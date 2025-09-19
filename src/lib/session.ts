import { cookies } from "next/headers";

const COOKIE = "dcai_session";

export type Session = {
  fid: number;
  username?: string;
  custody_address?: string;
  signer_uuid?: string;
  display_address?: string;
};

export function getSessionFromCookie(): Session | null {
  try {
    const c = cookies().get(COOKIE)?.value;
    if (!c) return null;
    return JSON.parse(c) as Session;
  } catch {
    return null;
  }
}

export function setSessionCookie(s: Session) {
  cookies().set({
    name: COOKIE,
    value: JSON.stringify(s),
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
  });
}

export function clearSessionCookie() {
  cookies().set({
    name: COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0,
  });
}
