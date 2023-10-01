import { Link } from "react-router-dom";
import data from "../data";

export default function HomeScreen(){
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