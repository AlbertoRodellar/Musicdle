"use client";
import { useState } from "react";
import { Artist } from "@/types";
import ArtistSearch from "./ArtistSearch";
import ArtistsList from "./ArtistsList";
import Pagination from "./Pagination";

interface PregameProps {
    onStart: (artist: Artist, rounds: number) => void;
}

const CARDS_PER_PAGE = 6;

export default function Pregame({ onStart }: PregameProps) {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const [page, setPage] = useState(0);

    const visibleArtists = artists.slice(
        page * CARDS_PER_PAGE,
        (page + 1) * CARDS_PER_PAGE,
    );

    async function handleArtistSearch(artistName: string) {
        const response = await fetch(`/api/search?q=${artistName}`);
        const data = await response.json();
        setArtists(data.data);
        setPage(0);
    }

    function handleArtistSelect(artist: Artist) {
        setSelectedArtist(artist);
    }

    function startGame(formData: FormData) {
        const rounds = Number(formData.get("rounds"));
        if (!rounds || rounds < 1 || rounds > 10) return;
        if (!selectedArtist) return;
        onStart(selectedArtist, rounds);
    }

    return (
        <div className="min-h-screen p-8">
            <ArtistSearch onArtistSelect={handleArtistSearch} />
            <ArtistsList
                artists={visibleArtists}
                onSelect={handleArtistSelect}
                selectedArtistId={selectedArtist?.id ?? null}
            />
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
                <p className="mt-4 text-gray-600">
                    Artista seleccionado:{" "}
                    <span className="font-bold text-white">
                        {selectedArtist.name}
                    </span>
                </p>
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
        </div>
    );
}
