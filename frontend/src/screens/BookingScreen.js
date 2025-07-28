import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { Store } from '../Stores';
import { URL } from '../Constants';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import SeatItem from '../components/SeatItem';
import SeatBox from '../components/SeatBox';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, show: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        case 'FETCH_INFO_REQUEST':
            return { ...state, loadingInfo: true };
        case 'FETCH_INFO_SUCCESS':
            return { ...state, info: action.payload, loadingInfo: false };
        case 'FETCH_INFO_FAIL':
            return { ...state, loadingInfo: false, errorInfo: action.payload };

        case 'CREATE_BOOKING_REQUEST':
            return { ...state, loadingBooking: true, errorBooking: '' };
        case 'CREATE_BOOKING_SUCCESS':
            return { ...state, loadingBooking: false };
        case 'CREATE_BOOKING_FAIL':
            return { ...state, loadingBooking: false, errorBooking: action.payload };
        default:
            return state;
    }
};

export default function BookingScreen() {
    const params = useParams();
    const { id: showtimeId } = params;
    const navigate = useNavigate();

    const [{ show, loading, error, info, loadingBooking, errorBooking, loadingInfo }, dispatch] = useReducer(reducer, {
        info: null,
        loadingInfo: true,
        show: null,
        loading: true,
    });

    const { state: ctxState } = useContext(Store);
    const { userInfo } = ctxState;

    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        const fetchShow = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get(`${URL}/showtime/${showtimeId}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        const getInfo = async () => {
            dispatch({ type: 'FETCH_INFO_REQUEST' });
            try {
                const { data } = await axios.get(`${URL}/user/info`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                dispatch({ type: 'FETCH_INFO_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_INFO_FAIL', payload: getError(err) });
            }
        };
        fetchShow();
        getInfo();
    }, [showtimeId, userInfo.token]);

    const handleSelectSeat = (seatNumber) => {
        // Prevent selection if the seat is already taken
        if (show.availableSeat[seatNumber - 1] == null) {
            return;
        }

        const isSelected = selectedSeats.includes(seatNumber);
        const seatsLimit = info?.member.membershipTier === 'Premium' ? 8 : 1;

        if (isSelected) {
            setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
        } else {
            if (selectedSeats.length < seatsLimit) {
                setSelectedSeats([...selectedSeats, seatNumber].sort((a, b) => a - b));
            } else {
                // Optional: show a message that the limit is reached
                alert(`You can only select up to ${seatsLimit} seat(s).`);
            }
        }
    };

    const createBookingHandler = async () => {
        dispatch({ type: 'CREATE_BOOKING_REQUEST' });
        try {
            const { data } = await axios.post(`${URL}/bookings`, {
                userId: userInfo.id,
                showTimeId: showtimeId,
                seats: selectedSeats
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            dispatch({ type: 'CREATE_BOOKING_SUCCESS' });
            navigate(`/payment/${data.id}`);
        } catch (err) {
            dispatch({ type: 'CREATE_BOOKING_FAIL', payload: getError(err) });
        }
    };

    // --- Price Calculation ---
    const basePrice = show ? selectedSeats.length * show.price : 0;
    const discountAmount = show?.discount ? basePrice * (show.discount.percentDiscount / 100) : 0;
    const priceAfterDiscount = basePrice - discountAmount;
    const serviceFee = info?.member.membershipTier === 'Regular' ? 1.5 * selectedSeats.length : 0;
    const tax = (priceAfterDiscount + serviceFee) * 0.1; // Assuming 10% tax
    const totalPrice = priceAfterDiscount + serviceFee + tax;

    return (
        <Container fluid className="booking-page">
            <Helmet>
                <title>Book Tickets</title>
            </Helmet>
            <div className="page-header">
                <h1 className="page-title">Book Your Tickets</h1>
            </div>

            {loading || loadingInfo ? <LoadingBox /> : error ? <MessageBox variant="danger">{error}</MessageBox> : show && (
                <Row>
                    {/* Left Column: Show Info */}
                    <Col lg={4} className="mb-4">
                        <div className="show-info-card">
                            <img src={show.movie.posterUrl} alt={show.movie.title} className="info-card-poster" />
                            <div className="info-card-body">
                                <h2>{show.movie.title}</h2>
                                <p><i className="fas fa-calendar-alt"></i> {show.date}</p>
                                <p><i className="fas fa-clock"></i> {show.startTime} - {show.endTime}</p>
                                <p><i className="fas fa-dollar-sign"></i> ${show.price.toFixed(2)} / ticket</p>
                                {show.discount && <p className="discount-info"><i className="fas fa-tags"></i> {show.discount.percentDiscount}% off applied!</p>}
                            </div>
                        </div>
                    </Col>

                    {/* Right Column: Booking Details */}
                    <Col lg={8}>
                        <div className="booking-details-card">
                            <h3 className="booking-section-title">Select Your Seats</h3>
                            <div className="cinema-screen">SCREEN</div>
                            <div className="cinema-hall">
                                <Row className="g-2">
                                    {show.availableSeat.map((seat, index) => (
                                        <Col key={index} className="d-flex justify-content-center" xs={3} sm={2}>
                                            <SeatItem
                                                seatNumber={index + 1}
                                                isSelect={selectedSeats.includes(index + 1)}
                                                selectSeat={handleSelectSeat}
                                                takenS={seat == null}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </div>

                            <hr className="section-divider" />

                            <h3 className="booking-section-title">Booking Summary</h3>
                            <div className="selected-seats-container">
                                <strong>Selected Seats:</strong>
                                <div className="d-flex flex-wrap mt-2">
                                    {selectedSeats.length > 0 ? selectedSeats.map(seatNum => (
                                        <SeatBox key={seatNum} seatNumber={seatNum} />
                                    )) : <span className="no-seats-text">No seats selected</span>}
                                </div>
                            </div>

                            <div className="price-summary">
                                <div className="price-item"><span>Base Price ({selectedSeats.length} tickets)</span> <span>${basePrice.toFixed(2)}</span></div>
                                {discountAmount > 0 && <div className="price-item discount"><span>Discount</span> <span>-${discountAmount.toFixed(2)}</span></div>}
                                {serviceFee > 0 && <div className="price-item"><span>Online Service Fee</span> <span>${serviceFee.toFixed(2)}</span></div>}
                                <div className="price-item"><span>Tax (10%)</span> <span>${tax.toFixed(2)}</span></div>
                                <hr className="price-divider" />
                                <div className="price-item total"><span>Total Price</span> <span>${totalPrice.toFixed(2)}</span></div>
                            </div>

                            {errorBooking && <MessageBox variant="danger">{errorBooking}</MessageBox>}

                            <div className="d-grid">
                                <Button className="auth-button" disabled={selectedSeats.length === 0 || loadingBooking} onClick={createBookingHandler}>
                                    {loadingBooking ? <LoadingBox isButton={true} /> : 'Proceed to Payment'}
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            )}
        </Container>
    );
}
