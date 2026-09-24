
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
import type { Payment } from "@/data/payment-repository";
import { addPayment, editPayment, removePayment } from "@/app/actions/payment-actions";
import type { OrdonnanceWithItems } from "@/data/ordonnance-repository";
import type { Medicine } from "@/types/medicines";
import OrdonnanceForm from "@/components/patients/ordonnances/OrdonnanceForm";
import { deleteOrdonnance } from "@/app/ordonnances/actions";

type PatientDetailsClientProps = {
  patient: Patient;
  initialMedicalRecords: MedicalRecord[];
  appointments: Appointment[];
  services: Service[];
  notes: PatientNote[];
  payments: Payment[];
  ordonnances: OrdonnanceWithItems[];
  medicines: Medicine[];
};

export default function PatientDetailsClient({
  patient,
  initialMedicalRecords,
  appointments,
  services,
  notes,
  payments,
  ordonnances,
  medicines,
}: PatientDetailsClientProps) {
  const [medicalRecords, setMedicalRecords] = useState(
    initialMedicalRecords
  );

  const [showRecordForm, setShowRecordForm] = useState(false);

  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  const [patientNotes, setPatientNotes] = useState<PatientNote[]>(notes);

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [paymentAppointmentId, setPaymentAppointmentId] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [showOrdonnanceForm, setShowOrdonnanceForm] = useState(false);
  const [expandedPaymentId, setExpandedPaymentId] = useState<string | null>(null);
  const [showAllPayments, setShowAllPayments] = useState(false);
  const [showAllAppointments, setShowAllAppointments] = useState(false);

  const totalServices = appointments.reduce((total, appointment) => {
    if (appointment.status !== "completed") {
      return total;
    }

    const service = services.find(
      (service) => service.id === appointment.serviceId
    );

    return total + (service?.price ?? 0);
  }, 0);

  const totalPaid = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const remainingAmount = Math.max(
    totalServices - totalPaid,
    0
  );

  const paymentStatus =
    totalServices === 0
      ? "unpaid"
      : totalPaid === 0
        ? "unpaid"
        : totalPaid >= totalServices
          ? "paid"
          : "partial";

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

  function formatPrice(amount: number) {
    return new Intl.NumberFormat("fr-FR").format(amount) + " DA";
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

  async function handleAddPayment() {
    const amount = Number(paymentAmount);

    setPaymentError("");

    if (!amount || amount <= 0) {
      setPaymentError("Veuillez saisir un montant valide.");
      return;
    }

    if (totalServices <= 0) {
      setPaymentError(
        "Aucune prestation terminée ne peut être facturée pour le moment."
      );
      return;
    }

    const editingPayment = editingPaymentId
      ? payments.find((payment) => payment.id === editingPaymentId)
      : undefined;

    const paidWithoutEditingPayment =
      totalPaid - (editingPayment?.amount ?? 0);

    const maxAllowedAmount =
      totalServices - paidWithoutEditingPayment;

    if (amount > maxAllowedAmount) {
      setPaymentError(
        "Le montant ne peut pas dépasser le reste à payer."
      );
      return;
    }

    if (editingPayment) {
      const payment: Payment = {
        ...editingPayment,
        appointmentId: paymentAppointmentId || undefined,
        amount,
        paymentDate,
        notes: paymentNotes.trim() || undefined,
      };

      await editPayment(payment);
    } else {
      const payment: Payment = {
        id: crypto.randomUUID(),
        patientId: patient.id,
        appointmentId: paymentAppointmentId || undefined,
        amount,
        paymentDate,
        notes: paymentNotes.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      await addPayment(payment);
    }

    setShowPaymentForm(false);
    setEditingPaymentId(null);
    setPaymentAmount("");
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setPaymentAppointmentId("");
    setPaymentNotes("");
    setPaymentError("");

    router.refresh();
  }

  function handleEditPayment(payment: Payment) {
    setEditingPaymentId(payment.id);
    setPaymentAmount(String(payment.amount));
    setPaymentDate(payment.paymentDate);
    setPaymentAppointmentId(payment.appointmentId ?? "");
    setPaymentNotes(payment.notes ?? "");
    setPaymentError("");
    setShowPaymentForm(true);
  }

  async function handleDeletePayment(id: string) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce paiement ?"
    );

    if (!confirmed) {
      return;
    }

    await removePayment(id);

    router.refresh();
  }

  function getPaymentStatusLabel() {
    if (paymentStatus === "paid") {
      return "Payé";
    }

    if (paymentStatus === "partial") {
      return "Partiellement payé";
    }

    return "Non payé";
  }

  const displayedPayments = showAllPayments
    ? payments
    : payments.slice(0, 5);

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
    const dateB = new Date(`${b.date}T${b.time || "00:00"}`).getTime();

    return dateB - dateA;
  });

  const displayedAppointments = showAllAppointments
    ? sortedAppointments
    : sortedAppointments.slice(0, 5);

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

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Situation financière
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Résumé des prestations et des paiements du patient.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Financial summary */}
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total des prestations
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(totalServices)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total payé
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(totalPaid)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Reste à payer
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(remainingAmount)}
                </p>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${paymentStatus === "paid"
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                    : paymentStatus === "partial"
                      ? "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
                      : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
                    }`}
                >
                  {getPaymentStatusLabel()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment history */}
          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Historique des paiements
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Liste des paiements enregistrés pour ce patient.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPaymentForm((current) => !current)
                }
                className="w-fit rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                {showPaymentForm
                  ? "Fermer"
                  : "+ Ajouter un paiement"}
              </button>
            </div>

            {
              showPaymentForm && (
                <div className="mb-6 rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                  <div className="mb-5">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Nouveau paiement
                    </h4>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Enregistrez un paiement effectué par le patient.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="payment-amount"
                        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Montant
                      </label>

                      <div className="relative">
                        <input
                          id="payment-amount"
                          type="number"
                          min="1"
                          step="1"
                          value={paymentAmount}
                          onChange={(event) =>
                            setPaymentAmount(event.target.value)
                          }
                          placeholder="Ex. 5000"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-12 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-700"
                        />

                        {paymentError && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {paymentError}
                          </p>
                        )}

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                          DA
                        </span>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="payment-date"
                        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Date du paiement
                      </label>

                      <input
                        id="payment-date"
                        type="date"
                        value={paymentDate}
                        onChange={(event) =>
                          setPaymentDate(event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-700"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="payment-appointment"
                        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Rendez-vous
                      </label>

                      <select
                        id="payment-appointment"
                        value={paymentAppointmentId}
                        onChange={(event) =>
                          setPaymentAppointmentId(event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-700"
                      >
                        <option value="">
                          Aucun rendez-vous
                        </option>

                        {appointments.map((appointment) => {
                          const service = services.find(
                            (service) =>
                              service.id === appointment.serviceId
                          );

                          return (
                            <option
                              key={appointment.id}
                              value={appointment.id}
                            >
                              {formatDate(appointment.date)} à{" "}
                              {appointment.time} —{" "}
                              {service?.name || "Prestation inconnue"}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="payment-notes"
                        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Notes
                      </label>

                      <textarea
                        id="payment-notes"
                        value={paymentNotes}
                        onChange={(event) =>
                          setPaymentNotes(event.target.value)
                        }
                        rows={3}
                        placeholder="Ex. Paiement partiel..."
                        className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 dark:focus:ring-gray-700"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleAddPayment}
                      disabled={
                        !paymentAmount ||
                        Number(paymentAmount) <= 0 ||
                        !paymentDate
                      }
                      className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                    >
                      {editingPaymentId ? "Modifier le paiement" : "Enregistrer le paiement"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowPaymentForm(false);
                        setEditingPaymentId(null);
                        setPaymentAmount("");
                        setPaymentDate(new Date().toISOString().slice(0, 10));
                        setPaymentAppointmentId("");
                        setPaymentNotes("");
                        setPaymentError("");
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )
            }

            {payments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucun paiement enregistré.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {displayedPayments.map((payment) => {
                    const appointment = payment.appointmentId
                      ? appointments.find(
                        (appointment) =>
                          appointment.id === payment.appointmentId
                      )
                      : undefined;

                    const isExpanded = expandedPaymentId === payment.id;

                    return (
                      <div
                        key={payment.id}
                        className="border-b border-gray-200 last:border-b-0 dark:border-gray-800"
                      >
                        <div className="flex items-center justify-between gap-4 p-4">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatPrice(payment.amount)}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedPaymentId(
                                isExpanded ? null : payment.id
                              )
                            }
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                          >
                            {isExpanded ? "Voir moins" : "Voir plus"}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Date : {formatDate(payment.paymentDate)}
                            </p>

                            {appointment && (
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Rendez-vous du {formatDate(appointment.date)}
                                {appointment.time && ` à ${appointment.time}`}
                                {appointment.serviceId && (
                                  <>
                                    {" — "}
                                    {services.find(
                                      (service) =>
                                        service.id === appointment.serviceId
                                    )?.name || "Prestation inconnue"}
                                  </>
                                )}
                              </p>
                            )}

                            {payment.notes && (
                              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                {payment.notes}
                              </p>
                            )}

                            <div className="mt-4 flex gap-4">
                              <button
                                type="button"
                                onClick={() => handleEditPayment(payment)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                Modifier
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeletePayment(payment.id)}
                                className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {payments.length > 5 && (
                    <div className="border-t border-gray-200 p-4 text-center dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => setShowAllPayments((current) => !current)}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {showAllPayments
                          ? "Afficher moins"
                          : `Afficher tous les paiements (${payments.length})`}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
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

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Ordonnances
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Historique des ordonnances du patient.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowOrdonnanceForm((current) => !current)
            }
            className="w-fit rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            {showOrdonnanceForm
              ? "Fermer"
              : "+ Nouvelle ordonnance"}
          </button>
        </div>

        {showOrdonnanceForm && (
          <div className="mb-6">
            <OrdonnanceForm
              patientId={patient.id}
              medicines={medicines}
              onCancel={() =>
                setShowOrdonnanceForm(false)
              }
              onSaved={() => {
                setShowOrdonnanceForm(false);
                window.location.reload();
              }}
            />
          </div>
        )}
        {ordonnances.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            Aucune ordonnance pour ce patient.
          </div>
        ) : (
          <div className="space-y-3">
            {ordonnances.map((ordonnance) => (
              <div
                key={ordonnance.id}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  Ordonnance du{" "}
                  {new Intl.DateTimeFormat("fr-FR").format(
                    new Date(ordonnance.date)
                  )}
                </p>

                <div className="mt-4 space-y-2">
                  {ordonnance.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                    >
                      <p className="font-medium text-gray-900 dark:text-white">
                        {index + 1}. {item.medicine_name}
                      </p>
                    </div>
                  ))}
                  <div className="mt-4 flex gap-2 border-t border-gray-200 pt-4 dark:border-gray-800">
                    <Link
                      href={`/ordonnances/${ordonnance.id}`}
                      className="inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      Voir / Imprimer
                    </Link>

                    <button
                      type="button"
                      onClick={async () => {
                        const confirmed = window.confirm(
                          "Voulez-vous vraiment supprimer cette ordonnance ?"
                        );

                        if (!confirmed) {
                          return;
                        }

                        await deleteOrdonnance(ordonnance.id);

                        window.location.reload();
                      }}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
            {displayedAppointments.map((appointment) => {
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
            {appointments.length > 5 && (
              <div className="border-t border-gray-200 p-4 text-center dark:border-gray-800">
                <button
                  type="button"
                  onClick={() =>
                    setShowAllAppointments((current) => !current)
                  }
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {showAllAppointments
                    ? "Afficher moins"
                    : `Afficher tous les rendez-vous (${appointments.length})`}
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}