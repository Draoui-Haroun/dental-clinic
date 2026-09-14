
"use client";
import { useState } from "react";
import type { Service } from "@/types/services";
import ServiceForm from "./ServiceForm";
import {
  addService,
  editService,
  deleteService,
} from "@/app/(app)/services/actions";

type ServicesClientProps = {
  initialServices: Service[];
};

export default function ServicesClient({
  initialServices,
}: ServicesClientProps) {
  const [services, setServices] =
    useState(initialServices);

  const [showForm, setShowForm] =
    useState(false);

  const [editingServiceId, setEditingServiceId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  async function handleAddService(
    service: Service
  ) {
    await addService(service);

    setServices((currentServices) => [
      service,
      ...currentServices,
    ]);

    setShowForm(false);
    setError(null);
  }

  async function handleEditService(
    service: Service
  ) {
    const updated = await editService(service);

    if (!updated) {
      setError(
        "La prestation n'a pas pu être modifiée."
      );
      return;
    }

    setServices((currentServices) =>
      currentServices.map((currentService) =>
        currentService.id === service.id
          ? service
          : currentService
      )
    );

    setEditingServiceId(null);
    setError(null);
  }

  async function handleDeleteService(
    id: string
  ) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette prestation ?"
    );

    if (!confirmed) {
      return;
    }

    const deleted = await deleteService(id);

    if (!deleted) {
      setError(
        "Cette prestation ne peut pas être supprimée car elle est utilisée par un rendez-vous."
      );

      return;
    }

    setServices((currentServices) =>
      currentServices.filter(
        (service) => service.id !== id
      )
    );

    setError(null);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
      {/* Header */}
      <section className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Gestion du cabinet
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Prestations
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Gérez les prestations proposées par le cabinet.
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
              : "+ Ajouter une prestation"}
          </button>
        </div>
      </section>

      {/* Add form */}
      {showForm && (
        <section className="mb-8">
          <ServiceForm
            onSubmit={handleAddService}
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
          {services.length}{" "}
          {services.length === 1
            ? "prestation"
            : "prestations"}
        </p>
      </section>

      {/* Empty state */}
      {services.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="font-medium text-gray-700 dark:text-gray-200">
            Aucune prestation.
          </p>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ajoutez une prestation pour commencer.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {services.map((service) => {
            if (
              editingServiceId === service.id
            ) {
              return (
                <div
                  key={service.id}
                  className="md:col-span-2"
                >
                  <ServiceForm
                    initialService={service}
                    onSubmit={handleEditService}
                    onCancel={() =>
                      setEditingServiceId(null)
                    }
                  />
                </div>
              );
            }

            return (
              <article
                key={service.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-6"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {service.name}
                  </h2>

                  {service.description ? (
                    <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      {service.description}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm italic text-gray-400 dark:text-gray-500">
                      Aucune description.
                    </p>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
                  <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                      Durée
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {service.duration} min
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                      Prix
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {service.price.toLocaleString("fr-FR")} DA
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-5 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingServiceId(
                        service.id
                      )
                    }
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Modifier
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteService(
                        service.id
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