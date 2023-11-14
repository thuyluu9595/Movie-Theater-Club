import React, {useState, useEffect, useReducer, useContext} from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS} from "chart.js/auto";
import {Col, Form, Row} from 'react-bootstrap';
import axios from "axios";
import { URL } from "../Constants";
import {Store} from "../Stores";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case 'FETCH_SUCCESS':
            return {...state, plots: action.payload, loading: false};
        case 'FETCH_FAIL':
            return {...state,loading:false, error: action.payload};
        default:
            return state;
    }
}
const Analytics = () => {
    const [days, setDays] = useState(30);
    const [category, setCategory] = useState('locations');
    const {state} = useContext(Store);
    const {userInfo} = state;
    const [{plots, loading, error}, dispatch] = useReducer(reducer, {
        plots: [],
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
        console.log(plots);
        fetchData();

    }, [days, category]);

    const handleDaysChange = (e) => {
        e.preventDefault();
        setDays(e.target.value);
    };

    const handleCategoryChange = (e) => {
        e.preventDefault();
        setCategory(e.target.value);
    };

    return (
        <div>
            <h1>Analytics</h1>
            <Form.Control as="select" value={days} onChange={handleDaysChange}>
                <option value={30}>30 Days</option>
                <option value={60}>60 Days</option>
                <option value={90}>90 Days</option>
            </Form.Control>
            <Form.Control as="select" value={category} onChange={handleCategoryChange}>
                <option value="location">Location</option>
                <option value="movies">Movies</option>
            </Form.Control>
            <Row>
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
                                                backgroundColor: ['green', 'red', 'grey']
                                            }
                                        ]
                                    };
                                    const pieChartColor = `rgb(${plot.id * 50}, ${plot.id * 50}, ${plot.id * 50})`

                                    return (
                                        plot.movie || plot.location ? (
                                            <Col key={1} sm={6} md={4} lg={3} style={{ backgroundColor: pieChartColor }}>
                                                {/*<h2>{category === 'locations' ? plot.location.city : plot.movie.title}</h2>*/}
                                                <h2>{plot.location.city}</h2>
                                                <Pie data={chartData} />
                                            </Col>) : null

                                    );
                                })
                                 ) : (
                                     <MessageBox variant='danger'>No data</MessageBox>
                                 )

                        )}
            </Row>

        </div>
    );
};


export default Analytics;