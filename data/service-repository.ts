import type { Service } from "@/types/services";
import { db } from "@/db/database";

type ServiceRow = {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  created_at: string;
};

function mapServiceRow(row: ServiceRow): Service {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    duration: row.duration,
    price: row.price,
    createdAt: row.created_at,
  };
}

export function getServices(): Service[] {
  const rows = db
    .prepare(
      "SELECT * FROM services ORDER BY created_at DESC"
    )
    .all() as ServiceRow[];

  return rows.map(mapServiceRow);
}

export function getServiceById(
  id: string
): Service | undefined {
  const row = db
    .prepare(
      "SELECT * FROM services WHERE id = ?"
    )
    .get(id) as ServiceRow | undefined;

  if (!row) {
    return undefined;
  }

  return mapServiceRow(row);
}

export function createService(
  service: Service
): void {
  db.prepare(`
    INSERT OR IGNORE INTO services (
      id,
      name,
      description,
      duration,
      price,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    service.id,
    service.name,
    service.description ?? null,
    service.duration,
    service.price,
    service.createdAt
  );
}

export function updateServiceById(
  service: Service
): boolean {
  const result = db
    .prepare(
      "SELECT id FROM services WHERE id = ?"
    )
    .get(service.id);

  if (!result) {
    return false;
  }

  db.prepare(`
    UPDATE services
    SET
      name = ?,
      description = ?,
      duration = ?,
      price = ?
    WHERE id = ?
  `).run(
    service.name,
    service.description ?? null,
    service.duration,
    service.price,
    service.id
  );

  return true;
}

export function deleteServiceById(
  id: string
): boolean {
  const appointment = db
    .prepare(`
      SELECT id
      FROM appointments
      WHERE service_id = ?
      LIMIT 1
    `)
    .get(id);

  if (appointment) {
    return false;
  }

  const result = db
    .prepare(
      "DELETE FROM services WHERE id = ?"
    )
    .run(id);

  return result.changes > 0;
}