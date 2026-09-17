
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
  const [patientSearch, setPatientSearch] = useState("");
  const [showPatientResults, setShowPatientResults] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const filteredPatients = patients.filter((patient) =>
    `${patient.firstName} ${patient.lastName}`
      .toLowerCase()
      .includes(patientSearch.toLowerCase())
  );

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
    setPatientSearch("");
    setShowPatientResults(false);
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

        <div className="relative">
          <input
            id="patient"
            type="text"
            value={patientSearch}
            onChange={(event) => {
              setPatientSearch(event.target.value);
              setShowPatientResults(true);
              setPatientId("");
            }}
            onFocus={() => setShowPatientResults(true)}
            placeholder="Rechercher un patient..."
            autoComplete="off"
            required={!patientId}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
          />

          {showPatientResults && patientSearch && (
            <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => {
                      setPatientId(patient.id);
                      setPatientSearch(
                        `${patient.firstName} ${patient.lastName}`
                      );
                      setShowPatientResults(false);
                    }}
                    className="block w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50"
                  >
                    {patient.firstName} {patient.lastName}
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-gray-500">
                  Aucun patient trouvé.
                </p>
              )}
            </div>
          )}
        </div>
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
            onChange={(event) => {
              console.log("TIME VALUE:", event.target.value);
              setTime(event.target.value);
            }}
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