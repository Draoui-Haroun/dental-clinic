
import { getMedicalRecords } from "@/data/medical-record-repository";
import { getPatients } from "@/data/patient-repository";
import { getAppointments } from "@/data/appointment-repository";

export default function MedicalRecordsPage() {
  const records = getMedicalRecords();
  const patients = getPatients();
  const appointments = getAppointments();

  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Medical Records</h1>

      <div className="space-y-3">
        {records.map((record) => {
          const patient = patients.find(
            (patient) => patient.id === record.patientId
          );

          const appointment = appointments.find(
            (appointment) => appointment.id === record.appointmentId
          );

          return (
            <div
              key={record.id}
              className="rounded-xl border p-4 shadow-sm"
            >
              <h2 className="font-semibold">
                {patient
                  ? `${patient.firstName} ${patient.lastName}`
                  : "Unknown patient"}
              </h2>

              <p className="mt-2">
                Diagnosis: {record.diagnosis}
              </p>

              {record.treatment && (
                <p className="text-sm">
                  Treatment: {record.treatment}
                </p>
              )}

              {appointment && (
                <p className="text-sm text-gray-500">
                  Appointment: {appointment.date} at{" "}
                  {appointment.time}
                </p>
              )}

              {record.notes && (
                <p className="mt-2 text-sm text-gray-500">
                  Notes: {record.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}