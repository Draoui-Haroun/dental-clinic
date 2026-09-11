
import type { Patient } from "@/types/patients";
import { useState } from "react";

type PatientFormProps = {
  onSubmit: (patient: Patient) => void;
};

export default function PatientForm({ onSubmit }: PatientFormProps) {
    const [success, setSuccess] = useState(false);

    return(
        <form onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const firstName = formData.get("firstName")?.toString() ?? "";
            const lastName = formData.get("lastName")?.toString() ?? "";
            const dateOfBirth = formData.get("dateOfBirth")?.toString() ?? "";
            const phone = formData.get("phone")?.toString() ?? "";
            const gender = formData.get("gender")?.toString() ?? "";
            const address = formData.get("address")?.toString() ?? "";
            const notes = formData.get("notes")?.toString() ?? "";
            
            const patient: Patient = {
                id: crypto.randomUUID(), firstName, lastName, phone, dateOfBirth, 
                gender: gender === "male" || gender === "female" ? gender : undefined,
                address, notes, createdAt: new Date().toISOString(),
            }
            onSubmit(patient);
            event.currentTarget.reset();
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
            console.log(patient)
        }}>
            <h2>Add Patient</h2>
            {success && (
                <p className="mb-4 text-green-600">
                    Patient added successfully.
                </p>
            )}
            <div>
                <label htmlFor="firstName">First Name</label>
                <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    required
                />
                </div>

                <div>
                <label htmlFor="lastName">Last Name</label>
                <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    required
                />

                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                    id="dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                />

                <label htmlFor="phone">Phone</label>
                <input
                    id="phone"
                    type="tel"
                    name="phone"
                    required
                    pattern="[0-9]{10}"
                />
            </div>

            <div>
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            <div>
                <label htmlFor="address">Address</label>
                <input
                    id="address"
                    type="text"
                    name="address"
                />
            </div>

            <div>
                <label htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                />
            </div>

            <button type="submit">Add Patient</button>
        </form>
    )
}