
"use client";
import { useState } from "react";
import Link from "next/link";
import type { Patient } from "@/types/patients";
import type { Appointment } from "@/types/appointments";
import type { Service } from "@/types/services";
import type { MedicalRecord } from "@/types/medical-recordes";
import MedicalRecordForm from "@/components/patients/MedicalRecordForm";
import {
  addMedicalRecord,
  editMedicalRecord,
  deleteMedicalRecord,
} from "@/app/patients/[id]/medical-record-actions";

type PatientDetailsClientProps = {
  patient: Patient;
  initialMedicalRecords: MedicalRecord[];
  appointments: Appointment[];
  services: Service[];
};

export default function PatientDetailsClient({
  patient,
  initialMedicalRecords,
  appointments,
  services,
}: PatientDetailsClientProps) {
  const [medicalRecords, setMedicalRecords] = useState(
    initialMedicalRecords
  );

  const [showRecordForm, setShowRecordForm] =
    useState(false);

  const [editingRecordId, setEditingRecordId] =
    useState<string | null>(null);

  async function handleAddRecord(
    record: MedicalRecord
  ) {
    await addMedicalRecord(record);

    setMedicalRecords((currentRecords) => [
      record,
      ...currentRecords,
    ]);

    setShowRecordForm(false);
  }

  async function handleEditRecord(
    record: MedicalRecord
  ) {
    await editMedicalRecord(record);

    setMedicalRecords((currentRecords) =>
      currentRecords.map((currentRecord) =>
        currentRecord.id === record.id
          ? record
          : currentRecord
      )
    );

    setEditingRecordId(null);
  }

  async function handleDeleteRecord(id: string) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce dossier médical ?"
    );

    if (!confirmed) {
      return;
    }

    await deleteMedicalRecord(id);

    setMedicalRecords((currentRecords) =>
      currentRecords.filter(
        (record) => record.id !== id
      )
    );
  }

  function getStatusLabel(
    status: Appointment["status"]
  ) {
    if (status === "completed") {
      return "Terminé";
    }

    if (status === "cancelled") {
      return "Annulé";
    }

    return "Planifié";
  }

  function getStatusClass(
    status: Appointment["status"]
  ) {
    if (status === "completed") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (status === "cancelled") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("fr-FR").format(
      new Date(date)
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      
      <Link
        href="/patients"
        className="mb-6 inline-flex items-center text-sm font-medium text-gray-300 transition hover:text-gray-900"
      >
        ← Retour aux patients
      </Link>

      <section className="mb-8 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-700">
              {patient.firstName.charAt(0)}
              {patient.lastName.charAt(0)}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Fiche patient
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {patient.firstName} {patient.lastName}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {patient.phone}
              </p>
            </div>
          </div>

          <Link
            href={`/patients/${patient.id}/edit`}
            className="w-fit rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Modifier le patient
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Informations personnelles
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Informations générales du patient.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">
              Prénom
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {patient.firstName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Nom
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {patient.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Téléphone
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {patient.phone}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Date de naissance
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {patient.dateOfBirth || "Non renseignée"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Sexe
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {patient.gender === "male"
                ? "Homme"
                : patient.gender === "female"
                ? "Femme"
                : "Non renseigné"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Adresse
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {patient.address || "Non renseignée"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Notes
          </h2>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
            {patient.notes || "Aucune note pour ce patient."}
          </p>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-200">
              Dossier médical
            </h2>

            <p className="mt-1 text-sm text-gray-300">
              Historique des diagnostics et traitements.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowRecordForm((current) => !current)
            }
            className="w-fit rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            {showRecordForm
              ? "Fermer"
              : "+ Ajouter un dossier"}
          </button>
        </div>

        {showRecordForm && (
          <div className="mb-6 rounded-2xl border bg-gray-50 p-5 shadow-sm sm:p-6">
            <MedicalRecordForm
              patientId={patient.id}
              appointments={appointments}
              onSubmit={handleAddRecord}
              onCancel={() => setShowRecordForm(false)}
            />
          </div>
        )}

        {medicalRecords.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <p className="font-medium text-gray-700">
              Aucun dossier médical.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Ajoutez un dossier médical après une consultation.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {medicalRecords.map((record) => {
              if (
                editingRecordId === record.id
              ) {
                return (
                  <div
                    key={record.id}
                    className="rounded-2xl border bg-gray-50 p-5 shadow-sm sm:p-6"
                  >
                    <MedicalRecordForm
                      patientId={patient.id}
                      appointments={appointments}
                      initialRecord={record}
                      onSubmit={handleEditRecord}
                      onCancel={() =>
                        setEditingRecordId(null)
                      }
                    />
                  </div>
                );
              }

              const appointment =
                appointments.find(
                  (item) =>
                    item.id ===
                    record.appointmentId
                );

              return (
                <div
                  key={record.id}
                  className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {record.diagnosis}
                      </p>

                      {appointment && (
                        <p className="mt-1 text-sm text-gray-500">
                          Consultation du{" "}
                          {appointment.date} à{" "}
                          {appointment.time}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Traitement
                      </p>

                      <p className="mt-1 text-sm text-gray-800">
                        {record.treatment ||
                          "Non renseigné"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Notes
                      </p>

                      <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
                        {record.notes ||
                          "Aucune note"}
                      </p>
                    </div>

                    <p className="text-xs text-gray-400">
                      Créé le {formatDate(record.createdAt)}
                    </p>
                  </div>

                  <div className="mt-5 flex gap-2 border-t pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingRecordId(
                          record.id
                        )
                      }
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Modifier
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteRecord(
                          record.id
                        )
                      }
                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-200">
            Rendez-vous
          </h2>

          <p className="mt-1 text-sm text-gray-300">
            Historique des rendez-vous de ce patient.
          </p>
        </div>

        {appointments.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <p className="font-medium text-gray-700">
              Aucun rendez-vous.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Aucun rendez-vous n&apos;a encore été enregistré.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => {
              const service = services.find(
                (service) =>
                  service.id ===
                  appointment.serviceId
              );

              return (
                <div
                  key={appointment.id}
                  className="rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {service?.name ||
                          "Prestation inconnue"}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {appointment.date} à{" "}
                        {appointment.time}
                      </p>

                      {appointment.notes && (
                        <p className="mt-2 text-sm text-gray-600">
                          {appointment.notes}
                        </p>
                      )}
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-sm font-medium ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {getStatusLabel(
                        appointment.status
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
