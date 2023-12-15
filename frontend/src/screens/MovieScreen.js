import React, {useContext, useEffect, useReducer} from "react";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Row, Col, ListGroup, Button} from 'react-bootstrap';
import {Helmet} from "react-helmet";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {getError} from "../utils";
import {URL} from "../Constants";
import {Store} from "../Stores";


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case 'FETCH_SUCCESS':
            return {...state, movie: action.payload, loading: false};
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
}

export default function MovieScreen() {
    const navigate = useNavigate();
    const params = useParams();

    const {state: webState} = useContext(Store);
    const {userInfo} = webState;

    const {id} = params;

    const [{loading, error, movie}, dispatch] = useReducer(reducer, {
        movie: {},
        loading: true,
        error: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: 'FETCH_REQUEST'});
            try {
                const result = await axios.get(`${URL}/movies/${id}`);
                dispatch({type: 'FETCH_SUCCESS', payload: result.data});
            } catch (err) {
                dispatch({type: 'FETCH_FAIL', payload: getError(err)});
            }
        };
        fetchData();
    }, [id, navigate]);

    return loading ? (
        <LoadingBox/>
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
                            Decription: {movie.description}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Link to={`/showtimes/${movie.id}`}>
                                <Button>{userInfo && userInfo.role === "Employee" ? "Add Showtime" : "Get Tickets"}</Button>
                            </Link>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </div>
    );

}