

"use server";
import { requireSession } from "@/lib/auth";

import { createPatient, deletePatientById } from "@/data/patient-repository";
import type { Patient } from "@/types/patients";

export async function addPatient(patient: Patient) {
  await requireSession();
  createPatient(patient);
}

export async function deletePatient(id: string) {
  await requireSession();
  deletePatientById(id);
}