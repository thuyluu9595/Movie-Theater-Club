import React from 'react';
import { Link } from 'react-router-dom'; 
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';



export default function Movie(props){
  const {movie, buttonName} = props;
  return (
    <Card>
      <Link to={`/movie/${movie.id}`}>
        <img 
          src={movie.posterUrl} 
          className='card-img-top' 
          alt={movie.title} 
          width="500" height="500"
          />
      </Link>
        {buttonName === "Edit" ? (
                <Card.Body>
                    <Link to={`/manage-movies/${movie.id}`}>
                        <Card.Title>{movie.title}</Card.Title>
                    </Link>
                    <Link to={`/manage-movies/${movie.id}`}>
                        <Button>{buttonName}</Button>
                    </Link>
                </Card.Body>

        ) : (
            <Card.Body>
                    <Link to={`/movie/${movie.id}`}>
                <Card.Title>{movie.title}</Card.Title>
            </Link>
            <Link to={`/showtimes/${movie.id}`}>
                <Button>{buttonName}</Button>
            </Link>
            </Card.Body>
        )}

    </Card>
  )
} 