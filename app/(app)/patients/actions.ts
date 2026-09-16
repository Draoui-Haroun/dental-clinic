

"use server";
import { requireSession } from "@/lib/auth";
import {
  createPatientNote,
  updatePatientNote,
  deletePatientNote,
} from "@/data/patient-note-repository";
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

export async function addPatientNote(
  note: {
    id: string;
    patientId: string;
    content: string;
    createdAt: string;
  }) {
  await requireSession();
  createPatientNote(note);
}

export async function editPatientNote(id: string, content: string) {
  await requireSession();
  return updatePatientNote(id, content);
}

export async function removePatientNote(id: string) {
  await requireSession();
  return deletePatientNote(id);
}