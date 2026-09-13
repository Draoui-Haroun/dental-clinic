
import { getPatientById } from "@/data/patient-repository";
import { notFound } from "next/navigation";
import { medicalRecords } from "@/data/medical-record";
import { appointments } from "@/data/appointments";
import { services } from "@/data/services";
import Link from "next/link";

export default async function PatientDetailsPage({params,}: {params: Promise<{ id: string }>;}) {
  const { id } = await params;
  const patient = getPatientById(id);
  if(!patient) {notFound(); }
  console.log(patient);

  const patientMedicalRecords = medicalRecords.filter((record) => record.patientId === patient.id);

  const patientAppointments = appointments.filter((appointment) => appointment.patientId === patient.id)

  return (
    <main className="p-6">
      <Link
        href="/patients"
        className="mb-6 inline-block hover:underline"
      >
        ← Back to Patients
      </Link>
      <h1 className="mb-6 text-3xl font-bold">Patient Profile</h1>

      <Link
        href={`/patients/${patient.id}/edit`}
        className="mb-6 inline-block rounded-lg border px-4 py-2"
      >
        Edit Patient
      </Link>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Personal Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">
              {patient.firstName} {patient.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{patient.phone}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium">{patient.dateOfBirth || "Not provided"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium">{patient.gender || "Not provided"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium">{patient.address || "Not provided"}</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Notes</h2>
        <p>{patient.notes || "No notes"}</p>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Medical History</h2>

        {patientMedicalRecords.length === 0 ? (
          <p className="text-gray-500">
            No medical records yet.
          </p>
        ) : (
          <div className="space-y-4">
            {patientMedicalRecords.map((record) => (
              <div
                key={record.id}
                className="rounded-lg border p-4"
              >
                <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                <p>
                  <strong>Treatment:</strong>{" "}
                  {record.treatment || "Not provided"}
                </p>
                <p>
                  <strong>Notes:</strong>{" "}
                  {record.notes || "No notes"}
                </p>
                <p className="mt-2 text-sm text-gray-500">Date: {record.createdAt}</p>
              </div>
            ))}
          </div>
        )}
      </section> 

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Appointments</h2>

        {patientAppointments.length === 0 ? (
          <p className="text-gray-500">No appointments yet.</p>
        ) : (
          <div className="space-y-4">
            {patientAppointments.map((appointment) => {
              const service = services.find(
                (service) => service.id === appointment.serviceId
              );

              return (
                <div
                  key={appointment.id}
                  className="rounded-lg border p-4"
                >
                  <p>
                    <strong>Service:</strong>{" "}
                    {service?.name || "Unknown service"}
                  </p>
                  <p><strong>Date:</strong> {appointment.date}</p>
                  <p><strong>Time:</strong> {appointment.time}</p>
                  <p><strong>Status:</strong> {appointment.status}</p>
                  {appointment.notes && (
                    <p>
                      <strong>Notes:</strong>{" "}
                      {appointment.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
 );
}