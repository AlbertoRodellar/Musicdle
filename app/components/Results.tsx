import { RoundResult } from "@/types";

interface ResultsProps {
    results: RoundResult[];
    onRestart: () => void;
}

export default function Results({ results, onRestart }: ResultsProps) {
    return (
        <div className="min-h-screen p-8">
            <h2 className="text-3xl font-bold mb-6">¡Juego terminado!</h2>
            {results.map((result, index) => (
                <div
                    key={index}
                    className="bg-gray-800 border border-gray-200 rounded-xl p-4 mb-3"
                >
                    <p className="font-bold">{result.song}</p>
                    <p className="text-gray-400">
                        {result.skipped
                            ? "⏭️ Saltada"
                            : `✅ Adivinada en ${result.attempts} intentos`}
                    </p>
                </div>
            ))}
            <button
                onClick={onRestart}
                className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer font-medium"
            >
                Volver al menú
            </button>
        </div>
    );
}
