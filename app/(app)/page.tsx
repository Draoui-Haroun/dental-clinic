
export const dynamic = "force-dynamic";
import Link from "next/link";
import { getPatients } from "@/data/patient-repository";
import { getAppointments } from "@/data/appointment-repository";
import { getServices } from "@/data/service-repository";

export default function Home() {
  const patients = getPatients();
  const appointments = getAppointments();
  const services = getServices();

  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const totalServices = services.length;

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Algiers",
  }).format(new Date());

  const todayAppointments = appointments
    .filter((appointment) => appointment.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  const completedToday = todayAppointments.filter(
    (appointment) => appointment.status === "completed"
  );

  const upcomingAppointments = appointments
    .filter(
      (appointment) =>
        appointment.date > today &&
        appointment.status === "scheduled"
    )
    .sort((a, b) => {
      const first = `${a.date} ${a.time}`;
      const second = `${b.date} ${b.time}`;

      return first.localeCompare(second);
    })
    .slice(0, 5);

  function getPatientName(patientId: string) {
    const patient = patients.find(
      (patient) => patient.id === patientId
    );

    return patient
      ? `${patient.firstName} ${patient.lastName}`
      : "Patient inconnu";
  }

  function getPatientInitials(patientId: string) {
    const patient = patients.find(
      (patient) => patient.id === patientId
    );

    if (!patient) {
      return "?";
    }

    return `${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`;
  }

  function getServiceName(serviceId: string) {
    const service = services.find(
      (service) => service.id === serviceId
    );

    return service?.name ?? "Prestation inconnue";
  }

  function getStatusLabel(status: string) {
    if (status === "completed") {
      return "Terminé";
    }

    if (status === "cancelled") {
      return "Annulé";
    }

    return "Planifié";
  }

  function getStatusClass(status: string) {
    if (status === "completed") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (status === "cancelled") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Africa/Algiers",
    }).format(new Date(`${date}T12:00:00`));
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
      {/* Header */}
      <section className="mb-8">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Gestion du cabinet
        </p>

        <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Tableau de bord
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Vue d&apos;ensemble et activité du cabinet.
            </p>
          </div>

          <Link
            href="/appointments"
            className="shrink-0 text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
          >
            + Nouveau rendez-vous
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
            Patients
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
            {totalPatients}
          </p>

          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Patients enregistrés
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="mt-1 text-xl text-gray-700 dark:text-gray-300">
            Rendez-vous
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
            {totalAppointments}
          </p>

          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Rendez-vous enregistrés
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="mt-1 text-xl text-gray-700 dark:text-gray-300">
            Prestations
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
            {totalServices}
          </p>

          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Prestations disponibles
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
            Terminés aujourd&apos;hui
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
            {completedToday.length}
          </p>

          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Rendez-vous terminés
          </p>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Actions rapides
          </h2>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Accédez rapidement aux principales fonctionnalités.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/patients"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          >
            <p className="font-semibold text-gray-900 dark:text-white">
              Patients
            </p>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Consulter et gérer les fiches patients.
            </p>

            <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              Voir les patients →
            </p>
          </Link>

          <Link
            href="/appointments"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          >
            <p className="font-semibold text-gray-900 dark:text-white">
              Rendez-vous
            </p>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Planifier et suivre les rendez-vous.
            </p>

            <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              Gérer les rendez-vous →
            </p>
          </Link>

          <Link
            href="/services"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          >
            <p className="font-semibold text-gray-900 dark:text-white">
              Prestations
            </p>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Gérer les prestations et leurs tarifs.
            </p>

            <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              Gérer les prestations →
            </p>
          </Link>
        </div>
      </section>

      {/* Today's appointments */}
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4 ">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Rendez-vous du jour
            </h2>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Activité prévue aujourd&apos;hui.
            </p>
          </div>

          <Link
            href="/appointments"
            className="shrink-0 text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
          >
            Voir tout
          </Link>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-gray-200">
              Aucun rendez-vous prévu aujourd&apos;hui.
            </p>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Votre agenda est libre pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {getPatientInitials(
                        appointment.patientId
                      )}
                    </div>

                    <div>
                      <Link
                        href={`/patients/${appointment.patientId}`}
                        className="font-semibold text-gray-900 dark:text-white hover:underline"
                      >
                        {getPatientName(
                          appointment.patientId
                        )}
                      </Link>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {getServiceName(
                          appointment.serviceId
                        )}
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {appointment.time}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-3 py-1 text-sm font-medium ${getStatusClass(
                      appointment.status
                    )}`}
                  >
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming appointments */}
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4 ">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Prochains rendez-vous
            </h2>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Les prochains rendez-vous planifiés.
            </p>
          </div>

          <Link
            href="/appointments"
            className="shrink-0 text-sm font-medium text-gray-300 hover:text-gray-600 hover:underline"
          >
            Voir tout
          </Link>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-gray-200">
              Aucun prochain rendez-vous.
            </p>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aucun rendez-vous planifié pour les prochains jours.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="divide-y divide-gray-800">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-gray-50 dark:hover:bg-gray-800 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                      {getPatientInitials(
                        appointment.patientId
                      )}
                    </div>

                    <div>
                      <Link
                        href={`/patients/${appointment.patientId}`}
                        className="font-semibold text-gray-900 dark:text-white hover:underline"
                      >
                        {getPatientName(
                          appointment.patientId
                        )}
                      </Link>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {getServiceName(
                          appointment.serviceId
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(appointment.date)}
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {appointment.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}