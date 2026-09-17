
export const dynamic = "force-dynamic";
import { getAppointments } from "@/data/appointment-repository";
import { getPatients } from "@/data/patient-repository";
import { getServices } from "@/data/service-repository";
import AppointmentsClient from "@/components/patients/appointments/AppointmentsClient";

export default function AppointmentsPage() {
  const appointments = getAppointments();
  const patients = getPatients();
  const services = getServices();

  return (
    <AppointmentsClient
      initialAppointments={appointments}
      patients={patients}
      services={services}
    />
  );
}