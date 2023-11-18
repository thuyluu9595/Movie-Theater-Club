import React, {useContext, useEffect, useReducer, useState} from "react";
import {Button, Container, Form, Table} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";
import Helmet from 'react-helmet';
import axios from 'axios';
import {Store} from "../Stores";
import {URL} from "../Constants";
import moment from "moment";

const reducer = (state, action) => {
    switch (action.type) {
        // Fetch Showtime
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case 'FETCH_SUCCESS':
            return {...state, showtimes: action.payload, loading: false};
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};

        // Fetch Location
        case 'FETCH_LOCATION_REQUEST':
            return {...state, loadingLocation: true};
        case 'FETCH_LOCATION_SUCCESS':
            return {...state, locations: action.payload, loadingLocation: false};
        case 'FETCH_LOCATION_FAIL':
            return {...state, loadingLocation: false, errorLocation: action.payload};

        // Fetch Screen
        case 'FETCH_SCREEN_REQUEST':
            return {...state, loadingScreen: true};
        case 'FETCH_SCREEN_SUCCESS':
            return {...state, loadingScreen: false, screens: action.payload};
        case 'FETCH_SCREEN_FAIL':
            return {...state, loadingScreen: false, errorScreen: action.payload};

        // Create Showtime
        case 'ADD_SHOWTIME_REQUEST':
            return {...state, adding: true};
        case 'ADD_SHOWTIME_SUCCESS':
            return {...state, adding: false};
        case 'ADD_SHOWTIME_FAIL':
            return {...state, adding: false, addError: action.payload};
        default:
            return state;
    }
}

const initialState = {
    showtimes: [],
    loading: false,
    error: '',

    locations: [],
    loadingLocation: false,
    errorLocation: null,

    screens: [],
    loadingScreen: false,
    errorScreen: null,

    adding: false,
    addError: '',
};

export default function ShowTimeScreen() {
    const navigate = useNavigate();
    const {state} = useContext(Store);
    const {userInfo} = state;
    const params = useParams();
    const {id} = params;

    // Hook declaration
    const [screenId, setScreenId] = useState('');
    const [locationId, setLocationId] = useState('');
    const [date, setDate] = useState();
    const [startTime, setStartTime] = useState('');
    const [price, setPrice] = useState(0.00);

    const [{
        showtimes,
        loading,
        error,

        locations,
        loadingLocation,
        errorLocation,

        screens,
        loadingScreen,
        errorScreen,

        adding,
        addError
    }, dispatch] = useReducer(reducer, initialState);

    const isAdmin = userInfo && userInfo.role === "Employee";

    const fetchShowtimes = async () => {
        dispatch({type: 'FETCH_REQUEST'});
        try {
            const response = await axios.get(`${URL}/showtime/${id}/movie`);
            dispatch({type: 'FETCH_SUCCESS', payload: response.data});
        } catch (err) {
            dispatch({type: 'FETCH_FAIL', payload: err.message});
        }
    };

    const fetchLocations = async () => {
        dispatch({type: 'FETCH_LOCATION_REQUEST'});
        try {
            const response = await axios.get(`${URL}/locations`);
            dispatch({type: 'FETCH_LOCATION_SUCCESS', payload: response.data});
        } catch (err) {
            dispatch({type: 'FETCH_LOCATION_FAIL', payload: err.message});
        }
    }

    const fetchSccreen = async (locId) => {
        dispatch({type: 'FETCH_SCREEN_REQUEST'})
        try {
            const response = await axios.get(`${URL}/screens/locations/${locId}`);
            dispatch({type: 'FETCH_SCREEN_SUCCESS', payload: response.data});
        } catch (err) {
            dispatch({type: 'FETCH_SCREEN_FAIL', payload: err.message});
        }
    }

    const addShowtime = async () => {
        dispatch({type: 'ADD_SHOWTIME_REQUEST'});
        try {
            await axios.post(`${URL}/showtime`, {
                    "movieId": id,
                    screenId,
                    date,
                    startTime,
                    price
                },
                {
                    headers: {Authorization: `Bearer ${userInfo.token}`},
                });

            dispatch({type: 'ADD_SHOWTIME_SUCCESS'});
            fetchShowtimes(); // Refresh showtimes after adding a new one
            
            setScreenId(null);
            setPrice(0.00);
            setStartTime();
            setLocationId(null);
            setDate();
        } catch (err) {
            dispatch({type: 'ADD_SHOWTIME_FAIL', payload: err.message});
        }
    };

    const locationHandler = (e) => {
        if (e.target.value === null) return
        else {
            setLocationId(e.target.value);
            fetchSccreen(e.target.value);
            setScreenId(null);
        }
    }

    useEffect(() => {
        fetchShowtimes();
        if (isAdmin) fetchLocations();

    }, []);

    return (
        <Container className='mt-3'>
            <Helmet>
                <title>Showtimes</title>
            </Helmet>
            <h1>Showtimes</h1>


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

            {isAdmin && (
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    addShowtime();
                    e.target.reset();
                }}>

                    <Form.Group controlId="locationId">
                        <Form.Label>Location</Form.Label>
                        <Form.Select
                            onChange={e => locationHandler(e)}
                            required={true}
                        >
                            <option value={null}>Select Location</option>
                            {locations.map((location) => (
                                <option value={location.id}>{`${location.city}, ${location.state}`}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="screenId">
                        <Form.Label>Screen</Form.Label>
                        <Form.Select
                            onChange={e => setScreenId(e.target.value)}
                            required={true}
                        >
                            <option value={null}>Select Screen</option>
                            {screens.map((screen) => (
                                <option value={screen.id}>{screen.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="showDate">
                        <Form.Label>Show Date</Form.Label>
                        <Form.Control
                            type="date"
                            onChange={(e) => setDate(moment(e.target.value).format("MM/DD/yyyy"))}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="showTime">
                        <Form.Label>Show Time</Form.Label>
                        <Form.Control
                            type="time"
                            onChange={(e) => setStartTime(e.target.value + ":00")}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="price">
                        <Form.Label>Ticket Price</Form.Label>
                        <Form.Control
                            type="number"
                            step={0.01}
                            min={0}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" disabled={adding}>
                        {adding ? 'Adding...' : 'Add Showtime'}
                    </Button>
                    {addError && <div className="text-danger">{addError}</div>}
                </Form>
            )}
        </Container>
    );
}
