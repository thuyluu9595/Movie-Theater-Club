import React from 'react';
import { Link } from 'react-router-dom';

export default function Movie(props) {
  const { movie, buttonName, disable } = props;
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/movie/${movie.id}`}>
        <img
          src={movie.posterUrl}
          className="w-full object-cover"
          alt={movie.title}
          width="500"
          height="500"
        />
      </Link>
      <div className="p-4">
        <Link
          to={buttonName === 'Edit' ? `/manage-movies/${movie.id}` : `/movie/${movie.id}`}
          className="block mb-2 text-lg font-semibold"
        >
          {movie.title}
        </Link>
        {disable ? null : (
          <Link
            to={buttonName === 'Edit' ? `/manage-movies/${movie.id}` : `/showtimes/${movie.id}`}
            className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {buttonName}
          </Link>
        )}
      </div>
    </div>
  );
}
