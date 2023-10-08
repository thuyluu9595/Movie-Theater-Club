import React, { useEffect, useReducer } from "react"; 
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Button } from 'react-bootstrap';
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
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const  [{ loading, error, movie}, dispatch] = useReducer(reducer, {
    movie: {},
    loading : true, 
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({type: 'FETCH_REQUEST'});
      try {
        const result = await axios.get(`http://localhost:8080/api/movies/${id}`);
        dispatch({type: 'FETCH_SUCCESS', payload: result.data});
      } catch(err) {
        dispatch({type: 'FETCH_FAIL', payload: getError(err)});
      }
    };
    fetchData();
  }, [id, navigate]);

  // const { state, dispatch: ctxDispatch} = useContext(Store);
  // const {ticket } = state;
  // const addToTicketHandler = async () => {
  //   const existItem = ticket.ticketItems.find((x) => x._id === movie._id);
  //   const quantity = existItem ? existItem.quantity + 1 : 1;
  //   const {data} = await axios.get(`/api/movies/${movie._id}`);
  //   if (data.seats < quantity) {
  //     window.alert('Sorry. Movie is out of stock');
  //     return;
  //   }

  //   ctxDispatch({
  //     type: 'TICKET_ADD_ITEM', 
  //     payload: {...movie, quantity},
  //   });
  // };
  
  return loading ? (
      <LoadingBox/>
    ) :  error ? (
      <MessageBox variant='danger'>{error}</MessageBox>
    ) : (
      <div>
        <Row>
          <Col md={4}>
            <img 
              className='img-large'
              src='/images/images1.jpeg'
              alt={movie.title}
            />
          </Col>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Helmet>
                  <title>{movie.title}</title>
                </Helmet> 
                <h1>{movie.title}</h1>
              </ListGroup.Item>
              <ListGroup.Item>
                Release Day: {movie.releaseDate}
              </ListGroup.Item>
              <ListGroup.Item>
                Duration: {movie.duration}
              </ListGroup.Item>
              <ListGroup.Item>
                Decription: {movie.description}
              </ListGroup.Item>
              <ListGroup.Item>
                <Link to={`/showtime`}>
                  <Button>Get Tickets</Button>
                </Link>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </div>
  );

}