
import { patients } from "@/data/patients";
import { createPatient } from "@/data/patient-repository";

for (const patient of patients) {
  createPatient(patient);
}

console.log("Patients seeded successfully");