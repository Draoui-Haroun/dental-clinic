
import type { MedicalRecord } from "@/types/medical-recordes";
import { db } from "@/db/database";

type MedicalRecordRow = {
  id: string;
  patient_id: string;
  appointment_id: string;
  diagnosis: string;
  treatment: string | null;
  notes: string | null;
  created_at: string;
};

function mapMedicalRecordRow(row: MedicalRecordRow): MedicalRecord {
  return {
    id: row.id,
    patientId: row.patient_id,
    appointmentId: row.appointment_id,
    diagnosis: row.diagnosis,
    treatment: row.treatment ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

export function getMedicalRecords(): MedicalRecord[] {
  const rows = db
    .prepare(
      "SELECT * FROM medical_records ORDER BY created_at DESC"
    )
    .all() as MedicalRecordRow[];

  return rows.map(mapMedicalRecordRow);
}

export function getMedicalRecordById(
  id: string
): MedicalRecord | undefined {
  const row = db
    .prepare(
      "SELECT * FROM medical_records WHERE id = ?"
    )
    .get(id) as MedicalRecordRow | undefined;

  if (!row) {
    return undefined;
  }

  return mapMedicalRecordRow(row);
}

export function createMedicalRecord(
  record: MedicalRecord
): void {
  db.prepare(`
    INSERT OR IGNORE INTO medical_records (
      id,
      patient_id,
      appointment_id,
      diagnosis,
      treatment,
      notes,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    record.id,
    record.patientId,
    record.appointmentId,
    record.diagnosis,
    record.treatment ?? null,
    record.notes ?? null,
    record.createdAt
  );
}

export function updateMedicalRecordById(
  record: MedicalRecord
): boolean {
  const result = db
    .prepare(
      "SELECT id FROM medical_records WHERE id = ?"
    )
    .get(record.id);

  if (!result) {
    return false;
  }

  db.prepare(`
    UPDATE medical_records
    SET
      patient_id = ?,
      appointment_id = ?,
      diagnosis = ?,
      treatment = ?,
      notes = ?
    WHERE id = ?
  `).run(
    record.patientId,
    record.appointmentId,
    record.diagnosis,
    record.treatment ?? null,
    record.notes ?? null,
    record.id
  );

  return true;
}

export function deleteMedicalRecordById(
  id: string
): boolean {
  const result = db
    .prepare(
      "DELETE FROM medical_records WHERE id = ?"
    )
    .run(id);

  return result.changes > 0;
}