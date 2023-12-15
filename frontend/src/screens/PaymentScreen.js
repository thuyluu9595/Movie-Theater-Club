import React, {useContext, useEffect, useReducer, useState} from 'react'
import CheckoutSteps from '../components/CheckoutSteps'
import {Helmet} from 'react-helmet'
import {Button, Form} from 'react-bootstrap'
import {Store} from '../Stores';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {URL} from "../Constants";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";


const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true};
        case "FETCH_SUCCESS":
            return {...state, loading: false, booking: action.payload};
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload}
        case "FETCH_INFO_REQUEST":
            return {...state, loadingInfo: true};
        case "FETCH_INFO_SUCCESS":
            return {...state, info: action.payload, loadingInfo: false};
        case "FETCH_INFO_FAIL":
            return {...state, loadingInfo: false, error: action.payload};
        case "PAID_BOOKING_REQUEST":
            return {...state, loadingPayment: true}
        case "PAID_BOOKING_SUCCESS":
            return {...state, loadingPayment: false};
        case "PAID_BOOKING_FAIL":
            return {...state, loadingPayment: false, errorPayment: action.payload};
        case "REDEEM_REQUEST":
            return {...state, loadingPayment: true};
        case "REDEEM_SUCCESS":
            return {...state, loadingPayment: true};
        case "REDEEM_FAIL":
            return {...state, loadingPayment: false, errorPayment: action.payload};
        default:
            return state;
    }
};

const initialState = {
    booking: {},
    info: {},
    error: null,
    loading: true,
    loadingInfo: true,
    loadingPayment: false,
    errorPayment: null
};

export default function PaymentScreen() {
    const {state: ctxState, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = ctxState;
    const [{booking, error, loading, info, loadingInfo}, dispatch] = useReducer(reducer, initialState);
    const [paymentMethodName, setPaymentMethod] = useState('Stripe');
    const navigate = useNavigate();
    const params = useParams();
    const {id} = params;


    useEffect(() => {
        fetchBooking();
        fetchInfo();
    }, []);
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

    const fetchInfo = async () => {
        dispatch({type: "FETCH_INFO_REQUEST"});
        try {
            const response = await axios.get(`${URL}/user/info`, {
                headers: {Authorization: `Bearer ${userInfo.token}`},
            });
            dispatch({type: "FETCH_INFO_SUCCESS", payload: response.data});
        } catch (error) {
            dispatch({type: "FETCH_INFO_FAIL", payload: error.message});
        }
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        if (paymentMethodName === "Stripe") navigate(`/payment/stripe/${id}`);
        else {
            dispatch({type: "REDEEM_REQUEST"});
            try {
                const response = await axios.put(`${URL}/user/redeem`,
                    {"amount": (booking.totalPrice * 10).toFixed(0)},
                    {
                        headers: {Authorization: `Bearer ${userInfo.token}`},
                    });
                dispatch({type: "REDEEM_REQUEST_SUCCESS", payload: response.data});
                await paidBooking();
            } catch (error) {
                dispatch({type: "REDEEM_REQUEST_FAIL", payload: error.message});
            }
        }
    }

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

    return (
        <div>
            <div className='container small-container'>
                <Helmet>
                    <title>Payment Method</title>
                </Helmet>
                <h1 className='my-3'>Payment Method</h1>
                {loading ? (<LoadingBox/>) :
                    error ? (<MessageBox variant="danger">{error}</MessageBox>) :
                        (<h4>Total: ${booking.totalPrice.toFixed(2)} or
                            ${(booking.totalPrice * 10).toFixed(0)} points</h4>)}
                <Form onSubmit={submitHandler}>
                    <div className='mb-3'>
                        <Form.Check
                            type='radio'
                            id='Paypal'
                            label={`Pay with point ${loadingInfo ? `` : `(${info.member.rewardPoint} points)`}`}
                            value='Point'
                            disabled={loadingInfo ? true : info.member.rewardPoint < booking.totalPrice * 10}
                            checked={paymentMethodName === 'Point'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </div>
                    <div className='mb-3'>
                        <Form.Check
                            type='radio'
                            id='Stripe'
                            label='Pay with credit card'
                            value='Stripe'
                            checked={paymentMethodName === 'Stripe'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </div>
                    <div className='mb-3'>
                        <Button type='submit'>Continue</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
