"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/time";

export default function PreviewPlayer({
    src,
    className,
}: {
    src: string | undefined;
    className?: string;
}) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const rafRef = useRef<number | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const canPlay = Boolean(src);
    // Calcula el progreso del preview en función del tiempo actual y la duración
    // useMemo es un hook de React que se encarga de memorizar el valor de la función y solo recalcularlo si los valores de las dependencias cambian
    const progress = useMemo(() => {
        if (!duration) return 0;
        return Math.min(100, Math.max(0, (currentTime / duration) * 100));
    }, [currentTime, duration]);

    function stopRaf() {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    }

    // Actualiza el tiempo actual cada vez que se reproduce el preview
    // requestAnimationFrame es una función que se encarga de actualizar el tiempo actual cada vez que se reproduce el preview
    function tick() {
        const a = audioRef.current;
        if (a) setCurrentTime(a.currentTime || 0);
        rafRef.current = requestAnimationFrame(tick);
    }

    async function toggle() {
        const a = audioRef.current;
        if (!a || !canPlay) return;

        setError(null);

        if (a.paused) {
            try {
                await a.play();
            } catch {
                setError("No se pudo reproducir el preview.");
            }
            return;
        }

        a.pause();
    }

    // Para cuando el usuario arrastra la barra de progreso
    function seekTo(nextTime: number) {
        const a = audioRef.current;
        if (!a) return;
        a.currentTime = Math.min(a.duration || 0, Math.max(0, nextTime));
        setCurrentTime(a.currentTime);
    }

    // Este useEffect conecta el elemento <audio> con el estado de React
    // (duración, tiempo actual, si está sonando, errores) y limpia todo cuando el componente se desmonta.
    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;

        function onLoadedMetadata() {
            setDuration(a?.duration || 0);
        }
        function onPlay() {
            setIsPlaying(true);
            stopRaf();
            tick();
        }
        function onPause() {
            setIsPlaying(false);
            stopRaf();
        }
        function onEnded() {
            setIsPlaying(false);
            stopRaf();
        }
        function onTimeUpdate() {
            setCurrentTime(a?.currentTime || 0);
        }
        function onError() {
            setError("No se pudo cargar el preview.");
        }

        a.addEventListener("loadedmetadata", onLoadedMetadata);
        a.addEventListener("play", onPlay);
        a.addEventListener("pause", onPause);
        a.addEventListener("ended", onEnded);
        a.addEventListener("timeupdate", onTimeUpdate);
        a.addEventListener("error", onError);

        return () => {
            stopRaf();
            a.removeEventListener("loadedmetadata", onLoadedMetadata);
            a.removeEventListener("play", onPlay);
            a.removeEventListener("pause", onPause);
            a.removeEventListener("ended", onEnded);
            a.removeEventListener("timeupdate", onTimeUpdate);
            a.removeEventListener("error", onError);
        };
    }, []);

    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;

        stopRaf();
        a.pause();
        a.currentTime = 0;
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
        setError(null);
    }, [src]);

    return (
        // El .join es para que se pueda poner className al llamara este componente
        <div
            className={[
                "w-full max-w-xl rounded-xl border border-white/10 bg-white/5 p-3",
                className ?? "",
            ].join(" ")}
        >
            <audio ref={audioRef} src={src} preload="metadata" />

            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    onClick={toggle}
                    disabled={!canPlay}
                    size="icon"
                    className="h-11 w-11 rounded-full bg-white text-black shadow-lg hover:bg-white/90 disabled:opacity-50 cursor-pointer"
                    aria-label={
                        isPlaying ? "Pausar preview" : "Reproducir preview"
                    }
                >
                    {isPlaying ? (
                        <Pause className="h-5 w-5" />
                    ) : (
                        <Play className="h-5 w-5 translate-x-px" />
                    )}
                </Button>

                <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>

                    <div className="relative">
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                                className="h-full bg-white/70"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={duration || 0}
                            step={0.01}
                            value={Math.min(currentTime, duration || 0)}
                            onChange={(e) => seekTo(Number(e.target.value))}
                            disabled={!duration}
                            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            aria-label="Barra de progreso"
                        />
                    </div>
                </div>
            </div>

            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
    );
}
