import React, { useState } from 'react';

type SearchBarProps = {
    onSearchClick: (query: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearchClick }) => {

    const [inputValue, setInputValue] = useState('');

    const handleSearchClick = () => {
        if (inputValue.trim() !== '') {
            onSearchClick(inputValue);
        } else {
            // You can add more error handling or user feedback here
            alert('Please enter a search query.');
        }
    };


    return (
        <div className="flex justify-center my-4">
            <input
                type="text"
                placeholder="Search for movies..."
                className="form-input px-4 py-2 w-full max-w-xl border rounded shadow-sm"
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 ml-2 rounded shadow-sm"
                onClick={handleSearchClick}
            >
                Search
            </button>
        </div>
    );
};

export default SearchBar;
