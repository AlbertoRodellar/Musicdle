"use client";
import { useState } from "react";
import ArtistSearch from "./components/ArtistSearch";
import ArtistsList from "./components/ArtistsList";
import Pagination from "./components/Pagination";
import Game from "./components/Game";

import { Artist } from "@/types";

const CARDS_PER_PAGE = 6;

export default function Page() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const [page, setPage] = useState(0);
    const [rounds, setRounds] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

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
        setRounds(rounds);
        setGameStarted(true);
    }

    if (gameStarted && selectedArtist)
        return <Game artist={selectedArtist} rounds={rounds} />;

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">Adivina la canción</h1>
            <ArtistSearch onArtistSelect={handleArtistSearch} />
            <ArtistsList
                artists={visibleArtists}
                onSelect={handleArtistSelect}
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
