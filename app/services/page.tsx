
import { getServices } from "@/data/service-repository";
import ServicesClient from "@/components/patients/services/ServicesClient";

export default function ServicesPage() {
  const services = getServices();

  return (
    <ServicesClient initialServices={services} />
  );
}