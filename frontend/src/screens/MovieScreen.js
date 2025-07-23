import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Button, Form } from 'react-bootstrap';
import { Helmet } from "react-helmet";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { URL } from "../Constants";
import { Store } from "../Stores";


const reducer = (state, action) => {
    switch (action.type) {
        // Fetch movie detail
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, movie: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        // Cases for fetching reviews
        case 'FETCH_REVIEWS_REQUEST':
            return { ...state, loadingReviews: true };
        case 'FETCH_REVIEWS_SUCCESS':
            // Reset hasUserReviewed on new review fetch
            return { ...state, reviews: action.payload, loadingReviews: false, hasUserReviewed: false };
        case 'FETCH_REVIEWS_FAIL':
            return { ...state, loadingReviews: false, errorReviews: action.payload };

        // Case to check if user has already reviewed
        case 'SET_USER_REVIEWED_STATUS':
            return { ...state, hasUserReviewed: true };

        // Cases for creating reviews
        case 'CREATE_REVIEW_REQUEST':
            return { ...state, loadingCreateReview: true };
        case 'CREATE_REVIEW_SUCCESS':
            return { ...state, loadingCreateReview: false };
        case 'CREATE_REVIEW_FAIL':
            return { ...state, loadingCreateReview: false, errorCreateReview: action.payload };

        // Cases for deleting reviews
        case 'DELETE_REVIEW_REQUEST':
            return { ...state, loadingDeleteReview: true };
        case 'DELETE_REVIEW_SUCCESS':
            return { ...state, loadingDeleteReview: false };
        case 'DELETE_REVIEW_FAIL':
            return { ...state, loadingDeleteReview: false, errorDeleteReview: action.payload };

        default:
            return state;
    }
}

export default function MovieScreen() {
    const navigate = useNavigate();
    const params = useParams();

    const { state: webState } = useContext(Store);
    const { userInfo } = webState;

    const { id: movieId } = params;

    const [{ loading, error, movie, reviews, loadingReviews, errorReviews, loadingCreateReview, errorCreateReview, hasUserReviewed, loadingDeleteReview }, dispatch] = useReducer(reducer, {
        movie: {},
        reviews: [],
        loading: true,
        error: '',
        loadingReviews: true,
        errorReviews: '',
        hasUserReviewed: false,
    });

    // State for the review form inputs
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [title, setTitle] = useState('');

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

        const fetchReviews = async () => {
            dispatch({ type: 'FETCH_REVIEWS_REQUEST' });
            try {
                const { data } = await axios.get(`${URL}/reviews/movie/${movieId}`);
                dispatch({ type: 'FETCH_REVIEWS_SUCCESS', payload: data });

                if (userInfo) {
                    const userHasReviewed = data.some(review => review.userId === userInfo.id);
                    if (userHasReviewed) {
                        dispatch({ type: 'SET_USER_REVIEWED_STATUS' });
                    }
                }
            } catch (err) {
                dispatch({ type: 'FETCH_REVIEWS_FAIL', payload: getError(err) });
            }
        };
        fetchData();
        fetchReviews();
    }, [movieId, navigate, userInfo]);

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        if (!comment || !rating || !title) {
            alert('Please enter a title, comment, and rating.');
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
            });
            dispatch({ type: 'CREATE_REVIEW_SUCCESS' });
            alert('Review submitted successfully!');
            window.location.reload();
        } catch (err) {
            dispatch({ type: 'CREATE_REVIEW_FAIL', payload: getError(err) });
            alert(getError(err));
        }
    };

    const deleteReviewHandler = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete your review?')) {
            dispatch({ type: 'DELETE_REVIEW_REQUEST' });
            try {
                // The backend should authorize this request based on the logged-in user's token
                await axios.delete(`${URL}/reviews/${reviewId}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                dispatch({ type: 'DELETE_REVIEW_SUCCESS' });
                alert('Review deleted successfully.');
                window.location.reload();
            } catch (err) {
                dispatch({ type: 'DELETE_REVIEW_FAIL' });
                alert(getError(err));
            }
        }
    };

    return loading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
    ) : (
        <div>
            <Row>
                <Col md={4}>
                    <img
                        className='img-large'
                        src={movie.posterUrl}
                        alt={movie.title}
                        width="300" height="400"
                    />
                </Col>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Helmet>
                                <title>{movie.title}</title>
                            </Helmet>
                            <h1>{movie.title}</h1>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Release Day: {movie.releaseDate}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Duration: {movie.duration}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Description: {movie.description}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Link to={`/showtimes/${movie.id}`}>
                                <Button>{userInfo && userInfo.role === "Employee" ? "Add Showtime" : "Get Tickets"}</Button>
                            </Link>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <div className="my-3">
                <hr />
                <h2>AI Review Summary</h2>
                <div style={{ backgroundColor: "white", minHeight: 100, padding: "10px" }}>
                    <p style={{color:"black"}}>{(movie.reviewSummary === '' || movie.reviewSummary === null ? 'There is no review to summarize': movie.reviewSummary)}</p>
                </div>

            </div>

            {/* Reviews Section */}
            <div className="my-3">
                <hr />
                <h2>Reviews</h2>
                <ListGroup variant="flush">
                    {loadingReviews ? (
                        <LoadingBox />
                    ) : errorReviews ? (
                        <MessageBox variant="danger">{errorReviews}</MessageBox>
                    ) : reviews.length === 0 ? (
                        <MessageBox>There are no reviews yet.</MessageBox>
                    ) : (
                        reviews.map((review) => (
                            <ListGroup.Item key={review.id} className="position-relative">
                                {userInfo && userInfo.id === review.userId && (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="position-absolute top-0 end-0 m-2"
                                        onClick={() => deleteReviewHandler(review.id)}
                                        disabled={loadingDeleteReview}
                                    >
                                        Delete
                                    </Button>
                                )}
                                <strong>{review.fullName}</strong>
                                <br/>
                                <strong>{review.title}</strong>
                                <p>Rating: {review.rating} / 5</p>
                                <p>{review.comment}</p>
                                <small>Reviewed on {new Date(review.createdAt).toLocaleDateString()}</small>
                            </ListGroup.Item>
                        ))
                    )}
                </ListGroup>
            </div>

            {/* Write a Review Section */}
            <div className="my-3">
                {userInfo ? (
                    hasUserReviewed ? (
                        <div>
                            <h3>Write a Customer Review</h3>
                            <MessageBox>You have already submitted a review for this movie.</MessageBox>
                        </div>
                    ) : (
                        <form onSubmit={submitReviewHandler}>
                            <h3>Write a Customer Review</h3>
                            <Form.Group className="mb-3" controlId="rating">
                                <Form.Label>Rating</Form.Label>
                                <Form.Select
                                    aria-label="Rating"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    required
                                >
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
                                <Form.Control
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="comment">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <div>
                                <Button disabled={loadingCreateReview} type="submit">
                                    {loadingCreateReview ? 'Submitting...' : 'Submit'}
                                </Button>
                                {errorCreateReview && (
                                    <MessageBox variant="danger">{errorCreateReview}</MessageBox>
                                )}
                            </div>
                        </form>
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
