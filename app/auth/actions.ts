
"use server";
import { redirect } from "next/navigation";
import { changePassword, createPassword, hasPassword, verifyPassword } from "@/data/auth-repository";
import { createSession, deleteSession } from "@/lib/auth";

export async function setupPassword(
  password: string
): Promise<{ success: boolean; message: string }> {
  if (hasPassword()) {
    return {
      success: false,
      message: "Un mot de passe est déjà configuré.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Le mot de passe doit contenir au moins 8 caractères.",
    };
  }

  createPassword(password);

  return {
    success: true,
    message: "Mot de passe configuré avec succès.",
  };
}

export async function login(
  password: string
): Promise<{ success: boolean; message: string }> {
  if (!hasPassword()) {
    return {
      success: false,
      message: "Aucun mot de passe n'est configuré.",
    };
  }

  const valid = verifyPassword(password);

  if (!valid) {
    return {
      success: false,
      message: "Mot de passe incorrect.",
    };
  }
  await createSession();
  redirect("/");
}

export async function logout() {
  await deleteSession();
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  if (!hasPassword()) {
    return {
      success: false,
      message: "Aucun mot de passe n'est configuré.",
    };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      message: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
    };
  }

  if (currentPassword === newPassword) {
    return {
      success: false,
      message: "Le nouveau mot de passe doit être différent de l'ancien.",
    };
  }

  const changed = changePassword(currentPassword, newPassword);

  if (!changed) {
    return {
      success: false,
      message: "Le mot de passe actuel est incorrect.",
    };
  }

  return {
    success: true,
    message: "Mot de passe modifié avec succès.",
  };
}