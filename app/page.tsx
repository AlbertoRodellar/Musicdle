"use client";
import { useState } from "react";
import { Artist, RoundResult } from "@/types";
import Menu from "./components/Menu";
import Pregame from "./components/Pregame";
import Game from "./components/Game";
import Results from "./components/Results";

type GameState = "menu" | "pregame" | "game" | "results";

export default function Page() {
    const [gameState, setGameState] = useState<GameState>("menu");
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const [rounds, setRounds] = useState(0);
    const [results, setResults] = useState<RoundResult[]>([]);

    switch (gameState) {
        case "menu":
            return <Menu onArtistMode={() => setGameState("pregame")} />;
        case "pregame":
            return (
                <Pregame
                    onStart={(artist, rounds) => {
                        setSelectedArtist(artist);
                        setRounds(rounds);
                        setGameState("game");
                    }}
                />
            );
        case "game":
            return (
                <Game
                    artist={selectedArtist!}
                    rounds={rounds}
                    onFinish={(results) => {
                        setResults(results);
                        setGameState("results");
                    }}
                />
            );
        case "results":
            return (
                <Results
                    results={results}
                    onReplay={() => setGameState("game")}
                    onRestart={() => setGameState("menu")}
                />
            );
    }
}
