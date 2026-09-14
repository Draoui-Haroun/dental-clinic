
"use client";
import { useState } from "react";
import type { Service } from "@/types/services";

type ServiceFormProps = {
  onSubmit: (service: Service) => Promise<void>;
  onCancel: () => void;
  initialService?: Service;
};

export default function ServiceForm({
  onSubmit,
  onCancel,
  initialService,
}: ServiceFormProps) {
  const [name, setName] = useState(
    initialService?.name ?? ""
  );

  const [description, setDescription] = useState(
    initialService?.description ?? ""
  );

  const [duration, setDuration] = useState(
    initialService?.duration.toString() ?? ""
  );

  const [price, setPrice] = useState(
    initialService?.price.toString() ?? ""
  );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const service: Service = {
      id:
        initialService?.id ??
        crypto.randomUUID(),

      name,
      description: description || undefined,

      duration: Number(duration),
      price: Number(price),

      createdAt:
        initialService?.createdAt ??
        new Date().toISOString(),
    };

    await onSubmit(service);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {initialService
            ? "Modifier la prestation"
            : "Ajouter une prestation"}
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {initialService
            ? "Modifiez les informations de la prestation."
            : "Renseignez les informations de la prestation."}
        </p>
      </div>

      <div>
        <label
          htmlFor="service-name"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Nom
        </label>

        <input
          id="service-name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          required
          placeholder="Ex. Détartrage"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="service-description"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>

        <textarea
          id="service-description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={4}
          placeholder="Décrivez brièvement la prestation..."
          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="service-duration"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Durée (minutes)
          </label>

          <input
            id="service-duration"
            type="number"
            min="1"
            value={duration}
            onChange={(event) =>
              setDuration(event.target.value)
            }
            required
            placeholder="30"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        <div>
          <label
            htmlFor="service-price"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Prix (DA)
          </label>

          <input
            id="service-price"
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(event) =>
              setPrice(event.target.value)
            }
            required
            placeholder="2000"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-2 dark:border-gray-800">
        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {initialService
            ? "Enregistrer les modifications"
            : "Ajouter la prestation"}
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