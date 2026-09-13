
"use server";

import { createPatient } from "@/data/patient-repository";
import type { Patient } from "@/types/patients";

export async function addPatient(patient: Patient) {
  createPatient(patient);
}