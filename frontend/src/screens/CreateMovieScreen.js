import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../Constants";
import { Store } from "../Stores";
import { getError } from '../utils';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';

export default function CreateMovieScreen() {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;

    // Use useState for simpler form state management
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [posterUrl, setPosterUrl] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submitCreateHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data: createdMovie } = await axios.post(
                `${URL}/movies`,
                {
                    title,
                    description,
                    duration_in_minutes: duration,
                    release_date: releaseDate, // Assuming backend can handle YYYY-MM-DD
                    poster_url: posterUrl,
                },
                {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                }
            );
            setLoading(false);
            // Use a toast or message on the next screen for success feedback
            navigate(`/manage-movies/${createdMovie.id}`);
        } catch (err) {
            setLoading(false);
            setError(getError(err));
        }
    };

    return (
        <Container className='create-movie-page'>
            <Helmet>
                <title>Create Movie</title>
            </Helmet>
            <div className="page-header">
                <h1 className='page-title'>Create New Movie</h1>
            </div>

            {/* Re-using the auth-container style for a consistent form UI */}
            <div className="auth-container">
                <Form onSubmit={submitCreateHandler}>
                    {error && <MessageBox variant="danger">{error}</MessageBox>}

                    <Form.Group className='mb-3' controlId='title'>
                        <Form.Label>Movie Title</Form.Label>
                        <Form.Control
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='posterUrl'>
                        <Form.Label>Poster URL</Form.Label>
                        <Form.Control
                            value={posterUrl}
                            onChange={(e) => setPosterUrl(e.target.value)}
                            placeholder="https://example.com/poster.jpg"
                            required
                        />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='description'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='duration'>
                        <Form.Label>Duration (in minutes)</Form.Label>
                        <Form.Control
                            type="number"
                            value={duration}
                            step={1}
                            min={1}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className='mb-4' controlId='release_date'>
                        <Form.Label>Release Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={releaseDate}
                            onChange={(e) => setReleaseDate(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <div className="d-grid">
                        <Button type='submit' className="auth-button" disabled={loading}>
                            {loading ? <LoadingBox isButton={true} /> : 'Create Movie'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
}
