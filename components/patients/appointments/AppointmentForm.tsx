
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-xl border p-6">
      <div>
        <label htmlFor="patient" className="mb-1 block text-sm font-medium">
          Patient
        </label>

        <select
          id="patient"
          value={patientId}
          onChange={(event) => setPatientId(event.target.value)}
          required
          className="w-full rounded-lg border p-3"
        >
          <option value="">Select patient</option>

          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.firstName} {patient.lastName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="service" className="mb-1 block text-sm font-medium">
          Service
        </label>

        <select
          id="service"
          value={serviceId}
          onChange={(event) => setServiceId(event.target.value)}
          required
          className="w-full rounded-lg border p-3"
        >
          <option value="">Select service</option>

          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium">
            Date
          </label>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label htmlFor="time" className="mb-1 block text-sm font-medium">
            Time
          </label>

          <input
            id="time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            required
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium">
          Notes
        </label>

        <textarea
          id="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="w-full rounded-lg border p-3"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="rounded-lg border px-4 py-2"
      >
        Add Appointment
      </button>
    </form>
  );
}