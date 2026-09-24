
import { getOrdonnanceDetailsById } from "@/data/ordonnance-repository";
import PrintButton from "@/components/ordonnances/PrintButton";
import Link from "next/link";

type OrdonnancePageProps = {
    params: Promise<{
        id: string;
    }>;
};

function calculateAge(dateOfBirth: string | null) {
    if (!dateOfBirth) {
        return null;
    }

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference =
        today.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 &&
            today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}

export default async function OrdonnancePage({
    params,
}: OrdonnancePageProps) {
    const { id } = await params;

    const ordonnance = getOrdonnanceDetailsById(id);

    if (!ordonnance) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
                <p className="text-sm text-gray-600">
                    Ordonnance introuvable
                </p>
            </main>
        );
    }

    const age = calculateAge(
        ordonnance.patient.date_of_birth
    );

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 p-6 dark:bg-gray-950 print:block print:min-h-0 print:p-0">
            <div className="flex items-center gap-3 print:hidden">
                <Link
                    href={`/patients/${ordonnance.patient.id}`}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                    ← Retour au patient
                </Link>

                <PrintButton />
            </div>

            <div
                className="relative h-[210mm] w-[148mm] shrink-0 bg-white bg-center bg-no-repeat print:h-[210mm] print:w-[148mm]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url('/images/prescription.jpg')",
                    backgroundSize: "contain",
                }}
            >
                <div className="absolute left-6 top-6 text-[17px]">
                    <p className="font-semibold">
                        Dr. BABA ALIM .épse Belguet
                    </p>

                    <p>Médecin dentiste</p>
                </div>

                <div className="font-medium absolute right-30 top-6 text-[15px]">
                    <p>
                        Alger le :{" "}
                        {new Intl.DateTimeFormat("fr-FR").format(
                            new Date(ordonnance.date)
                        )}
                    </p>

                    <p>
                        Nom : {ordonnance.patient.last_name}
                    </p>

                    <p>
                        Prénom : {ordonnance.patient.first_name}
                    </p>

                    <p>
                        Âge : {age !== null ? `${age} ans` : "..........."}
                    </p>
                </div>

                <div className="absolute left-0 right-0 top-34 text-center pt-[20px]">
                    <div className="flex items-center justify-center gap-2">
                        <span className="h-[1px] w-20 bg-black" />

                        <span className="h-2 w-2 rounded-full border border-black bg-black" />

                        <span className="h-[1px] w-20 bg-black" />
                    </div>

                    <div className="h-2"></div>

                    <h1 className="font-serif text-[25px] font-extrabold uppercase tracking-wide">
                        ORDONNANCE
                    </h1>

                    <div className="flex items-center justify-center gap-2">
                        <span className="h-[3px] w-25 bg-black" />

                        <span className="h-3 w-3 rounded-full border border-black bg-black" />

                        <span className="h-[3px] w-25 bg-black" />
                    </div>
                </div>

                <div className="absolute left-10 right-10 top-56 space-y-3 text-[17px] pt-[30px]">
                    {ordonnance.items.map((item, index) => (
                        <div key={item.id}>
                            <p>
                                {index + 1}. {item.medicine_name}
                            </p>

                            {item.duration && (
                                <p className="ml-6">
                                    {item.duration} jours
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-6 left-6 right-6 border-t-4 border-double border-black pt-2 text-center text-sm">
                    <p>
                        Cité Rokazin N 35. 1er étage Baraki-Alger
                    </p>

                    <p>
                        Mob : 0555 82 28 64
                    </p>
                </div>
            </div>
        </main>
    );
}

