
import { patients } from "@/data/patients";
import { appointments } from "@/data/appointments";
import { services } from "@/data/services";


export default function Home() {
  const totalPatients = patients.length;

  const todayAppointments = appointments.filter(
    (appointment) =>
      appointment.date === new Date().toISOString().split("T")[0]
  );

  const completedToday = todayAppointments.filter(
    (appointment) => appointment.status === "completed"
  );

  

  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="rounded-xl border p-4 text-left shadow-sm">
            <span className="font-semibold">New Appointment</span>
            <p className="mt-1 text-sm text-gray-500">Create a new appointment</p>
          </button>

          <button className="rounded-xl border p-4 text-left shadow-sm">
            <span className="font-semibold">New Patient</span>
            <p className="mt-1 text-sm text-gray-500">Add a new patient</p>
          </button>

          <button className="rounded-xl border p-4 text-left shadow-sm">
            <span className="font-semibold">Patients</span>
            <p className="mt-1 text-sm text-gray-500">View all patients</p>
          </button>

          <button className="rounded-xl border p-4 text-left shadow-sm">
            <span className="font-semibold">Appointments</span>
            <p className="mt-1 text-sm text-gray-500">View all appointments</p>
          </button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Today's Appointments</h2>
        <div className="space-y-3">
          {todayAppointments.map((appointment) => {
            const patient = patients.find(
              (patient) => patient.id === appointment.patientId
            );

            const service = services.find(
              (service) => service.id === appointment.serviceId
            );

            return (
              <div
                key={appointment.id}
                className="rounded-xl border p-4 shadow-sm"
              >
                <p className="font-semibold">{patient?.firstName} {patient?.lastName}</p>
                <p className="text-sm text-gray-500">{service?.name}</p>
                <p className="text-sm">{appointment.time}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>

  );
}