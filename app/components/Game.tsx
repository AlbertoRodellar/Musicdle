import { Artist } from "@/types";


interface GameProps {
    artist: Artist;
    rounds: number;
}

export default function Game({ artist, rounds }: GameProps) {
    return (
        <div>
            <p>Artista: {artist.name}</p>
            <p>Rondas: {rounds}</p>
            <img src={artist.picture_medium} alt={artist.name} />
        </div>
    );
}