// import React from 'react';
// import { Link } from 'react-router-dom';
// import Card from 'react-bootstrap/Card';
// import Button from 'react-bootstrap/Button';
//
//
//
// export default function Movie(props){
//   const {movie, buttonName, disable} = props;
//   return (
//     <Card>
//       <Link to={`/movie/${movie.id}`}>
//         <img
//           src={movie.posterUrl}
//           className='card-img-top'
//           alt={movie.title}
//           width="500" height="500"
//           />
//       </Link>
//         {buttonName === "Edit" ? (
//                 <Card.Body>
//                     <Link to={`/manage-movies/${movie.id}`}>
//                         <Card.Title>{movie.title}</Card.Title>
//                     </Link>
//                     <Link to={`/manage-movies/${movie.id}`}>
//                         <Button>{buttonName}</Button>
//                     </Link>
//                 </Card.Body>
//
//         ) : (
//             <Card.Body>
//                     <Link to={`/movie/${movie.id}`}>
//                 <Card.Title>{movie.title}</Card.Title>
//             </Link>
//                 {
//                     disable ? null : (
//                         <Link to={`/showtimes/${movie.id}`}>
//                             <Button>{buttonName}</Button>
//                         </Link>
//
//                     )
//                 }
//             </Card.Body>
//         )}
//
//     </Card>
//   )
// }

import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export default function Movie(props) {
    const { movie, buttonName, disable } = props;

    // Fallback for missing poster
    const poster = movie.posterUrl || 'https://placehold.co/500x750/1c1c1e/eaeaea?text=No+Image';

    return (
        // The main container for our custom card
        <div className="movie-card">
            {/* The poster is a link to the movie details page */}
            <Link to={`/movie/${movie.id}`} className="movie-poster-link">
                <img
                    src={poster}
                    className='movie-poster'
                    alt={movie.title}
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/500x750/1c1c1e/eaeaea?text=Image+Error'; }}
                />
            </Link>

            {/* Container for the movie title and action button */}
            <div className="movie-info">
                <div className="movie-title-container">
                    <Link to={`/movie/${movie._id}`}>
                        <h5 className="movie-title">{movie.title}</h5>
                    </Link>
                </div>

                <div className="movie-button-container">
                    {buttonName === "Edit" ? (
                        <Link to={`/manage-movies/${movie.id}`}>
                            <Button>{buttonName}</Button>
                        </Link>
                    ) : (
                        !disable && (
                            <Link to={`/showtimes/${movie._id}`}>
                                <Button>{buttonName}</Button>
                            </Link>
                        )
                    )}
                    {/* Show a disabled button for upcoming movies for better UX */}
                    {disable && (
                        <Button disabled>Coming Soon</Button>
                    )}
                </div>
            </div>
        </div>
    );
}
