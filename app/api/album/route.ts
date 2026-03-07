import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const albumId = request.nextUrl.searchParams.get("albumId");
    const response = await fetch(`https://api.deezer.com/album/${albumId}`);
    const data = await response.json();
    return Response.json(data);
}