import ArtistCard from "./ArtistCard";
import { Artist } from "@/types";

interface ArtistListProps {
    artists: Artist[];
    onSelect: (artist: Artist) => void;
}

export default function ArtistList({ artists, onSelect }: ArtistListProps) {
    return (
        <div className="flex flex-wrap gap-4 mt-4">
            {artists.map((artist) => (
                <ArtistCard
                    key={artist.id}
                    artist={artist}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}
