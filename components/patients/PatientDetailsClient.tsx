
"use client";
import { useState } from "react";
import Link from "next/link";
import type { Patient } from "@/types/patients";
import type { Appointment } from "@/types/appointments";
import type { Service } from "@/types/services";
import type { MedicalRecord } from "@/types/medical-recordes";
import MedicalRecordForm from "@/components/patients/MedicalRecordForm";
import { addMedicalRecord, editMedicalRecord, deleteMedicalRecord } from "@/app/(app)/patients/[id]/medical-record-actions";
import { useRouter } from "next/navigation";
import { deletePatient, addPatientNote, editPatientNote, removePatientNote } from "@/app/(app)/patients/actions";
import type { PatientNote } from "@/data/patient-note-repository";
import {

} from "@/app/(app)/patients/actions";

type PatientDetailsClientProps = {
  patient: Patient;
  initialMedicalRecords: MedicalRecord[];
  appointments: Appointment[];
  services: Service[];
  notes: PatientNote[];
};

export default function PatientDetailsClient({
  patient,
  initialMedicalRecords,
  appointments,
  services,
  notes,
}: PatientDetailsClientProps) {
  const [medicalRecords, setMedicalRecords] = useState(
    initialMedicalRecords
  );

  const [showRecordForm, setShowRecordForm] =
    useState(false);

  const [editingRecordId, setEditingRecordId] =
    useState<string | null>(null);

  const [patientNotes, setPatientNotes] =
    useState<PatientNote[]>(notes);

  const [newNote, setNewNote] = useState("");

  const [editingNoteId, setEditingNoteId] =
    useState<string | null>(null);

  const [editingNoteContent, setEditingNoteContent] =
    useState("");

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
      return "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400";
    }

    if (status === "cancelled") {
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400";
    }

    return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400";
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("fr-FR").format(
      new Date(date)
    );
  }

  const router = useRouter();

  async function handleDeletePatient() {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible."
    );

    if (!confirmed) {
      return;
    }

    await deletePatient(patient.id);
    router.push("/patients");
  }

  async function handleAddNote() {
    const content = newNote.trim();

    if (!content) {
      return;
    }

    const note: PatientNote = {
      id: crypto.randomUUID(),
      patientId: patient.id,
      content,
      createdAt: new Date().toISOString(),
    };

    await addPatientNote(note);

    setPatientNotes((currentNotes) => [
      note,
      ...currentNotes,
    ]);

    setNewNote("");
  }

  async function handleEditNote(
    id: string
  ) {
    const content = editingNoteContent.trim();

    if (!content) {
      return;
    }

    const updated = await editPatientNote(
      id,
      content
    );

    if (!updated) {
      return;
    }

    setPatientNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? {
            ...note,
            content,
            updatedAt: new Date().toISOString(),
          }
          : note
      )
    );

    setEditingNoteId(null);
    setEditingNoteContent("");
  }

  async function handleDeleteNote(
    id: string
  ) {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette note ?"
    );

    if (!confirmed) {
      return;
    }

    const deleted = await removePatientNote(id);

    if (!deleted) {
      return;
    }

    setPatientNotes((currentNotes) =>
      currentNotes.filter(
        (note) => note.id !== id
      )
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">

      <Link
        href="/patients"
        className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        ← Retour aux patients
      </Link>

      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {patient.firstName.charAt(0)}
              {patient.lastName.charAt(0)}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Fiche patient
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                {patient.firstName} {patient.lastName}
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {patient.phone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/patients/${patient.id}/edit`}
              className="w-fit rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Modifier le patient
            </Link>

            <button
              type="button"
              onClick={handleDeletePatient}
              className="w-fit rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950"
            >
              Supprimer le patient
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Informations personnelles
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Informations générales du patient.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Prénom
            </p>

            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {patient.firstName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nom
            </p>

            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {patient.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Téléphone
            </p>

            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {patient.phone}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Date de naissance
            </p>

            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {patient.dateOfBirth || "Non renseignée"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sexe
            </p>

            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {patient.gender === "male"
                ? "Homme"
                : patient.gender === "female"
                  ? "Femme"
                  : "Non renseigné"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Adresse
            </p>

            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {patient.address || "Non renseignée"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notes du patient
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ajoutez des observations ou des informations importantes
            concernant ce patient.
          </p>
        </div>

        {/* Add new note */}
        <div className="space-y-3">
          <textarea
            value={newNote}
            onChange={(event) =>
              setNewNote(event.target.value)
            }
            placeholder="Écrire une nouvelle note..."
            rows={4}
            className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 dark:focus:ring-gray-700"
          />

          <button
            type="button"
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Ajouter la note
          </button>
        </div>

        {/* Notes history */}
        <div className="mt-8 space-y-4">
          {patientNotes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aucune note pour ce patient.
              </p>
            </div>
          ) : (
            patientNotes.map((note) => {
              const isEditing =
                editingNoteId === note.id;

              return (
                <article
                  key={note.id}
                  className="rounded-xl border border-gray-200 p-5 dark:border-gray-800"
                >
                  {/* Date */}
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {new Date(
                        note.createdAt
                      ).toLocaleString("fr-FR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>

                    {note.updatedAt && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Modifiée le{" "}
                        {new Date(
                          note.updatedAt
                        ).toLocaleString("fr-FR", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    )}
                  </div>

                  {/* Content */}
                  {isEditing ? (
                    <div className="mt-4 space-y-3">
                      <textarea
                        value={editingNoteContent}
                        onChange={(event) =>
                          setEditingNoteContent(
                            event.target.value
                          )
                        }
                        rows={4}
                        className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-700"
                      />

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEditNote(note.id)
                          }
                          className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                        >
                          Enregistrer
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingNoteId(null);
                            setEditingNoteContent("");
                          }}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {note.content}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNoteId(note.id);
                            setEditingNoteContent(
                              note.content
                            );
                          }}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteNote(note.id)
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          Supprimer
                        </button>
                      </div>
                    </>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Dossier médical
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Historique des diagnostics et traitements.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowRecordForm((current) => !current)
            }
            className="w-fit rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {showRecordForm
              ? "Fermer"
              : "+ Ajouter un dossier"}
          </button>
        </div>

        {showRecordForm && (
          <MedicalRecordForm
            patientId={patient.id}
            appointments={appointments}
            onSubmit={handleAddRecord}
            onCancel={() => setShowRecordForm(false)}
          />
        )}

        {medicalRecords.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="font-medium text-gray-700 dark:text-gray-200">
              Aucun dossier médical.
            </p>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Ajoutez un dossier médical après une consultation.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            {medicalRecords.map((record) => {
              if (
                editingRecordId === record.id
              ) {
                return (
                  <div
                    key={record.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
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
              const service = appointment
                ? services.find(
                  (item) => item.id === appointment.serviceId
                )
                : undefined;

              return (
                <div
                  key={record.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {record.diagnosis}
                      </p>
                      {service && (
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {service.name}
                        </p>
                      )}

                      {appointment && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Consultation du{" "}
                          {formatDate(appointment.date)} à {appointment.time}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Traitement
                      </p>

                      <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                        {record.treatment ||
                          "Non renseigné"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Notes
                      </p>

                      <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                        {record.notes || "Aucune note"}
                      </p>
                    </div>

                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Créé le {formatDate(record.createdAt)}
                    </p>
                  </div>

                  <div className="mt-5 flex gap-2 border-t border-gray-200 pt-4 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingRecordId(
                          record.id
                        )
                      }
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Rendez-vous
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Historique des rendez-vous de ce patient.
          </p>
        </div>

        {appointments.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="font-medium text-gray-700 dark:text-gray-200">
              Aucun rendez-vous.
            </p>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {service?.name ||
                          "Prestation inconnue"}
                      </p>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {appointment.date} à{" "}
                        {appointment.time}
                      </p>

                      {appointment.notes && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
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
