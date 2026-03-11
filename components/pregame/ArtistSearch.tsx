import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ArtistSearchProps {
    onArtistSelect: (artist: string) => void;
}

export default function ArtistSearch({ onArtistSelect }: ArtistSearchProps) {
    const [value, setValue] = useState("");

    function searchArtist(formData: FormData) {
        const artist = formData.get("artist")?.toString() || "";
        if (!artist) return;
        onArtistSelect(artist);
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                    Game by Artist
                </h2>
                <p className="mt-2 text-slate-400">
                    Selecciona tu artista favorito para poner a prueba tu conocimiento
                </p>
            </div>

            <form action={searchArtist} className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <Input
                    type="text"
                    name="artist"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Busca tu artista favorito..."
                    className="pl-12 pr-12 py-6 rounded-xl bg-slate-800 border-none text-slate-100 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                {value && (
                    <button
                        type="button"
                        onClick={() => setValue("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </form>
        </div>
    );
}