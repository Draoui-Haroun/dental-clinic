
import { patients } from "@/data/patients";
import { services } from "@/data/services";
import { appointments } from "@/data/appointments";
import { medicalRecords } from "@/data/medical-record";

import { createPatient } from "@/data/patient-repository";
import { createService } from "@/data/service-repository";
import { createAppointment } from "@/data/appointment-repository";
import { createMedicalRecord } from "@/data/medical-record-repository";

for (const patient of patients) {
  createPatient(patient);
}

for (const service of services) {
  createService(service);
}

for (const appointment of appointments) {
  createAppointment(appointment);
}

for (const record of medicalRecords) {
  createMedicalRecord(record);
}

console.log("Database seeded successfully");