import { RoundResult } from "@/types";
import { formatTime } from "@/lib/time";
import { Card, CardContent } from "@/components/ui/card";

interface ResultCardProps {
    result: RoundResult;
    index: number;
}

export default function ResultCard({ result, index }: ResultCardProps) {
    return (
        <Card className="bg-slate-800/80 border border-gray-200 mb-3">
            <CardContent className="flex items-center gap-4 px-4">
                <img
                    src={result.song.cover}
                    alt={result.song.title}
                    className="w-30 h-30 object-cover shrink-0"
                />
                <div className="flex flex-col gap-1 min-w-0">
                    <p className="font-bold truncate">{result.song.title}</p>
                    <p className="text-gray-400 text-sm">
                        {result.skipped
                            ? "⏭️ Saltada"
                            : `✅ Adivinada en ${result.attempts} intentos`}
                    </p>
                    <p className="text-gray-400 text-sm">
                        Tiempo: {formatTime(result.time)}
                    </p>
                </div>
                <div className="ml-auto shrink-0 text-right">
                    <p className="text-xs text-slate-500">Ronda {index + 1}</p>
                </div>
            </CardContent>
        </Card>
    );
}
