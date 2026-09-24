
import { getPatientById } from "@/data/patient-repository";
import { getMedicalRecords } from "@/data/medical-record-repository";
import { getAppointments } from "@/data/appointment-repository";
import { getServices } from "@/data/service-repository";
import { notFound } from "next/navigation";
import PatientDetailsClient from "@/components/patients/PatientDetailsClient";
import { getNotesByPatientId } from "@/data/patient-note-repository";
import { getPaymentsByPatientId } from "@/data/payment-repository";
import { getOrdonnancesWithItemsByPatientId } from "@/data/ordonnance-repository";
import { getAllMedicines } from "@/data/medicine-repository";

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }>; }) {
  const { id } = await params;

  const patient = getPatientById(id);

  if (!patient) {
    notFound();
  }

  const notes = getNotesByPatientId(id);
  const payments = getPaymentsByPatientId(id);
  const ordonnances = getOrdonnancesWithItemsByPatientId(id);
  const medicines = getAllMedicines();
  const medicalRecords = getMedicalRecords();
  const appointments = getAppointments();
  const services = getServices();

  const patientMedicalRecords = medicalRecords.filter(
    (record) => record.patientId === patient.id
  );

  const patientAppointments = appointments.filter(
    (appointment) => appointment.patientId === patient.id
  );

  return (
    <PatientDetailsClient
      patient={patient}
      initialMedicalRecords={patientMedicalRecords}
      appointments={patientAppointments}
      services={services}
      notes={notes}
      payments={payments}
      ordonnances={ordonnances}
      medicines={medicines}
    />
  );
}