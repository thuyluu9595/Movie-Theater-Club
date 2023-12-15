import React, {useContext, useEffect, useReducer} from "react";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {Button, Table} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {Store} from "../Stores";
import {getError} from "../utils";
import {URL} from "../Constants";
import axios from "axios";
import {Helmet} from "react-helmet";

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true};
        case "FETCH_SUCCESS":
            return {...state, histories: action.payload, loading: false};
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload};
        case "CANCEL_REQUEST":
            return {...state, loadingCancel: true};
        case "CANCEL_SUCCESS":
            return {...state, loadingCancel: false, success: true};
        case "CANCEL_FAIL":
            return {...state, loadingCancel: false, errorCancel: action.payload};
        case "CANCEL_RESET":
            return {...state, loadingCancel: false, success: false};
        default:
            return state;
    }
};

const initialState = {
    histories: [],
    loading: true,
    error: null,
    loadingCancel: false,
    errorCancel: null,
    success: false,
};

export default function HistoryScreen() {
    //TODO: connect backend

    const {state: ctxState, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = ctxState;
    const navigate = useNavigate();


    const [{
        loading,
        error,
        histories,
        loadingCancel,
        errorCancel,
        success
    }, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        fetchShow()
        if (success) dispatch("CANCEL_RESET");
    }, [success]);

    const fetchShow = async () => {
        dispatch({type: 'FETCH_REQUEST'});
        try {
            const response = await axios.get(`${URL}/bookings/user/${userInfo.id}`, {
                headers: {Authorization: `Bearer ${userInfo.token}`},
            });
            dispatch({type: 'FETCH_SUCCESS', payload: response.data});
        } catch (error) {
            dispatch({type: 'FETCH_FAIL', payload: error.message || 'Error fetching show'});
        }
    };

    const cancelHandler = async (id) => {
        if (window.confirm("Do you want to cancel this?")) {
            dispatch({type: 'CANCEL_REQUEST'});
            try {
                const response = await axios.put(`${URL}/bookings/cancel/${id}`,
                    {},
                    {headers: {Authorization: `Bearer ${userInfo.token}`}}
                )
                dispatch({type: 'CANCEL_SUCCESS'});
                alert("Ticket canceled, refund will be issue in the next 2 or 3 business day.")
            } catch (error) {
                dispatch({type: 'CANCEL_FAIL', payload: error.message || 'Cannot cancel'});
            }
        }
    }


    return (
        <div>
            <Helmet>
                <title>Order History</title>
            </Helmet>
            <h1>Order History</h1>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox varian="danger">{error}</MessageBox>
            ) : (
                <>
                {loadingCancel && (<LoadingBox/>)}
                {errorCancel && <MessageBox varian="danger"></MessageBox>}
                    <Table className="table">
                        <thead>
                        <tr>
                            <th>MOVIE</th>
                            <th>SCREEN</th>
                            <th>LOCATION</th>
                            <th>SEATS</th>
                            <th>STATUS</th>
                            <th>TOTAL</th>
                            <th>ACTION</th>
                        </tr>
                        </thead>
                        <tbody>
                        {histories.map((history) => (
                            <tr key={history.id}>
                                <td>{history.showTime.movie.title}</td>
                                <td>{history.showTime.screen.name}</td>
                                <td>{history.showTime.screen.location.city}, {history.showTime.screen.location.state}</td>
                                <td>{history.seats.toString()}</td>
                                <td>{history.status}</td>
                                <td>{history.totalPrice.toFixed(2)}</td>
                                <td>{history.status === "PENDING" ?
                                    <Link to={`/payment/${history.id}`}>
                                        <Button variant="primary">Pay</Button>
                                    </Link> : history.status === "PAID" &&
                                    new Date(history.showTime.date) > new Date() &&
                                    <Button variant="danger"
                                            onClick={() => cancelHandler(history.id)}>Cancel</Button>}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </>
            )}
        </div>
    );
}

