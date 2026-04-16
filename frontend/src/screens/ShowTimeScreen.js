import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Form, Button, Col, Row, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from "moment";

import { Store } from '../Stores';
import { URL } from '../Constants';
import { getError } from '../utils';
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
    switch (action.type) {
        // Fetching main showtime list
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, showtimes: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        // Form-related fetching
        case 'FETCH_LOCATIONS_SUCCESS':
            return { ...state, locations: action.payload };
        case 'FETCH_SCREENS_SUCCESS':
            return { ...state, screens: action.payload };

        // Add Showtime
        case 'ADD_REQUEST':
            return { ...state, loadingAdd: true, errorAdd: '', successAdd: '' };
        case 'ADD_SUCCESS':
            return {
                ...state,
                loadingAdd: false,
                successAdd: 'Showtime added successfully!',
                showtimes: [action.payload, ...state.showtimes] // Add to list instantly
            };
        case 'ADD_FAIL':
            return { ...state, loadingAdd: false, errorAdd: action.payload };

        // Cancel Showtime
        case 'CANCEL_REQUEST':
            return { ...state, loadingCancel: true, errorCancel: '', successCancel: '' };
        case 'CANCEL_SUCCESS':
            return {
                ...state,
                loadingCancel: false,
                successCancel: 'Showtime canceled successfully!',
                showtimes: state.showtimes.filter(s => s.id !== action.payload) // Remove from list instantly
            };
        case 'CANCEL_FAIL':
            return { ...state, loadingCancel: false, errorCancel: action.payload };

        case 'CLEAR_MESSAGES':
            return { ...state, successAdd: '', errorAdd: '', successCancel: '', errorCancel: '' };

        default:
            return state;
    }
};

