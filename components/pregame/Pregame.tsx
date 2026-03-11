"use client";
import { useState } from "react";
import { Artist } from "@/types";
import ArtistSearch from "./ArtistSearch";
import ArtistsList from "./ArtistsList";
import Pagination from "./Pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface PregameProps {
    onStart: (artist: Artist, rounds: number) => void;
}

const CARDS_PER_PAGE = 6;

export default function Pregame({ onStart }: PregameProps) {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const visibleArtists = artists.slice(
        page * CARDS_PER_PAGE,
        (page + 1) * CARDS_PER_PAGE,
    );

    async function handleArtistSearch(artistName: string) {
        try {
            setError(null);
            setIsLoading(true);
            const response = await fetch(
                `/api/search?q=${encodeURIComponent(artistName)}`,
            );
            if (!response.ok) {
                throw new Error(
                    "No se ha podido buscar el artista. Inténtalo de nuevo.",
                );
            }
            const data = await response.json();
            const sortedArtists = data.data.sort(
                (a: Artist, b: Artist) => b.nb_fan - a.nb_fan,
            );
            setArtists(sortedArtists);
            setSelectedArtist(null);
            setPage(0);
            if (!data.data || data.data.length === 0) {
                setError("No se han encontrado artistas con ese nombre.");
            }
        } catch (e) {
            setArtists([]);
            setSelectedArtist(null);
            setError(
                e instanceof Error
                    ? e.message
                    : "Ha ocurrido un error al buscar el artista.",
            );
        } finally {
            setIsLoading(false);
        }
    }

    function handleArtistSelect(artist: Artist) {
        setSelectedArtist(artist);
    }

    function startGame(formData: FormData) {
        const rounds = Number(formData.get("rounds"));
        if (!selectedArtist) {
            setError("Selecciona un artista antes de empezar la partida.");
            return;
        }
        if (!rounds || rounds < 1 || rounds > 5) {
            setError("Elige un número de rondas entre 1 y 5.");
            return;
        }
        setError(null);
        onStart(selectedArtist, rounds);
    }

    return (
        <div>
            <ArtistSearch onArtistSelect={handleArtistSearch} />
            {isLoading ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-8">
                    {Array.from({ length: CARDS_PER_PAGE }).map((_, i) => (
                        <div
                            key={i}
                            className="h-72 rounded-2xl py-4 px-4 flex flex-col items-center bg-[#1a1f2e]"
                        >
                            <Skeleton className="w-38 h-38 rounded-full mb-4" />
                            <Skeleton className="h-4 w-3/4 rounded-md pt-6 m-auto" />
                            <Skeleton className="h-3 w-1/2 rounded-md mt-auto mb-4" />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <ArtistsList
                        artists={visibleArtists}
                        onSelect={handleArtistSelect}
                        selectedArtistId={selectedArtist?.id ?? null}
                    />
                    {error && (
                        <p className="mt-2 text-red-400 text-sm">{error}</p>
                    )}
                    {artists.length > 0 && (
                        <Pagination
                            page={page}
                            totalItems={artists.length}
                            itemsPerPage={CARDS_PER_PAGE}
                            onNext={() => setPage((p) => p + 1)}
                            onPrev={() => setPage((p) => p - 1)}
                        />
                    )}
                    {selectedArtist && (
                        <p>Tu artista seleccionado: {selectedArtist.name}</p>
                    )}
                    {selectedArtist && (
                        <form
                            action={startGame}
                            className="flex items-center gap-4 mt-4"
                        >
                            <label htmlFor="rounds" className="font-medium">
                                Selecciona cuantas rondas:
                            </label>
                            <input
                                type="number"
                                name="rounds"
                                min={1}
                                max={5}
                                defaultValue={3}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-20 outline-none focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer font-medium"
                            >
                                Empezar!
                            </button>
                        </form>
                    )}
                </>
            )}
        </div>
    );
}
