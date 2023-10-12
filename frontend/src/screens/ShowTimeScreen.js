import React, { useEffect, useReducer } from "react";
import { Helmet } from "react-helmet";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
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
};

const initialState = {
  showtimes: [],
  loading: false,
  error: null,
}

export default function ShowTimeScreen() {
  const [state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const response = await axios.get('http://localhost:8080/api/showtimes');
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error });
      }
    }
    fetchData();
  }, []);

  const {showtimes, loading, error } = state;

  return (
    <Container>
      <Helmet>
        <title>Show Time</title>
      </Helmet>
      <h1>Movie Showtimes</h1>
      { loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="thead">
            <tr>
                <th>Movie</th>
                <th>Showtime</th>
                <th>Location</th>
                <th>Tickets</th>
            </tr>
          </thead>
          <tbody className="tbody">
            {showtimes.map((showtime, id) =>(
              <tr key={id}>
                <td>{showtime.movie}</td>
                <td>{showtime.showtime}</td>
                <td>{showtime.location}</td>
                <td>
                  <Link to='/'>Buy Tickets</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
    </Container>

  )
}