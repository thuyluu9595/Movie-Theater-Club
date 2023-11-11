import React, { useContext, useEffect, useReducer, useState } from "react";
import { Button, Container, Form, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Helmet from 'react-helmet';
import axios from 'axios';
import { Store } from "../Stores";
import {URL} from "../Constants";

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, showtimes: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_SHOWTIME_REQUEST':
      return { ...state, adding: true };
    case 'ADD_SHOWTIME_SUCCESS':
      return { ...state, adding: false };
    case 'ADD_SHOWTIME_FAIL':
      return { ...state, adding: false, addError: action.payload };
    default:
      return state;
  }
}

const initialState = {
  showtimes: [],
  loading: true,
  error: '',
  adding: false,
  addError: '',
};

export default function ShowTimeScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [movieId, setMovieId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [showDate, setShowDate] = useState('');
  const [showTime, setShowTime] = useState('');

  const params = useParams();
  const { id } = params;

  const [{ showtimes, loading, error, adding, addError }, dispatch] = useReducer(reducer, initialState);

  const isAdmin = userInfo && userInfo.role === "Employee";

  const fetchShowtimes = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      const response = await axios.get(`${URL}/showtime/${id}/movie`);
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: err.message });
    }
  };

  const addShowtime = async () => {
    dispatch({ type: 'ADD_SHOWTIME_REQUEST' });
    try {
      await axios.post(`${URL}/showtime`, {
        movieId,
        locationId,
        showDate,
        showTime,
      });
      dispatch({ type: 'ADD_SHOWTIME_SUCCESS' });
      fetchShowtimes(); // Refresh showtimes after adding a new one
    } catch (err) {
      dispatch({ type: 'ADD_SHOWTIME_FAIL', payload: err.message });
    }
  };

  useEffect(() => {
    fetchShowtimes();
  }, []);

  return (
    <Container className='mt-3'>
      <Helmet>
        <title>Showtimes</title>
      </Helmet>
      <h1>Showtimes</h1>

      {isAdmin && (
        <Form onSubmit={(e) => {
          e.preventDefault();
          addShowtime();
        }}>
          <Form.Group controlId="movieId">
            <Form.Label>Movie ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Movie ID"
              onChange={(e) => setMovieId(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="locationId">
            <Form.Label>Location ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Location ID"
              onChange={(e) => setLocationId(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="showDate">
            <Form.Label>Show Date</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => setShowDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="showTime">
            <Form.Label>Show Time</Form.Label>
            <Form.Control
              type="time"
              onChange={(e) => setShowTime(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" disabled={adding}>
            {adding ? 'Adding...' : 'Add Showtime'}
          </Button>
          {addError && <div className="text-danger">{addError}</div>}
        </Form>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Movie Name</th>
              <th>Location</th>
              <th>Room</th>
              <th>Show Date</th>
              <th>Show Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map((showtime) => (
              <tr key={showtime.id}>
                <td>{showtime.movie.title}</td>
                <td>{showtime.screen.location.city}, {showtime.screen.location.state}</td>
                <td>{showtime.screen.name}</td>
                <td>{showtime.date}</td>
                <td>{showtime.startTime}</td>
                <td>
                  <Button>
                    <Link to={`/bookings/${showtime.id}`}>Book</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
