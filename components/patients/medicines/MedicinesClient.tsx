
"use client";

import { useState } from "react";
import type { Medicine } from "@/types/medicines";
import MedicineForm from "./MedicineForm";
import {
    addMedicine,
    editMedicine,
    deleteMedicine,
} from "@/app/(app)/medicines/actions";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MedicinesClientProps = {
    initialMedicines: Medicine[];
};

export default function MedicinesClient({
    initialMedicines,
}: MedicinesClientProps) {

    const pathname = usePathname();
    const [medicines, setMedicines] = useState(initialMedicines);
    const [showForm, setShowForm] = useState(false);
    const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleAddMedicine(
        medicine: Medicine
    ) {
        await addMedicine(
            medicine.id,
            medicine.name,
            medicine.created_at
        );

        setMedicines((currentMedicines) => [
            medicine,
            ...currentMedicines,
        ]);

        setShowForm(false);
        setError(null);
    }

    async function handleEditMedicine(
        medicine: Medicine
    ) {
        const updated = await editMedicine(
            medicine.id,
            medicine.name
        );

        if (!updated) {
            setError(
                "Le médicament n'a pas pu être modifié."
            );
            return;
        }

        setMedicines((currentMedicines) =>
            currentMedicines.map((currentMedicine) =>
                currentMedicine.id === medicine.id
                    ? medicine
                    : currentMedicine
            )
        );

        setEditingMedicineId(null);
        setError(null);
    }

    async function handleDeleteMedicine(
        id: string
    ) {
        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer ce médicament ?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const deleted = await deleteMedicine(id);

            if (!deleted) {
                setError(
                    "Le médicament n'a pas pu être supprimé."
                );
                return;
            }

            setMedicines((currentMedicines) =>
                currentMedicines.filter(
                    (medicine) => medicine.id !== id
                )
            );

            setError(null);
        } catch {
            setError(
                "Ce médicament ne peut pas être supprimé car il est utilisé dans une ordonnance."
            );
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
            {/* Section navigation */}
            <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-800">
                <Link
                    href="/services"
                    className={`rounded-t-lg px-4 py-2.5 text-sm font-medium transition ${pathname === "/services"
                            ? "bg-gray-900 text-white"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                        }`}
                >
                    Prestations
                </Link>

                <Link
                    href="/medicines"
                    className={`rounded-t-lg px-4 py-2.5 text-sm font-medium transition ${pathname === "/medicines"
                            ? "bg-gray-900 text-white"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                        }`}
                >
                    Médicaments
                </Link>
            </div>

            {/* Header */}
            <section className="mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Gestion du cabinet
                        </p>

                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Médicaments
                        </h1>

                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Gérez les médicaments disponibles pour les ordonnances.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setShowForm((current) => !current)
                        }
                        className="w-fit rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        {showForm
                            ? "Fermer"
                            : "+ Ajouter un médicament"}
                    </button>
                </div>
            </section>

            {/* Add form */}
            {showForm && (
                <section className="mb-8">
                    <MedicineForm
                        onSubmit={handleAddMedicine}
                        onCancel={() => setShowForm(false)}
                    />
                </section>
            )}

            {/* Error */}
            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                        {error}
                    </p>
                </div>
            )}

            {/* Count */}
            <section className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {medicines.length}{" "}
                    {medicines.length === 1
                        ? "médicament"
                        : "médicaments"}
                </p>
            </section>

            {/* Empty state */}
            {medicines.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <p className="font-medium text-gray-700 dark:text-gray-200">
                        Aucun médicament.
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Ajoutez un médicament pour commencer.
                    </p>
                </div>
            ) : (
                <section className="grid gap-4 md:grid-cols-2">
                    {medicines.map((medicine) => {
                        if (
                            editingMedicineId === medicine.id
                        ) {
                            return (
                                <div
                                    key={medicine.id}
                                    className="md:col-span-2"
                                >
                                    <MedicineForm
                                        initialMedicine={medicine}
                                        onSubmit={handleEditMedicine}
                                        onCancel={() =>
                                            setEditingMedicineId(null)
                                        }
                                    />
                                </div>
                            );
                        }

                        return (
                            <article
                                key={medicine.id}
                                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-6"
                            >
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {medicine.name}
                                    </h2>
                                </div>

                                <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-5 dark:border-gray-800">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditingMedicineId(
                                                medicine.id
                                            )
                                        }
                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Modifier
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteMedicine(
                                                medicine.id
                                            )
                                        }
                                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </section>
            )}
        </main>
    );
}