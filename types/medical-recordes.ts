
export type MedicalRecord = {
  id: string;
  patientId: string;
  appointmentId: string;
  diagnosis: string;
  treatment?: string;
  notes?: string;
  createdAt: string;
};