import React, { useReducer, useEffect } from "react";
import {Row, Col, Button} from 'react-bootstrap';
import Movie from "../components/Movie";
import axios from "axios";
import { Helmet } from "react-helmet";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

import { URL } from "../Constants"


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case 'FETCH_SUCCESS':
            return {...state, movies: [...action.payload], loading: false};
        case 'FETCH_FAIL':
            return {...state,loading:false, error: action.payload};
        default:
            return state;
    }
}

export default function ManageMoviesScreen(){

    const  [{ loading, error, movies}, dispatch] = useReducer(reducer, {
        movies: [],
        loading : true,
        error: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: 'FETCH_REQUEST'});
            try {
                const response = await axios.get(`${URL}/movies/`);
                dispatch({type: 'FETCH_SUCCESS', payload: response.data});
            } catch(err) {
                dispatch({type: 'FETCH_FAIL', payload: err.message});
            }
        };
        fetchData()
    }, [dispatch]);

    return (
        <div className="manage-movie">
            <Helmet>
                <title>Manage Movies</title>
            </Helmet>
            <div style={{display: "inline", width: "100%"}} className="manage-movie-header">
                <h1 style={{display: "inline-block"}}>Manage Movies</h1>
                <Button style={{float: "right"}} href="/addmovie">Add Movie</Button>
            </div>
            <div className='movies'>
                <Row>
                    {
                        loading ? (
                            <LoadingBox />
                        ) : error ? (
                            <MessageBox variant='danger'>{error}</MessageBox>
                        ) : (
                            movies.map((movie) => (
                                <Col key={movie._id} sm={6} md={4} lg={3} className='mb-3'>
                                    <Movie movie={movie} buttonName="Edit"></Movie>
                                </Col>
                            )))}
                </Row>
            </div>
        </div>
    )
}