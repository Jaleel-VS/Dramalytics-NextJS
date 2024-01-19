import { SearchResultType } from '../../types/types';
import React from 'react';
import Link from 'next/link';


interface SearchResultProps extends SearchResultType {
}

const SearchResult: React.FC<SearchResultProps> = ({ 
    tmdb_id,
    title, 
    year, 
    poster, 
    voteAverage
 }) => {
    return (
        <div className="flex flex-col md:flex-row items-center p-4 border-b border-gray-200">
            <img src={poster} alt={title} className="w-32 h-48 object-cover md:mr-4" />
            <div className="mt-2 md:mt-0">
                <h3 className="text-lg font-semibold text-lime-500">{title}</h3>
                <p className="text-sm text-neutral-50">Year: {year}</p>
                <p className="text-sm text-neutral-50">Rating: {voteAverage}/10</p>
            </div>
            <Link href={`/show/${
                encodeURIComponent(tmdb_id.toString())
                }`}>
                <button
                className='bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 ml-2 rounded shadow-sm'
                >
                    View Details
                </button>
            </Link>
        </div>
    );
};

export default SearchResult;
