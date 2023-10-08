import React from 'react';
import { Link } from 'react-router-dom'; 
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';



export default function Movie(props){
  const {movie} = props;
  return (
    <Card>
      <Link to={`/movie/${movie.id}`}>
        <img src={movie.image} className='card-img-top' alt={movie.title} />
      </Link>
      <Card.Body>
        <Link to={`/movie/${movie.id}`}>
          <Card.Title>{movie.title}</Card.Title>
        </Link>
        <Link to={`/showtime`}>
          <Button>Get Tickets</Button>
        </Link>
      </Card.Body>
    </Card>
  )
} 