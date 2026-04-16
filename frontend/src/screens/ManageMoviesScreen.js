import React, { useReducer, useEffect } from "react";
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from "react-router-dom"; // Import Link for proper navigation
import axios from "axios";
import { Helmet } from "react-helmet";

import Movie from "../components/Movie";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { URL } from "../Constants";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, movies: [...action.payload], loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export default function ManageMoviesScreen() {

    const [{ loading, error, movies }, dispatch] = useReducer(reducer, {
        movies: [],
        loading: true,
        error: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const response = await axios.get(`${URL}/movies/`);
                dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        };
        fetchData();
    }, [dispatch]);

    return (
        <div className="manage-movies-page">
            <Helmet>
                <title>Manage Movies</title>
            </Helmet>

            {/* A clean header using flexbox for alignment */}
            <div className="page-header">
                <h1 className="page-title">Manage Movies</h1>
                <Link to="/addmovie">
                    <Button className="btn-add-movie">
                        <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                        Add Movie
                    </Button>
                </Link>
            </div>

            <div className='movies-grid-container'>
                {loading ? (
                    <LoadingBox />
                ) : error ? (
                    <MessageBox variant='danger'>{error}</MessageBox>
                ) : (
                    <Row>
                        {movies.map((movie) => (
                            <Col key={movie._id} xl={3} lg={4} md={6} className='mb-4'>
                                <Movie movie={movie} buttonName="Edit"></Movie>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </div>
    )
}
