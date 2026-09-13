
"use server";

import {
  createService,
  updateServiceById,
  deleteServiceById,
} from "@/data/service-repository";

import type { Service } from "@/types/services";

export async function addService(
  service: Service
) {
  createService(service);
}

export async function editService(
  service: Service
) {
  return updateServiceById(service);
}

export async function deleteService(
  id: string
) {
  return deleteServiceById(id);
}