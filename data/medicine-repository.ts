
import { db } from "@/db/database";
import type { Medicine } from "@/types/medicines";

export function getAllMedicines(): Medicine[] {
  return db
    .prepare(`
      SELECT *
      FROM medicines
      ORDER BY name ASC
    `)
    .all() as Medicine[];
}

export function createMedicine(
  id: string,
  name: string,
  createdAt: string
): Medicine {
  db.prepare(`
    INSERT INTO medicines (id, name, created_at)
    VALUES (?, ?, ?)
  `).run(id, name, createdAt);

  return {
    id,
    name,
    created_at: createdAt,
  };
}

export function deleteMedicineById(id: string): boolean {
  const result = db
    .prepare(`
      DELETE FROM medicines
      WHERE id = ?
    `)
    .run(id);

  return result.changes > 0;
}

export function updateMedicine(
  id: string,
  name: string
): boolean {
  const result = db
    .prepare(`
      UPDATE medicines
      SET name = ?
      WHERE id = ?
    `)
    .run(name, id);

  return result.changes > 0;
}