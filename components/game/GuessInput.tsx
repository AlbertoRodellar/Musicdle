"use client";
import { useState } from "react";
import { Song } from "@/types";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";

interface GuessInputProps {
    songs: Song[];
    onGuess: (guess: string) => void;
    onSkip: () => void;
}

export default function GuessInput({
    songs,
    onGuess,
    onSkip,
}: GuessInputProps) {
    const [value, setValue] = useState<string | null>(null);

    function handleGuess() {
        if (!value) return;
        onGuess(value);
        setValue(null);
    }
    function handleSkip() {
        onSkip();
        setValue(null);
    }

    return (
        <div className="flex flex-col gap-3 max-w-md">
            <Combobox
                items={songs.map((song) => song.title)}
                value={value}
                onValueChange={(title) => setValue(title)}
                autoHighlight
            >
                <ComboboxInput placeholder="Escribe el título de la canción..." />
                <ComboboxContent>
                    <ComboboxEmpty>
                        No se encontró ninguna canción.
                    </ComboboxEmpty>
                    <ComboboxList>
                        {(title) => (
                            <ComboboxItem key={title} value={title}>
                                {title}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handleGuess}
                    disabled={!value}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
        </div>
    );
}
