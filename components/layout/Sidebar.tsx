
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/app/ThemeProvider";
import { logout } from "@/app/auth/actions";

const navigation = [
  {
    name: "Tableau de bord",
    href: "/",
    icon: "⌂",
  },
  {
    name: "Patients",
    href: "/patients",
    icon: "👥",
  },
  {
    name: "Rendez-vous",
    href: "/appointments",
    icon: "📅",
  },
  {
    name: "Prestations",
    href: "/services",
    icon: "🦷",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:flex">
        <div className="border-b px-6 py-4">
          <div className="mb-4 flex justify-end">

          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-lg text-white">
              🦷
            </div>

            <div>
              <h1 className="font-semibold text-gray-900 dark:text-white">
                Cabinet dentaire
              </h1>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Gestion du cabinet
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="rounded-lg bg-gray-100 px-3 py-2 text-sm transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              aria-label="Changer le thème"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Menu principal
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${isActive
                      ? "bg-white/10 dark:bg-gray-900/10"
                      : "bg-gray-100 dark:bg-gray-800"
                      }`}
                  >
                    {item.icon}
                  </span>

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Cabinet dentaire
            </p>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Gestion locale
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="border-b bg-white md:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white">
              🦷
            </div>

            <div>
              <p className="text-sm font-semibold">
                Cabinet dentaire
              </p>

              <p className="text-xs text-gray-500">
                Gestion du cabinet
              </p>
            </div>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3">
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${isActive
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
                  }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}