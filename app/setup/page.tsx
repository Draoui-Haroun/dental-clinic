
"use client";

import { useActionState } from "react";
import { setupPassword } from "../auth/actions";
import { useRouter } from "next/navigation";

const initialState = {
    success: false,
    message: "",
};

export default function SetupPage() {
    const [state, formAction, isPending] = useActionState(
        async (_previousState: typeof initialState, formData: FormData) => {
            const password = formData.get("password");

            if (typeof password !== "string") {
                return {
                    success: false,
                    message: "Veuillez saisir un mot de passe.",
                };
            }

            const result = await setupPassword(password);

            if (result.success) {
                router.push("/login");
            }

            return result;
        },
        initialState
    );

    const router = useRouter();

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6 dark:bg-gray-950">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Première configuration
                    </h1>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Créez le mot de passe qui protégera votre cabinet.
                    </p>
                </div>

                <form action={formAction} className="space-y-5">
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Nouveau mot de passe
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={8}
                            autoComplete="new-password"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-700"
                        />
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
                        {isPending ? "Configuration..." : "Créer le mot de passe"}
                    </button>
                </form>
            </div>
        </main>
    );
}