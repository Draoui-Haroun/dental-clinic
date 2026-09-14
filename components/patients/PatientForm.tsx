
import type { Patient } from "@/types/patients";
import { useState } from "react";

type PatientFormProps = {
  onSubmit: (patient: Patient) => void;
};

export default function PatientForm({
  onSubmit,
}: PatientFormProps) {
  const [success, setSuccess] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const firstName =
          formData.get("firstName")?.toString() ?? "";

        const lastName =
          formData.get("lastName")?.toString() ?? "";

        const dateOfBirth =
          formData.get("dateOfBirth")?.toString() ?? "";

        const phone =
          formData.get("phone")?.toString() ?? "";

        const gender =
          formData.get("gender")?.toString() ?? "";

        const address =
          formData.get("address")?.toString() ?? "";

        const notes =
          formData.get("notes")?.toString() ?? "";

        const patient: Patient = {
          id: crypto.randomUUID(),
          firstName,
          lastName,
          phone,
          dateOfBirth,
          gender:
            gender === "male" || gender === "female"
              ? gender
              : undefined,
          address,
          notes,
          createdAt: new Date().toISOString(),
        };

        onSubmit(patient);

        event.currentTarget.reset();

        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }}
      className="space-y-6"
    >

      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Ajouter un patient
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Renseignez les informations du patient.
        </p>
      </div>

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800 dark:bg-green-950">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            Patient ajouté avec succès.
          </p>
        </div>
      )}

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
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="dateOfBirth"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-600 dark:focus:ring-gray-700"
          >
            Date de naissance
          </label>

          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
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
            required
            pattern="[0-9]{10}"
            placeholder="0771234567"
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
          defaultValue=""
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
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-600 dark:focus:ring-gray-700"
        >
          Notes
        </label>

        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Informations complémentaires..."
          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
        />
      </div>

      <div className="flex justify-end border-t border-gray-200 pt-5 dark:border-gray-800">
        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Ajouter le patient
        </button>
      </div>
    </form>
  );
}