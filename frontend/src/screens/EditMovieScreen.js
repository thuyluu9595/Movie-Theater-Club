import React, {useContext, useEffect, useReducer, useState} from 'react'
import { Helmet } from 'react-helmet';
import {Form, Button, Container} from 'react-bootstrap'
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import { URL } from "../Constants"
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import {Store} from "../Stores";
import moment from "moment";
import ImageUploadModal from "../components/ImageUploadModal";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case 'FETCH_SUCCESS':
            return {...state, movie: action.payload, loading: false};
        case 'FETCH_TITLE':
            return {...state, movie: {...state.movie, title:action.payload}, loading: false};
        case 'FETCH_DESCRIPTION':
            return {...state, movie: {...state.movie, description:action.payload}, loading: false};
        case 'FETCH_DURATION':
            return {...state, movie: {...state.movie, duration:action.payload}, loading: false};
        case 'FETCH_RELEASE_DATE':
            return {...state, movie: {...state.movie, releaseDate:action.payload}, loading: false};
        case 'FETCH_POSTER_URL':
            return {...state, movie: {...state.movie, posterUrl:action.payload}, loading: false};
        case 'FETCH_FAIL':
            return {...state,loading:false, error: action.payload};
        default:
            return state;
    }
}
export default function EditMovieScreen() {

    const id = useParams().id;
    const navigate = useNavigate();
    const {state} = useContext(Store);
    const {userInfo} = state;

    const  [{ loading, error, movie}, dispatch] = useReducer(reducer, {
        movie: {},
        loading : true,
        error: '',
    });
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: 'FETCH_REQUEST'});
            try {
                const response = await axios.get(`${URL}/movies/${id}`,{
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                dispatch({type: 'FETCH_SUCCESS', payload: response.data});
            } catch(err) {
                dispatch({type: 'FETCH_FAIL', payload: err.message});
            }
        };
        fetchData();
    }, [movie.posterUrl,dispatch]);
    const {title, description, duration, releaseDate, posterUrl} = movie;
    const submitEditHandler = async (e) => {
        e.preventDefault();
        try {
            const data = {
                "title": title,
                "description": description,
                "duration_in_minutes": duration,
                "release_date":  moment(releaseDate).format("MM/DD/YYYY")
            }
            console.log(data);
            await axios.put(`${URL}/movies/${id}`,data , {
                headers: { 'Authorization': `Bearer ${userInfo.token}` }
            });
            alert('Movie updated successfully');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleImageChange = (newImageUrl) => {
        // Update the movie state with the new image URL
        dispatch({ type: 'FETCH_POSTER_URL', payload: newImageUrl });
    };


    function deleteHandler() {
        try{
            axios.delete(`${URL}/movies/${id}`,
                {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
            alert('Movie deleted');
        } catch (err) {
            alert(err.message);
        }
        navigate('/manage-movies');
    }

    return (
        <Container className='edit-movie'>
            <Helmet>
                <title>Edit Movie</title>
            </Helmet>
            <h1 className='my-3'>Edit Movie</h1>
            {
            loading ? (
            <LoadingBox />
            ) : error ? (
                <MessageBox variant='danger'>{error}</MessageBox>
            ) : (
            <div>
                <div>
                    <div className='edit-movie-img-container'>
                        <img src={posterUrl} className='card-img-top' width='500' height='500' alt={title} />
                        <button onClick={() => setShowModal(true)}>Change Image</button>
                    </div>
                </div>
                <Form onSubmit={submitEditHandler} style={{marginBottom:"1rem"}}>
                    <Form.Group className='mb-3' controlId='title'>
                        <Form.Label>Movie Title</Form.Label>
                        <Form.Control
                            value={title}
                            placeholder={title}
                            onChange={(e) => dispatch({type: 'FETCH_TITLE', payload: e.target.value})}
                            required />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='description'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            placeholder={description}
                            onChange={(e) => dispatch({type: 'FETCH_DESCRIPTION', payload: e.target.value})}
                            required />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='duration'>
                        <Form.Label>Duration (in minutes)</Form.Label>
                        <Form.Control
                            type="number"
                            value={duration}
                            placeholder={duration}
                            step={1}
                            min={1}
                            onChange={(e) => dispatch({type: 'FETCH_DURATION', payload: e.target.value})}
                            required />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='release_date'>
                        <Form.Label>Release Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={moment(releaseDate, "MM/DD/YYYY").format("YYYY-MM-DD")}
                            onChange={(e) => dispatch({type: 'FETCH_RELEASE_DATE', payload: moment(e.target.value, "YYYY-MM-DD").format("MM/DD/YYYY")})}
                            required />
                    </Form.Group>
                        <Button type='submit'>Update</Button>
                        <Button onClick={deleteHandler} style={{display: "inline-flex", backgroundColor:"red", marginLeft:"5px"}}>Delete</Button>
                </Form>

                <ImageUploadModal show={showModal}
                                  onHide={() => setShowModal(false)}
                                  loading={loading}
                                  id={id}
                                  userInfo={userInfo}
                                  dispatch={dispatch}
                                  onImageChange={handleImageChange}
                />
            </div>
            )
            }
        </Container>
    );
}
