import { Artist } from "@/types";

interface ArtistCardProps {
    artist: Artist;
    onSelect: (artist: Artist) => void;
    isSelected: boolean;
}
export default function ArtistCard({ artist, onSelect, isSelected }: ArtistCardProps) {
    return (
        <div
            className={`cursor-pointer border bg-gray-800 hover:bg-gray-900 rounded-xl p-4 w-64 h-68 flex flex-col ${isSelected ? "border-green-500" : "border-gray-200"}`}
            onClick={() => onSelect(artist)}
        >
            <img
                src={artist.picture_medium}
                alt={artist.name}
                className="w-full h-40 object-cover rounded-lg"
            />
            <p className="text-lg font-bold mt-2">{artist.name}</p>
            <p className="text-sm text-gray-500">
                {artist.nb_fan.toLocaleString()} fans
            </p>
        </div>
    );
}
