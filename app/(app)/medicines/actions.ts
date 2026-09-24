
"use server";

import { createMedicine, deleteMedicineById, updateMedicine } from "@/data/medicine-repository";

export async function addMedicine(
  id: string,
  name: string,
  createdAt: string
) {
  return createMedicine(id, name, createdAt);
}

export async function editMedicine(
  id: string,
  name: string
) {
  return updateMedicine(id, name);
}

export async function deleteMedicine(id: string) {
  return deleteMedicineById(id);
}