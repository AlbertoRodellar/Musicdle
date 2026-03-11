import { Artist } from "@/types";
import { Check } from "lucide-react";

interface ArtistCardProps {
    artist: Artist;
    onSelect: (artist: Artist) => void;
    isSelected: boolean;
}

export default function ArtistCard({
    artist,
    onSelect,
    isSelected,
}: ArtistCardProps) {
    return (
        <div
            onClick={() => onSelect(artist)}
            className={`h-72 relative cursor-pointer rounded-2xl py-4 px-4 flex flex-col items-center bg-[#1a1f2e] border-2 transition-colors
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
                className="w-38 h-38 rounded-full object-cover shrink-0"
            />

            <p className="text-white font-semibold text-lg text-center pt-4 line-clamp-2 shrink-0 m-auto">
                {artist.name}
            </p>
            <p className="text-gray-400 text-sm mt-auto">
                {artist.nb_fan.toLocaleString()} fans
            </p>
        </div>
    );
}
