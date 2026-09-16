
"use client";
import { useActionState } from "react";
import { changePasswordAction } from "@/app/auth/actions";
import { useState } from "react";

const initialState = {
    success: false,
    message: "",
};

export default function ChangePasswordPage() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [state, formAction, isPending] = useActionState(
        async (
            _previousState: typeof initialState,
            formData: FormData
        ) => {
            const currentPassword = formData.get("currentPassword");
            const newPassword = formData.get("newPassword");
            const confirmPassword = formData.get("confirmPassword");

            if (
                typeof currentPassword !== "string" ||
                typeof newPassword !== "string" ||
                typeof confirmPassword !== "string"
            ) {
                return {
                    success: false,
                    message: "Veuillez remplir tous les champs.",
                };
            }

            if (newPassword !== confirmPassword) {
                return {
                    success: false,
                    message: "Les nouveaux mots de passe ne correspondent pas.",
                };
            }

            return await changePasswordAction(
                currentPassword,
                newPassword
            );
        },
        initialState
    );

    return (
        <main className="p-6">
            <div className="mx-auto max-w-xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Changer le mot de passe
                    </h1>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Modifiez le mot de passe utilisé pour accéder à votre cabinet.
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <form action={formAction} className="space-y-5">
                        <div>
                            <label
                                htmlFor="currentPassword"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Mot de passe actuel
                            </label>

                            <div className="relative">
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-12 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-700"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCurrentPassword((value) => !value)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    aria-label={
                                        showCurrentPassword
                                            ? "Masquer le mot de passe"
                                            : "Afficher le mot de passe"
                                    }
                                >
                                    {showCurrentPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="newPassword"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Nouveau mot de passe
                            </label>

                            <div className="relative">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-12 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-700"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowNewPassword((value) => !value)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    aria-label={
                                        showNewPassword
                                            ? "Masquer le mot de passe"
                                            : "Afficher le mot de passe"
                                    }
                                >
                                    {showNewPassword ? "🙈" : "👁️"}
                                </button>
                            </div>

                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Minimum 8 caractères.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Confirmer le nouveau mot de passe
                            </label>

                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-12 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-700"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword((value) => !value)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Masquer le mot de passe"
                                            : "Afficher le mot de passe"
                                    }
                                >
                                    {showConfirmPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {state.message && (
                            <p
                                className={
                                    state.success
                                        ? "text-sm text-green-600 dark:text-green-400"
                                        : "text-sm text-red-600 dark:text-red-400"
                                }
                            >
                                {state.message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                        >
                            {isPending
                                ? "Modification..."
                                : "Modifier le mot de passe"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}