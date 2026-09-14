
"use server";
import {
  createMedicalRecord,
  updateMedicalRecordById,
  deleteMedicalRecordById,
} from "@/data/medical-record-repository";
import { requireSession } from "@/lib/auth";
import type { MedicalRecord } from "@/types/medical-recordes";

export async function addMedicalRecord(record: MedicalRecord) {
  await requireSession();
  createMedicalRecord(record);
}

export async function editMedicalRecord(record: MedicalRecord) {
  await requireSession();
  return updateMedicalRecordById(record);
}

export async function deleteMedicalRecord(id: string) {
  await requireSession();
  return deleteMedicalRecordById(id);
}