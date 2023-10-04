import React, { useEffect, useState } from "react"; 
import { useParams } from "react-router-dom";
import { Card, Button } from 'react-bootstrap'
import Rating from "../components/Rating";
import data from "../data";


export default function MovieScreen(){
  const { slug } = useParams();
  const movies = data.movies;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    
    const selectedMovie = movies.find(movie => movie.slug === slug);

    if(selectedMovie){
      setMovie(selectedMovie);
    } else {
      console.log("Movie not found");
    }
  }, [slug]);

  if (!movie){
    return<div>Loading...</div>
  }
  
  return (
    <div>
      <Card>
        <Card.Img 
          className='img-large' 
          src={movie.image} 
          alt={movie.title} />
        <Card.Body>
          <Card.Title>{movie.title}</Card.Title>
          <Card.Price>${movie.price}</Card.Price>
          <Rating rating={movie.rating} numReviews={movie.numReviews} />
          <Button>Get Tickets</Button>
        </Card.Body>
      </Card>
    </div>
  )
}