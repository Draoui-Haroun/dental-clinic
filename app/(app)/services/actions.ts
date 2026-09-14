
"use server";

import {
  createService,
  updateServiceById,
  deleteServiceById,
} from "@/data/service-repository";
import { requireSession } from "@/lib/auth";

import type { Service } from "@/types/services";

export async function addService(service: Service) {
  await requireSession();
  createService(service);
}

export async function editService(service: Service) {
  await requireSession();
  return updateServiceById(service);
}

export async function deleteService(id: string) {
  await requireSession();
  return deleteServiceById(id);
}
