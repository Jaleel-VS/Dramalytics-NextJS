// util.ts

export function formatSearchResultInfo(series: any): any {
    return {
      tmdb_id: series["id"],
      title: series["name"],
      year: series["first_air_date"].split("-")[0],
      poster: `https://image.tmdb.org/t/p/w500${series["poster_path"]}`,
      vote_average: series["vote_average"],
    };
  }
  
  export function getYears(series: any): string {
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
  
  export function formatSeriesInfo(series: any): any {
    return {
      tmdb_id: series["id"],
      genres: series["genres"].map((genre: any) => genre["name"]),
      year: getYears(series),
      title: series["name"],
      poster: series["poster_path"],
      overview: series["overview"],
      vote_average: series["vote_average"],
      seasons: series["number_of_seasons"],
    };
  }
  
  export function formatEpisodeInfo(episode: any, season: string): any {
    return {
      tmdb_id: episode["id"],
      title: episode["name"],
      episode: episode["episode_number"],
      season: season,
      overview: episode["overview"],
      rating: episode["vote_average"],
    };
  }
  