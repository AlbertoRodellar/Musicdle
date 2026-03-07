"use client";
import { Artist, RoundResult, Song } from "@/types";
import { useEffect, useState } from "react";
import GameHints from "./GameHints";
import LastGuesses from "./LastGuesses";
import GuessInput from "./GuessInput";
import Timer from "./Timer";

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
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [timerRunning, setTimerRunning] = useState(false);

    useEffect(() => {
        fetch(`/api/songs?artistId=${artist.id}`)
            .then((res) => res.json())
            .then((data) => {
                const allSongs: Song[] = data.data;
                setAllSongs(allSongs);
                const randomSongs = getRandomSongs(allSongs).slice(0, rounds);
                setSelectedSongs(randomSongs);
                setTimerRunning(true);
                console.log(
                    "soluciones:",
                    randomSongs.map((s) => s.title),
                );
            });
    }, []);

    function getRandomSongs(allSongs: Song[]): Song[] {
        const shuffled = [...allSongs].sort(() => Math.random() - 0.5);
        return shuffled;
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
            setStartTime(Date.now());
        } else {
            // onFinish es la funcion que le pasamos desde page.tsx que basicamente hace un emit de los resultados al padre
            // y cambia el gameState para mostrar estos resultados
            onFinish(updatedResults);
        }
    }

    function handleGuess(guess: string) {
        setGuesses((prev) => [...prev, guess]);

        if (guess !== currentSong.title) {
            setAttempts((a) => a + 1);
            setMessage("❌ Incorrecto.");
            return;
        }

        const newResult: RoundResult = {
            song: currentSong.title,
            attempts: attempts + 1,
            skipped: false,
            time: Math.floor((Date.now() - startTime) / 1000), // se calcula en segundos el tiempo que ha tardado en acertar
        };

        setMessage("✅ Acertaste!");
        setTimerRunning(false);
        
        setTimeout(() => {
            setTimerRunning(true);
            nextRoundOrFinish(newResult, [...results, newResult]);
        }, 2000);
    }

    // si skipea se crea nuevo resultado y se pasa a la siguiente ronda
    function handleSkip() {
        const newResult: RoundResult = {
            song: currentSong.title,
            attempts,
            skipped: true,
            time: Math.floor((Date.now() - startTime) / 1000),
        };
        nextRoundOrFinish(newResult, [...results, newResult]);
    }

    // Filtra las canciones disponibles para adivinar, quitando las que ya se han adivinado o intentado
    const playedSongs = selectedSongs.slice(0, currentRound);

    const availableSongs = allSongs.filter(
        (song) =>
            !guesses.includes(song.title) &&
            !playedSongs.some((s) => s.title === song.title),
    );

    if (selectedSongs.length === 0)
        return <p className="p-8">Cargando canciones...</p>;

    return (
        <div className="min-h-screen p-8">
            <p className="text-gray-500 mb-2">
                Ronda {currentRound + 1} de {rounds}
            </p>
            <Timer running={timerRunning} />
            <h2 className="text-2xl font-bold mb-4">{artist.name}</h2>
            <audio src={currentSong.preview} controls className="mb-6" />
            <GuessInput
                songs={availableSongs}
                onGuess={(guess) => handleGuess(guess)}
                onSkip={handleSkip}
            />
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
