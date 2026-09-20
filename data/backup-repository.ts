
import fs from "fs";
import path from "path";
import { db } from "@/db/database";

export async function backupDatabase() {
  const backupDirectory = process.env.DENTAL_CLINIC_BACKUP_DIR;

  if (!backupDirectory) {
    throw new Error("Backup directory is not configured.");
  }

  if (!fs.existsSync(backupDirectory)) {
    fs.mkdirSync(backupDirectory, { recursive: true });
  }

  const fileName = `backup-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}.db`;

  const destinationPath = path.join(
    backupDirectory,
    fileName
  );

  await db.backup(destinationPath);

  return destinationPath;
}