export default function ShowTimeScreen() {
    const navigate = useNavigate();
    const { state: storeState } = useContext(Store);
    const { userInfo } = storeState;
    const { id: movieId } = useParams();
    const isAdmin = userInfo?.role === "Employee";

    const [{
        showtimes, loading, error, locations, screens,
        loadingAdd, errorAdd, successAdd,
        loadingCancel, errorCancel, successCancel
    }, dispatch] = useReducer(reducer, {
        showtimes: [], loading: true, error: '', locations: [], screens: [],
        loadingAdd: false, errorAdd: '', successAdd: '',
        loadingCancel: false, errorCancel: '', successCancel: '',
    });

    // Form state
    const [locationId, setLocationId] = useState('');
    const [screenId, setScreenId] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [price, setPrice] = useState('');

    // --- Data Fetching Effects ---
    useEffect(() => {
        const fetchInitialData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                // Fetch showtimes and locations in parallel for efficiency
                const [showtimesRes, locationsRes] = await Promise.all([
                    axios.get(`${URL}/showtime/${movieId}/movie`),
                    isAdmin ? axios.get(`${URL}/locations`) : Promise.resolve({ data: [] })
                ]);
                dispatch({ type: 'FETCH_SUCCESS', payload: showtimesRes.data });
                if (isAdmin) {
                    dispatch({ type: 'FETCH_LOCATIONS_SUCCESS', payload: locationsRes.data });
                }
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchInitialData();
    }, [movieId, isAdmin]);

    useEffect(() => {
        if (locationId && isAdmin) {
            const fetchScreens = async () => {
                try {
                    const { data } = await axios.get(`${URL}/screens/locations/${locationId}`);
                    dispatch({ type: 'FETCH_SCREENS_SUCCESS', payload: data });
                } catch (err) { /* Handle error */ }
            };
            fetchScreens();
        } else {
            dispatch({ type: 'FETCH_SCREENS_SUCCESS', payload: [] }); // Clear screens if no location
        }
    }, [locationId, isAdmin]);

    // --- Event Handlers ---
    const addShowtimeHandler = async (e) => {
        e.preventDefault();
        dispatch({ type: 'ADD_REQUEST' });
        try {
            const { data } = await axios.post(`${URL}/showtime`, {
                movieId,
                screenId,
                date: moment(date).format("MM/DD/YYYY"), // Format date on submission
                startTime: startTime + ":00",
                price
            }, { headers: { Authorization: `Bearer ${userInfo.token}` } });

            dispatch({ type: 'ADD_SUCCESS', payload: data });

            // Reset form state after successful submission
            setLocationId('');
            setScreenId('');
            setDate('');
            setStartTime('');
            setPrice('');

            setTimeout(() => dispatch({ type: 'CLEAR_MESSAGES' }), 3000);
        } catch (err) {
            dispatch({ type: 'ADD_FAIL', payload: getError(err) });
        }
    };

    const cancelShowHandler = async (showtimeId) => {
        if (window.confirm('Are you sure you want to cancel this showtime?')) {
            dispatch({ type: 'CANCEL_REQUEST' });
            try {
                await axios.delete(`${URL}/showtime/${showtimeId}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                dispatch({ type: 'CANCEL_SUCCESS', payload: showtimeId });
                setTimeout(() => dispatch({ type: 'CLEAR_MESSAGES' }), 3000);
            } catch (err) {
                dispatch({ type: 'CANCEL_FAIL', payload: getError(err) });
            }
        }
    };

    // --- Sub-components for clean rendering ---
    const AdminView = () => (
        <Row>
            <Col lg={8} className="mb-4">
                <ShowtimeTable />
            </Col>
            <Col lg={4}>
                <AddShowtimeForm />
            </Col>
        </Row>
    );

    const UserView = () => (
        <Row>
            <Col>
                <ShowtimeTable />
            </Col>
        </Row>
    );

    const ShowtimeTable = () => (
        <div className="table-card">
            <h3 className="table-card-title">Available Showtimes</h3>
            {successCancel && <MessageBox variant="success">{successCancel}</MessageBox>}
            {errorCancel && <MessageBox variant="danger">{errorCancel}</MessageBox>}
            {loading ? <LoadingBox /> : error ? <MessageBox variant="danger">{error}</MessageBox> : showtimes.length === 0 ? <MessageBox variant="info">No showtimes available for this movie yet.</MessageBox> : (
                <Table responsive className="data-table">
                    <thead>
                    <tr>
                        <th>Location</th>
                        <th>Room</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th className="text-center">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {showtimes.map((show) => (
                        <tr key={show.id}>
                            <td>{show.screen.location.city}, {show.screen.location.state}</td>
                            <td>{show.screen.name}</td>
                            <td>{show.date}</td>
                            <td>{show.startTime}</td>
                            <td className="text-center">
                                {isAdmin ? (
                                    <Button className="btn-cancel-show" onClick={() => cancelShowHandler(show.id)} disabled={loadingCancel}>
                                        Cancel
                                    </Button>
                                ) : (
                                    <Button className="btn-table-action" onClick={() => navigate(`/bookings/${show.id}`)}>
                                        Book
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </div>
    );

    const AddShowtimeForm = () => (
        <div className="form-card">
            <h3 className="form-card-title">Add New Showtime</h3>
            <Form onSubmit={addShowtimeHandler}>
                {errorAdd && <MessageBox variant="danger">{errorAdd}</MessageBox>}
                {successAdd && <MessageBox variant="success">{successAdd}</MessageBox>}

                <Form.Group className="mb-3" controlId="locationId">
                    <Form.Label>Location</Form.Label>
                    <Form.Select value={locationId} onChange={(e) => { setLocationId(e.target.value); setScreenId(''); }} required>
                        <option value="">Select Location...</option>
                        {locations.map((loc) => (<option key={loc.id} value={loc.id}>{`${loc.city}, ${loc.state}`}</option>))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="screenId">
                    <Form.Label>Screen</Form.Label>
                    <Form.Select value={screenId} onChange={(e) => setScreenId(e.target.value)} required disabled={!locationId}>
                        <option value="">Select Screen...</option>
                        {screens.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="showDate">
                    <Form.Label>Show Date</Form.Label>
                    <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="showTime">
                    <Form.Label>Show Time</Form.Label>
                    <Form.Control type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-4" controlId="price">
                    <Form.Label>Ticket Price</Form.Label>
                    <Form.Control type="number" step="0.01" min="0" placeholder="$0.00" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </Form.Group>

                <div className="d-grid">
                    <Button type="submit" className="auth-button" disabled={loadingAdd}>
                        {loadingAdd ? <LoadingBox isButton={true} /> : 'Add Showtime'}
                    </Button>
                </div>
            </Form>
        </div>
    );

    return (
        <Container fluid className="showtime-admin-page">
            <Helmet>
                <title>Showtimes</title>
            </Helmet>
            <div className="page-header">
                <h1 className="page-title">{isAdmin ? 'Manage Showtimes' : 'Available Showtimes'}</h1>
            </div>
            {isAdmin ? <AdminView /> : <UserView />}
        </Container>
    );
}
