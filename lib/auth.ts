
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "dental_clinic_session";

export async function createSession() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, "authenticated", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function hasSession(): Promise<boolean> {
  const cookieStore = await cookies();

  return cookieStore.get(SESSION_COOKIE)?.value === "authenticated";
}

export async function deleteSession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE);
}

export async function requireSession() {
  const authenticated = await hasSession();

  if (!authenticated) {
    redirect("/login");
  }
}