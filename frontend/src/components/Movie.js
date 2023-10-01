import React from 'react';
import { Link } from 'react-router-dom'; 
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Rating } from './Rating';


export default function Movie(props){
  const {movie} = props;
  return (
    <Card>
      <Link to={`/movie/${movie.slug}`}>
        <img src={movie.image} className='card-img-top' alt={movie.title} />
      </Link>
      <Card.Body>
        <Link to={`/movie/${movie.slug}`}>
          <Card.Title>{movie.title}</Card.Title>
        </Link>
        <Rating rating={movie.rating} numReviews={movie.numReviews}/>
        <Card.Text>${movie.price}</Card.Text>
        <Button>Get Tickets</Button>
      </Card.Body>
    </Card>
  )
} 