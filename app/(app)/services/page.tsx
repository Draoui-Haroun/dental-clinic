
export const dynamic = "force-dynamic";

import { getServices } from "@/data/service-repository";
import ServicesClient from "@/components/patients/services/ServicesClient";

export default function ServicesPage() {
  const services = getServices();

  console.log("SERVICES PAGE FROM SQLITE:", services);

  return (
    <ServicesClient initialServices={services} />
  );
}