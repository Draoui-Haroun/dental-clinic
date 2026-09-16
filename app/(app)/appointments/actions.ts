
"use server";

import {
  createAppointment,
  updateAppointmentById,
  updateAppointmentStatus,
  deleteAppointmentById,
} from "@/data/appointment-repository";
import { requireSession } from "@/lib/auth";

import type { Appointment } from "@/types/appointments";

export async function addAppointment(appointment: Appointment) {
  await requireSession();
  createAppointment(appointment);
}

export async function editAppointment(appointment: Appointment) {
  await requireSession();
  return updateAppointmentById(appointment);
}

export async function changeAppointmentStatus(id: string, status: Appointment["status"]) {
  await requireSession();
  return updateAppointmentStatus(id, status);
}

export async function deleteAppointment(id: string) {
  await requireSession();

  return deleteAppointmentById(id);
}