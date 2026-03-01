import { Artist, Song } from "@/types";
import { useEffect, useState } from "react";

interface GameProps {
    artist: Artist;
    rounds: number;
}
interface RoundResult {
    song: string;
    attempts: number;
    skipped: boolean;
}

export default function Game({ artist, rounds }: GameProps) {
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentRound, setCurrentRound] = useState(0);
    const currentSong = songs[currentRound];
    const [results, setResults] = useState<RoundResult[]>([]);
    const [attempts, setAttempts] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch(`/api/songs?artistId=${artist.id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("data:", data.data);
                const allSongs: Song[] = data.data;
                const randomSongs = getRandomSongs(allSongs, rounds);
                setSongs(randomSongs);
            });
    }, []);

    function getRandomSongs(allSongs: Song[], count: number): Song[] {
        const shuffled = [...allSongs].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    function normalize(str: string) {
        return str.toLowerCase().trim().replace(/[''`]/g, "'"); // convierte todas las comillas a la misma
    }

    function handleGuess(formData: FormData) {
        const guess = normalize(formData.get("guess")?.toString() || "");
        const answer = normalize(currentSong.title);
        const correct = guess === answer;

        // si el guess no es correcto attempts +1 y vuelve atras
        if (!correct) {
            console.log("guess:", guess);
            console.log("answer:", answer);
            setAttempts((a) => a + 1);
            setMessage(`❌ Incorrecto. Llevas ${attempts} intentos.`);
            return;
        }
        // si el guess es correcto se crea un nuevo resultado de ronda
        const newResult: RoundResult = {
            song: currentSong.title,
            attempts: attempts + 1, // +1 porque este intento correcto también cuenta
            skipped: false,
        };

        setMessage("✅ Acertaste!");

        setTimeout(() => {
            setMessage(""); // resetea el mensaje
            if (currentRound + 1 < songs.length) {
                setResults((prev) => [...prev, newResult]);
                setCurrentRound((r) => r + 1);
                setAttempts(0); // resetea intentos para la siguiente ronda
            } else {
                setResults((prev) => [...prev, newResult]);
                setGameOver(true);
            }
        }, 2000);
    }

    function handleSkip() {
        const newResult: RoundResult = {
            song: currentSong.title,
            attempts,
            skipped: true,
        };

        if (currentRound + 1 < songs.length) {
            setResults((prev) => [...prev, newResult]);
            setCurrentRound((r) => r + 1);
            setAttempts(0);
        } else {
            setResults((prev) => [...prev, newResult]);
            setGameOver(true);
        }
    }

    if (songs.length === 0) return <p className="p-8">Cargando canciones...</p>;

    if (gameOver)
        return (
            <div className="min-h-screen  p-8">
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
            </div>
        );

    return (
        <div className="min-h-screen  p-8">
            <p className="text-gray-500 mb-2">
                Ronda {currentRound + 1} de {rounds}
            </p>
            <h2 className="text-2xl font-bold mb-4">
                {currentSong.artist.name}
            </h2>
            <audio src={currentSong.preview} controls className="mb-6" />
            <form action={handleGuess} className="flex flex-col gap-3 max-w-md">
                <input
                    type="text"
                    name="guess"
                    placeholder="Escribe el título de la canción..."
                    className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                    required
                />
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer font-medium"
                    >
                        Comprobar
                    </button>
                    <button
                        type="button"
                        onClick={handleSkip}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer font-medium"
                    >
                        Saltar
                    </button>
                </div>
            </form>
            <p>{message}</p>
        </div>
    );
}
