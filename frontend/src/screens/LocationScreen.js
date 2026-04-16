import React, { useEffect, useReducer, useState, useContext } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { URL } from '../Constants';
import { Store } from '../Stores';
import { useNavigate } from 'react-router-dom';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, locations: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true, errorCreate: '' };
    case 'CREATE_SUCCESS':
      // Add the new location to the top of the list for immediate feedback
      const newLocations = [action.payload, ...state.locations];
      return { ...state, locations: newLocations, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false, errorCreate: action.payload };
    default:
      return state;
  }
};

export function LocationScreen() {
  const navigate = useNavigate();
  const { state: webState } = useContext(Store);
  const { userInfo } = webState;

  const [{ locations, loading, error, loadingCreate, errorCreate }, dispatch] = useReducer(reducer, {
    locations: [],
    loading: true,
    error: '',
    loadingCreate: false,
    errorCreate: '',
  });

  const [city, setCity] = useState('');
  const [locationState, setState] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`${URL}/locations`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchLocations();
  }, []);

  const createLocationHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'CREATE_REQUEST' });
    try {
      const { data } = await axios.post(
          `${URL}/locations`,
          { city, state: locationState },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'CREATE_SUCCESS', payload: data });
      setCity('');
      setState('');
    } catch (error) {
      dispatch({ type: 'CREATE_FAIL', payload: getError(error) });
    }
  };

  return (
      <Container fluid className="location-page">
        <Helmet>
          <title>Manage Locations</title>
        </Helmet>
        <div className="page-header">
          <h1 className="page-title">Manage Locations</h1>
        </div>

        <Row>
          {/* Create New Location Form Card */}
          <Col lg={4} className="mb-4">
            <div className="form-card">
              <h3 className="form-card-title">Create New Location</h3>
              <Form onSubmit={createLocationHandler}>
                {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
                <Form.Group className="mb-3" controlId="locationCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                      type="text"
                      placeholder="e.g. Los Angeles"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="locationState">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                      type="text"
                      placeholder="e.g. CA"
                      value={locationState}
                      onChange={(e) => setState(e.target.value)}
                      required
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button type="submit" className="auth-button" disabled={loadingCreate}>
                    {loadingCreate ? <LoadingBox isButton={true} /> : 'Create Location'}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>

          {/* Existing Locations Table Card */}
          <Col lg={8}>
            <div className="table-card">
              <h3 className="table-card-title">Existing Locations</h3>
              {loading ? (
                  <LoadingBox />
              ) : error ? (
                  <MessageBox variant="danger">{error}</MessageBox>
              ) : (
                  <Table responsive className="data-table">
                    <thead>
                    <tr>
                      <th>ID</th>
                      <th>City</th>
                      <th>State</th>
                      <th className="text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {locations.map((loc) => (
                        <tr key={loc.id}>
                          <td>{loc.id}</td>
                          <td>{loc.city}</td>
                          <td>{loc.state}</td>
                          <td className="text-center">
                            <Button
                                className="btn-table-action"
                                onClick={() => { navigate(`/locations/${loc.id}`) }}
                            >
                              Manage Screens
                            </Button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </Table>
              )}
            </div>
          </Col>
        </Row>
      </Container>
  );
}
