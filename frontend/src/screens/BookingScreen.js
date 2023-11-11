import React, { useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, bookings: action.payload, loading: false, error: null };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  bookings: [],
  loading: false,
  error: null,
};

const BookingList = ({ bookings, cancelBooking }) => {
  return (
    <ul>
      {bookings.map((booking) => (
        <li key={booking.id}>
          User ID: {booking.userId}, Movie: {booking.movie}, Showtime: {booking.showtime}
          <Button variant="danger" onClick={() => cancelBooking(booking.id)}>
            Cancel Booking
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default function BookingScreen() {
    //TODO: connect backend

  const [state, dispatch] = useReducer(reducer, initialState);
  const [userId, setUserId] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      const response = await axios.get(`${URL}/bookings`);
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: error.message || 'Error fetching bookings' });
    }
  };

  const handleBooking = async () => {
    try {
      await axios.post(`${URL}/bookings`, {
        userId,
        movie: selectedMovie,
        showtime: selectedShowtime,
      });
      fetchBookings();
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: error.message || 'Error booking tickets' });
    }
  };

  const getBookingsByUserId = async () => {
    try {
      const response = await axios.get(`${URL}/bookings/user/${userId}`);
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: error.message || 'Error fetching bookings by user ID' });
    }
  };

  const getWatchedMoviesIn30Days = async () => {
    try {
      const response = await axios.get(`${URL}/bookings/watched-movie-30?id=${userId}`);
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: error.message || 'Error fetching watched movies in 30 days' });
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await axios.delete(`${URL}/bookings/${bookingId}`);
      fetchBookings();
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: error.message || 'Error canceling booking' });
    }
  };

  return (
    <Container>
      <Helmet>
        <title>Bookings</title>
      </Helmet>
      <h1>Book Tickets</h1>
      <Form>
        <Form.Group controlId="userId">
          <Form.Label>User ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="movie">
          <Form.Label>Select Movie</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => setSelectedMovie(e.target.value)}
          >
            {/* Populate with movie options */}
            <option value="">Select Movie</option>
            {/* Add movie options dynamically */}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="showtime">
          <Form.Label>Select Showtime</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => setSelectedShowtime(e.target.value)}
          >
            {/* Populate with showtime options */}
            <option value="">Select Showtime</option>
            {/* Add showtime options dynamically */}
          </Form.Control>
        </Form.Group>
        <Link to={'/payment'}>
          <Button variant="primary" onClick={handleBooking}>
            Book Now
          </Button>
        </Link>
      </Form>
      {state.loading ? (
        <LoadingBox />
      ) : state.error ? (
        <MessageBox variant="danger">{state.error}</MessageBox>
      ) : (
        <div>
          <h2>Bookings List</h2>
          <Button variant="primary" onClick={getBookingsByUserId}>
            Get Bookings By User ID
          </Button>
          <Button variant="primary" onClick={getWatchedMoviesIn30Days}>
            Get Watched Movies in Last 30 Days
          </Button>
          <BookingList bookings={state.bookings} cancelBooking={cancelBooking} />
        </div>
      )}
    </Container>
  );
}
