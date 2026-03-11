export interface Artist {
    id: number;
    name: string;
    picture_medium: string;
    nb_fan: number;
}

export interface Song {
    id: number;
    title: string;
    preview: string;
    artist: { name: string };
    album: { id: number; title: string; cover: string };
}

export interface RoundResult {
    song: {
        title: string;
        cover: string;
    };
    attempts: number;
    skipped: boolean;
    time: number;
}
