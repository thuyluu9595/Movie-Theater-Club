import React, { useEffect, useReducer, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import Helmet from 'react-helmet';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { URL } from '../Constants'; // Import your URL constant

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_LOCATIONS_SUCCESS':
            return { ...state, locations: action.payload, loading: false };
        case 'FETCH_SHOWTIME_SUCCESS':
            return { ...state, showtime: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const ShowtimeByLocationScreen = () => {
    const [{ locations, showtime, loading, error }, dispatch] = useReducer(reducer, {
        locations: [],
        showtime: [],
        loading: true,
        error: '',
    });

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await axios.get(`${URL}/locations`);
                dispatch({ type: 'FETCH_LOCATIONS_SUCCESS', payload: res.data });
            } catch (e) {
                dispatch({ type: 'FETCH_FAIL', payload: e.message });
            }
        };
        fetchLocations();
    }, []);

    const [locationId, setLocationId] = useState(1);

    useEffect(() => {
        const fetchShowtime = async () => {
            try {
                const response = await axios.get(`${URL}/showtime/${locationId}/location`);
                dispatch({ type: 'FETCH_SHOWTIME_SUCCESS', payload: response.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        };
        fetchShowtime();
    }, [locationId]);

    const handleLocationChange = (e) => {
        setLocationId(e.target.value);
    };

    return (
        <Container>
            <Helmet>
                <title>Showtime</title>
            </Helmet>
            <h1>Showtime</h1>
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <label htmlFor="location-select" style={{ color: 'black', marginRight: '0.7rem' }}>
                        Location:{' '}
                    </label>
                    <Form.Control as="select" className="location-select" value={locationId} onChange={handleLocationChange}>
                        {locations.map((lo) => (
                            <option key={lo.id} value={lo.id}>
                                {lo.city + ', ' + lo.state}
                            </option>
                        ))}
                    </Form.Control>
                    <Row className="row">
                        {showtime.map((show) => (
                            <Col key={show.id} className="col" sm={6} md={4} lg={3}>
                                <ul>
                                    <li>{show.id}</li>
                                    <li>{show.movie.title}</li>
                                    <li>{show.screen.name}</li>
                                </ul>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </Container>
    );
};

export default ShowtimeByLocationScreen;
