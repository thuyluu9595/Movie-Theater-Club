import React, {useContext, useEffect, useReducer, useState} from 'react';
import {Helmet} from 'react-helmet';
import {Container, Form, Button, Col, Row} from 'react-bootstrap';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {Link, redirect, useNavigate, useParams} from 'react-router-dom';
import {URL} from '../Constants';
import SeatItem from '../components/SeatItem';
import SeatBox from '../components/SeatBox';
import {Store} from '../Stores';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case 'FETCH_SUCCESS':
            return {...state, show: action.payload, loading: false, error: null};
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};
        case 'FETCH_INFO_REQUEST':
            return {...state, loadingInfo: true};
        case 'FETCH_INFO_SUCCESS':
            return {...state, info: action.payload, loadingInfo: false};
        case 'FETCH_INFO_FAIL':
            return {...state, loading: false, errorInfo: action.payload};
        case 'CREATE_BOOKING_REQUEST':
            return {...state, loadingBooking: true};
        case 'CREATE_BOOKING_SUCCESS':
            return {...state, loadingBooking: false};
        case 'CREATE_BOOKING_FAIL':
            return {...state, loadingBooking: false, errorBooking: action.payload};
        default:
            return state;
    }
};

const initialState = {
    info: {},
    loadingInfo: true,
    errorInfo: null,
    loadingBooking: false,
    errorBooking: null,
    show: {},
    loading: true,
    error: null
};

