
export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled";

export type Appointment = {
  id: string;
  patientId: string;
  serviceId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
};