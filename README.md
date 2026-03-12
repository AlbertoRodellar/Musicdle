# 🎵 Musicdle

> A music guessing game where you listen to song previews and try to identify them with the fewest attempts possible.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-black)

## What is Musicdle?

Musicdle is a **Wordle-inspired music game**. You pick an artist, listen to short previews of their songs, and try to guess the title in as few attempts as possible. The faster and fewer attempts you use, the higher your score.

### How scoring works

Each round starts at **1000 points**:
- `-100` per wrong attempt
- `-50` per every 5 seconds elapsed
- Skipped songs give **0 points**
- Minimum score per round is **0**

## Features

- 🔍 **Artist search** powered by the Deezer API
- 🎧 **Song preview player** — short audio clips to guess from
- 🏆 **Score system** based on attempts and time
- 💡 **Progressive hints** revealed after each wrong guess
- ⏱️ **Per-round timer**
- 📄 **Results screen** with per-song breakdown
- 💀 **Skip option** if you're stuck

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Music Data | Deezer API |
| Notifications | Sonner |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/musicdle.git
cd musicdle

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> No environment variables required — the app uses the public Deezer API.

## Project Structure

```
app/
├── api/
│   ├── search/route.ts       # Artist search endpoint
│   └── songs/route.ts        # Artist top songs endpoint
├── layout.tsx
└── page.tsx

components/
├── Game.tsx                  # Core game logic
├── Pregame.tsx               # Artist selection + round config
├── Results.tsx               # End-of-game results screen
├── ArtistCard.tsx            # Artist selection card
├── ArtistsList.tsx           # Artist grid
├── ArtistSearch.tsx          # Search input
├── RoundSelector.tsx         # Round count picker
├── ResultCard.tsx            # Per-song result card
├── GuessInput.tsx            # Song guess autocomplete
├── GameHints.tsx             # Progressive hints
├── LastGuesses.tsx           # Recent guesses list
├── PreviewPlayer.tsx         # Audio preview player
├── Pagination.tsx            # Page navigation
└── Timer.tsx                 # Round timer
```

## Roadmap

These are the features planned for future versions:

- [ ] **Daily challenge** — everyone guesses the same song each day (like Wordle)
- [ ] **Supabase integration** — user accounts, persistent scores and history
- [ ] **Play with friends** — create private rooms and compete in real time
- [ ] **Global leaderboard** — compare scores with other players
- [ ] **More game modes** — genre-based, decade-based, random artist
- [ ] **Mobile app** — React Native version

## API

This project uses the [Deezer API](https://developers.deezer.com/api) to fetch artist data and song previews. No API key is required for public endpoints.

The API routes act as a proxy to avoid CORS issues and add basic input validation:

- `GET /api/search?q={artist}` — search artists by name
- `GET /api/songs?artistId={id}` — get top 50 songs for an artist
