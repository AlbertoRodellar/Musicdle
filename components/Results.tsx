import { RoundResult } from "@/types";

interface ResultsProps {
    results: RoundResult[];
    onReplay: () => void;
    onRestart: () => void;
}

export default function Results({
    results,
    onReplay,
    onRestart,
}: ResultsProps) {
    // Calcula los puntos totales segun los results
    // Empiezas con 1000 puntos por ronda, y se van restando puntos -100 cada intento y -50 cada 5 segundos
    // El roundScore con el Math.max garantiza que no se resten puntos, el puntaje minimo por ronda es 0
    function calculateScore(results: RoundResult[]): number {
        return results.reduce((total, result) => {
            if (result.skipped) return total;
            const base = 1000;
            const attemptPenalty = result.attempts * 100;
            const timePenalty = Math.floor(result.time / 5) * 50;
            const roundScore = Math.max(0, base - attemptPenalty - timePenalty);
            return total + roundScore;
        }, 0);
    }
    const totalTime = results.reduce((total, result) => total + result.time, 0);

    return (
        <div className="min-h-screen p-8">
            <h2 className="text-3xl font-bold mb-6">¡Juego terminado!</h2>
            <p className="text-xl font-bold mb-6">
                Puntuación total: {calculateScore(results)}
                <span className="text-gray-500 text-sm ml-1">
                    / {results.length * 1000}
                </span>
            </p>
            <p className="text-gray-500 mb-6">
                Tiempo total: {totalTime} segundos
            </p>
            {results.map((result, index) => (
                <div
                    key={index}
                    className="bg-gray-800 border border-gray-200 rounded-xl p-4 mb-3 flex items-center gap-4"
                >
                    <img src={result.song.cover} alt={result.song.title} />
                    <div className="flex flex-col">
                        <p className="font-bold">{result.song.title}</p>
                        <p className="text-gray-400">
                            {result.skipped
                                ? "⏭️ Saltada"
                                : `✅ Adivinada en ${result.attempts} intentos`}
                        </p>
                        <p className="text-gray-400">
                            Tiempo: {result.time} segundos
                        </p>
                    </div>
                </div>
            ))}
            <button
                onClick={onReplay}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer font-medium mr-4"
            >
                Volver a jugar
            </button>
            <button
                onClick={onRestart}
                className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer font-medium"
            >
                Volver al menú
            </button>
        </div>
    );
}
