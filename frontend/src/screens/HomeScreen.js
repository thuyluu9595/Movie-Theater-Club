import data from "../data";

export default function HomeScreen(){
  return (
    <div>
      <h1>List Of Movies</h1>
          <div className='movies'>
            {data.movies.map((movie) => (
              <div className='movie' key={movie.slug}>
                <a href={`/movie/${movie.slug}`}>
                  <img src={movie.image} alt={movie.title} />
                </a>
                <div className='movie-info'>
                  <a href={`/movie/${movie.slug}`}>
                    <p>{movie.title}</p>
                  </a>
                  <p><strong>{movie.price}</strong></p>
                  <button>Get Tickets</button>
                </div>
              </div>
            ))}
          </div>
    </div>
  )
}