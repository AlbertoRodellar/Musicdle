import { Artist } from "@/types";
import { Check } from "lucide-react";

interface ArtistCardProps {
    artist: Artist;
    onSelect: (artist: Artist) => void;
    isSelected: boolean;
}

export default function ArtistCard({ artist, onSelect, isSelected }: ArtistCardProps) {
    return (
        <div
            onClick={() => onSelect(artist)}
            className={`relative cursor-pointer rounded-2xl p-6 flex flex-col items-center gap-3 bg-[#1a1f2e] border-2 transition-colors
                ${isSelected ? "border-blue-500" : "border-transparent hover:border-gray-600"}`}
        >
            {isSelected && (
                <div className="absolute top-3 right-3 bg-blue-500 rounded-full p-0.5">
                    <Check className="w-3 h-3 text-white" />
                </div>
            )}

            <img
                src={artist.picture_medium}
                alt={artist.name}
                className="w-24 h-24 rounded-full object-cover"
            />

            <p className="text-white font-semibold text-base text-center">{artist.name}</p>
            <p className="text-gray-400 text-sm">{artist.nb_fan.toLocaleString()} fans</p>

            <button
                className={`mt-1 px-5 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-[#2a2f3e] text-gray-300 hover:bg-[#3a3f4e]"
                    }`}
            >
                {isSelected ? "Selected" : "Select"}
            </button>
        </div>
    );
}