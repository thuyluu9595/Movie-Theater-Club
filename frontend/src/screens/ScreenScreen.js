import React, {useContext, useReducer, useEffect, useState} from 'react';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {Helmet} from 'react-helmet';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Container, Table, Button, Form, Row, Col} from 'react-bootstrap';
import {URL} from '../Constants';
import {Store} from '../Stores';
import axios from 'axios';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                screens: action.payload,
                loading: false
            };
        case 'FETCH_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'CREATE_REQUEST':
            return {
                ...state,
                creatingScreen: true
            };
        case 'CREATE_SUCCESS':
            return {
                ...state,
                creatingScreen: false
            };
        case 'CREATE_FAIL':
            return {
                ...state,
                creatingScreen: false,
                createScreenError: action.payload
            };

        case 'DELETE_REQUEST':
            return {...state, loadingDelete: true, errorDelete: null}
        case 'DELETE_SUCCESS':
            return {...state, loadingDelete: false, successDelete: true}
        case 'DELETE_FAIL':
            return {...state, loadingDelete: false, errorDelete: action.payload}
        case 'DELETE_RESET':
            return {...state, loadingDelete: false, successDelete: false}
        default:
            return state;
    }
};

const initialState = {
    screens: [],
    screen: {},
    loading: false,
    creatingScreen: false,
    createScreenError: null,
    error: null,

    loadingDelete: false,
    successDelete: false,
    errorDelete: null
};

export default function ScreenScreen() {
    const {state: webState} = useContext(Store);
    const {userInfo} = webState;
    const params = useParams();
    const {id} = params;

    const [state, dispatch] = useReducer(reducer, initialState);
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState(0);

    const fetchScreens = async () => {
        dispatch({type: 'FETCH_REQUEST'});
        try {
            const response = await axios.get(`${URL}/screens/locations/${id}`, {
                headers: {Authorization: `Bearer ${userInfo.token}`}
            });
            dispatch({type: 'FETCH_SUCCESS', payload: response.data});
        } catch (error) {
            dispatch({type: 'FETCH_FAIL', payload: error.message});
        }
    };

    const createScreen = async () => {
        dispatch({type: 'CREATE_REQUEST'});
        try {
            await axios.post(
                `${URL}/screens`,
                {
                    name,
                    locationId: id,
                    capacity
                },
                {
                    headers: {Authorization: `Bearer ${userInfo.token}`}
                }
            );
            fetchScreens();

            setName('');
            setCapacity(0);
            dispatch({type: 'CREATE_SUCCESS'});
        } catch (error) {
            dispatch({type: 'CREATE_FAIL', payload: error.message});
        }
    };
    const {
        screens,
        screen,
        loading,
        creatingScreen,
        error,
        createScreenError,
        loadingDelete,
        successDelete,
        errorDelete
    } =
        state;
    useEffect(() => {
        fetchScreens();
        if (successDelete) {
            alert("Screen deleted.")
            dispatch({type: "DELETE_RESET"})
        }
    }, [successDelete]);


    async function deleteScreen(id) {
        dispatch({type: "DELETE_REQUEST"})
        try {
            await axios.delete(`${URL}/screens/${id}`, {
                headers: {Authorization: `Bearer ${userInfo.token}`}
            })
            dispatch({type: "DELETE_SUCCESS"});
        } catch (error) {
            dispatch({type: "DELETE_FAIL", payload: error.message});
        }
    }

    return (
        <Container>
            <Helmet>
                <title>Screens</title>
            </Helmet>
            <h1>Screens</h1>
            {loading ? (
                <LoadingBox/>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <div>
                    {/* Display existing locations */}
                    {loadingDelete && <LoadingBox/>}
                    {errorDelete && <MessageBox variant={"danger"}>{errorDelete}</MessageBox>}
                    <h2>Existing Screen</h2>
                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Capacity</th>
                            <th>City</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {screens.map((scr, idx) => (
                            <tr key={scr.id}>
                                <td>{idx + 1}</td>
                                <td>{scr.name}</td>
                                <td>{scr.capacity}</td>
                                <td>{scr.location.city}</td>
                                <td>
                                    <Button variant="info" onClick={() => deleteScreen(scr.id)}>Delete Screen</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <h2>Create New Screen</h2>
                    <Row>
                        <Col md={6}>
                            <Form>
                                <Form.Group controlId="screenName">
                                    <Form.Label>Screen Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter screen name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="screenName">
                                    <Form.Label>Capacity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={capacity}
                                        min={0}
                                        onChange={(e) => setCapacity(e.target.value)}
                                    />
                                </Form.Group>
                                <Button
                                    type="button"
                                    onClick={createScreen}
                                    disabled={creatingScreen}
                                >
                                    {creatingScreen ? 'Creating...' : 'Create Location'}
                                </Button>
                                {createScreenError && (
                                    <MessageBox varient="danger">{createScreenError}</MessageBox>
                                )}
                            </Form>
                        </Col>
                    </Row>
                    {/* Create new location form */}
                    {/* <h2>Create New Location</h2>
          <Row>
            <Col md={6}>
              <Form>
                <Form.Group controlId="locationName">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter location city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="locationName">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter location state"
                    value={locationState}
                    onChange={(e) => setState(e.target.value)}
                  />
                </Form.Group>
                <Button
                  type="button"
                  onClick={createLocation}
                  disabled={creatingLocation}
                >
                  {creatingLocation ? 'Creating...' : 'Create Location'}
                </Button>
                {createLocationError && (
                  <MessageBox variant="danger">
                    {createLocationError}
                  </MessageBox>
                )}
              </Form>
            </Col>
          </Row> */}
                </div>
            )}
        </Container>
    );
}
