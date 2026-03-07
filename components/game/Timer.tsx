"use client";
import { useEffect, useState } from "react";

interface TimerProps {
    running: boolean;
}

// Componente Timer que muestra el tiempo transcurrido en formato mm:ss
// El useEffect se encarga de iniciar un intervalo que incrementa el tiempo cada segundo cuando el timer esta corriendo,
// y de limpiar ese intervalo cuando el componente se desmonta o cuando running cambia a false (para no tener mas de un intervalo a la vez)
export default function Timer({ running }: TimerProps) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            setTime((t) => t + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [running]);

    const minutes = Math.floor(time / 60);
    const seconds = String(time % 60).padStart(2, "0");

    return (
        <p className="text-gray-500 font-mono text-lg">
            {minutes}:{seconds}
        </p>
    );
}
