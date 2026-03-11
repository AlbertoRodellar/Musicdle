import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const artistId = request.nextUrl.searchParams.get("artistId");

    if (!artistId) {
        return Response.json(
            { error: "Parámetro 'artistId' obligatorio." },
            { status: 400 },
        );
    }

    try {
        const response = await fetch(
            `https://api.deezer.com/artist/${encodeURIComponent(
                artistId,
            )}/top?limit=50`,
        );

        if (!response.ok) {
            return Response.json(
                { error: "Error al consultar las canciones del artista." },
                { status: 502 },
            );
        }

        const data = await response.json();
        return Response.json(data);
    } catch {
        return Response.json(
            { error: "Error inesperado al obtener canciones." },
            { status: 500 },
        );
    }
}
