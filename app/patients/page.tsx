
"use client";
import Link from "next/link";
import { patients as initialPatients } from "@/data/patients";
import { useState } from "react";
import PatientForm from "@/components/patients/PatientForm";

export default function PatientsPage() {
    const [search, setSearch] = useState("");
    const [patients, setPatients] = useState(initialPatients);
    const [showForm, setShowForm] = useState(false);
    const filteredPatients = patients.filter((patient) => 
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Patients</h1>
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="mb-6 rounded-lg border px-4 py-2"
        >
        + Add Patient
      </button>
      {showForm && (
        <PatientForm
            onSubmit={(patient) => {
                setPatients((currentPatients) => [...currentPatients, patient])
                setShowForm(false);
            }}
        />
      )}
      {showForm && (
        <button
            type="button"
            onClick={() => setShowForm(false)}
            className="mb-6 rounded-lg border px-4 py-2"
        >
            Cancel
        </button>
      )}
      <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mb-6 w-full rounded-lg border p-3"
        />
      <p className="mb-6 text-gray-500">{filteredPatients.length} patients found</p>

      <div className="space-y-3">
        {filteredPatients.map((patient) => (
            <div
            key={patient.id}
            className="rounded-xl border p-4 shadow-sm"
            >
            <Link href={`/patients/${patient.id}`} className="font-semibold hover:underline">
                {patient.firstName} {patient.lastName}
            </Link>

            <p className="text-sm text-gray-500">
                {patient.phone}
            </p>
            </div>
        ))}
        </div>
    </main>
  );
}