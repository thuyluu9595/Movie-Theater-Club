import React, {useContext, useEffect, useReducer, useState} from "react";
import {Store} from "../Stores";
import {Helmet} from "react-helmet";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import {URL} from "../Constants";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {useNavigate, useParams} from "react-router-dom";

const reducer = (state, action) => {
    switch (action.type) {
        case "PAYMENT_REQUEST":
            return {...state, loadingPayment: true};
        case "PAYMENT_SUCCESS":
            return {...state, loadingPayment: true, payment: action.payload};
        case "PAYMENT_FAIL":
            return {...state, loadingPayment: false, error: action.payload};
        case "FETCH_REQUEST":
            return {...state, loading: true};
        case "FETCH_SUCCESS":
            return {...state, loading: false, booking: action.payload};
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload}
        case "PAID_BOOKING_REQUEST":
            return {...state, loadingPayment: true}
        case "PAID_BOOKING_SUCCESS":
            return {...state, loadingPayment: false};
        case "PAID_BOOKING_FAIL":
            return {...state, loadingPayment: false, errorPayment: action.payload};
        default:
            return state;
    }
};

const initialState = {
    booking: {},
    payment: {},
    error: null,
    loading: true,
    loadingPayment: false,
    errorPayment: null
};

export default function StripeScreen() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();
    const params = useParams();
    const {id} = params;


    const fetchBooking = async () => {
        dispatch({type: 'FETCH_REQUEST'});
        try {
            const response = await axios.get(`${URL}/bookings/${id}`, {
                headers: {Authorization: `Bearer ${userInfo.token}`},
            });
            dispatch({type: 'FETCH_SUCCESS', payload: response.data});
        } catch (error) {
            dispatch({type: 'FETCH_FAIL', payload: error.message || 'Error fetching show'});
        }
    }

    useEffect(() => {
        fetchBooking();
    }, []);
    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch({type: "PAYMENT_REQUEST"});
        try {

            const {data} = await axios.post(
                `${URL}/payment/charge`,
                {
                    cardNumber,
                    expMonth,
                    expYear,
                    cvc,
                    "amount": booking.totalPrice
                },
                {
                    headers: {Authorization: `Bearer ${userInfo.token}`},
                }
            );
            dispatch({type: "PAYMENT_SUCCESS", payload: data});
            if (data.success) {
                await paidBooking();
            }
        } catch (error) {
            dispatch({type: "PAYMENT_FAIL", payload: error.message});
        }
    };

    async function paidBooking() {
        dispatch({type: "PAID_BOOKING_REQUEST"});
        try {
            await axios.put(`${URL}/bookings/paid/${id}`, {},
                {
                    headers: {Authorization: `Bearer ${userInfo.token}`},
                });
            dispatch({type: "PAID_BOOKING_SUCCESS"});
            navigate("/history")
        } catch (error) {
            dispatch({type: "PAID_BOOKING_FAIL", payload: error.message});
            throw error
        }
    }

    const {loading, booking, error, loadingPayment, errorPayment} = state;

    const {state: ctxState, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = ctxState;
    const [cardNumber, setCradNumber] = useState(userInfo.name);
    const [expMonth, setExpMonth] = useState(userInfo.email);
    const [expYear, setEpxYear] = useState("");
    const [cvc, setCvc] = useState("");


    return (
        <div className="container small-container">
            <Helmet>
                <title>Payment</title>
            </Helmet>
            <h1 className="my-3">Payment</h1>
            {loading ? (<LoadingBox/>) :
                error ? (<MessageBox variant="danger">{error}</MessageBox>) :
                    (<h4>Total: ${booking.totalPrice.toFixed(2)}</h4>)}

            <Form onSubmit={e => submitHandler(e)}>
                <Form.Group className="mb-3" controlId="cardNumber">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control
                        value={cardNumber}
                        onChange={(e) => setCradNumber(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="expMonth">
                    <Form.Label>Expire Month</Form.Label>
                    <Form.Control
                        type="expMonth"
                        value={expMonth}
                        onChange={(e) => setExpMonth(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="expYear">
                    <Form.Label>Expire Year</Form.Label>
                    <Form.Control
                        value={expYear}
                        onChange={(e) => setEpxYear(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="cvc">
                    <Form.Label>Security</Form.Label>
                    <Form.Control
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        type="password"
                        required
                    />
                </Form.Group>
                {loadingPayment && (<LoadingBox/>)}
                {errorPayment && (<MessageBox variant='danger'>{errorPayment}</MessageBox>)}
                <div className="mb-3">
                    <Button type="submit">Update</Button>
                </div>
            </Form>

        </div>
    );
}
