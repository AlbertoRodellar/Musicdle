"use client";
import { Artist, RoundResult, Song } from "@/types";
import { useEffect, useState } from "react";
import GameHints from "./GameHints";
import LastGuesses from "./LastGuesses";

interface GameProps {
    artist: Artist;
    rounds: number;
    onFinish: (results: RoundResult[]) => void;
}

export default function Game({ artist, rounds, onFinish }: GameProps) {
    const [allSongs, setAllSongs] = useState<Song[]>([]);
    const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
    const [currentRound, setCurrentRound] = useState(0);
    const currentSong = selectedSongs[currentRound];
    const [results, setResults] = useState<RoundResult[]>([]);
    const [attempts, setAttempts] = useState(0);
    const [message, setMessage] = useState("");
    const [guesses, setGuesses] = useState<string[]>([]);

    useEffect(() => {
        fetch(`/api/songs?artistId=${artist.id}`)
            .then((res) => res.json())
            .then((data) => {
                const allSongs: Song[] = data.data;
                setAllSongs(allSongs);
                const randomSongs = getRandomSongs(allSongs).slice(0, rounds);
                setSelectedSongs(randomSongs);
            });
    }, []);

    function getRandomSongs(allSongs: Song[]): Song[] {
        const shuffled = [...allSongs].sort(() => Math.random() - 0.5);
        return shuffled;
    }

    function normalize(str: string) {
        return str.toLowerCase().trim().replace(/[''`]/g, "'");
    }

    // pasa a la siguiente ronda o acaba el game
    function nextRoundOrFinish(
        newResult: RoundResult,
        updatedResults: RoundResult[],
    ) {
        if (currentRound + 1 < selectedSongs.length) {
            setResults(updatedResults);
            setCurrentRound((r) => r + 1);
            setAttempts(0);
            setGuesses([]);
            setMessage("");
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

    if (selectedSongs.length === 0) return <p className="p-8">Cargando canciones...</p>;

    return (
        <div className="min-h-screen p-8">
            <p className="text-gray-500 mb-2">
                Ronda {currentRound + 1} de {rounds}
            </p>
            <h2 className="text-2xl font-bold mb-4">
                {artist.name}
            </h2>
            <audio src={currentSong.preview} controls className="mb-6" />
            <form action={handleGuess} className="flex flex-col gap-3 max-w-md">
                <input
                    type="text"
                    name="guess"
                    placeholder="Escribe el título de la canción..."
                    className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                    list="songs-list"
                    required
                />
                <datalist id="songs-list" className="bg-white">
                    {allSongs.map((song) => (
                        <option key={song.id} value={song.title} />
                    ))}
                </datalist>
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
                <>
                    <LastGuesses guesses={guesses} />
                    <GameHints
                        currentSong={currentSong}
                        guesses={guesses.length}
                    />
                </>
            )}
        </div>
    );
}
