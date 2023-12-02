import React, {useContext, useReducer, useState} from "react";
import {Store} from "../Stores";
import {Helmet} from "react-helmet";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import {URL} from "../Constants";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {useNavigate} from "react-router-dom";

const reducer = (state, action) => {
    switch (action.type) {
        case "PAYMENT_REQUEST":
            return {...state, loading: true};
        case "PAYMENT_SUCCESS":
            return {loading: false, success: true};
        case "PAYMENT_FAIL":
            return {loading: false, error: action.payload};
        default:
            return state;
    }
};

const initialState = {
    success: false,
    error: null,
    loading: false,
};

export default function PremiumScreen() {
    //TODO: connect backend
    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch({type: "PAYMENT_REQUEST"});
        try {
            const {data} = await axios.put(
                `${URL}/user/${userInfo.id}/upgradeAccount`,
                {
                    cardNumber,
                    expMonth,
                    expYear,
                    cvc,
                },
                {
                    headers: {Authorization: `Bearer ${userInfo.token}`},
                }
            );
            dispatch({type: "PAYMENT_SUCCESS"});
            navigate('/')
            window.location.reload();
        } catch (error) {
            dispatch({type: "PAYMENT_FAIL", payload: error.message});
        }
    };

    const {loading, success, error} = state;

    const {state: ctxState, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = ctxState;
    const [cardNumber, setCradNumber] = useState(userInfo.name);
    const [expMonth, setExpMonth] = useState(userInfo.email);
    const [expYear, setEpxYear] = useState("");
    const [cvc, setCvc] = useState("");

    return (
        <div className="container small-container">
            <Helmet>
                <title>Premium</title>
            </Helmet>
            <h1 className="my-3">Update Premium</h1>
            <h2>$15/year</h2>
            {loading && (<LoadingBox/>)}
            {error && (<MessageBox variant="danger">{error}</MessageBox>)}
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
                        required
                        type={"password"}
                    />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Update</Button>
                </div>
            </Form>

        </div>
    );
}
