import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("q");
    const response = await fetch(
        `https://api.deezer.com/search/artist?q=${query}`,
    );
    const data = await response.json();
    return Response.json(data);
}
