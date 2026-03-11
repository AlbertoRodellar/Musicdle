interface GameHintsProps {
    guesses: string[];
}

export default function LastGuesses({ guesses }: GameHintsProps) {
    const hasMore = guesses.length > 4;
    const lastGuesses = guesses.slice(-4).reverse();

    return (
        <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Últimos intentos</h3>
            <ul className="space-y-1">
                {lastGuesses.map((guess, index) => (
                    <li key={index} className="text-gray-300">
                        {guess}
                    </li>
                ))}
                {hasMore && (
                    <li className="text-gray-500 text-sm tracking-widest">...</li>
                )}
            </ul>
        </div>
    );
}
