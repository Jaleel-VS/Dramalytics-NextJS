import fetch from "node-fetch";
import { Show, Episode } from "../types/types";
import { MongoDBHelper } from "./mongoDBHelper";

const BASE_URL = "https://api.themoviedb.org/3/";
const API_KEY = process.env.TMDB_API_KEY;

class ShowHandler {
  private mongoDBHelper: MongoDBHelper | null = null;

  public async initialize(): Promise<void> {
    this.mongoDBHelper = await MongoDBHelper.getInstance();
  }

  public constructor() {}

  private formatSearchResultInfo(series: any): any {
    return {
      tmdb_id: series["id"],
      title: series["name"],
      year: series["first_air_date"].split("-")[0],
      poster: series["poster_path"],
      vote_average: series["vote_average"],
    };
  }

  public async getSeriesByTitle(title: string): Promise<any[]> {
    const response = await fetch(
      BASE_URL +
        "search/tv?query=" +
        encodeURIComponent(title) +
        "&language=en-US&page=1&include_adult=false",
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    ).then((res) => res.json());

    return response
      ? response["results"].map((series: any) =>
          this.formatSearchResultInfo(series)
        )
      : [];
  }

  private formatSeriesInfo(series: any): any {
    return {
      tmdb_id: series["id"],
      genres: series["genres"].map((genre: any) => genre["name"]),
      year: series["in_production"]
        ? `${series["first_air_date"].split("-")[0]}-Present`
        : `${series["first_air_date"].split("-")[0]}-${
            series["last_air_date"].split("-")[0]
          }`,
      title: series["name"],
      poster: series["poster_path"],
      overview: series["overview"],
      vote_average: series["vote_average"],
      seasons: series["number_of_seasons"],
    };
  }

  public async getSeriesById(tmdbID: string): Promise<any> {
    console.log("Getting series by ID...");
    const url = BASE_URL + "tv/" + tmdbID;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    };

    const response = await fetch(url, options)
      .then((res) => res.json())
      .catch((err) => console.error("error:" + err));
    return response ? this.formatSeriesInfo(response) : null;
  }

  private formatEpisodeInfo(episode: any, season: string): any {
    return {
      tmdb_id: episode["id"],
      title: episode["name"],
      episode: episode["episode_number"],
      season: season,
      overview: episode["overview"],
      rating: episode["vote_average"],
    };
  }

  public async getEpisodesForSeries(
    tmdb_id: string,
    season: string
  ): Promise<any[]> {
    console.log("Getting episodes for series...");
    const url = BASE_URL + "tv/" + tmdb_id + "/season/" + season;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    };

    const response = await fetch(url, options)
      .then((res) => res.json())
      .catch((err) => console.error("error:" + err));

    return response
      ? response["episodes"].map((episode: any) =>
          this.formatEpisodeInfo(episode, season)
        )
      : [];
  }

  public getSeriesDbObject(showId: string): any {
    const allSeriesIds = this.mongoDBHelper?.getAllShowIds();
    if (allSeriesIds?.includes(showId)) {
      return this.mongoDBHelper?.getShow(showId);
    }
    return null;
  }

  public async getSeriesFromApiCall(showId: string): Promise<any> {
    // await this.initialize();

    const seriesInfo = await this.getSeriesById(showId);

    if (!seriesInfo) {
      return null;
    }

    const seasons = seriesInfo["seasons"];
    if (!seasons) {
      return null;
    }

    const episodesPerSeason: Record<string, Episode[]> = {};
    for (let season = 1; season <= parseInt(seasons); season++) {
      const episodesData = await this.getEpisodesForSeries(
        showId,
        season.toString()
      );
      if (episodesData.length) {
        episodesPerSeason[season.toString()] = episodesData.map(
          (episodeData) => {
            return {
              id: episodeData["tmdb_id"],
              name: episodeData["title"],
              episodeNumber: episodeData["episode"],
              voteAverage: episodeData["rating"],
            };
          }
        );
      }
    }

    const show: Show = {
      showId: showId,
      showName: seriesInfo["title"],
      posterUrl: seriesInfo["poster"],
      episodes: episodesPerSeason,
    };

    // const dbShow = JSON.stringify(show); // This replaces jsonable_encoder
    // this.mongoDBHelper?.addShow(show);
    return show;
  }
}

// test out the ShowHandler class

const showHandler = new ShowHandler();

const query = "1399";

// search by series id

// async function searchAndLogSeries() {
//   console.log(`Searching for series with name: ${query}`);
//   console.log("====================================");

//   try {
//     const series = await showHandler.getSeriesByTitle(query);
//     if (series.length) {
//       series.forEach((series: any) => {
//         console.log(`Found series: ${series["title"]} (${series["year"]})`);
//       });
//     } else {
//       console.log("No series found.");
//     }
//   } catch (error) {
//     console.error("Error getting series:", error);
//   }

//   // Now that all async operations have completed, you can safely exit.
//   process.exit(0);
// }

// searchAndLogSeries();

// Run the async function
// searchAndLogSeries();

async function getAndLogSeries() {
  console.log(`Getting series with ID: ${query}`);
  console.log("====================================");

  try {
    const series = await showHandler.getSeriesFromApiCall(query);
    if (series.showId) {
      console.log(`Found series: ${series["showName"]}`);

      const n_seasons = Object.keys(series["episodes"]).length;

      let lowest_average = Number.MAX_SAFE_INTEGER;
      let episode_with_lowest_average: string = ""  ;
      let highest_average = Number.MIN_SAFE_INTEGER;
      let episode_with_highest_average: string = "";

      for (let season = 1; season <= n_seasons; season++) {
        const episodes = series["episodes"][season.toString()];
        console.log(`Season ${season}:`);
        if (episodes.length) {
          episodes.forEach((episode: Episode) => {
            console.log(
              `Episode ${episode.episodeNumber}: ${episode.name} (${episode.voteAverage})`
            );
            if (episode.voteAverage < lowest_average) {
              lowest_average = episode.voteAverage;
              episode_with_lowest_average = episode.name + ` S${season}E${episode.episodeNumber}`;
            }

            if (episode.voteAverage > highest_average) {
              highest_average = episode.voteAverage;
              episode_with_highest_average = episode.name + ` S${season}E${episode.episodeNumber}`;
            }
          });
        }
      }

        console.log(
            `Episode with lowest average rating: ${episode_with_lowest_average} (${lowest_average})`
        );

        console.log(
            `Episode with highest average rating: ${episode_with_highest_average} (${highest_average})`
        );
    } else {
      console.log("No series found.");
    }
  } catch (error) {
    console.error("Error getting series:", error);
  }

  // Now that all async operations have completed, you can safely exit.
  process.exit(0);
}

// // Run the async function
getAndLogSeries();
