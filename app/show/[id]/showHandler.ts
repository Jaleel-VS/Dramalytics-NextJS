import fetch from "node-fetch";
import { Show, Episode } from "../../../types/types";
// import { MongoDBHelper } from "./mongoDBHelper";

const BASE_URL = "https://api.themoviedb.org/3/";
const API_KEY = process.env.API_KEY;

console.log("API KEY: " + API_KEY);

export default class ShowHandler {

  public constructor() {}

  private formatSearchResultInfo(series: any): any {
    return {
      tmdb_id: series["id"],
      title: series["name"],
      year: series["first_air_date"].split("-")[0],
      poster: `https://image.tmdb.org/t/p/w500${series["poster_path"]}`,
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

  private getYears(series: any): string {
    // Helper function to extract the year from a date string
    const extractYear = (dateString: string) => {
      return dateString && dateString.split("-")[0];
    };
  
    const firstYear = extractYear(series["first_air_date"]);
    const lastYear = extractYear(series["last_air_date"]);
  
    // Handle cases where the first air date is unknown
    if (!firstYear) {
      return "Unknown";
    }
  
    // If the series is still in production
    if (series["in_production"]) {
      return `${firstYear}-Present`;
    }
  
    // If the series is not in production and the last air date is known
    if (lastYear) {
      return `${firstYear}-${lastYear}`;
    }
  
    // If the series is not in production but the last air date is unknown
    return `${firstYear}-Unknown`;
  }

  private formatSeriesInfo(series: any): any {
    console.log(series)
    return {
      tmdb_id: series["id"],
      genres: series["genres"].map((genre: any) => genre["name"]),
      year: this.getYears(series),
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

  // public getSeriesDbObject(showId: string): any {
  //   const allSeriesIds = this.mongoDBHelper?.getAllShowIds();
  //   if (allSeriesIds?.includes(showId)) {
  //     return this.mongoDBHelper?.getShow(showId);
  //   }
  //   return null;
  // }

  public async getSeriesFromApiCall(showId: string): Promise<Show | null> {
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
      posterUrl: `https://image.tmdb.org/t/p/w500${seriesInfo["poster"]}`,
      episodes: episodesPerSeason,
    };

    // const dbShow = JSON.stringify(show); // This replaces jsonable_encoder
    // this.mongoDBHelper?.addShow(show);
    return show;
  }
}

