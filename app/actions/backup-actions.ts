
"use server";

import { backupDatabase } from "@/data/backup-repository";
import { requireSession } from "@/lib/auth";

export async function createBackup() {
  await requireSession();

  return backupDatabase();
}