interface MenuProps {
    onArtistMode: () => void;
}

export default function Menu({ onArtistMode }: MenuProps) {
    return (
        <div className="min-h-screen p-8">
            <div className="flex gap-4 flex-col w-64">
                <button
                    onClick={onArtistMode}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer font-medium"
                >
                    Por artista
                </button>
                <button
                    disabled
                    className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg cursor-not-allowed font-medium"
                >
                    Daily (próximamente)
                </button>
            </div>
        </div>
    );
}
