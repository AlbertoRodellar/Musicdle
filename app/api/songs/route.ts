import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const artistId = request.nextUrl.searchParams.get("artistId");
    const response = await fetch(
        `https://api.deezer.com/artist/${artistId}/top?limit=50`,
    );
    const data = await response.json();
    return Response.json(data);
}
