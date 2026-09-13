
"use client";

import { useState } from "react";
import type { Appointment } from "@/types/appointments";
import type { Patient } from "@/types/patients";
import type { Service } from "@/types/services";

type EditAppointmentFormProps = {
  appointment: Appointment;
  patients: Patient[];
  services: Service[];
  onSubmit: (appointment: Appointment) => Promise<void>;
  onCancel: () => void;
};

export default function EditAppointmentForm({
  appointment,
  patients,
  services,
  onSubmit,
  onCancel,
}: EditAppointmentFormProps) {
  const [patientId, setPatientId] = useState(appointment.patientId);
  const [serviceId, setServiceId] = useState(appointment.serviceId);
  const [date, setDate] = useState(appointment.date);
  const [time, setTime] = useState(appointment.time);
  const [status, setStatus] = useState(appointment.status);
  const [notes, setNotes] = useState(appointment.notes ?? "");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const updatedAppointment: Appointment = {
      ...appointment,
      patientId,
      serviceId,
      date,
      time,
      status,
      notes: notes || undefined,
    };

    await onSubmit(updatedAppointment);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 space-y-4 rounded-xl border p-6"
    >
      <h2 className="text-xl font-semibold">
        Edit Appointment
      </h2>

      <div>
        <label
          htmlFor="edit-patient"
          className="mb-1 block text-sm font-medium"
        >
          Patient
        </label>

        <select
          id="edit-patient"
          value={patientId}
          onChange={(event) => setPatientId(event.target.value)}
          required
          className="w-full rounded-lg border p-3"
        >
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.firstName} {patient.lastName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="edit-service"
          className="mb-1 block text-sm font-medium"
        >
          Service
        </label>

        <select
          id="edit-service"
          value={serviceId}
          onChange={(event) => setServiceId(event.target.value)}
          required
          className="w-full rounded-lg border p-3"
        >
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
            htmlFor="edit-date"
            className="mb-1 block text-sm font-medium"
          >
            Date
          </label>

          <input
            id="edit-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label
            htmlFor="edit-time"
            className="mb-1 block text-sm font-medium"
          >
            Time
          </label>

          <input
            id="edit-time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            required
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="edit-status"
          className="mb-1 block text-sm font-medium"
        >
          Status
        </label>

        <select
          id="edit-status"
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as Appointment["status"]
            )
          }
          className="w-full rounded-lg border p-3"
        >
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="edit-notes"
          className="mb-1 block text-sm font-medium"
        >
          Notes
        </label>

        <textarea
          id="edit-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg border px-4 py-2"
        >
          Save Changes
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