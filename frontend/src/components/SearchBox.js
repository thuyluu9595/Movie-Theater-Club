import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-grow justify-center">
      <div className="flex">
        <input
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search..."
          aria-label="Search Movies"
          className="border border-gray-300 rounded-l px-3 py-1 focus:outline-none"
        />
        <button
          type="submit"
          id="button-search"
          className="bg-blue-600 text-white px-3 py-1 rounded-r"
        >
          <i className="fas fa-search" />
        </button>
      </div>
    </form>
  );
}
