
"use server";

import {
  createMedicalRecord,
  updateMedicalRecordById,
  deleteMedicalRecordById,
} from "@/data/medical-record-repository";

import type { MedicalRecord } from "@/types/medical-recordes";

export async function addMedicalRecord(
  record: MedicalRecord
) {
  createMedicalRecord(record);
}

export async function editMedicalRecord(
  record: MedicalRecord
) {
  return updateMedicalRecordById(record);
}

export async function deleteMedicalRecord(
  id: string
) {
  return deleteMedicalRecordById(id);
}