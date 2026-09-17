
export const dynamic = "force-dynamic";

import { getPatients } from "@/data/patient-repository";
import PatientsClient from "@/components/patients/PatientsClient";

export default function PatientsPage() {
  const patients = getPatients();

  return <PatientsClient initialPatients={patients} />;
}