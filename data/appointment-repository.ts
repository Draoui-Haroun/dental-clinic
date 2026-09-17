
import type { Appointment } from "@/types/appointments";
import { db } from "@/db/database";

type AppointmentRow = {
    id: string;
    patient_id: string;
    service_id: string;
    date: string;
    time: string;
    status: "scheduled" | "completed" | "cancelled";
    notes: string | null;
    created_at: string;
};

function mapAppointmentRow(row: AppointmentRow): Appointment {
    return {
        id: row.id,
        patientId: row.patient_id,
        serviceId: row.service_id,
        date: row.date,
        time: row.time,
        status: row.status,
        notes: row.notes ?? undefined,
        createdAt: row.created_at,
    };
}

export function getAppointments(): Appointment[] {
    const rows = db
        .prepare("SELECT * FROM appointments ORDER BY date ASC, time ASC")
        .all() as AppointmentRow[];

    return rows.map(mapAppointmentRow);
}

export function createAppointment(appointment: Appointment): void {
  console.log("CREATING APPOINTMENT:", {
    id: appointment.id,
    patientId: appointment.patientId,
    serviceId: appointment.serviceId,
  });

  console.log(
    "PATIENT EXISTS:",
    db.prepare("SELECT id FROM patients WHERE id = ?")
      .get(appointment.patientId)
  );

  console.log(
    "SERVICE EXISTS:",
    db.prepare("SELECT id FROM services WHERE id = ?")
      .get(appointment.serviceId)
  );

  db.prepare(`
    INSERT INTO appointments (
      id,
      patient_id,
      service_id,
      date,
      time,
      status,
      notes,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    appointment.id,
    appointment.patientId,
    appointment.serviceId,
    appointment.date,
    appointment.time,
    appointment.status,
    appointment.notes ?? null,
    appointment.createdAt
  );
}

export function updateAppointmentById(
  appointment: Appointment
): boolean {
  const result = db
    .prepare("SELECT id FROM appointments WHERE id = ?")
    .get(appointment.id);

  if (!result) {
    return false;
  }

  db.prepare(`
    UPDATE appointments
    SET
      patient_id = ?,
      service_id = ?,
      date = ?,
      time = ?,
      status = ?,
      notes = ?
    WHERE id = ?
  `).run(
    appointment.patientId,
    appointment.serviceId,
    appointment.date,
    appointment.time,
    appointment.status,
    appointment.notes ?? null,
    appointment.id
  );

  return true;
}

export function updateAppointmentStatus(
  id: string,
  status: Appointment["status"]
): boolean {
  const result = db
    .prepare("SELECT id FROM appointments WHERE id = ?")
    .get(id);

  if (!result) {
    return false;
  }

  db.prepare(`
    UPDATE appointments
    SET status = ?
    WHERE id = ?
  `).run(status, id);

  return true;
}

export function deleteAppointmentsByPatientId(
  patientId: string
): void {
  db.prepare(
    "DELETE FROM appointments WHERE patient_id = ?"
  ).run(patientId);
}

export function deleteAppointmentById(
  id: string
): boolean {
  const result = db
    .prepare("SELECT id FROM appointments WHERE id = ?")
    .get(id);

  if (!result) {
    return false;
  }

  db.prepare(
    "DELETE FROM appointments WHERE id = ?"
  ).run(id);

  return true;
}