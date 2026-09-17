
import { db } from "@/db/database";

export type Payment = {
    id: string;
    patientId: string;
    appointmentId?: string;
    amount: number;
    paymentDate: string;
    notes?: string;
    createdAt: string;
};

type PaymentRow = {
    id: string;
    patient_id: string;
    appointment_id: string | null;
    amount: number;
    payment_date: string;
    notes: string | null;
    created_at: string;
};

function mapPayment(row: PaymentRow): Payment {
    return {
        id: row.id,
        patientId: row.patient_id,
        appointmentId: row.appointment_id ?? undefined,
        amount: row.amount,
        paymentDate: row.payment_date,
        notes: row.notes ?? undefined,
        createdAt: row.created_at,
    };
}

export function getPaymentsByPatientId(patientId: string): Payment[] {
    const rows = db
        .prepare(`
      SELECT
        id,
        patient_id,
        appointment_id,
        amount,
        payment_date,
        notes,
        created_at
      FROM payments
      WHERE patient_id = ?
      ORDER BY payment_date DESC
    `)
        .all(patientId) as PaymentRow[];

    return rows.map(mapPayment);
}

export function createPayment(payment: Payment): void {
    db.prepare(`
    INSERT INTO payments (
      id,
      patient_id,
      appointment_id,
      amount,
      payment_date,
      notes,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
        payment.id,
        payment.patientId,
        payment.appointmentId ?? null,
        payment.amount,
        payment.paymentDate,
        payment.notes ?? null,
        payment.createdAt
    );
}

export function updatePayment(payment: Payment): boolean {
    const result = db
        .prepare(`
      UPDATE payments
      SET
        appointment_id = ?,
        amount = ?,
        payment_date = ?,
        notes = ?
      WHERE id = ?
    `)
        .run(
            payment.appointmentId ?? null,
            payment.amount,
            payment.paymentDate,
            payment.notes ?? null,
            payment.id
        );

    return result.changes > 0;
}

export function deletePayment(id: string): boolean {
    const result = db
        .prepare(`
      DELETE FROM payments
      WHERE id = ?
    `)
        .run(id);

    return result.changes > 0;
}