import ArtistCard from "./ArtistCard";
import { Artist } from "@/types";

interface ArtistListProps {
    artists: Artist[];
    onSelect: (artist: Artist) => void;
    selectedArtistId: number | null;
}

export default function ArtistList({
    artists,
    onSelect,
    selectedArtistId,
}: ArtistListProps) {
    return (
        <div className="grid grid-cols-4 gap-4 mt-4">
            {artists.map((artist) => (
                <ArtistCard
                    key={artist.id}
                    artist={artist}
                    onSelect={onSelect}
                    isSelected={artist.id === selectedArtistId}
                />
            ))}
        </div>
    );
}
