


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

export interface SearchResult {
    tmdb_id: string;
    title: string;
    year: string;
    poster: string;
    voteAverage: number;
}

// export class EpisodeImpl implements Episode {
//     id: number;
//     name: string;
//     episodeNumber: number;
//     voteAverage: number;

//     constructor(id: number, name: string, episodeNumber: number, voteAverage: number) {
//         this.id = id;
//         this.name = name;
//         this.episodeNumber = episodeNumber;
//         this.voteAverage = voteAverage;
//     }
//     // Additional methods relevant to an episode can be added here
// }

// export class ShowImpl implements Show {
//     showId: string;
//     showName: string;
//     posterUrl: string;
//     episodes: Record<string, Episode[]>;

//     constructor(showId: string, showName: string, posterUrl: string, episodes: Record<string, Episode[]>) {
//         this.showId = showId;
//         this.showName = showName;
//         this.posterUrl = posterUrl;
//         this.episodes = episodes;
//     }
//     // Additional methods relevant to a show can be added here
// }
