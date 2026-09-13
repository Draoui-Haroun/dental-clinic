
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

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <section className="mb-8">
        <p className="text-sm font-medium text-gray-300">
          Tableau de bord
        </p>

        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Cabinet dentaire
            </h1>

            <p className="mt-2 text-gray-300">
              Vue d&apos;ensemble et activité du jour
            </p>
          </div>

          <Link
            href="/appointments"
            className="w-fit rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + Nouveau rendez-vous
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Nombre de patients
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            {totalPatients}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Nombre de rendez-vous
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            {totalAppointments}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Nombre de prestations
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            {totalServices}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Rendez-vous terminés aujourd&apos;hui
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            {completedToday.length}
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-300">
          Actions rapides
        </h2>

        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/patients"
            className="rounded-xl border bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow"
          >
            <p className="font-semibold text-gray-900">
              Voir les patients
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Consulter et gérer les fiches patients
            </p>
          </Link>

          <Link
            href="/appointments"
            className="rounded-xl border bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow"
          >
            <p className="font-semibold text-gray-900">
              Gérer les rendez-vous
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Planifier et suivre les rendez-vous
            </p>
          </Link>

          <Link
            href="/services"
            className="rounded-xl border bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow"
          >
            <p className="font-semibold text-gray-900">
              Gérer les prestations
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Consulter les prestations et leurs tarifs
            </p>
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-300">
              Rendez-vous du jour
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Activité prévue aujourd&apos;hui
            </p>
          </div>

          <Link
            href="/appointments"
            className="text-sm font-medium text-gray-300 hover:text-gray-900 hover:underline"
          >
            Voir tout
          </Link>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <p className="font-medium text-gray-700">
              Aucun rendez-vous prévu aujourd&apos;hui.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Votre agenda est libre pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-700">
                      {appointment.time}
                    </div>

                    <div>
                      <Link
                        href={`/patients/${appointment.patientId}`}
                        className="font-semibold text-gray-900 hover:underline"
                      >
                        {getPatientName(
                          appointment.patientId
                        )}
                      </Link>

                      <p className="mt-1 text-sm text-gray-500">
                        {getServiceName(
                          appointment.serviceId
                        )}
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

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-300">
              Prochains rendez-vous
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Les prochains rendez-vous planifiés
            </p>
          </div>

          <Link
            href="/appointments"
            className="text-sm font-medium text-gray-300 hover:text-gray-900 hover:underline"
          >
            Voir tout
          </Link>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <p className="font-medium text-gray-700">
              Aucun prochain rendez-vous.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Aucun rendez-vous planifié pour les prochains jours.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="divide-y">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <Link
                      href={`/patients/${appointment.patientId}`}
                      className="font-semibold text-gray-900 hover:underline"
                    >
                      {getPatientName(
                        appointment.patientId
                      )}
                    </Link>

                    <p className="mt-1 text-sm text-gray-500">
                      {getServiceName(
                        appointment.serviceId
                      )}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="font-medium text-gray-900">
                      {appointment.date}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
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