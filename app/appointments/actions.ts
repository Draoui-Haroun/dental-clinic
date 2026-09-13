
"use server";

import {
  createAppointment,
  updateAppointmentById,
  updateAppointmentStatus,
} from "@/data/appointment-repository";

import type { Appointment } from "@/types/appointments";

export async function addAppointment(
  appointment: Appointment
) {
  createAppointment(appointment);
}

export async function editAppointment(
  appointment: Appointment
) {
  return updateAppointmentById(appointment);
}

export async function changeAppointmentStatus(
  id: string,
  status: Appointment["status"]
) {
  return updateAppointmentStatus(id, status);
}