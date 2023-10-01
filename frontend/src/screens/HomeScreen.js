import data from "../data";
import React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Movie from "../components/Movie";

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
        <Row>
          {data.movies.map((movie) => (
            <Col key={movie.slug} sm={6} md={4} lg={3} className='mb-3'>
              <Movie movie={movie}></Movie>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}