export default function BookingScreen() {
    //TODO: connect backend

    const params = useParams();
    const {id} = params;
    const navigate = useNavigate();

    const [
        {show, loading, error, info, loadingBooking, errorBooking, loadingInfo},
        dispatch
    ] = useReducer(reducer, initialState);
    const {state: ctxState, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = ctxState;

    const [selectedSeats, changeSelectedSeats] = useState([]);
    const [disable, setDisable] = useState(false);
    const [seatsLimit, setLimit] = useState(false);
    const [cardNumber, setCradNumber] = useState(userInfo.name);
    const [expMonth, setExpMonth] = useState(userInfo.email);
    const [expYear, setEpxYear] = useState('');
    const [cvc, setCvc] = useState('');

    useEffect(() => {
        fetchShow();
        getInfo();
    }, []);

    const fetchShow = async () => {
        dispatch({type: 'FETCH_REQUEST'});
        try {
            const response = await axios.get(`${URL}/showtime/${id}`);
            dispatch({type: 'FETCH_SUCCESS', payload: response.data});
        } catch (error) {
            dispatch({
                type: 'FETCH_FAIL',
                payload: error.message || 'Error fetching show'
            });
        }
    };

    const getInfo = async () => {
        dispatch({type: 'FETCH_INFO_REQUEST'});
        try {
            const response = await axios.get(`${URL}/user/info`, {
                headers: {Authorization: `Bearer ${userInfo.token}`}
            });
            dispatch({type: 'FETCH_INFO_SUCCESS', payload: response.data});
        } catch (error) {
            dispatch({type: 'FETCH_INFO_FAIL', payload: error.message});
        }
    };

    const renderCinemaHall = () => {
        let cinemaHall = [];
        let isSelect;
        for (let i = 1; i <= show.availableSeat.length; i++) {
            if (selectedSeats.includes(i)) {
                isSelect = true;
            } else {
                isSelect = false;
            }
            console.log(i, show.availableSeat[i - 1], show.availableSeat);
            cinemaHall = [
                ...cinemaHall,
                <Col md={3}>
                    <SeatItem
                        key={i}
                        seatNumber={i}
                        isSelect={isSelect}
                        selectSeat={handleSelectSeat}
                        takenS={show.availableSeat[i - 1] == null}
                    />
                </Col>
            ];
        }
        return cinemaHall;
    };

    const handleSelectSeat = async (seatNumber) => {
        console.log(seatNumber, selectedSeats);
        if (selectedSeats.includes(seatNumber)) {
            const allSelected = selectedSeats.filter((seat) => seat !== seatNumber);
            changeSelectedSeats(allSelected);
            if (selectedSeats.length === 0) setDisable(true);
            setLimit(false);
        } else if (selectedSeats.length === 8) {
            setLimit(true);
        } else if (show.availableSeat[seatNumber - 1] == null) {
            return;
        } else {
            const allSelected = [...selectedSeats, seatNumber];
            changeSelectedSeats(allSelected);
        }
    };

    let finalPrice;
    let total;
    let tax;
    const renderPrice = () => {
        const price = selectedSeats.length * show.price;
        if (show.discount) {
            finalPrice = price * (1 - show.discount.percentDiscount / 100);
            return (
                <h4>
                    Price: <s>${price.toFixed(2)}</s> ${finalPrice.toFixed(2)}
                </h4>
            );
        } else {
            finalPrice = price;
            return <h4>Price: ${finalPrice}</h4>;
        }
    };

    const renderTotal = () => {
        if (loadingInfo) {
            return <LoadingBox/>
        }
        if (info !== null && info.member !== null) {
            tax = finalPrice * 0.1;
            if (info.member.membershipTier === 'Regular') {
                total = finalPrice + 1.5 * selectedSeats.length;
                return (
                    <div>
                        <h4>Online Service Fee: $1.50 x {selectedSeats.length}</h4>
                        <h4>Tax: ${tax.toFixed(2)}</h4>
                        <h4>Total: ${(total + tax).toFixed(2)}</h4>
                    </div>
                );
            } else {
                total = finalPrice;
                return (
                    <div>
                        <h4>Tax: ${tax.toFixed(2)}</h4>
                        <h4>Total: ${(total + tax).toFixed(2)}</h4>
                    </div>
                );
            }
        }
    };

    async function submitHandler(e) {
        try {
            const bookingId = await createBooking();
            navigate(`/payment/${bookingId}`);
        } catch (error) {
        }
    }

    async function createBooking() {
        dispatch({type: 'CREATE_BOOKING_REQUEST'});
        try {
            const req = {
                userId: userInfo.id,
                showTimeId: id,
                seats: selectedSeats
            };
            console.log(req);
            const {data} = await axios.post(`${URL}/bookings`, req, {
                headers: {Authorization: `Bearer ${userInfo.token}`}
            });
            dispatch({type: 'CREATE_BOOKING_SUCCESS', payload: data});
            return data.id;
        } catch (error) {
            console.log(error);
            console.log(show.availableSeat);
            dispatch({type: 'CREATE_BOOKING_FAIL', payload: error.message});
            throw error;
        }
    }

    return (
        <Container fluid>
            <Helmet>
                <title>Bookings</title>
            </Helmet>
            <h1>Book Tickets</h1>
            {loading ? (
                <LoadingBox/>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <Row>
                    <Col md={4}>
                        <h2>{show.movie.title}</h2>
                        <img
                            className="img-large"
                            src={show.movie.posterUrl}
                            alt={show.movie.title}
                            width="300"
                            height="400"
                        />
                        <h6>Date: {show.date}</h6>
                        <h6>Start time: {show.startTime}</h6>
                        <h6>End time: {show.endTime}</h6>
                        <h6>Price: ${show.price}/ticket</h6>
                        {show.discount && (
                            <h6>Discount {show.discount.percentDiscount}% off</h6>
                        )}
                    </Col>
                    <Col md={8}>
                        <div className="screen"/>
                        <h4 className="title-hall" align="center">
                            {show.screen.name}
                        </h4>
                        <Row>{renderCinemaHall()}</Row>
                        <h3 className="selected-seats-title">Selected Seats</h3>
                        <Row>
                            {selectedSeats.map((i) => (
                                <Col md={1}>
                                    <SeatBox
                                        key={i}
                                        seatNumber={i}
                                        selectSeat={handleSelectSeat}
                                    />
                                </Col>
                            ))}
                        </Row>
                        {renderPrice()}
                        {renderTotal()}
                        {loadingBooking && <LoadingBox/>}
                        {errorBooking && (
                            <MessageBox variant="danger">{errorBooking}</MessageBox>
                        )}
                        <button
                            type="button"
                            className="pay-button"
                            disabled={selectedSeats.length === 0}
                            onClick={(e) => submitHandler(e)}
                        >
                            {'Purchase'}
                        </button>
                    </Col>
                </Row>
            )}
            {/*<Form>*/}
            {/*  <Form.Group controlId="userId">*/}
            {/*    <Form.Label>User ID</Form.Label>*/}
            {/*    <Form.Control*/}
            {/*      type="text"*/}
            {/*      placeholder="Enter User ID"*/}
            {/*      value={userId}*/}
            {/*      onChange={(e) => setUserId(e.target.value)}*/}
            {/*    />*/}
            {/*  </Form.Group>*/}
            {/*  <Form.Group controlId="movie">*/}
            {/*    <Form.Label>Select Movie</Form.Label>*/}
            {/*    <Form.Control*/}
            {/*      as="select"*/}
            {/*      onChange={(e) => setSelectedMovie(e.target.value)}*/}
            {/*    >*/}
            {/*      /!* Populate with movie options *!/*/}
            {/*      <option value="">Select Movie</option>*/}
            {/*      /!* Add movie options dynamically *!/*/}
            {/*    </Form.Control>*/}
            {/*  </Form.Group>*/}
            {/*  <Form.Group controlId="showtime">*/}
            {/*    <Form.Label>Select Showtime</Form.Label>*/}
            {/*    <Form.Control*/}
            {/*      as="select"*/}
            {/*      onChange={(e) => setSelectedShowtime(e.target.value)}*/}
            {/*    >*/}
            {/*      /!* Populate with showtime options *!/*/}
            {/*      <option value="">Select Showtime</option>*/}
            {/*      /!* Add showtime options dynamically *!/*/}
            {/*    </Form.Control>*/}
            {/*  </Form.Group>*/}
            {/*  <Link to={'/payment'}>*/}
            {/*    <Button variant="primary" onClick={handleBooking}>*/}
            {/*      Book Now*/}
            {/*    </Button>*/}
            {/*  </Link>*/}
            {/*</Form>*/}
            {/*{state.loading ? (*/}
            {/*  <LoadingBox />*/}
            {/*) : state.error ? (*/}
            {/*  <MessageBox variant="danger">{state.error}</MessageBox>*/}
            {/*) : (*/}
            {/*  <div>*/}
            {/*    <h2>Bookings List</h2>*/}
            {/*    <Button variant="primary" onClick={getBookingsByUserId}>*/}
            {/*      Get Bookings By User ID*/}
            {/*    </Button>*/}
            {/*    <Button variant="primary" onClick={getWatchedMoviesIn30Days}>*/}
            {/*      Get Watched Movies in Last 30 Days*/}
            {/*    </Button>*/}
            {/*    <BookingList bookings={state.bookings} cancelBooking={cancelBooking} />*/}
            {/*  </div>*/}
            {/*)}*/}
        </Container>
    );
}
