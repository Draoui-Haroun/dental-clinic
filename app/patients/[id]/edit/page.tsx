
import { getPatientById } from "@/data/patient-repository";
import { notFound } from "next/navigation";
import EditPatientForm from "@/components/patients/EditPatientForm";

export default async function EditPatientPage({params}: {params: Promise<{ id: string }>;}) {
  const { id } = await params;
  const patient = getPatientById(id);
  if(!patient) {notFound(); }

  return (
    <main className="p-6">
        <h1 className="text-3xl font-bold">Edit patient</h1>
        <EditPatientForm
            patient={patient}
        />
    </main>
  );
}