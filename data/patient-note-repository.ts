
import { db } from "@/db/database";

export type PatientNote = {
  id: string;
  patientId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
};

type PatientNoteRow = {
  id: string;
  patient_id: string;
  content: string;
  created_at: string;
  updated_at: string | null;
};

function mapPatientNote(row: PatientNoteRow): PatientNote {
  return {
    id: row.id,
    patientId: row.patient_id,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

export function getNotesByPatientId(
  patientId: string
): PatientNote[] {
  const rows = db
    .prepare(`
      SELECT
        id,
        patient_id,
        content,
        created_at,
        updated_at
      FROM patient_notes
      WHERE patient_id = ?
      ORDER BY created_at DESC
    `)
    .all(patientId) as PatientNoteRow[];

  return rows.map(mapPatientNote);
}

export function createPatientNote(
  note: PatientNote
): void {
  db.prepare(`
    INSERT INTO patient_notes (
      id,
      patient_id,
      content,
      created_at
    )
    VALUES (?, ?, ?, ?)
  `).run(
    note.id,
    note.patientId,
    note.content,
    note.createdAt
  );
}

export function updatePatientNote(
  id: string,
  content: string
): boolean {
  const result = db
    .prepare(`
      UPDATE patient_notes
      SET content = ?,
          updated_at = ?
      WHERE id = ?
    `)
    .run(
      content,
      new Date().toISOString(),
      id
    );

  return result.changes > 0;
}

export function deletePatientNote(
  id: string
): boolean {
  const result = db
    .prepare(`
      DELETE FROM patient_notes
      WHERE id = ?
    `)
    .run(id);

  return result.changes > 0;
}