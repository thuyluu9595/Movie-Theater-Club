import React, {useEffect, useReducer, useContext} from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import {Col, Container, Form, Row} from 'react-bootstrap';
import axios from "axios";
import { URL } from "../Constants";
import {Store} from "../Stores";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

ChartJS.register(ArcElement, Tooltip, Legend);
const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case '30_DAYS':
            return {...state, days: 30};
        case '60_DAYS':
            return {...state, days: 60};
        case '90_DAYS':
            return {...state, days: 90};
        case 'LOCATIONS':
            return {...state, category: 'locations'};
        case 'MOVIES':
            return {...state, category: 'movies'};
        case 'FETCH_SUCCESS':
            return {...state, plots: action.payload, loading: false};
        case 'FETCH_FAIL':
            return {...state,loading:false, error: action.payload};
        default:
            return state;
    }
}
const AnalyticsScreen = () => {
    const {state} = useContext(Store);
    const {userInfo} = state;
    const [{plots, days, category, loading, error}, dispatch] = useReducer(reducer, {
        plots: [],
        days: 30,
        category: 'locations',
        loading : true,
        error: '',
    });
    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: 'FETCH_REQUEST'});
            try {
                const response = await axios.get(`${URL}/analytic/${category}?days=${days}`, {
                    headers: { 'Authorization': `Bearer ${userInfo.access_token}` }
                });
                dispatch({type: 'FETCH_SUCCESS', payload: response.data});

            } catch (err) {
                dispatch({type: 'FETCH_FAIL', payload: err.message});
            }
        };
        fetchData();

    }, [days, category]);

    const handleDaysChange = (e) => {
        // e.preventDefault();
        dispatch({type: e.target.value === '30' ? '30_DAYS' : e.target.value === '60' ? '60_DAYS' : '90_DAYS'});
    };

    const handleCategoryChange = (e) => {
        // e.preventDefault();
        dispatch({type: e.target.value === 'locations' ? 'LOCATIONS' : 'MOVIES'});
    };

    return (
        // <div className="analytics-container">
        <Container>
            <h1>Analytics </h1>
            <label htmlFor="category-select" style={{color: "black", marginRight: "0.7rem"}}>Category: </label>
            <Form.Control as="select" className="category-select" value={category} onChange={handleCategoryChange}>
                <option value="locations">Location</option>
                <option value="movies">Movies</option>
            </Form.Control>

            <label htmlFor="days-select" style={{color: "black", marginRight: "0.7rem"}}>Days: </label>
            <Form.Control as="select" className="days-select" value={days} onChange={handleDaysChange}>
                <option value={30}>30 Days</option>
                <option value={60}>60 Days</option>
                <option value={90}>90 Days</option>
            </Form.Control>

            <Row className="row">
                {
                    loading ? (
                        <LoadingBox />
                    ) : error ? (
                        <MessageBox variant='danger'>{error}</MessageBox>
                    ) : (

                        plots.length > 0 ? (plots.map((plot) => {
                                let data = [0, 0, 100];
                                if (plot.occupiedPercent !=='NaN') {
                                    data = [parseFloat(plot.occupiedPercent), 100 - parseFloat(plot.occupiedPercent), 0];
                                }

                                const chartData = {
                                    labels: ['Occupied', 'Unoccupied', 'No Data'],
                                    datasets: [
                                        {
                                            data: data,
                                            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.1)', 'rgba(255, 206, 86, 0.2)'],
                                            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
                                            borderWidth: 1,
                                        }
                                    ]
                                };
                                const pieChartColor = `rgb(${plot.id * 50}, ${plot.id * 50}, ${plot.id * 50})`

                                return (
                                    plot.movie != null|| plot.location != null ? (
                                        <Col key={plot.location != null ? plot.location.city : plot.movie.id} className="col" sm={6} md={4} lg={3} style={{ backgroundColor: pieChartColor }}>
                                            <h2>{plot.location != null ? plot.location.city : plot.movie.title}</h2>
                                            <Pie data={chartData} />
                                        </Col>) : null

                                );
                            })
                        ) : (
                            <MessageBox variant='danger'>No data</MessageBox>
                        )

                    )}
            </Row>
        </Container>
            

        // </div>
    );
};


export default AnalyticsScreen;