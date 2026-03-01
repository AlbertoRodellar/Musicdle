"use client";
import { Artist, RoundResult, Song } from "@/types";
import { useEffect, useState } from "react";

interface GameProps {
    artist: Artist;
    rounds: number;
    onFinish: (results: RoundResult[]) => void;
}

export default function Game({ artist, rounds, onFinish }: GameProps) {
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentRound, setCurrentRound] = useState(0);
    const currentSong = songs[currentRound];
    const [results, setResults] = useState<RoundResult[]>([]);
    const [attempts, setAttempts] = useState(0);
    const [message, setMessage] = useState("");
    const [guesses, setGuesses] = useState<string[]>([]);

    useEffect(() => {
        fetch(`/api/songs?artistId=${artist.id}`)
            .then((res) => res.json())
            .then((data) => {
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
        return str.toLowerCase().trim().replace(/[''`]/g, "'");
    }

    // pasa a la siguiente ronda o acaba el game
    function nextRoundOrFinish(
        newResult: RoundResult,
        updatedResults: RoundResult[],
    ) {
        if (currentRound + 1 < songs.length) {
            setResults(updatedResults);
            setCurrentRound((r) => r + 1);
            setAttempts(0);
            setGuesses([]);
        } else {
            // onFinish es la funcion que le pasamos desde page.tsx que basicamente hace un emit de los resultados al padre
            // y cambia el gameState para mostrar estos resultados
            onFinish(updatedResults);
        }
    }

    function handleGuess(formData: FormData) {
        const guess = normalize(formData.get("guess")?.toString() || "");
        const answer = normalize(currentSong.title);
        setGuesses((prev) => [...prev, guess]);

        // si el guess no es correcto return
        if (guess !== answer) {
            setAttempts((a) => a + 1);
            setMessage(`❌ Incorrecto.`);
            console.log("answer:", answer);
            return;
        }

        // si el guess es correcto se crea nuevo resultado y despues de 2s se pasa a la siguiente ronda
        const newResult: RoundResult = {
            song: currentSong.title,
            attempts: attempts + 1,
            skipped: false,
        };

        setMessage("✅ Acertaste!");

        setTimeout(() => {
            setMessage("");
            nextRoundOrFinish(newResult, [...results, newResult]);
        }, 2000);
    }

    // si skipea se crea nuevo resultado y se pasa a la siguiente ronda
    function handleSkip() {
        const newResult: RoundResult = {
            song: currentSong.title,
            attempts,
            skipped: true,
        };
        nextRoundOrFinish(newResult, [...results, newResult]);
    }

    if (songs.length === 0) return <p className="p-8">Cargando canciones...</p>;

    return (
        <div className="min-h-screen p-8">
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
            <p className="mt-4">{message}</p>
            {guesses.length > 0 && (
                <div>
                    <p>Intentos:</p>
                    {guesses.map((guess, index) => (
                        <p key={index}>{guess}</p>
                    ))}
                </div>
            )}
        </div>
    );
}
