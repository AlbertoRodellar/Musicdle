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
        <form action={searchArtist} className="flex gap-2">
            <input
                type="text"
                name="artist"
                placeholder="Escribe un artista..."
                className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
                Buscar
            </button>
        </form>
    );
}
