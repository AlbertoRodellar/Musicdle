import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const albumId = request.nextUrl.searchParams.get("albumId");

    if (!albumId) {
        return Response.json(
            { error: "Parámetro 'albumId' obligatorio." },
            { status: 400 },
        );
    }

    try {
        const response = await fetch(
            `https://api.deezer.com/album/${encodeURIComponent(albumId)}`,
        );

        if (!response.ok) {
            return Response.json(
                { error: "Error al consultar la información del álbum." },
                { status: 502 },
            );
        }

        const data = await response.json();
        return Response.json(data);
    } catch {
        return Response.json(
            { error: "Error inesperado al obtener el álbum." },
            { status: 500 },
        );
    }
}