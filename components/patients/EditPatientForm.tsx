
"use client";
import type { Patient } from "@/types/patients";
import { updatePatient } from "@/app/patients/[id]/edit/actions";
import { useActionState } from "react";

type EditPatientFormProps = {
  patient: Patient;
};

export default function EditPatientForm({patient}: EditPatientFormProps) {
    const [message, formAction] = useActionState(
        updatePatient,
        ""
    );

  return (
    <form action={formAction}>
        <h2>Edit Patient</h2>

        <input
            type="hidden"
            name="id"
            value={patient.id}
        />  

        <input
            type="text"
            name="firstName"
            defaultValue={patient.firstName}
            required
        />

        <input
            type="text"
            name="lastName"
            defaultValue={patient.lastName}
            required
        />

        <input
        type="tel"
        name="phone"
        defaultValue={patient.phone}
        required
        />

        <input
        type="date"
        name="dateOfBirth"
        defaultValue={patient.dateOfBirth}
        />

        <select
        name="gender"
        defaultValue={patient.gender ?? ""}
        >
        <option value="">Select gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        </select>

        <input
        type="text"
        name="address"
        defaultValue={patient.address}
        />

        <textarea
        name="notes"
        defaultValue={patient.notes}
        />  

        <button type="submit">
            Save Changes
        </button> 
        {message && <p>{message}</p>}   
    </form>
  );
}