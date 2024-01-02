export interface Episode {
    id: number;
    name: string;
    episodeNumber: number;
    voteAverage: number;
}

export interface Show {
    showId: string;
    showName: string;
    posterUrl: string;
    episodes: Record<string, Episode[]>; 
}
