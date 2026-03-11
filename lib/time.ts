export function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
    const m = Math.floor(seconds / 60).toString();
    return `${m}:${s}`;
}

