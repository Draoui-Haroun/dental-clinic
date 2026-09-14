

import { getPatientById } from "@/data/patient-repository";
import { notFound } from "next/navigation";
import EditPatientForm from "@/components/patients/EditPatientForm";

export default async function EditPatientPage({ params }: { params: Promise<{ id: string }>; }) {
  const { id } = await params;
  const patient = getPatientById(id);
  if (!patient) { notFound(); }

  return (
    <main className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Modifier le patient
      </h1>

      <EditPatientForm patient={patient} />
    </main>
  );
}