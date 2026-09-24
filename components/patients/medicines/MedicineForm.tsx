
"use client";

import { useState } from "react";
import type { Medicine } from "@/types/medicines";

type MedicineFormProps = {
    initialMedicine?: Medicine;
    onSubmit: (medicine: Medicine) => void;
    onCancel: () => void;
};

export default function MedicineForm({
    initialMedicine,
    onSubmit,
    onCancel,
}: MedicineFormProps) {
    const [name, setName] = useState(initialMedicine?.name ?? "");
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("Veuillez saisir le nom du médicament.");
            return;
        }

        setError(null);

        const medicine: Medicine = {
            id:
                initialMedicine?.id ??
                crypto.randomUUID(),
            name: trimmedName,
            created_at:
                initialMedicine?.created_at ??
                new Date().toISOString(),
        };

        onSubmit(medicine);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
        >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {initialMedicine
                    ? "Modifier le médicament"
                    : "Ajouter un médicament"}
            </h2>

            <div className="mt-5">
                <label
                    htmlFor="medicine-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Nom du médicament
                </label>

                <input
                    id="medicine-name"
                    type="text"
                    value={name}
                    onChange={(event) => {
                        setName(event.target.value);
                        setError(null);
                    }}
                    placeholder="Ex. Amoxicilline"
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-gray-700"
                />

                {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </p>
                )}
            </div>

            <div className="mt-5 flex gap-2">
                <button
                    type="submit"
                    className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                    {initialMedicine
                        ? "Enregistrer"
                        : "Ajouter"}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    Annuler
                </button>
            </div>
        </form>
    );
}