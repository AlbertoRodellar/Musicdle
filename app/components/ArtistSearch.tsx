interface ArtistSearchProps {
    onArtistSelect: (artist: string) => void;
}

export default function ArtistSearch({ onArtistSelect }: ArtistSearchProps) {
    function searchArtist(formData: FormData) {
        const artist = formData.get("artist")?.toString() || "";
        if (!artist) return;
        onArtistSelect(artist);
    }

    return (
        <form action={searchArtist}>
            <input
                type="text"
                name="artist"
                placeholder="Escribe un artista..."
            />
            <button type="submit">Buscar</button>
        </form>
    );
}
