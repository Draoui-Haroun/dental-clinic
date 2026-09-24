
"use client";

import { useState } from "react";
import type { Medicine } from "@/types/medicines";
import { createOrdonnanceWithItems } from "@/app/ordonnances/actions";

type PrescriptionItemDraft = {
    id: string;
    medicineId: string;
    dosage: string;
    posology: string;
    duration: string;
};

type OrdonnanceFormProps = {
    patientId: string;
    medicines: Medicine[];
    onCancel: () => void;
    onSaved: () => void;
};

export default function OrdonnanceForm({
    patientId,
    medicines,
    onCancel,
    onSaved,
}: OrdonnanceFormProps) {
    const [items, setItems] = useState<PrescriptionItemDraft[]>([]);
    const [medicineId, setMedicineId] = useState("");
    const [dosage, setDosage] = useState("");
    const [posology, setPosology] = useState("");
    const [duration, setDuration] = useState("");
    const [saving, setSaving] = useState(false);
    const [itemError, setItemError] = useState<string | null>(null);

    function handleAddItem() {
        if (!medicineId) {
            setItemError("Veuillez sélectionner un médicament.");
            return;
        }

        const alreadyAdded = items.some(
            (item) => item.medicineId === medicineId
        );

        if (alreadyAdded) {
            setItemError(
                "Ce médicament a déjà été ajouté à cette ordonnance."
            );
            return;
        }

        const item: PrescriptionItemDraft = {
            id: crypto.randomUUID(),
            medicineId,
            dosage: dosage.trim(),
            posology: posology.trim(),
            duration: duration.trim(),
        };

        setItems((current) => [...current, item]);

        setMedicineId("");
        setDosage("");
        setPosology("");
        setDuration("");
        setItemError(null);
    }

    function handleRemoveItem(id: string) {
        setItems((current) =>
            current.filter((item) => item.id !== id)
        );
    }

    function getMedicineName(id: string) {
        return (
            medicines.find(
                (medicine) => medicine.id === id
            )?.name ?? "Médicament"
        );
    }

    async function handleSave() {
        if (items.length === 0 || saving) {
            return;
        }

        try {
            setSaving(true);

            const ordonnanceId = crypto.randomUUID();
            const createdAt = new Date().toISOString();

            await createOrdonnanceWithItems(
                ordonnanceId,
                patientId,
                new Date().toISOString().split("T")[0],
                createdAt,
                items.map((item) => ({
                    id: item.id,
                    medicineId: item.medicineId,
                    dosage: item.dosage || null,
                    posology: item.posology || null,
                    duration: item.duration || null,
                }))
            );

            onSaved();
        } catch (error) {
            console.error(
                "Erreur lors de l'enregistrement de l'ordonnance:",
                error
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Nouvelle ordonnance
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Ajoutez les médicaments de l'ordonnance.
                </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label
                        htmlFor="medicine"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Médicament
                    </label>

                    <select
                        id="medicine"
                        value={medicineId}
                        onChange={(event) =>
                            setMedicineId(event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="">
                            Sélectionner un médicament
                        </option>

                        {medicines.map((medicine) => (
                            <option
                                key={medicine.id}
                                value={medicine.id}
                            >
                                {medicine.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="dosage"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Dosage
                    </label>

                    <input
                        id="dosage"
                        type="text"
                        value={dosage}
                        onChange={(event) =>
                            setDosage(event.target.value)
                        }
                        placeholder="Ex. 500 mg"
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <div>
                    <label
                        htmlFor="posology"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Posologie
                    </label>

                    <input
                        id="posology"
                        type="text"
                        value={posology}
                        onChange={(event) =>
                            setPosology(event.target.value)
                        }
                        placeholder="Ex. Selon prescription"
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <div>
                    <label
                        htmlFor="duration"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Durée
                    </label>

                    <input
                        id="duration"
                        type="text"
                        value={duration}
                        onChange={(event) =>
                            setDuration(event.target.value)
                        }
                        placeholder="Ex. 5 jours"
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={handleAddItem}
                className="mt-4 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
                + Ajouter le médicament
            </button>
            {itemError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {itemError}
                </p>
            )}

            {items.length > 0 && (
                <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-800">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Médicaments ajoutés
                    </h3>

                    <div className="mt-3 space-y-3">
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {index + 1}.{" "}
                                            {getMedicineName(item.medicineId)}
                                        </p>

                                        {item.dosage && (
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Dosage : {item.dosage}
                                            </p>
                                        )}

                                        {item.posology && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Posologie : {item.posology}
                                            </p>
                                        )}

                                        {item.duration && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Durée : {item.duration}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveItem(item.id)
                                        }
                                        className="text-sm font-medium text-red-600 hover:text-red-700"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6 flex gap-2 border-t border-gray-200 pt-5 dark:border-gray-800">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={items.length === 0 || saving}
                    className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving
                        ? "Enregistrement..."
                        : "Enregistrer l'ordonnance"
                    }
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    Annuler
                </button>
            </div>
        </div>
    );
}