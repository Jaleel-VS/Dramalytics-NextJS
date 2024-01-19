"use client";
import Image from 'next/image'
import { useState } from 'react';
import SearchBar from './_components/SearchBar';
import SearchResult from './_components/SearchResult';
import { SearchResultType } from '../types/types';
import React from 'react';



export default function Home() {
  const results: SearchResultType[] = [
    {
      tmdb_id: "101",
      title: "Space Odyssey",
      year: "2021",
      poster: "https://example.com/posters/space-odyssey.jpg",
      voteAverage: 8.5
    },
    {
      tmdb_id: "102",
      title: "The Great Adventure",
      year: "2019",
      poster: "https://example.com/posters/great-adventure.jpg",
      voteAverage: 7.9
    },
    {
      tmdb_id: "103",
      title: "Mystery of the Depths",
      year: "2023",
      poster: "https://example.com/posters/mystery-depths.jpg",
      voteAverage: 6.8
    },
    {
      tmdb_id: "104",
      title: "Future World",
      year: "2022",
      poster: "https://example.com/posters/future-world.jpg",
      voteAverage: 9.1
    },
    {
      tmdb_id: "105",
      title: "Legends of Yesterday",
      year: "2020",
      poster: "https://example.com/posters/legends-yesterday.jpg",
      voteAverage: 7.4
    }
  ];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [displayResults, setDisplayResults] = useState(false);

  const handleSearchClick = (query: string) => {
    setSearchQuery(query);
    setDisplayResults(true);
  };

  const filteredResults = results.filter(result => {
    return result.title.toLowerCase().includes(searchQuery.toLowerCase());
  }
  );

  return (
    <div className="container mx-auto my-8">
      <SearchBar onSearchClick={handleSearchClick} />
      <div>
        {displayResults && filteredResults.map(result => (
          <SearchResult key={result.tmdb_id} {...result} />
        ))}
      </div>
    </div>
  )
}
