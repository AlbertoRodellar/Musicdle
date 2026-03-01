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
            console.log('guess:', guess)
            console.log('answer:', answer)
            setAttempts((a) => a + 1);
            return;
        }
        // si el guess es correcto se crea un nuevo resultado de ronda
        const newResult: RoundResult = {
            song: currentSong.title,
            attempts: attempts + 1, // +1 porque este intento correcto también cuenta
            skipped: false,
        };

        if (currentRound + 1 < songs.length) {
            setResults((prev) => [...prev, newResult]);
            setCurrentRound((r) => r + 1);
            setAttempts(0); // resetea los intentos para la siguiente ronda
        } else {
            setResults((prev) => [...prev, newResult]);
            setGameOver(true);
        }
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

    if (songs.length === 0) return <p>Cargando canciones...</p>;
    if (gameOver)
        return (
            <div>
                <h2>¡Juego terminado!</h2>
                {results.map((result, index) => (
                    <div key={index}>
                        <p>
                            Ronda {index + 1}: {result.song}
                        </p>
                        <p>
                            {result.skipped
                                ? "⏭️ Saltada"
                                : `✅ Adivinada en ${result.attempts} intentos`}
                        </p>
                    </div>
                ))}
            </div>
        );
    return (
        <div>
            <p>
                Ronda {currentRound + 1} de {rounds}
            </p>
            <p>{currentSong.artist.name}</p>
            <audio src={currentSong.preview} controls />
            <form action={handleGuess}>
                <input
                    type="text"
                    name="guess"
                    placeholder="Escribe el título de la canción..."
                />
                <br />
                <button type="submit">Comprobar</button>
                <button type="button" onClick={handleSkip}>
                    Saltar
                </button>
            </form>
        </div>
    );
}
