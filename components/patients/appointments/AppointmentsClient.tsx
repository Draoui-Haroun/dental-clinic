
"use client";
import { useState } from "react";
import type { Appointment } from "@/types/appointments";
import type { Patient } from "@/types/patients";
import type { Service } from "@/types/services";
import AppointmentForm from "./AppointmentForm";
import EditAppointmentForm from "./EditAppointmentForm";
import {
  addAppointment,
  editAppointment,
  changeAppointmentStatus,
  deleteAppointment,
} from "@/app/(app)/appointments/actions";

function isAppointmentLate(appointment: Appointment) {
  if (appointment.status !== "scheduled") {
    return false;
  }

  const appointmentDateTime = new Date(
    `${appointment.date}T${appointment.time}`
  );

  return appointmentDateTime < new Date();
}

type AppointmentsClientProps = {
  initialAppointments: Appointment[];
  patients: Patient[];
  services: Service[];
};

export default function AppointmentsClient({
  initialAppointments,
  patients,
  services,
}: AppointmentsClientProps) {
  const [appointments, setAppointments] =
    useState(initialAppointments);

  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showAllAppointments, setShowAllAppointments] = useState(false);

  const [editingAppointmentId, setEditingAppointmentId] =
    useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | Appointment["status"]>("all");
  const [dateFilter, setDateFilter] = useState("");

  async function handleAddAppointment(
    appointment: Appointment
  ) {
    await addAppointment(appointment);

    setAppointments((currentAppointments) => [
      ...currentAppointments,
      appointment,
    ]);

    setShowForm(false);
  }

  async function handleEditAppointment(
    appointment: Appointment
  ) {
    await editAppointment(appointment);

    setAppointments((currentAppointments) =>
      currentAppointments.map((currentAppointment) =>
        currentAppointment.id === appointment.id
          ? appointment
          : currentAppointment
      )
    );

    setEditingAppointmentId(null);
  }

  async function handleStatusChange(
    id: string,
    status: Appointment["status"]
  ) {
    await changeAppointmentStatus(id, status);

    setAppointments((currentAppointments) =>
      currentAppointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status }
          : appointment
      )
    );
  }

  async function handleDeleteAppointment(id: string) {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce rendez-vous ?"
    );

    if (!confirmed) {
      return;
    }

    const deleted = await deleteAppointment(id);

    if (!deleted) {
      return;
    }

    setAppointments((currentAppointments) =>
      currentAppointments.filter(
        (appointment) => appointment.id !== id
      )
    );
  }

  function getStatusLabel(appointment: Appointment) {
    if (isAppointmentLate(appointment)) {
      return "En retard";
    }

    switch (appointment.status) {
      case "completed":
        return "Terminé";
      case "cancelled":
        return "Annulé";
      case "scheduled":
        return "Planifié";
    }
  }

  function getStatusClass(appointment: Appointment) {
    if (isAppointmentLate(appointment)) {
      return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800";
    }

    switch (appointment.status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800";

      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800";

      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800";
    }
  }

  const filteredAppointments = appointments.filter(
    (appointment) => {
      const patient = patients.find(
        (patient) => patient.id === appointment.patientId
      );

      const service = services.find(
        (service) => service.id === appointment.serviceId
      );

      const patientName = patient
        ? `${patient.firstName} ${patient.lastName}`.toLowerCase()
        : "";

      const serviceName =
        service?.name.toLowerCase() ?? "";

      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        patientName.includes(searchValue) ||
        serviceName.includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        appointment.status === statusFilter;

      const matchesDate =
        dateFilter === "" ||
        appointment.date === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    }
  ).sort((a, b) => {
    const dateTimeA = new Date(
      `${a.date}T${a.time}`
    ).getTime();

    const dateTimeB = new Date(
      `${b.date}T${b.time}`
    ).getTime();

    return dateTimeA - dateTimeB;
  });

  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = filteredAppointments.filter(
    (appointment) =>
      appointment.date === today
  );

  const upcomingAppointments = filteredAppointments.filter(
    (appointment) =>
      appointment.date > today &&
      appointment.status === "scheduled"
  );

  const lateAppointments = filteredAppointments.filter(
    (appointment) =>
      appointment.date < today &&
      appointment.status === "scheduled"
  );

  const historyAppointments = filteredAppointments.filter(
    (appointment) =>
      appointment.date < today &&
      (
        appointment.status === "completed" ||
        appointment.status === "cancelled"
      )
  );

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("fr-FR").format(
      new Date(date)
    );
  }

  const allAppointments = [...filteredAppointments].sort((a, b) => {
    const dateTimeA = new Date(
      `${a.date}T${a.time}`
    ).getTime();

    const dateTimeB = new Date(
      `${b.date}T${b.time}`
    ).getTime();

    return dateTimeA - dateTimeB;
  });

  function renderAppointment(appointment: Appointment) {
    const patient = patients.find(
      (patient) => patient.id === appointment.patientId
    );

    const service = services.find(
      (service) => service.id === appointment.serviceId
    );

    if (editingAppointmentId === appointment.id) {
      return (
        <EditAppointmentForm
          key={appointment.id}
          appointment={appointment}
          patients={patients}
          services={services}
          onSubmit={handleEditAppointment}
          onCancel={() => setEditingAppointmentId(null)}
        />
      );
    }

    return (
      <article
        key={appointment.id}
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-6"
      >
        {/* Top */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700">
              {patient
                ? `${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`
                : "?"}
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {patient
                  ? `${patient.firstName} ${patient.lastName}`
                  : "Patient inconnu"}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {service?.name ?? "Prestation inconnue"}
              </p>
            </div>
          </div>

          <span
            className={`w-fit rounded-full border px-3 py-1 text-sm font-medium ${getStatusClass(
              appointment
            )}`}
          >
            {getStatusLabel(appointment)}
          </span>
        </div>

        {/* Appointment information */}
        <div className="mt-5 grid gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Date
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(appointment.date)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Heure
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {appointment.time}
            </p>
          </div>
        </div>

        {/* Notes */}
        {appointment.notes && (
          <div className="mt-5 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Notes
            </p>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {appointment.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-5 dark:border-gray-800">
          <button
            type="button"
            onClick={() =>
              setEditingAppointmentId(appointment.id)
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Modifier
          </button>

          {appointment.status === "scheduled" && (
            <>
              <button
                type="button"
                onClick={() =>
                  handleStatusChange(
                    appointment.id,
                    "completed"
                  )
                }
                className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100 dark:border-green-800 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900"
              >
                Terminer
              </button>

              <button
                type="button"
                onClick={() =>
                  handleStatusChange(
                    appointment.id,
                    "cancelled"
                  )
                }
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
              >
                Annuler
              </button>
            </>
          )}

          {appointment.status === "cancelled" && (
            <button
              type="button"
              onClick={() =>
                handleStatusChange(
                  appointment.id,
                  "scheduled"
                )
              }
              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900"
            >
              Restaurer
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              handleDeleteAppointment(appointment.id)
            }
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Supprimer
          </button>
        </div>
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
      {/* Header */}
      <section className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Gestion du cabinet
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Rendez-vous
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Planifiez et gérez les rendez-vous de vos patients.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm((current) => !current)}
            className="w-fit rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            {showForm
              ? "Fermer"
              : "+ Ajouter un rendez-vous"}
          </button>
        </div>
      </section>

      {/* Add appointment form */}
      {showForm && (
        <section className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Ajouter un rendez-vous
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Renseignez les informations du rendez-vous.
            </p>
          </div>

          <AppointmentForm
            patients={patients}
            services={services}
            onSubmit={handleAddAppointment}
          />
        </section>
      )}

      {/* Filters */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_200px]">
          {/* Search */}
          <div>
            <label
              htmlFor="appointment-search"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Rechercher
            </label>

            <input
              id="appointment-search"
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Nom du patient ou prestation..."
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="appointment-status"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Statut
            </label>

            <select
              id="appointment-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                  | "all"
                  | Appointment["status"]
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            >
              <option value="all">Tous les statuts</option>
              <option value="scheduled">Planifié</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="appointment-date"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
            >
              Date
            </label>

            <input
              id="appointment-date"
              type="date"
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredAppointments.length} rendez-vous{" "}
            {filteredAppointments.length === 1
              ? "trouvé"
              : "trouvés"}
          </p>

          {(search || statusFilter !== "all" || dateFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setDateFilter("");
              }}
              className="w-fit text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </section>

      {/* Empty state */}
      {appointments.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="font-medium text-gray-700 dark:text-gray-200">
            Aucun rendez-vous.
          </p>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ajoutez un rendez-vous pour commencer.
          </p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="font-medium text-gray-700 dark:text-gray-200">
            Aucun rendez-vous trouvé.
          </p>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Aujourd'hui */}
          {todayAppointments.length > 0 && (
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Aujourd'hui
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {todayAppointments.length} rendez-vous aujourd'hui
                </p>
              </div>

              <div className="space-y-4">
                {todayAppointments.map(renderAppointment)}
              </div>
            </section>
          )}

          {/* À venir */}
          {/* À venir */}
          {upcomingAppointments.length > 0 && (
            <section>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    À venir
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {upcomingAppointments.length} rendez-vous à venir
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowUpcoming((current) => !current)
                  }
                  className="w-fit rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {showUpcoming
                    ? "Masquer les prochains rendez-vous"
                    : "Afficher les prochains rendez-vous"}
                </button>
              </div>

              {showUpcoming && (
                <div className="space-y-4">
                  {upcomingAppointments.map(renderAppointment)}
                </div>
              )}
            </section>
          )}

          {/* En retard */}
          {lateAppointments.length > 0 && (
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  En retard
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {lateAppointments.length} rendez-vous en retard
                </p>
              </div>

              <div className="space-y-4">
                {lateAppointments.map(renderAppointment)}
              </div>
            </section>
          )}

          {/* Historique */}
          {historyAppointments.length > 0 && (
            <section>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Historique
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {historyAppointments.length} ancien
                    {historyAppointments.length > 1 ? "s" : ""} rendez-vous
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowHistory((current) => !current)
                  }
                  className="w-fit rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {showHistory
                    ? "Masquer l'historique"
                    : "Afficher l'historique"}
                </button>
              </div>

              {showHistory && (
                <div className="space-y-4">
                  {historyAppointments.map(renderAppointment)}
                </div>
              )}
            </section>
          )}

          {/* Tous les rendez-vous */}
          {allAppointments.length > 0 && (
            <section>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Tous les rendez-vous
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {allAppointments.length} rendez-vous
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowAllAppointments((current) => !current)
                  }
                  className="w-fit rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {showAllAppointments
                    ? "Masquer tous les rendez-vous"
                    : "Afficher tous les rendez-vous"}
                </button>
              </div>

              {showAllAppointments && (
                <div className="space-y-4">
                  {allAppointments.map(renderAppointment)}
                </div>
              )}
            </section>
          )}

          {/* No appointments in any section */}
          {todayAppointments.length === 0 &&
            upcomingAppointments.length === 0 &&
            lateAppointments.length === 0 &&
            historyAppointments.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  Aucun rendez-vous à afficher.
                </p>
              </div>
            )}
        </div>
      )}
    </main>
  );
}