import React, { useReducer, useEffect, useState, useContext } from "react";
import { Row, Col, Carousel, Button } from 'react-bootstrap';
import axios from "axios";
import { Helmet } from "react-helmet";
import Slider from "react-slick";
import { Link } from "react-router-dom";

import Movie from "../components/Movie";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Stores";
import { URL } from "../Constants";

// Importing css for react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image from "../assets/AdobeStock_626224006.jpeg";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, movies: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

const initialState = {
    movies: [],
    loading: true,
    error: null,
}

export default function HomeScreen() {
    const { state: ctxState } = useContext(Store);
    const { userInfo } = ctxState;

    const [{ loading, error, movies }, dispatch] = useReducer(reducer, initialState);
    const [upcomingMovies, setUpcomingMovies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                // Gets currently showing movies
                const response = await axios.get(`${URL}/movies/`);
                dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        };

        const fetchUpcomingMovies = async () => {
            try {
                // Gets upcoming movies
                const response = await axios.get(`${URL}/movies/latest-movies`);
                setUpcomingMovies(response.data);
            } catch (err) {
                console.log('Error fetching upcoming movies', err);
            }
        }
        fetchData();
        fetchUpcomingMovies();
    }, []);

    const sliderSettings = {
        dots: false,
        infinite: upcomingMovies.length > 4,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 600, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } }
        ]
    };

    // Use some of the upcoming movies for the hero carousel
    const heroMovies = upcomingMovies.slice(0, 3);

    return (
        <div>
            <Helmet>
                <title>THC Theater</title>
            </Helmet>
            {/*<div className="poster-image">*/}
            {/*    <img src={image} alt="poster" className="img-fluid"/>*/}
            {/*    <div className="cover-image-text">*/}
            {/*        TCH Movie Theater*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Hero Section Carousel */}
            {heroMovies.length > 0 && (
                <Carousel controls={false} indicators={false} interval={5000} pause={false} className="hero-section">
                    {heroMovies.map(movie => (
                        <Carousel.Item key={movie.id}>
                            <div
                                className="hero-slide"
                                style={{ backgroundImage: `url(${movie.posterUrl})` }}
                            >
                                <div className="hero-content">
                                    <h1 className="hero-title">{movie.title}</h1>
                                    <p className="hero-description">{movie.description}</p>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            )}

            {/* Now Showing Section */}
            <h1 className="section-title">Now Showing</h1>
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <MessageBox variant='danger'>{error}</MessageBox>
            ) : (
                <Row>
                    {movies.map((movie) => (
                        <Col key={movie.id} sm={6} md={4} lg={3} className='mb-4 movie-grid-item'>
                            <Movie
                                movie={movie}
                                buttonName={userInfo && userInfo.role === "Employee" ? "Edit" : "Get Tickets"}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            {/* Upcoming Movies Section */}
            {upcomingMovies.length > 0 && (
                <div className="upcoming-movies-section">
                    <h2 className="section-title">Coming Soon</h2>
                    <Slider {...sliderSettings}>
                        {upcomingMovies.map((movie) => (
                            <div key={movie._id} className="movie-grid-item">
                                <Movie
                                    movie={movie}
                                    buttonName={userInfo && userInfo.role === "Employee" ? "Edit" : "Get Tickets"}
                                    disable={true}
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
            )}
        </div>
    )
}

