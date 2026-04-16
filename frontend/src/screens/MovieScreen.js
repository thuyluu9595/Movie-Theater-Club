import React, { useContext, useEffect, useReducer, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button, Form } from 'react-bootstrap';
import { Helmet } from "react-helmet";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { URL } from "../Constants";
import { Store } from "../Stores";

// --- NEW: Custom hook for the typing animation ---
const useTypingEffect = (fullText, typingSpeed = 30) => {
    const [typedText, setTypedText] = useState('');
    const [isDoneTyping, setIsDoneTyping] = useState(false);

    useEffect(() => {
        // Reset everything when the fullText changes (e.g., on page load)
        setTypedText('');
        setIsDoneTyping(false);

        if (!fullText) {
            setIsDoneTyping(true);
            return;
        };

        let i = -1;
        const intervalId = setInterval(() => {
            setTypedText(prev => prev + fullText.charAt(i));
            i++;
            if (i >= fullText.length) {
                clearInterval(intervalId);
                setIsDoneTyping(true);
            }
        }, typingSpeed);

        // Cleanup function to clear the interval if the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, [fullText, typingSpeed]);

    return { typedText, isDoneTyping };
};


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, movie: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        case 'FETCH_REVIEWS_REQUEST':
            return { ...state, loadingReviews: true };
        case 'FETCH_REVIEWS_SUCCESS':
            return { ...state, reviews: action.payload, loadingReviews: false };
        case 'FETCH_REVIEWS_FAIL':
            return { ...state, loadingReviews: false, errorReviews: action.payload };

        case 'SET_USER_REVIEWED_STATUS':
            return { ...state, hasUserReviewed: action.payload };

        case 'CREATE_REVIEW_REQUEST':
            return { ...state, loadingCreateReview: true, errorCreateReview: '', successCreateReview: '' };
        case 'CREATE_REVIEW_SUCCESS':
            return { ...state, loadingCreateReview: false, successCreateReview: 'Review submitted successfully!' };
        case 'CREATE_REVIEW_FAIL':
            return { ...state, loadingCreateReview: false, errorCreateReview: action.payload };

        case 'DELETE_REVIEW_REQUEST':
            return { ...state, loadingDeleteReview: true, errorDeleteReview: '', successDeleteReview: '' };
        case 'DELETE_REVIEW_SUCCESS':
            const updatedReviews = state.reviews.filter(r => r.id !== action.payload);
            return { ...state, reviews: updatedReviews, loadingDeleteReview: false, hasUserReviewed: false, successDeleteReview: 'Review deleted successfully.' };
        case 'DELETE_REVIEW_FAIL':
            return { ...state, loadingDeleteReview: false, errorDeleteReview: action.payload };

        default:
            return state;
    }
};

const StarRating = ({ rating }) => {
    return (
        <div>
            {[...Array(5)].map((_, index) => (
                <span key={index} className="star">{index < rating ? '★' : '☆'}</span>
            ))}
        </div>
    );
};

