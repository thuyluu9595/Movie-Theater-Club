import React, { useEffect, useReducer, useState } from 'react';
import { Col, Container, Form, Row, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { URL } from '../Constants';
import { getError } from '../utils';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_LOCATIONS_SUCCESS':
            return { ...state, locations: action.payload };
        case 'FETCH_SHOWTIME_REQUEST':
            return { ...state, loadingShowtimes: true, error: '' };
        case 'FETCH_SHOWTIME_SUCCESS':
            return { ...state, showtimes: action.payload, loading: false, loadingShowtimes: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, loadingShowtimes: false, error: action.payload };
        default:
            return state;
    }
};

const ShowtimeByLocationScreen = () => {
    const [{ locations, showtimes, loading, error, loadingShowtimes }, dispatch] = useReducer(reducer, {
        locations: [],
        showtimes: [],
        loading: true,
        error: '',
        loadingShowtimes: true,
    });

    const navigate = useNavigate();
    const [locationId, setLocationId] = useState('');

    useEffect(() => {
        const fetchLocations = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get(`${URL}/locations`);
                dispatch({ type: 'FETCH_LOCATIONS_SUCCESS', payload: data });
                if (data.length > 0) {
                    setLocationId(data[0].id); // Set initial location
                } else {
                    // Handle case with no locations
                    dispatch({ type: 'FETCH_SHOWTIME_SUCCESS', payload: [] });
                }
            } catch (e) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(e) });
            }
        };
        fetchLocations();
    }, []);

    useEffect(() => {
        if (!locationId) return; // Don't fetch if no location is selected

        const fetchShowtimes = async () => {
            dispatch({ type: 'FETCH_SHOWTIME_REQUEST' });
            try {
                const { data } = await axios.get(`${URL}/showtime/${locationId}/location`);
                dispatch({ type: 'FETCH_SHOWTIME_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchShowtimes();
    }, [locationId]);

    return (
        <Container fluid className="showtime-page">
            <Helmet>
                <title>Showtimes</title>
            </Helmet>
            <div className="page-header">
                <h1 className="page-title">Showtimes by Location</h1>
            </div>

            {loading ? <LoadingBox /> : error ? <MessageBox variant="danger">{error}</MessageBox> : (
                <>
                    <Form.Group controlId="location-select" className="location-filter-group">
                        <Form.Label>Select a Location</Form.Label>
                        <Form.Control as="select" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                            {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.city}, {loc.state}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    {loadingShowtimes ? <LoadingBox /> : showtimes.length === 0 ? (
                        <MessageBox variant="info">No showtimes available for this location.</MessageBox>
                    ) : (
                        <Row xs={1} md={2} xl={3} className="g-4">
                            {showtimes.map((show) => (
                                <Col key={show.id}>
                                    <div className="showtime-card">
                                        <h4 className="showtime-movie-title">{show.movie.title}</h4>
                                        <ul className="showtime-details-list">
                                            <li><i className="fas fa-desktop"></i><span>Room: {show.screen.name}</span></li>
                                            <li><i className="fas fa-calendar-alt"></i><span>Date: {show.date}</span></li>
                                            <li><i className="fas fa-clock"></i><span>Time: {show.startTime}</span></li>
                                            <li><i className="fas fa-dollar-sign"></i><span>Price: ${show.price.toFixed(2)}</span></li>
                                        </ul>
                                        <Button className="btn-book-now" onClick={() => navigate(`/bookings/${show.id}`)}>
                                            Book Now
                                        </Button>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )}
                </>
            )}
        </Container>
    );
};

export default ShowtimeByLocationScreen;
