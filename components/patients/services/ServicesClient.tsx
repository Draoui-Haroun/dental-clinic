
"use client";

import { useState } from "react";
import type { Service } from "@/types/services";
import ServiceForm from "./ServiceForm";
import {
  addService,
  editService,
  deleteService,
} from "@/app/services/actions";

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
      setError("Service could not be updated.");
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
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) {
      return;
    }

    const deleted = await deleteService(id);

    if (!deleted) {
      setError(
        "This service cannot be deleted because it is used by an appointment."
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
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Services
      </h1>

      <button
        type="button"
        onClick={() =>
          setShowForm((current) => !current)
        }
        className="mb-6 rounded-lg border px-4 py-2"
      >
        {showForm
          ? "Close Form"
          : "+ Add Service"}
      </button>

      {showForm && (
        <ServiceForm
          onSubmit={handleAddService}
          onCancel={() => setShowForm(false)}
        />
      )}

      {error && (
        <div className="mb-6 rounded-lg border p-4">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {services.map((service) => {
          if (
            editingServiceId === service.id
          ) {
            return (
              <ServiceForm
                key={service.id}
                initialService={service}
                onSubmit={handleEditService}
                onCancel={() =>
                  setEditingServiceId(null)
                }
              />
            );
          }

          return (
            <div
              key={service.id}
              className="rounded-xl border p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">
                    {service.name}
                  </h2>

                  {service.description && (
                    <p className="text-sm text-gray-500">
                      {service.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <p>
                  <strong>Duration:</strong>{" "}
                  {service.duration} minutes
                </p>

                <p>
                  <strong>Price:</strong>{" "}
                  {service.price}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditingServiceId(
                      service.id
                    )
                  }
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDeleteService(
                      service.id
                    )
                  }
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}