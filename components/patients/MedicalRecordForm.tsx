
"use client";
import { useState } from "react";
import type { Appointment } from "@/types/appointments";
import type { MedicalRecord } from "@/types/medical-recordes";

type MedicalRecordFormProps = {
    patientId: string;
    appointments: Appointment[];
    onSubmit: (record: MedicalRecord) => Promise<void>;
    onCancel: () => void;
    initialRecord?: MedicalRecord;
};

export default function MedicalRecordForm({
    patientId,
    appointments,
    onSubmit,
    onCancel,
    initialRecord,
}: MedicalRecordFormProps) {
    const [appointmentId, setAppointmentId] = useState(
        initialRecord?.appointmentId ?? ""
    );

    const [diagnosis, setDiagnosis] = useState(
        initialRecord?.diagnosis ?? ""
    );

    const [treatment, setTreatment] = useState(
        initialRecord?.treatment ?? ""
    );

    const [notes, setNotes] = useState(
        initialRecord?.notes ?? ""
    );

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const record: MedicalRecord = {
            id: initialRecord?.id ?? crypto.randomUUID(),
            patientId,
            appointmentId,
            diagnosis,
            treatment: treatment || undefined,
            notes: notes || undefined,
            createdAt:
                initialRecord?.createdAt ??
                new Date().toISOString(),
        };

        await onSubmit(record);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
        >
            <div>
                <h3 className="text-xl font-semibold text-gray-900">
                    {initialRecord
                        ? "Modifier le dossier médical"
                        : "Ajouter un dossier médical"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    Renseignez les informations de la consultation.
                </p>
            </div>

            <div>
                <label
                    htmlFor="medical-appointment"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Rendez-vous
                </label>

                <select
                    id="medical-appointment"
                    value={appointmentId}
                    onChange={(event) =>
                        setAppointmentId(event.target.value)
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                >
                    <option value="" disabled>
                        Sélectionner un rendez-vous
                    </option>

                    {appointments.map((appointment) => (
                        <option
                            key={appointment.id}
                            value={appointment.id}
                        >
                            {appointment.date} à {appointment.time}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label
                    htmlFor="diagnosis"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Diagnostic
                </label>

                <input
                    id="diagnosis"
                    type="text"
                    value={diagnosis}
                    onChange={(event) =>
                        setDiagnosis(event.target.value)
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                />
            </div>

            <div>
                <label
                    htmlFor="treatment"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Traitement
                </label>

                <textarea
                    id="treatment"
                    value={treatment}
                    onChange={(event) =>
                        setTreatment(event.target.value)
                    }
                    rows={3}
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                />
            </div>

            <div>
                <label
                    htmlFor="medical-notes"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Notes
                </label>

                <textarea
                    id="medical-notes"
                    value={notes}
                    onChange={(event) =>
                        setNotes(event.target.value)
                    }
                    rows={3}
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                />
            </div>

            <div className="flex flex-wrap gap-3 border-t pt-5">
                <button
                    type="submit"
                    className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                    {initialRecord
                        ? "Enregistrer les modifications"
                        : "Ajouter le dossier"}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    Annuler
                </button>
            </div>
        </form>
    );
}