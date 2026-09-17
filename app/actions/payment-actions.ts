
"use server";

import { createPayment, deletePayment, updatePayment } from "@/data/payment-repository";

import { requireSession } from "@/lib/auth";
import type { Payment } from "@/data/payment-repository";

export async function addPayment(payment: Payment) {
  await requireSession();
  createPayment(payment);
}

export async function editPayment(payment: Payment) {
  await requireSession();
  return updatePayment(payment);
}

export async function removePayment(id: string) {
  await requireSession();
  return deletePayment(id);
}