import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from "axios";
import { URL } from "../Constants";
import { Store } from "../Stores";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from '../utils';

export default function Discount() {
    const { state } = useContext(Store);
    const { userInfo } = state;

    // Constants for discount types
    const TUESDAY_SPECIAL = "tueday-special";
    const BEFORE_6PM = "before-6pm";

    // State for each discount value
    const [tuesdayDiscount, setTuesdayDiscount] = useState('');
    const [sixPmDiscount, setSixPmDiscount] = useState('');

    // State for loading, error, and success feedback for each form
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [loadingTuesday, setLoadingTuesday] = useState(false);
    const [errorTuesday, setErrorTuesday] = useState('');
    const [successTuesday, setSuccessTuesday] = useState('');

    const [loadingSixPm, setLoadingSixPm] = useState(false);
    const [errorSixPm, setErrorSixPm] = useState('');
    const [successSixPm, setSuccessSixPm] = useState('');

    useEffect(() => {
        const fetchDiscounts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${URL}/discount`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                // Find and set the value for each discount type
                const tuesday = data.find(d => d.id === "TuedaySpecial");
                const sixPm = data.find(d => d.id !== "TuedaySpecial"); // Assuming the other is always Before6PM
                if (tuesday) setTuesdayDiscount(tuesday.percentDiscount);
                if (sixPm) setSixPmDiscount(sixPm.percentDiscount);
                setLoading(false);
            } catch (err) {
                setError(getError(err));
                setLoading(false);
            }
        };
        fetchDiscounts();
    }, [userInfo.token]);

    // Generic handler to clear success messages after a delay
    const clearSuccessMessage = (setter) => {
        setTimeout(() => {
            setter('');
        }, 3000);
    };

    const submitHandler = async (e, type) => {
        e.preventDefault();
        // Set loading and clear errors for the specific form
        if (type === TUESDAY_SPECIAL) {
            setLoadingTuesday(true);
            setErrorTuesday('');
            setSuccessTuesday('');
        } else {
            setLoadingSixPm(true);
            setErrorSixPm('');
            setSuccessSixPm('');
        }

        try {
            await axios.put(`${URL}/discount/${type}`, {
                "percent": type === TUESDAY_SPECIAL ? tuesdayDiscount : sixPmDiscount
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            if (type === TUESDAY_SPECIAL) {
                setLoadingTuesday(false);
                setSuccessTuesday("Tuesday discount updated successfully!");
                clearSuccessMessage(setSuccessTuesday);
            } else {
                setLoadingSixPm(false);
                setSuccessSixPm("Before 6 PM discount updated successfully!");
                clearSuccessMessage(setSuccessSixPm);
            }
        } catch (err) {
            if (type === TUESDAY_SPECIAL) {
                setLoadingTuesday(false);
                setErrorTuesday(getError(err));
            } else {
                setLoadingSixPm(false);
                setErrorSixPm(getError(err));
            }
        }
    };

    return (
        <Container fluid className="discount-page">
            <Helmet>
                <title>Manage Discounts</title>
            </Helmet>
            <div className="page-header">
                <h1 className='page-title'>Manage Discounts</h1>
            </div>

            {loading ? <LoadingBox /> : error ? <MessageBox variant="danger">{error}</MessageBox> : (
                <Row>
                    {/* Tuesday Special Card */}
                    <Col md={6} className="mb-4">
                        <div className="form-card">
                            <h3 className="form-card-title">Tuesday Special Discount</h3>
                            <Form onSubmit={e => submitHandler(e, TUESDAY_SPECIAL)}>
                                {errorTuesday && <MessageBox variant="danger">{errorTuesday}</MessageBox>}
                                {successTuesday && <MessageBox variant="success">{successTuesday}</MessageBox>}
                                <Form.Group className="mb-3" controlId="tuesdayDiscount">
                                    <Form.Label>Discount Percentage (%)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step={0.01}
                                        min={0}
                                        max={100}
                                        value={tuesdayDiscount}
                                        onChange={(e) => setTuesdayDiscount(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <div className="d-grid">
                                    <Button type="submit" className="auth-button" disabled={loadingTuesday}>
                                        {loadingTuesday ? <LoadingBox isButton={true} /> : 'Update Discount'}
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Col>

                    {/* Before 6 PM Card */}
                    <Col md={6} className="mb-4">
                        <div className="form-card">
                            <h3 className="form-card-title">Before 6 PM Discount</h3>
                            <Form onSubmit={e => submitHandler(e, BEFORE_6PM)}>
                                {errorSixPm && <MessageBox variant="danger">{errorSixPm}</MessageBox>}
                                {successSixPm && <MessageBox variant="success">{successSixPm}</MessageBox>}
                                <Form.Group className="mb-3" controlId="sixPmDiscount">
                                    <Form.Label>Discount Percentage (%)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step={0.01}
                                        min={0}
                                        max={100}
                                        value={sixPmDiscount}
                                        onChange={(e) => setSixPmDiscount(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <div className="d-grid">
                                    <Button type="submit" className="auth-button" disabled={loadingSixPm}>
                                        {loadingSixPm ? <LoadingBox isButton={true} /> : 'Update Discount'}
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            )}
        </Container>
    );
}
