
"use client";

import { useState } from "react";
import type { Appointment } from "@/types/appointments";
import type { Patient } from "@/types/patients";
import type { Service } from "@/types/services";

import AppointmentForm from "./AppointmentForm";
import EditAppointmentForm from "./EditAppointmentForm";

import {
  addAppointment,
  editAppointment,
  changeAppointmentStatus,
} from "@/app/appointments/actions";

type AppointmentsClientProps = {
  initialAppointments: Appointment[];
  patients: Patient[];
  services: Service[];
};

export default function AppointmentsClient({
  initialAppointments,
  patients,
  services,
}: AppointmentsClientProps) {
  const [appointments, setAppointments] =
    useState(initialAppointments);

  const [showForm, setShowForm] = useState(false);

  const [editingAppointmentId, setEditingAppointmentId] =
    useState<string | null>(null);

  async function handleAddAppointment(
    appointment: Appointment
  ) {
    await addAppointment(appointment);

    setAppointments((currentAppointments) => [
      ...currentAppointments,
      appointment,
    ]);

    setShowForm(false);
  }

  async function handleEditAppointment(
    appointment: Appointment
  ) {
    await editAppointment(appointment);

    setAppointments((currentAppointments) =>
      currentAppointments.map((currentAppointment) =>
        currentAppointment.id === appointment.id
          ? appointment
          : currentAppointment
      )
    );

    setEditingAppointmentId(null);
  }

  async function handleStatusChange(
    id: string,
    status: Appointment["status"]
  ) {
    await changeAppointmentStatus(id, status);

    setAppointments((currentAppointments) =>
      currentAppointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status }
          : appointment
      )
    );
  }

  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Appointments
      </h1>

      <button
        type="button"
        onClick={() => setShowForm((current) => !current)}
        className="mb-6 rounded-lg border px-4 py-2"
      >
        {showForm ? "Close Form" : "+ Add Appointment"}
      </button>

      {showForm && (
        <AppointmentForm
          patients={patients}
          services={services}
          onSubmit={handleAddAppointment}
        />
      )}

      <div className="space-y-4">
        {appointments.map((appointment) => {
          const patient = patients.find(
            (patient) =>
              patient.id === appointment.patientId
          );

          const service = services.find(
            (service) =>
              service.id === appointment.serviceId
          );

          if (editingAppointmentId === appointment.id) {
            return (
              <EditAppointmentForm
                key={appointment.id}
                appointment={appointment}
                patients={patients}
                services={services}
                onSubmit={handleEditAppointment}
                onCancel={() =>
                  setEditingAppointmentId(null)
                }
              />
            );
          }

          return (
            <div
              key={appointment.id}
              className="rounded-xl border p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">
                    {patient
                      ? `${patient.firstName} ${patient.lastName}`
                      : "Unknown patient"}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {service?.name ?? "Unknown service"}
                  </p>
                </div>

                <span className="rounded-full border px-3 py-1 text-sm">
                  {appointment.status}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <p>
                  <strong>Date:</strong>{" "}
                  {appointment.date}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {appointment.time}
                </p>

                {appointment.notes && (
                  <p className="text-gray-500">
                    <strong>Notes:</strong>{" "}
                    {appointment.notes}
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditingAppointmentId(
                      appointment.id
                    )
                  }
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  Edit
                </button>

                {appointment.status === "scheduled" && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(
                          appointment.id,
                          "completed"
                        )
                      }
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      Mark Completed
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(
                          appointment.id,
                          "cancelled"
                        )
                      }
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}

                {appointment.status === "cancelled" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(
                        appointment.id,
                        "scheduled"
                      )
                    }
                    className="rounded-lg border px-3 py-2 text-sm"
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}