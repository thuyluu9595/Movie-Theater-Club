import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet';
import {Form, Button, Container, Col, Row, FormText, Badge} from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import { URL } from "../Constants";
import { Store } from "../Stores";
import { getError } from '../utils';
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import ImageUploadModal from "../components/ImageUploadModal";

// --- UPDATED REDUCER ---
// Added cases for update state and poster URL changes
const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            const movieData = action.payload;
            movieData.genres = Array.isArray(movieData.genres) ? movieData.genres : [];
            return { ...state, movie: movieData, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        // Cases for individual field updates
        case 'UPDATE_FIELD':
            return { ...state, movie: { ...state.movie, [action.field]: action.payload } };

        // Cases for handling the update submission process
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true, errorUpdate: '', successUpdate: '' };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false, successUpdate: 'Movie updated successfully!' };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false, errorUpdate: action.payload };
        case 'CLEAR_MESSAGES':
            return { ...state, errorUpdate: '', successUpdate: '' };

        default:
            return state;
    }
};

export default function EditMovieScreen() {
    const { id: movieId } = useParams(); // Renamed to avoid conflict
    const navigate = useNavigate();
    const { state: storeState } = useContext(Store); // Renamed to avoid conflict
    const { userInfo } = storeState;

    const [{ loading, error, movie, loadingUpdate, errorUpdate, successUpdate }, dispatch] = useReducer(reducer, {
        movie: { genres: [] },
        loading: true,
        error: '',
        loadingUpdate: false,
        errorUpdate: '',
        successUpdate: '',
    });

    const [showModal, setShowModal] = useState(false);
    const [currentGenre, setCurrentGenre] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get(`${URL}/movies/${movieId}`, {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
        // Fixed dependency array to prevent infinite loops
    }, [movieId, userInfo.token]);

    const submitUpdateHandler = async (e) => {
        e.preventDefault();
        dispatch({ type: 'UPDATE_REQUEST' });
        try {
            await axios.put(`${URL}/movies/${movieId}`, {
                title: movie.title,
                description: movie.description,
                duration_in_minutes: movie.duration,
                release_date: moment(movie.releaseDate, "MM/DD/YYYY").format("YYYY-MM-DD"),
                genres: movie.genres
            }, {
                headers: { 'Authorization': `Bearer ${userInfo.token}` }
            });
            dispatch({ type: 'UPDATE_SUCCESS' });
            setTimeout(() => dispatch({ type: 'CLEAR_MESSAGES' }), 3000);
        } catch (err) {
            dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
        }
    };

    const deleteHandler = async () => {
        if (window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
            try {
                await axios.delete(`${URL}/movies/${movieId}`, {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                navigate('/manage-movies');
            } catch (err) {
                dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
            }
        }
    };

    // Generic handler for form field changes
    const handleFieldChange = (field, value) => {
        dispatch({ type: 'UPDATE_FIELD', field, payload: value });
    };

    const handleAddGenre = (e) => {
        if (e.key === 'Enter' && currentGenre.trim() !== '') {
            e.preventDefault();
            const genreList = [...movie.genres, currentGenre.trim()];
            handleFieldChange('genres', genreList);
            setCurrentGenre('');
        }
    }

    const handleRemoveGenre = (genreToRemove) => {
        const remainingGenres = movie.genres.filter(genre => genre !== genreToRemove);
        handleFieldChange('genres', remainingGenres);
    }

    return (
        <Container className="edit-movie-page">
            <Helmet>
                <title>Edit Movie</title>
            </Helmet>
            <div className="page-header">
                <h1 className='page-title'>Edit Movie</h1>
            </div>

            {loading ? <LoadingBox /> : error ? <MessageBox variant='danger'>{error}</MessageBox> : (
                <div className="edit-movie-card">
                    <Row>
                        <Col md={4} className="poster-column">
                            <img src={movie.posterUrl} className='edit-poster-img' alt={movie.title} />
                            <Button className="btn-change-image" onClick={() => setShowModal(true)}>
                                Change Image
                            </Button>
                        </Col>
                        <Col md={8} className="form-column">
                            <Form onSubmit={submitUpdateHandler}>
                                {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                                {successUpdate && <MessageBox variant="success">{successUpdate}</MessageBox>}

                                <Form.Group className='mb-3' controlId='title'>
                                    <Form.Label>Movie Title</Form.Label>
                                    <Form.Control value={movie.title || ''} onChange={(e) => handleFieldChange('title', e.target.value)} required />
                                </Form.Group>

                                <Form.Group className='mb-3' controlId='genres'>
                                    <Form.Label>Genres</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentGenre}
                                        onChange={(e) => setCurrentGenre(e.target.value)}
                                        onKeyDown={handleAddGenre}
                                        placeholder="Type a genre and press Enter"
                                    />
                                    <div className="genres-container mt-2">
                                        {movie.genres?.map((genre, index) => (
                                            <Badge key={index} pill className="genre-badge">
                                                {genre}
                                                <span className="remove-genre-btn" onClick={() => handleRemoveGenre(genre)}>×</span>
                                            </Badge>
                                        ))}
                                    </div>
                                </Form.Group>

                                <Form.Group className='mb-3' controlId='description'>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows={5} value={movie.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} required />
                                </Form.Group>

                                <Form.Group className='mb-3' controlId='duration'>
                                    <Form.Label>Duration (in minutes)</Form.Label>
                                    <Form.Control type="number" value={movie.duration || ''} step={1} min={1} onChange={(e) => handleFieldChange('duration', e.target.value)} required />
                                </Form.Group>

                                <Form.Group className='mb-3' controlId='release_date'>
                                    <Form.Label>Release Date</Form.Label>
                                    <Form.Control type="date" value={moment(movie.releaseDate, "MM/DD/YYYY").format("YYYY-MM-DD")} onChange={(e) => handleFieldChange('releaseDate', e.target.value)} required />
                                </Form.Group>

                                <div className="action-buttons">
                                    <Button type='submit' className="auth-button" disabled={loadingUpdate}>
                                        {loadingUpdate ? <LoadingBox isButton={true} /> : 'Update Movie'}
                                    </Button>
                                    <Button onClick={deleteHandler} className="btn-delete">
                                        Delete
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </div>
            )}

            <ImageUploadModal
                show={showModal}
                onHide={() => setShowModal(false)}
                id={movieId}
                userInfo={userInfo}
                onImageChange={(newUrl) => handleFieldChange('posterUrl', newUrl)}
            />
        </Container>
    );
}