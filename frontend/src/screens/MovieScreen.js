import React, { useEffect, useReducer } from "react"; 
import Rating from "../components/Rating";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Button, Badge } from 'react-bootstrap';
import { Helmet } from "react-helmet";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true};
    case 'FETCH_SUCCESS':
      return {...state, movie: action.payload, loading: false};
    case 'FETCH_FAIL':
      return {...state,loading:false, error: action.payload};
    default:
      return state;
  }
}

export default function MovieScreen(){

  const {slug } = useParams();

  const  [{ loading, error, movie}, dispatch] = useReducer(reducer, {
    movie: [],
    loading : true, 
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({type: 'FETCH_REQUEST'});
      try {
        const result = await axios.get(`/api/movies/slug/${slug}`);
        dispatch({type: 'FETCH_SUCCESS', payload: result.data});
      } catch(err) {
        dispatch({type: 'FETCH_FAIL', payload: getError(err)});
      }
    };
    fetchData();
  }, [slug]);
  
  return loading ? (
      <LoadingBox/>
    ) :  error ? (
      <MessageBox variant='danger'>{error}</MessageBox>
    ) : (
      <div>
        <Row>
          <Col md={3}>
            <img 
              className='img-large'
              src={movie.image}
              alt={movie.title}
            />
          </Col>
          <Col md={5}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Helmet>
                  <title>{movie.title}</title>
                </Helmet> 
                <h1>{movie.title}</h1>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  rating={movie.rating}
                  numReviews={movie.numReviews}/>
              </ListGroup.Item>
              <ListGroup.Item>
                Price: ${movie.price}
              </ListGroup.Item>
              <ListGroup.Item>
                Decription: {movie.description}
              </ListGroup.Item>
              <ListGroup.Item>
                Duration: {movie.duration}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <Col>Price</Col>
                <Col>${movie.price}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Seats</Col>
                <Col>
                  {movie.seats>0 ?(
                    <Badge bg="success">Vaviable</Badge>
                  ) : (
                    <Badge bg="danger">Unvariable</Badge>
                  )}   
                </Col>
              </Row>
            </ListGroup.Item>
            {movie.seats > 0 && (
              <ListGroup.Item>
                <div className='d-grid'>
                  <Link to='/signin'>
                    <Button variant='primary'>Get Tickets</Button>
                  </Link>
                </div>
              </ListGroup.Item>
            )}
          </ListGroup>
          </Col>
        </Row>
      </div>
  );

}