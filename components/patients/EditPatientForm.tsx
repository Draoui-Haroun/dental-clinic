

"use client";
import type { Patient } from "@/types/patients";
import { updatePatient } from "@/app/(app)/patients/[id]/edit/actions";
import { useActionState } from "react";

type EditPatientFormProps = {
  patient: Patient;
};

export default function EditPatientForm({
  patient,
}: EditPatientFormProps) {
  const [message, formAction] = useActionState(
    updatePatient,
    ""
  );

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Modifier le patient
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Modifiez les informations du patient.
        </p>
      </div>

      <input
        type="hidden"
        name="id"
        value={patient.id}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Prénom
          </label>

          <input
            id="firstName"
            type="text"
            name="firstName"
            defaultValue={patient.firstName}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nom
          </label>

          <input
            id="lastName"
            type="text"
            name="lastName"
            defaultValue={patient.lastName}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="dateOfBirth"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Date de naissance
          </label>

          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            defaultValue={patient.dateOfBirth}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Téléphone
          </label>

          <input
            id="phone"
            type="tel"
            name="phone"
            defaultValue={patient.phone}
            required
            pattern="[0-9]{10}"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
          />

          <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
            10 chiffres
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="gender"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Sexe
        </label>

        <select
          id="gender"
          name="gender"
          defaultValue={patient.gender ?? ""}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-600 dark:focus:ring-gray-700"
        >
          <option value="" disabled>
            Sélectionner
          </option>

          <option value="male">Homme</option>

          <option value="female">Femme</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="address"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Adresse
        </label>

        <input
          id="address"
          type="text"
          name="address"
          defaultValue={patient.address}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Notes
        </label>

        <textarea
          id="notes"
          name="notes"
          defaultValue={patient.notes}
          rows={4}
          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
        />
      </div>

      {message && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {message}
          </p>
        </div>
      )}

      <div className="flex justify-end border-t border-gray-200 pt-5 dark:border-gray-800">
        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Enregistrer les modifications
        </button>
      </div>
    </form>
  );
}
