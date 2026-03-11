"use client";
import { Artist, RoundResult, Song } from "@/types";
import { useEffect, useState } from "react";
import GameHints from "./GameHints";
import LastGuesses from "./LastGuesses";
import GuessInput from "./GuessInput";
import Timer from "./Timer";
import PreviewPlayer from "./PreviewPlayer";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

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
    const [feedback, setFeedback] = useState("");
    const [guesses, setGuesses] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [timerRunning, setTimerRunning] = useState(false);
    const [loadingRound, setLoadingRound] = useState(true);
    const MS_TO_SHOW_FEEDBACK = 1500;

    useEffect(() => {
        fetch(`/api/songs?artistId=${artist.id}`)
            .then((res) => res.json())
            .then((data) => {
                const allSongs = removeDuplicates(data.data);
                setAllSongs(allSongs);
                const randomSongs = getRandomSongs(allSongs).slice(0, rounds);
                setSelectedSongs(randomSongs);
                setTimerRunning(true);
                setLoadingRound(false);
                console.log(
                    "soluciones:",
                    randomSongs.map((s) => s.title),
                ); // testing
            });
    }, []);

    //fixes bug de canciones con el mismo titulo de la api
    function removeDuplicates(songs: Song[]): Song[] {
        const seen = new Set<string>();
        return songs.filter((song) => {
            if (seen.has(song.title)) return false;
            seen.add(song.title);
            return true;
        });
    }

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
            setFeedback("");
            setStartTime(Date.now());
        } else {
            // onFinish es la funcion que le pasamos desde page.tsx que basicamente hace un emit de los resultados al padre
            // y cambia el gameState para mostrar estos resultados
            onFinish(updatedResults);
        }
    }

    function handleGuess(guess: string) {
        if (loadingRound) return;

        setGuesses((prev) => [...prev, guess]);

        if (guess !== currentSong.title) {
            setAttempts((a) => a + 1);
            setFeedback("❌ Incorrecto.");
            return;
        }

        const newResult: RoundResult = {
            song: {
                title: currentSong.title,
                cover: currentSong.album.cover,
            },
            attempts: attempts + 1,
            skipped: false,
            time: Math.floor((Date.now() - startTime) / 1000), // se calcula en segundos el tiempo que ha tardado en acertar
        };

        setFeedback("✅ Acertaste!");
        setTimerRunning(false);
        setLoadingRound(true);

        toast.success("¡Has acertado!", {
            position: "top-center",
            duration: MS_TO_SHOW_FEEDBACK,
        });

        setTimeout(() => {
            setTimerRunning(true);
            nextRoundOrFinish(newResult, [...results, newResult]);
            setLoadingRound(false);
        }, MS_TO_SHOW_FEEDBACK);
    }

    // si skipea se crea nuevo resultado y se pasa a la siguiente ronda
    function handleSkip() {
        setLoadingRound(true);
        setTimerRunning(false);
        const newResult: RoundResult = {
            song: {
                title: currentSong.title,
                cover: currentSong.album.cover,
            },
            attempts,
            skipped: true,
            time: Math.floor((Date.now() - startTime) / 1000),
        };

        toast("Canción saltada", {
            description: currentSong.title,
            position: "top-center",
            duration: MS_TO_SHOW_FEEDBACK,
        });

        setTimeout(() => {
            setTimerRunning(true);
            nextRoundOrFinish(newResult, [...results, newResult]);
            setLoadingRound(false);
        }, MS_TO_SHOW_FEEDBACK);
    }

    // Filtra las canciones disponibles para adivinar, quitando las que ya se han adivinado o intentado
    const playedSongs = selectedSongs.slice(0, currentRound);

    const availableSongs = allSongs.filter(
        (song) =>
            !guesses.includes(song.title) &&
            !playedSongs.some((s) => s.title === song.title),
    );

    return (
        <div className="p-8">
            <p className="text-gray-500 mb-2">
                Ronda {currentRound + 1} de {rounds}
            </p>
            <Timer running={timerRunning} />
            <h2 className="text-2xl font-bold mb-4">{artist.name}</h2>
            {loadingRound || selectedSongs.length === 0 || !currentSong ? (
                <div>
                    <Skeleton className="mb-6 h-20 w-full max-w-xl rounded-xl" />
                    <div className="flex flex-col gap-3 max-w-md">
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <div className="flex gap-2">
                            <Skeleton className="h-9 w-28 rounded-lg" />
                            <Skeleton className="h-9 w-24 rounded-lg" />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <PreviewPlayer src={currentSong.preview} className="mb-6" />
                    <GuessInput
                        songs={availableSongs}
                        onGuess={(guess) => handleGuess(guess)}
                        onSkip={handleSkip}
                    />
                    <p className="mt-4">{feedback}</p>
                    {guesses.length > 0 && (
                        <>
                            <LastGuesses guesses={guesses} />
                            <GameHints
                                currentSong={currentSong}
                                guesses={guesses.length}
                            />
                        </>
                    )}
                </>
            )}
        </div>
    );
}
