
import { patients } from "@/data/patients";
import { notFound } from "next/navigation";
import EditPatientForm from "@/components/patients/EditPatientForm";

export default async function EditPatientPage({params}: {params: Promise<{ id: string }>;}) {
  const { id } = await params;
  const patient = patients.find((patient) => patient.id === id);
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