export default function MovieScreen() {
    const params = useParams();
    const { id: movieId } = params;

    const { state: webState } = useContext(Store);
    const { userInfo } = webState;

    const [{ loading, error, movie, reviews, loadingReviews, loadingCreateReview, errorCreateReview, successCreateReview, hasUserReviewed, loadingDeleteReview, successDeleteReview, errorDeleteReview }, dispatch] = useReducer(reducer, {
        movie: {},
        reviews: [],
        loading: true,
        error: '',
        hasUserReviewed: false,
    });

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [title, setTitle] = useState('');

    // --- Use the typing effect hook ---
    const summaryText = (movie?.reviewSummary === '' || movie?.reviewSummary === null) ? 'There are no reviews to summarize yet.' : movie?.reviewSummary;
    const { typedText: typedSummary, isDoneTyping } = useTypingEffect(summaryText);


    const fetchReviews = useCallback(async () => {
        dispatch({ type: 'FETCH_REVIEWS_REQUEST' });
        try {
            const { data } = await axios.get(`${URL}/reviews/movie/${movieId}`);
            dispatch({ type: 'FETCH_REVIEWS_SUCCESS', payload: data });
            if (userInfo) {
                const userHasReviewed = data.some(review => review.userId === userInfo.id);
                dispatch({ type: 'SET_USER_REVIEWED_STATUS', payload: userHasReviewed });
            }
        } catch (err) {
            dispatch({ type: 'FETCH_REVIEWS_FAIL', payload: getError(err) });
        }
    }, [movieId, userInfo]);

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`${URL}/movies/${movieId}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
        fetchReviews();
    }, [movieId, fetchReviews]);

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        if (!comment || !rating || !title) {
            dispatch({ type: 'CREATE_REVIEW_FAIL', payload: 'Please enter a title, comment, and rating.' });
            return;
        }
        dispatch({ type: 'CREATE_REVIEW_REQUEST' });
        try {
            await axios.post(`${URL}/reviews/create`, {
                userId: userInfo.id,
                movieId: movieId,
                title,
                rating,
                comment,
            }, { headers: { Authorization: `Bearer ${userInfo.token}` } });
            dispatch({ type: 'CREATE_REVIEW_SUCCESS' });
            fetchReviews();
            setRating(0);
            setComment('');
            setTitle('');
        } catch (err) {
            dispatch({ type: 'CREATE_REVIEW_FAIL', payload: getError(err) });
        }
    };

    const deleteReviewHandler = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete your review?')) {
            dispatch({ type: 'DELETE_REVIEW_REQUEST' });
            try {
                await axios.delete(`${URL}/reviews/${reviewId}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                dispatch({ type: 'DELETE_REVIEW_SUCCESS', payload: reviewId });
            } catch (err) {
                dispatch({ type: 'DELETE_REVIEW_FAIL', payload: getError(err) });
            }
        }
    };

    return loading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
    ) : (
        <div className="movie-details-page">
            <Helmet>
                <title>{movie.title}</title>
            </Helmet>
            <div className="movie-hero-section" style={{ backgroundImage: `url(${movie.posterUrl})` }}>
                <Row className="align-items-center">
                    <Col md={4} className="text-center text-md-start">
                        <img
                            className='details-poster-img'
                            src={movie.posterUrl}
                            alt={movie.title}
                        />
                    </Col>
                    <Col md={8} className="details-content mt-4 mt-md-0">
                        <h1>{movie.title}</h1>
                        <div className="details-meta-item"><strong>Genres: </strong>
                        {movie.genres.map(genre => (
                            <span key={genre}>{genre}, </span>
                        ))}</div>
                        <div className="details-meta-item"><strong>Release Day:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</div>
                        <div className="details-meta-item"><strong>Duration:</strong> {movie.duration} minutes</div>
                        <p className="details-description">{movie.description}</p>
                        <Link to={`/showtimes/${movie.id}`}>
                            <Button className="btn-get-tickets">{userInfo && userInfo.role === "Employee" ? "Add Showtime" : "Get Tickets"}</Button>
                        </Link>
                    </Col>
                </Row>
            </div>

            {/* AI Review Summary Section */}
            <div>
                <h2 className="section-title">AI Review Summary</h2>
                <div className="ai-summary-box">
                    {/* --- UPDATED: Render the animated text and cursor --- */}
                    <p>
                        {typedSummary}
                        {!isDoneTyping && <span className="typing-cursor"></span>}
                    </p>
                </div>
            </div>

            <hr className="section-divider" />

            {/* Reviews Section */}
            <div className="reviews-section">
                <h2 className="section-title">Customer Reviews</h2>
                {successDeleteReview && <MessageBox variant="success">{successDeleteReview}</MessageBox>}
                {errorDeleteReview && <MessageBox variant="danger">{errorDeleteReview}</MessageBox>}
                {loadingReviews ? <LoadingBox /> :
                    reviews.length === 0 ? <MessageBox>There are no reviews yet. Be the first!</MessageBox> :
                        (
                            <div>
                                {reviews.map((review) => (
                                    <div key={review.id} className="review-card">
                                        <div className="review-header">
                                            <div className="review-author-info">
                                                <div className="review-author">{review.fullName}</div>
                                                <div className="review-rating"><StarRating rating={review.rating} /></div>
                                            </div>
                                            {userInfo && userInfo.id === review.userId && (
                                                <div className="review-actions">
                                                    <Button variant="danger" size="sm" onClick={() => deleteReviewHandler(review.id)} disabled={loadingDeleteReview}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <p className="review-title">{review.title}</p>
                                        <p className="review-comment">{review.comment}</p>
                                        <small className="review-date">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</small>
                                    </div>
                                ))}
                            </div>
                        )
                }
            </div>

            <hr className="section-divider" />

            {/* Write a Review Section */}
            <div className="review-form-section">
                {userInfo ? (
                    hasUserReviewed ? (
                        <div>
                            <h3 className="section-title">Write a Customer Review</h3>
                            <MessageBox>You have already submitted a review for this movie.</MessageBox>
                        </div>
                    ) : (
                        <div className="review-form-container">
                            <h3 className="section-title">Write a Customer Review</h3>
                            <Form onSubmit={submitReviewHandler}>
                                <Form.Group className="mb-3" controlId="rating">
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Select aria-label="Rating" value={rating} onChange={(e) => setRating(e.target.value)} required>
                                        <option value="">Select...</option>
                                        <option value="1">1- Poor</option>
                                        <option value="2">2- Fair</option>
                                        <option value="3">3- Good</option>
                                        <option value="4">4- Very Good</option>
                                        <option value="5">5- Excellent</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="title">
                                    <Form.Label>Review Title</Form.Label>
                                    <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. A Cinematic Masterpiece" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="comment">
                                    <Form.Label>Comment</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} required placeholder="Share your thoughts about the movie..." />
                                </Form.Group>
                                <div>
                                    <Button disabled={loadingCreateReview} type="submit">
                                        {loadingCreateReview ? 'Submitting...' : 'Submit Review'}
                                    </Button>
                                </div>
                                {successCreateReview && <MessageBox variant="success" className="mt-3">{successCreateReview}</MessageBox>}
                                {errorCreateReview && <MessageBox variant="danger" className="mt-3">{errorCreateReview}</MessageBox>}
                            </Form>
                        </div>
                    )
                ) : (
                    <MessageBox>
                        Please <Link to={`/signin?redirect=/movie/${movie.id}`}>sign in</Link> to write a review.
                    </MessageBox>
                )}
            </div>
        </div>
    );
}
