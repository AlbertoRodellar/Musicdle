export interface Artist {
    id: number;
    name: string;
    picture_medium: string;
    nb_fan: number;
}

export interface Song {
    title: string;
    preview: string;
    artist: { name: string };
    album: { title: string; cover: string };
}