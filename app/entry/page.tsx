
import { hasPassword } from "@/data/auth-repository";
import { hasSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EntryPage() {
    const passwordConfigured = hasPassword();
    console.log("ENTRY PASSWORD CONFIGURED:", passwordConfigured);
    if (!passwordConfigured) { redirect("/setup"); }

    const authenticated = await hasSession();
    if (!authenticated) { redirect("/login"); }

    redirect("/");
}