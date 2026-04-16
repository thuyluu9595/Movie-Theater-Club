import React, { useEffect, useReducer, useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Col, Container, Form, Row } from 'react-bootstrap';
import axios from "axios";
import { URL } from "../Constants";
import { Store } from "../Stores";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Helmet } from "react-helmet";

ChartJS.register(ArcElement, Tooltip, Legend);

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'SET_DAYS':
            return { ...state, days: parseInt(action.payload) };
        case 'SET_CATEGORY':
            return { ...state, category: action.payload };
        case 'FETCH_SUCCESS':
            return { ...state, plots: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

const AnalyticsScreen = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ plots, days, category, loading, error }, dispatch] = useReducer(reducer, {
        plots: [],
        days: 30,
        category: 'locations',
        loading: true,
        error: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const response = await axios.get(`${URL}/analytic/${category}?days=${days}`, {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        };
        fetchData();
    }, [days, category, userInfo.token]);

    // Consistent chart colors based on our theme
    const chartColors = {
        occupied: 'rgba(249, 38, 114, 0.7)', // Accent Pink
        unoccupied: 'rgba(255, 255, 255, 0.1)',
        noData: 'rgba(128, 128, 128, 0.2)',
        borderOccupied: '#F92672',
        borderUnoccupied: 'rgba(255, 255, 255, 0.3)',
        borderNoData: 'rgba(128, 128, 128, 0.4)',
    };

    // Global chart options for better readability on a dark theme
    ChartJS.defaults.color = '#FFFFFF';
    ChartJS.defaults.plugins.legend.position = 'bottom';

    return (
        <Container fluid className="analytics-page">
            <Helmet>
                <title>Analytics Dashboard</title>
            </Helmet>
            <h1 className="page-title">Analytics Dashboard</h1>

            {/* Filter Controls Card */}
            <div className="filter-card">
                <Row className="align-items-end">
                    <Col md={4}>
                        <Form.Group controlId="category-select">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" value={category} onChange={(e) => dispatch({ type: 'SET_CATEGORY', payload: e.target.value })}>
                                <option value="locations">Location</option>
                                <option value="movies">Movies</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="days-select">
                            <Form.Label>Time Period</Form.Label>
                            <Form.Control as="select" value={days} onChange={(e) => dispatch({ type: 'SET_DAYS', payload: e.target.value })}>
                                <option value={30}>Last 30 Days</option>
                                <option value={60}>Last 60 Days</option>
                                <option value={90}>Last 90 Days</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
            </div>

            {/* Chart Display Area */}
            <div className="charts-grid">
                {loading ? (
                    <LoadingBox />
                ) : error ? (
                    <MessageBox variant='danger'>{error}</MessageBox>
                ) : plots.length > 0 ? (
                    <Row>
                        {plots.map((plot) => {
                            const isValid = plot.movie != null || plot.location != null;
                            if (!isValid) return null;

                            const occupied = parseFloat(plot.occupiedPercent);
                            const data = !isNaN(occupied) ? [occupied, 100 - occupied, 0] : [0, 0, 100];

                            const chartData = {
                                labels: ['Occupied (%)', 'Unoccupied (%)', 'No Data'],
                                datasets: [{
                                    data: data,
                                    backgroundColor: [chartColors.occupied, chartColors.unoccupied, chartColors.noData],
                                    borderColor: [chartColors.borderOccupied, chartColors.borderUnoccupied, chartColors.borderNoData],
                                    borderWidth: 1,
                                }]
                            };

                            const chartTitle = plot.location ? `${plot.location.city}, ${plot.location.state}` : plot.movie.title;
                            const key = plot.location ? plot.location.id : plot.movie.id;

                            return (
                                <Col key={key} xl={3} lg={4} md={6} className="mb-4">
                                    <div className="analytics-card">
                                        <h5 className="analytics-card-title">{chartTitle}</h5>
                                        <div className="chart-container">
                                            <Pie data={chartData} />
                                        </div>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                ) : (
                    <MessageBox variant='info'>No analytics data available for the selected filters.</MessageBox>
                )}
            </div>
        </Container>
    );
};

export default AnalyticsScreen;
