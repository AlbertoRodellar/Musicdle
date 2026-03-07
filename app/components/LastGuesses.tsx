interface GameHintsProps {
    guesses: string[];
}

export default function LastGuesses({ guesses }: GameHintsProps) {
    return (
        <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Últimos intentos</h3>
            <ul className="space-y-1">
                {guesses.map((guess, index) => (
                    <li key={index} className="text-gray-300">
                        {guess}
                    </li>
                ))}
            </ul>
        </div>
    );
}
