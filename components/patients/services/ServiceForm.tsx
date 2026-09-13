
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
      className="mb-6 space-y-4 rounded-xl border p-6"
    >
      <h2 className="text-xl font-semibold">
        {initialService
          ? "Edit Service"
          : "Add Service"}
      </h2>

      <div>
        <label
          htmlFor="service-name"
          className="mb-1 block text-sm font-medium"
        >
          Name
        </label>

        <input
          id="service-name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          required
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label
          htmlFor="service-description"
          className="mb-1 block text-sm font-medium"
        >
          Description
        </label>

        <textarea
          id="service-description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={3}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="service-duration"
            className="mb-1 block text-sm font-medium"
          >
            Duration (minutes)
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
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label
            htmlFor="service-price"
            className="mb-1 block text-sm font-medium"
          >
            Price
          </label>

          <input
            id="service-price"
            type="number"
            min="0"
            value={price}
            onChange={(event) =>
              setPrice(event.target.value)
            }
            required
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg border px-4 py-2"
        >
          {initialService
            ? "Save Changes"
            : "Add Service"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}