import { PlayCircle } from "lucide-react";

interface RoundSelectorProps {
    onStart: (rounds: number) => void;
    disabled?: boolean;
}

const ROUND_OPTIONS = [3, 5, 8];

export default function RoundSelector({
    onStart,
    disabled,
}: RoundSelectorProps) {
    function handleSubmit(formData: FormData) {
        const rounds = Number(formData.get("rounds"));
        onStart(rounds);
    }

    return (
        <form action={handleSubmit} className="mt-8 space-y-8">
            <div className="rounded-2xl bg-slate-800/80 p-8 space-y-6">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold">Selección de rondas</h3>
                    <p className="text-sm text-slate-400">
                        ¿Cuántas canciones quieres adivinar?
                    </p>
                </div>
                <div className="flex flex-wrap gap-4">
                    {ROUND_OPTIONS.map((n) => (
                        <label
                            key={n}
                            className="flex-1 min-w-[100px] cursor-pointer group"
                        >
                            <input
                                className="peer hidden"
                                type="radio"
                                name="rounds"
                                value={n}
                                defaultChecked={n === ROUND_OPTIONS[0]}
                            />
                            <div className="flex items-center justify-center rounded-xl border-2 border-slate-700 py-4 px-6 font-bold transition-all peer-checked:bg-blue-500/20 peer-checked:border-blue-500 peer-checked:text-blue-400 group-hover:border-blue-500/50">
                                {n} Rondas
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={disabled}
                className="w-full rounded-2xl bg-blue-500 py-5 text-xl font-bold text-white shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
            >
                <PlayCircle className="w-6 h-6" />
                Empezar partida
            </button>
        </form>
    );
}
