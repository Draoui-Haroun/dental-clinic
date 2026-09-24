
"use server";

import {
    addPrescriptionItem,
    createOrdonnance,
    deleteOrdonnanceById,
    deletePrescriptionItemById,
    createOrdonnanceWithItems as createOrdonnanceWithItemsRepository,
} from "@/data/ordonnance-repository";

export async function addOrdonnance(
    id: string,
    patientId: string,
    date: string,
    createdAt: string
) {
    return createOrdonnance(
        id,
        patientId,
        date,
        createdAt
    );
}

export async function addOrdonnanceItem(
    id: string,
    ordonnanceId: string,
    medicineId: string,
    dosage: string | null,
    posology: string | null,
    duration: string | null
) {
    return addPrescriptionItem(
        id,
        ordonnanceId,
        medicineId,
        dosage,
        posology,
        duration
    );
}

export async function createOrdonnanceWithItems(
    ordonnanceId: string,
    patientId: string,
    date: string,
    createdAt: string,
    items: {
        id: string;
        medicineId: string;
        dosage: string | null;
        posology: string | null;
        duration: string | null;
    }[]
) {
    console.log("SERVER ACTION patientId:", patientId);

    return createOrdonnanceWithItemsRepository(
        ordonnanceId,
        patientId,
        date,
        createdAt,
        items
    );
}

export async function deleteOrdonnance(
    id: string
) {
    return deleteOrdonnanceById(id);
}

export async function deleteOrdonnanceItem(
    id: string
) {
    return deletePrescriptionItemById(id);
}