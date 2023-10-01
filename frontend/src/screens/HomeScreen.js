import { Link } from "react-router-dom";
import data from "../data";
import React from "react";
// import axios from "axios";
// import { useEffect, useState } from "react";

export default function HomeScreen(){
  // const [movies, setMovies] = useState([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await axios.get('/api/movies');
  //     setMovies(result.data);
  //   };
  //   fetchData();
  // }, []);

  return (
    <div>
      <h1>List Of Movies</h1>
          <div className='movies'>
            {data.movies.map((movie) => (
              <div className='movie' key={movie.slug}>
                <Link to={`/movie/${movie.slug}`}>
                  <img src={movie.image} alt={movie.title} />
                </Link>
                <div className='movie-info'>
                  <Link to={`/movie/${movie.slug}`}>
                    <p>{movie.title}</p>
                  </Link>
                  <p><strong>{movie.price}</strong></p>
                  <button>Get Tickets</button>
                </div>
              </div>
            ))}
          </div>
    </div>
  )
}