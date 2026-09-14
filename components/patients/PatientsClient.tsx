
"use client";

import Link from "next/link";
import { useState } from "react";
import PatientForm from "@/components/patients/PatientForm";
import { addPatient } from "@/app/(app)/patients/action";
import type { Patient } from "@/types/patients";

type PatientsClientProps = {
  initialPatients: Patient[];
};

export default function PatientsClient({
  initialPatients,
}: PatientsClientProps) {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState(initialPatients);
  const [showForm, setShowForm] = useState(false);

  const filteredPatients = patients.filter((patient) => {
    const fullName =
      `${patient.firstName} ${patient.lastName}`.toLowerCase();

    return fullName.includes(search.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
      
      <section className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Gestion du cabinet
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Patients
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Consultez et gérez les fiches de vos patients.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-fit rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            + Ajouter un patient
          </button>
        </div>
      </section>

      {showForm && (
        <section className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Ajouter un patient
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Renseignez les informations du patient.
            </p>
          </div>

          <PatientForm
            onSubmit={async (patient) => {
              await addPatient(patient);

              setPatients((currentPatients) => [
                ...currentPatients,
                patient,
              ]);

              setShowForm(false);
            }}
          />

          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="mt-3 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Annuler
          </button>
        </section>
      )}

      <section className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un patient..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-800"
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredPatients.length}{" "}
            {filteredPatients.length === 1
              ? "patient trouvé"
              : "patients trouvés"}
          </p>
        </div>
      </section>

      {filteredPatients.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="font-medium text-gray-700 dark:text-gray-200">
            Aucun patient trouvé.
          </p>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Essayez une autre recherche ou ajoutez un nouveau patient.
          </p>
        </div>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredPatients.map((patient) => (
              <Link
                key={patient.id}
                href={`/patients/${patient.id}`}
                className="block p-5 transition hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {patient.firstName.charAt(0)}
                      {patient.lastName.charAt(0)}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {patient.firstName}{" "}
                        {patient.lastName}
                      </p>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {patient.phone}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Voir la fiche →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}