
"use client";

import { useState } from "react";
import type { Appointment, AppointmentStatus } from "@/types/appointments";
import type { Patient } from "@/types/patients";
import type { Service } from "@/types/services";

type AppointmentFormProps = {
  patients: Patient[];
  services: Service[];
  onSubmit: (appointment: Appointment) => Promise<void>;
};

export default function AppointmentForm({
  patients,
  services,
  onSubmit,
}: AppointmentFormProps) {
  const [patientId, setPatientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const appointment: Appointment = {
      id: crypto.randomUUID(),
      patientId,
      serviceId,
      date,
      time,
      status: "scheduled" as AppointmentStatus,
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
    };

    await onSubmit(appointment);

    setPatientId("");
    setServiceId("");
    setDate("");
    setTime("");
    setNotes("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div>
        <label
          htmlFor="patient"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Patient
        </label>

        <select
          id="patient"
          value={patientId}
          onChange={(event) => setPatientId(event.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        >
          <option value="">Sélectionner un patient</option>

          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.firstName} {patient.lastName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="service"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Prestation
        </label>

        <select
          id="service"
          value={serviceId}
          onChange={(event) => setServiceId(event.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        >
          <option value="">Sélectionner une prestation</option>

          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="date"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Date
          </label>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        <div>
          <label
            htmlFor="time"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Heure
          </label>

          <input
            id="time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="notes"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Notes
        </label>

        <textarea
          id="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
          placeholder="Ajouter une note concernant le rendez-vous..."
          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        />
      </div>

      <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Ajouter le rendez-vous
        </button>
      </div>
    </form>
  );
}