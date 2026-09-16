
import bcrypt from "bcryptjs";
import { db } from "@/db/database";

export function hasPassword(): boolean {
  const row = db
    .prepare("SELECT id FROM app_auth WHERE id = 1")
    .get();

  return Boolean(row);
}

export function createPassword(password: string): void {
  const passwordHash = bcrypt.hashSync(password, 12);

  db.prepare(`
    INSERT INTO app_auth (id, password_hash)
    VALUES (1, ?)
  `).run(passwordHash);
}

export function verifyPassword(password: string): boolean {
  const row = db
    .prepare("SELECT password_hash FROM app_auth WHERE id = 1")
    .get() as { password_hash: string } | undefined;

  if (!row) {return false}

  return bcrypt.compareSync(password, row.password_hash);
}

export function changePassword(
  currentPassword: string,
  newPassword: string
): boolean {
  const valid = verifyPassword(currentPassword);

  if (!valid) {
    return false;
  }

  const passwordHash = bcrypt.hashSync(newPassword, 12);

  db.prepare(`
    UPDATE app_auth
    SET password_hash = ?
    WHERE id = 1
  `).run(passwordHash);

  return true;
}