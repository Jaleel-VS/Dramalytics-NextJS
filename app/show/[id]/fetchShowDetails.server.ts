'use server';
import { Episode, Show } from "../../../types/types";
import { formatSearchResultInfo, formatSeriesInfo, formatEpisodeInfo } from './util';

const BASE_URL = "https://api.themoviedb.org/3/";
const API_KEY = process.env.API_KEY;




async function fetchFromApi(url: string): Promise<any> {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    console.log("Request was made");
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}


async function getSeriesById(tmdbID: string): Promise<any> {
  const url = `${BASE_URL}tv/${tmdbID}?language=en-US`;
  const seriesInfo = await fetchFromApi(url);
  return seriesInfo ? formatSeriesInfo(seriesInfo) : null;
}

async function getSeriesByTitle(title: string): Promise<Show[]> {
  const url = `${BASE_URL}search/tv?query=${encodeURIComponent(title)}&language=en-US&page=1&include_adult=false`;
  const response = await fetchFromApi(url);
  return response ? response["results"].map((series: any) => formatSearchResultInfo(series)) : [];
}

async function getEpisodesForSeries(tmdbID: string, season: string) {
  const url = `${BASE_URL}tv/${tmdbID}/season/${season}?language=en-US`;
  const response = await fetchFromApi(url);
  return response ? response["episodes"].map((episode: any) => formatEpisodeInfo(episode, season)) : [];
}

async function getSeriesFromApiCall(showId: string): Promise<Show | null> {
  const seriesInfo = await getSeriesById(showId);

  if (!seriesInfo) {
    return null;
  }

  const seasons = seriesInfo["seasons"];
  if (!seasons) {
    return null;
  }

  const episodesPerSeason: Record<string, Episode[]> = {};
  for (let season = 1; season <= parseInt(seasons); season++) {
    const episodesData = await getEpisodesForSeries(showId, season.toString());
    if (episodesData.length) {
      episodesPerSeason[season.toString()] = episodesData.map((episodeData: any) => {
        return {
          id: episodeData["tmdb_id"],
          name: episodeData["title"],
          episodeNumber: episodeData["episode"],
          voteAverage: episodeData["rating"],
        };
      });
    }
  }

  const show: Show = {
    showId: showId,
    showName: seriesInfo["title"],
    posterUrl: `https://image.tmdb.org/t/p/w500${seriesInfo["poster"]}`,
    episodes: episodesPerSeason,
  };

  return show;
}

export { getSeriesFromApiCall };

