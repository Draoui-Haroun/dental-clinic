
import { db } from "@/db/database";
import type { Ordonnance } from "@/types/ordonnances";

export function getOrdonnancesByPatientId(
    patientId: string
): Ordonnance[] {
    return db
        .prepare(`
      SELECT *
      FROM ordonnances
      WHERE patient_id = ?
      ORDER BY date DESC, created_at DESC
    `)
        .all(patientId) as Ordonnance[];
}

export function createOrdonnance(
    id: string,
    patientId: string,
    date: string,
    createdAt: string
): Ordonnance {
    db.prepare(`
    INSERT INTO ordonnances (
      id,
      patient_id,
      date,
      created_at
    )
    VALUES (?, ?, ?, ?)
  `).run(
        id,
        patientId,
        date,
        createdAt
    );

    return {
        id,
        patient_id: patientId,
        date,
        created_at: createdAt,
    };
}

export function deleteOrdonnanceById(
    id: string
): boolean {
    const deleteTransaction = db.transaction(() => {
        db.prepare(`
            DELETE FROM prescription_items
            WHERE ordonnance_id = ?
        `).run(id);

        const result = db
            .prepare(`
                DELETE FROM ordonnances
                WHERE id = ?
            `)
            .run(id);

        return result.changes > 0;
    });

    return deleteTransaction();
}

export type PrescriptionItemWithMedicine = {
    id: string;
    ordonnance_id: string;
    medicine_id: string;
    dosage: string | null;
    posology: string | null;
    duration: string | null;
    medicine_name: string;
};

export function getPrescriptionItems(
    ordonnanceId: string
): PrescriptionItemWithMedicine[] {
    return db
        .prepare(`
      SELECT
        prescription_items.id,
        prescription_items.ordonnance_id,
        prescription_items.medicine_id,
        prescription_items.dosage,
        prescription_items.posology,
        prescription_items.duration,
        medicines.name AS medicine_name
      FROM prescription_items
      INNER JOIN medicines
        ON medicines.id = prescription_items.medicine_id
      WHERE prescription_items.ordonnance_id = ?
      ORDER BY prescription_items.rowid ASC
    `)
        .all(ordonnanceId) as PrescriptionItemWithMedicine[];
}

export function addPrescriptionItem(
    id: string,
    ordonnanceId: string,
    medicineId: string,
    dosage: string | null,
    posology: string | null,
    duration: string | null
): PrescriptionItemWithMedicine {
    db.prepare(`
    INSERT INTO prescription_items (
      id,
      ordonnance_id,
      medicine_id,
      dosage,
      posology,
      duration
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
        id,
        ordonnanceId,
        medicineId,
        dosage,
        posology,
        duration
    );

    return db
        .prepare(`
      SELECT
        prescription_items.id,
        prescription_items.ordonnance_id,
        prescription_items.medicine_id,
        prescription_items.dosage,
        prescription_items.posology,
        prescription_items.duration,
        medicines.name AS medicine_name
      FROM prescription_items
      INNER JOIN medicines
        ON medicines.id = prescription_items.medicine_id
      WHERE prescription_items.id = ?
    `)
        .get(id) as PrescriptionItemWithMedicine;
}

export function deletePrescriptionItemById(
    id: string
): boolean {
    const result = db
        .prepare(`
      DELETE FROM prescription_items
      WHERE id = ?
    `)
        .run(id);

    return result.changes > 0;
}

type PrescriptionItemInput = {
    id: string;
    medicineId: string;
    dosage: string | null;
    posology: string | null;
    duration: string | null;
};

export function createOrdonnanceWithItems(
    ordonnanceId: string,
    patientId: string,
    date: string,
    createdAt: string,
    items: PrescriptionItemInput[]
): Ordonnance {
    const create = db.transaction(() => {
        db.prepare(`
      INSERT INTO ordonnances (
        id,
        patient_id,
        date,
        created_at
      )
      VALUES (?, ?, ?, ?)
    `).run(
            ordonnanceId,
            patientId,
            date,
            createdAt
        );

        const insertItem = db.prepare(`
      INSERT INTO prescription_items (
        id,
        ordonnance_id,
        medicine_id,
        dosage,
        posology,
        duration
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        for (const item of items) {
            insertItem.run(
                item.id,
                ordonnanceId,
                item.medicineId,
                item.dosage,
                item.posology,
                item.duration
            );
        }
    });

    create();

    return {
        id: ordonnanceId,
        patient_id: patientId,
        date,
        created_at: createdAt,
    };
}

export type OrdonnanceWithItems = Ordonnance & {
    items: PrescriptionItemWithMedicine[];
};

export function getOrdonnancesWithItemsByPatientId(
    patientId: string
): OrdonnanceWithItems[] {
    const ordonnances = getOrdonnancesByPatientId(
        patientId
    );

    return ordonnances.map((ordonnance) => ({
        ...ordonnance,
        items: getPrescriptionItems(ordonnance.id),
    }));
}

export function getOrdonnanceWithItemsById(
    id: string
): OrdonnanceWithItems | null {
    const ordonnance = db
        .prepare(`
      SELECT *
      FROM ordonnances
      WHERE id = ?
    `)
        .get(id) as Ordonnance | undefined;

    if (!ordonnance) {
        return null;
    }

    return {
        ...ordonnance,
        items: getPrescriptionItems(ordonnance.id),
    };
}

export type OrdonnanceDetails = OrdonnanceWithItems & {
    patient: {
        id: string;
        first_name: string;
        last_name: string;
        date_of_birth: string | null;
    };
};

export function getOrdonnanceDetailsById(
    id: string
): OrdonnanceDetails | null {
    const ordonnance = db
        .prepare(`
      SELECT
        ordonnances.id,
        ordonnances.patient_id,
        ordonnances.date,
        ordonnances.created_at,
        patients.id AS patient_id_value,
        patients.first_name,
        patients.last_name,
        patients.date_of_birth
      FROM ordonnances
      INNER JOIN patients
        ON patients.id = ordonnances.patient_id
      WHERE ordonnances.id = ?
    `)
        .get(id) as
        | {
            id: string;
            patient_id: string;
            date: string;
            created_at: string;
            patient_id_value: string;
            first_name: string;
            last_name: string;
            date_of_birth: string | null;
        }
        | undefined;

    if (!ordonnance) {
        return null;
    }

    return {
        id: ordonnance.id,
        patient_id: ordonnance.patient_id,
        date: ordonnance.date,
        created_at: ordonnance.created_at,
        items: getPrescriptionItems(ordonnance.id),
        patient: {
            id: ordonnance.patient_id_value,
            first_name: ordonnance.first_name,
            last_name: ordonnance.last_name,
            date_of_birth: ordonnance.date_of_birth,
        },
    };
}