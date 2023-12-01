import React, {useContext, useReducer} from 'react'
import { Helmet } from 'react-helmet';
import {Form, Button, Container} from 'react-bootstrap'
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { URL } from "../Constants"
import {Store} from "../Stores";
import moment from "moment";

const reducer = (state, action) => {
    switch (action.type) {
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
        case 'FETCH_FAIL':
            return {...state,loading:false, error: action.payload};
        default:
            return state;
    }
}
export default function CreateMovieScreen() {

    const {state} = useContext(Store);
    const {userInfo} = state;
    const navigate = useNavigate();

    const  [{ loading, error, movie}, dispatch] = useReducer(reducer, {
        movie: {},
        loading : true,
        error: '',
    });

    const {title, description, duration, releaseDate} = movie;
    const submitCreateHandler = async (e) => {
        e.preventDefault();
        try {
            const data = {
                "title": title,
                "description": description,
                "duration_in_minutes": duration,
                "release_date":  moment(releaseDate).format("MM/DD/YYYY"),
                "poster_url": "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
            }
            console.log(data);
            const response = await axios.post(`${URL}/movies`,data , {
                headers: { 'Authorization': `Bearer ${userInfo.token}` }
            });
            alert('Movie created successfully');
            navigate(`/manage-movies/${response.data.id}`);
        } catch (err) {
            alert(err.message);
        }
    };



    return (
        <Container className='create-movie'>
            <Helmet>
                <title>Create Movie</title>
            </Helmet>
            <h1 className='my-3'>Create Movie</h1>
            {(
                    <div>
                        <Form onSubmit={submitCreateHandler}>
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
                            <Button type='submit'>Create Movie</Button>

                        </Form>
                    </div>
                )
            }
        </Container>
    );
}
