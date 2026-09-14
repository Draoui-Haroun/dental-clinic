
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
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Modifier le rendez-vous
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Modifiez les informations du rendez-vous.
        </p>
      </div>

      <div>
        <label
          htmlFor="edit-patient"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Patient
        </label>

        <select
          id="edit-patient"
          value={patientId}
          onChange={(event) => setPatientId(event.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
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
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Prestation
        </label>

        <select
          id="edit-service"
          value={serviceId}
          onChange={(event) => setServiceId(event.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
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
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Date
          </label>

          <input
            id="edit-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        <div>
          <label
            htmlFor="edit-time"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Heure
          </label>

          <input
            id="edit-time"
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
          htmlFor="edit-status"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Statut
        </label>

        <select
          id="edit-status"
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as Appointment["status"]
            )
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        >
          <option value="scheduled">Planifié</option>
          <option value="completed">Terminé</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="edit-notes"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Notes
        </label>

        <textarea
          id="edit-notes"
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
          Enregistrer les modifications
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}