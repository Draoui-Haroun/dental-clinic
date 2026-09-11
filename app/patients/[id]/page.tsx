
import { patients } from "@/data/patients";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PatientDetailsPage({params,}: {params: Promise<{ id: string }>;}) {
  const { id } = await params;
  const patient = patients.find((patient) => patient.id === id);
  if(!patient) {notFound(); }
  console.log(patient);

  return (
    <main className="p-6">
        <Link href="/patients" className="mb-6 inline-block hover:underline">&larr; Back to Patients</Link>
        <h1 className="text-3xl font-bold">{patient.firstName} {patient.lastName}</h1>
        <p>{patient.phone}</p>
        <p>Date of Birth: {patient.dateOfBirth || "Not provided"}</p>
        <p>Gender: {patient.gender || "Not provided"}</p>
        <p>Address: {patient.address || "Not provided"}</p>
        <p>Notes: {patient.notes || "No notes"}</p>
    </main>
 );
}