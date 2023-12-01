import React, {useContext, useEffect, useReducer} from 'react';
import {Store} from "../Stores";
import axios from "axios";
import {URL} from "../Constants";
import {Col, Container, Row} from "react-bootstrap";
import Helmet from "react-helmet";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Movie from "../components/Movie";

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true };
        case "FETCH_SUCCESS":
            return { ...state, movies: [...action.payload], loading: false };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const initialState = {
    movies: [],
    loading: false,
    error: null,
};
const WatchedHistoryScreen = () => {
    const {state: ctxState} = useContext(Store);
    const {userInfo} = ctxState;
    const [state, dispatch] = useReducer(reducer, initialState);

    const getMovies = async () => {
        dispatch({ type: "FETCH_REQUEST" });
        try {
            const response = await axios.get(`${URL}/bookings/watched-movie-30/${userInfo.id}`, {
                headers: { 'Authorization': `Bearer ${userInfo.token}` },
            });
            dispatch({ type: "FETCH_SUCCESS", payload: response.data });
        } catch (error) {
            dispatch({ type: "FETCH_FAIL", payload: error.message });
        }
    };

    useEffect(() => {
        if (userInfo) getMovies();
    }, [userInfo]);

    return (
        <Container>
            <Helmet>
                <title>Watched History</title>
            </Helmet>
            <h1>Watched Movies Last 30 Days</h1>
            <div className='movies'>
                <Row>
                    {state.loading ? (
                        <LoadingBox />
                    ) : state.error ? (
                        <MessageBox variant="danger">{state.error}</MessageBox>
                    ) : (
                        state.movies.length > 0 ? (
                            state.movies.map((movie) => (
                                <Col key={movie._id} sm={6} md={4} lg={3} className='mb-3'>
                                    <Movie movie={movie} buttonName="Get Tickets"></Movie>
                                </Col>
                            ))
                        ) : (
                            <MessageBox variant="info">No movies watched in the last 30 days.</MessageBox>
                        )
                    )}
                </Row>
            </div>

        </Container>
    );
};

export default WatchedHistoryScreen;