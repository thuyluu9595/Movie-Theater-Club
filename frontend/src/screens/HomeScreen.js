import React, { useReducer, useEffect } from "react";
import {Row, Col } from 'react-bootstrap';
import Movie from "../components/Movie";
import axios from "axios";
import logger from "use-reducer-logger";
import { Helmet } from "react-helmet";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true};
    case 'FETCH_SUCCESS':
      return {...state, movies: action.payload, loading: false};
    case 'FETCH_FAIL':
      return {...state,loading:false, error: action.payload};
    default:
      return state;
  }
}

export default function HomeScreen(props){
  const apiUrl = 'http://localhost:8080/api/movies';

  const  [{ loading, error, movies}, dispatch] = useReducer(logger(reducer), {
    movies: [],
    loading : true, 
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({type: 'FETCH_REQUEST'});
      try {
        const response = await axios.get(apiUrl);
        dispatch({type: 'FETCH_SUCCESS', payload: response.data});
      } catch(err) {
        dispatch({type: 'FETCH_FAIL', payload: err.message});
      }
      
      //setMovies(result.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>THC Theather</title>
      </Helmet>
      <h1>List Of Movies</h1>
      <div className='movies'>
        <Row>
          {
            loading ? (
              <LoadingBox />
            ) : error ? (
              <MessageBox variant='danger'>{error}</MessageBox>
            ) : (
            movies.map((movie) => (
            <Col key={movie._id} sm={6} md={4} lg={3} className='mb-3'>
              <Movie movie={movie}></Movie>
            </Col>
          )))}
        </Row>
      </div>
    </div>
  )
}