
export const dynamic = "force-dynamic";

import { getAllMedicines } from "@/data/medicine-repository";
import MedicinesClient from "@/components/patients/medicines/MedicinesClient";

export default function MedicinesPage() {
    const medicines = getAllMedicines();

    console.log("MEDICINES PAGE FROM SQLITE:", medicines);

    return (
        <MedicinesClient initialMedicines={medicines} />
    );
}