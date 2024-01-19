import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Episode, Show } from '@/types/types';

interface ShowHeatmapProps {
  seasonEpisodes: Record<string, Episode[]>;
}

export const ShowHeatmap: React.FC<ShowHeatmapProps> = ({ seasonEpisodes }) => {
  // Transform the episodes data into series data for the heatmap
  const series = Object.entries(seasonEpisodes).map(([season, episodes]) => ({
    name: `${season}`,
    data: episodes.map((episode) => ({
      x: `${episode.episodeNumber}`,
      y: episode.voteAverage,
    })),
  }));

  // Define the options for ApexCharts
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'heatmap',
    },
    dataLabels: {
      enabled: true,
    },
    colors: ["#8e44ad"],
    title: {
      text: 'Episode Ratings Heatmap',
    },
    xaxis: {
      type: 'category',
      title: {
        text: 'Episode',
      },
    },
    yaxis: {
      reversed: true,
      title: {
        text: 'Season',
      },
    },
    plotOptions: {
      heatmap: {
        radius: 10,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 5,
              color: '#ec644b',
              name: 'low',
            },
            {
              from: 5,
              to: 7,
              color: '#f39c12',
              name: 'medium',
            },
            {
              from: 7,
              to: 10,
              color: '#27ae60',
              name: 'high',
            },
          ],
        },
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="heatmap"
      height={350}
    />
  );
};