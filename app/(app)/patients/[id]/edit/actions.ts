

"use server";
import { updatePatientById } from "@/data/patient-repository";

export async function updatePatient(
  previousState: string,
  formData: FormData
) {
  const firstName = formData.get("firstName")?.toString().trim() ?? "";
  const lastName = formData.get("lastName")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";

  const dateOfBirth =
    formData.get("dateOfBirth")?.toString() ?? "";

  const genderValue = formData.get("gender")?.toString();

  const gender: "male" | "female" | undefined =
    genderValue === "male" || genderValue === "female"
      ? genderValue
      : undefined;

  const address =
    formData.get("address")?.toString().trim() ?? "";

  const notes =
    formData.get("notes")?.toString().trim() ?? "";

  const updatedPatient = {
    id: formData.get("id")?.toString() ?? "",
    firstName,
    lastName,
    phone,
    dateOfBirth,
    gender,
    address,
    notes,
    createdAt:
      formData.get("createdAt")?.toString() ?? "",
  };
  const updated = updatePatientById(updatedPatient);

  if (!updated) {
    return "Patient not found";
  }

  return "Patient updated successfully";
}