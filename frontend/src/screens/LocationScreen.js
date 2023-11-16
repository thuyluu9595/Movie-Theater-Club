import React, { useEffect, useReducer, useState, useContext } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { URL } from '../Constants';
import { Store } from '../Stores';
import { useNavigate } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, locations: action.payload, loading: false };
    case 'FETCH_BY_ID_REQUEST':
      return { ...state, loading: true, location: {} };
    case 'FETCH_BY_ID_SUCCESS':
      return { ...state, location: action.payload, loading: false };
    case 'CREATE_REQUEST':
      return { ...state, creatingLocation: true };
    case 'CREATE_SUCCESS':
      return { ...state, creatingLocation: false };
    case 'CREATE_FAIL':
      return {
        ...state,
        creatingLocation: false,
        createLocationError: action.payload
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  locations: [],
  location: {},
  loading: false,
  creatingLocation: false,
  createLocationError: null,
  error: null
};

export function LocationScreen() {
  const navigate = useNavigate();
  const { state: webState } = useContext(Store);
  const { userInfo } = webState;

  const [state, dispatch] = useReducer(reducer, initialState);
  const [city, setCity] = useState('');
  const [locationState, setState] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      const response = await axios.get(`${URL}/locations`);
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: error.message });
    }
  };


  const createLocation = async () => {
    dispatch({ type: 'CREATE_REQUEST' });
    try {
      await axios.post(
        `${URL}/locations`,
        {
          city,
          state: locationState
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        }
      );
      await fetchLocations();
      setCity('');
      setState('');
      dispatch({ type: 'CREATE_SUCCESS' });
    } catch (error) {
      dispatch({ type: 'CREATE_FAIL', payload: error.message });
    }
  };

  const {
    locations,
    location,
    loading,
    creatingLocation,
    createLocationError,
    error
  } = state;

  return (
    <Container>
      <Helmet>
        <title>Locations</title>
      </Helmet>
      <h1>Locations</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          {/* Display existing locations */}
          <h2>Existing Locations</h2>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>City</th>
                <th>State</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.id}>
                  <td>{loc.id}</td>
                  <td>{loc.city}</td>
                  <td>{loc.state}</td>
                  <td>
                    <Button
                      variant="info"
                      onClick={() => {navigate(`/locations/${loc.id}`)}}
                    >
                      Add Screen
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Create new location form */}
          <h2>Create New Location</h2>
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
          </Row>
        </div>
      )}

      {/* Display location details if available */}
      {Object.keys(location).length > 0 && (
        <div>
          <h2>Location Details</h2>
          <p>ID: {location._id}</p>
          <p>Name: {location.name}</p>
        </div>
      )}
    </Container>
  );
}
