import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("q");

    if (!query || query.trim().length === 0) {
        return Response.json(
            { error: "Parámetro 'q' obligatorio." },
            { status: 400 },
        );
    }

    try {
        const response = await fetch(
            `https://api.deezer.com/search/artist?q=${encodeURIComponent(query)}`,
        );

        if (!response.ok) {
            return Response.json(
                { error: "Error al consultar la API de artistas." },
                { status: 502 },
            );
        }

        const data = await response.json();
        return Response.json(data);
    } catch {
        return Response.json(
            { error: "Error inesperado al buscar artistas." },
            { status: 500 },
        );
    }
}
