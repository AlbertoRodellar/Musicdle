"use client";
import { Song } from "@/types";
import { useEffect, useState } from "react";

interface GameHintsProps {
    currentSong: Song;
    guesses: number;
}

const HINT_1 = 2; // titulo y portada del album
const HINT_2 = 5; // lista canciones del album

export default function GameHints({ currentSong, guesses }: GameHintsProps) {
    const [albumTracks, setAlbumTracks] = useState<string[]>([]);
    const [releaseDate, setReleaseDate] = useState<string>("");
    console.log("currentSong:", currentSong);

    // Al renderizar el componente hacemos fetch para obtener canciones del album
    useEffect(() => {
        fetch(`/api/album?albumId=${currentSong.album.id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("data:", data);
                const titles = data.tracks.data.map(
                    (track: { title: string }) => track.title,
                );
                setReleaseDate(data.release_date);
                setAlbumTracks(titles);
            });
    }, [currentSong.album.id]);

    // Funcion para calcular cuantos intento faltan para la siguiente pista, o null si ya se han mostrado todas las pistas
    function getNextHintIn(guesses: number): number | null {
        if (guesses < HINT_1) return HINT_1 - guesses;
        if (guesses < HINT_2) return HINT_2 - guesses;
        return null;
    }

    const nextHintIn = getNextHintIn(guesses);

    return (
        <div className="mt-6 flex flex-col gap-4">
            {nextHintIn && (
                <p className="text-gray-500 text-sm">
                    Siguiente pista en{" "}
                    <span className="font-bold text-white">{nextHintIn}</span>{" "}
                    intentos
                </p>
            )}

            {guesses >= HINT_1 && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col gap-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Álbum
                    </p>

                    <div className="flex items-center gap-4">
                        <img
                            src={currentSong.album.cover}
                            alt={currentSong.album.title}
                            className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex flex-col">
                            <p className="font-semibold text-lg">
                                {currentSong.album.title}
                            </p>
                            <p className="text-sm text-gray-500">
                                {releaseDate}
                            </p>
                        </div>
                    </div>

                    {guesses >= HINT_2 && albumTracks.length > 0 && (
                        <>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                Canciones del álbum
                            </p>
                            <ul className="columns-2 gap-2">
                                {albumTracks.map((track, index) => (
                                    <li
                                        key={index}
                                        className="text-sm text-gray-300 list-disc list-inside"
                                    >
                                        {track}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
