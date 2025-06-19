import React, {useReducer, useEffect, useState, useContext} from "react";

import Movie from "../components/Movie";
import axios from "axios";
// import logger from "use-reducer-logger";
import {Helmet} from "react-helmet";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Slider from "react-slick";

import {URL} from "../Constants"
import image from "../assets/AdobeStock_626224006.jpeg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Store} from "../Stores";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case 'FETCH_SUCCESS':
            return {...state, movies: action.payload, loading: false};
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
}

const initialState = {
    movies: [],
    loading: true,
    error: null,
}
export default function HomeScreen(props) {
    const {state: ctxState, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = ctxState;

    const [{loading, error, movies}, dispatch] = useReducer(reducer, initialState);

    const [upcomingMovies, setUpcomingMovies] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: 'FETCH_REQUEST'});
            try {
                const response = await axios.get(`${URL}/movies/`);
                dispatch({type: 'FETCH_SUCCESS', payload: response.data});
            } catch (err) {
                dispatch({type: 'FETCH_FAIL', payload: err.message});
            }
        };

        const fetchUpcomingMovies = async () => {
            try {
                const response = await axios.get(`${URL}/movies/latest-movies`);
                setUpcomingMovies(response.data);
            } catch (err) {
                console.log('Error fetching upcoming movies', err);
            }
        }
        fetchData();
        fetchUpcomingMovies()
    }, [dispatch]);

    function chunkArray(myArray, chunk_size) {
        var index = 0;
        var arrayLength = myArray.length;
        var tempArray = [];

        for (index = 0; index < arrayLength; index += chunk_size) {
            let myChunk = myArray.slice(index, index + chunk_size);
            tempArray.push(myChunk);
        }

        return tempArray;
    }

    let movieChunks = chunkArray(upcomingMovies, 6);
    return (
        <div>
            <Helmet>
                <title>THC Theather</title>
            </Helmet>
            <div className="poster-image">
                <img src={image} alt="poster" className="img-fluid"/>
                <div className="cover-image-text">
                    TCH Movie Theater
                </div>
            </div>
            <h1 className="text-2xl font-semibold mb-4">List Of Movies</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {
                    loading ? (
                        <LoadingBox/>
                    ) : error ? (
                        <MessageBox variant='danger'>{error}</MessageBox>
                    ) : (
                        movies.map((movie) => (
                            <Movie key={movie._id} movie={movie}
                                   buttonName={userInfo && userInfo.role === "Employee" ? "Edit" : "Get Ticket"}></Movie>
                        )))
                }
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Upcoming Movies</h2>
                <Slider slidesToShow={4} slidesToScroll={1} infinite={true}>
                    {upcomingMovies.map((movie) => (
                        <div key={movie.id}>
                            <Movie movie={movie}
                                   buttonName={userInfo && userInfo.role === "Employee" ? "Edit" : "Get Ticket"}
                                   disable={true}></Movie>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    )
}