
import type { Patient } from "@/types/patients";
import { db } from "@/db/database";

type PatientRow = {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    date_of_birth: string | null;
    gender: "male" | "female" | null;
    address: string | null;
    notes: string | null;
    created_at: string;
};

function mapPatientRow(row: PatientRow): Patient {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    dateOfBirth: row.date_of_birth ?? undefined,
    gender: row.gender ?? undefined,
    address: row.address ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

export function getPatientById(id: string): Patient | undefined {
    const row = db
        .prepare("SELECT * FROM patients WHERE id = ?")
        .get(id) as PatientRow | undefined;

    if (!row) {
        return undefined;
    }

    return mapPatientRow(row);
}

export function getPatients(): Patient[] {
  const rows = db
    .prepare("SELECT * FROM patients ORDER BY created_at DESC")
    .all() as PatientRow[];

  return rows.map(mapPatientRow);
}

export function createPatient(patient: Patient): void {
    db.prepare(`
    INSERT OR IGNORE INTO patients (
      id,
      first_name,
      last_name,
      phone,
      date_of_birth,
      gender,
      address,
      notes,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        patient.id,
        patient.firstName,
        patient.lastName,
        patient.phone,
        patient.dateOfBirth ?? null,
        patient.gender ?? null,
        patient.address ?? null,
        patient.notes ?? null,
        patient.createdAt
    );
}

export function updatePatientById(patient: Patient): boolean {
  const result = db
    .prepare("SELECT id FROM patients WHERE id = ?")
    .get(patient.id);

  if (!result) {
    return false;
  }

  db.prepare(`
    UPDATE patients
    SET
        first_name = ?,
        last_name = ?,
        phone = ?,
        date_of_birth = ?,
        gender = ?,
        address = ?,
        notes = ?
    WHERE id = ?
    `).run(
    patient.firstName,
    patient.lastName,
    patient.phone,
    patient.dateOfBirth ?? null,
    patient.gender ?? null,
    patient.address ?? null,
    patient.notes ?? null,
    patient.id
    );

  return true;
}