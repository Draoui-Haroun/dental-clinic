
import type { Appointment } from "@/types/appointments";

export const appointments: Appointment[] = [
  {
    id: "a1",
    patientId: "p1",
    serviceId: "s1",
    date: "2026-09-11",
    time: "09:00",
    status: "scheduled",
    notes: "Regular cleaning appointment",
    createdAt: "2026-09-10",
  },
  {
    id: "a2",
    patientId: "p1",
    serviceId: "s2",
    date: "2026-09-12",
    time: "10:30",
    status: "scheduled",
    createdAt: "2026-09-10",
  },
];