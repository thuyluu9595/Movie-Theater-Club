import React, {useContext, useEffect, useReducer} from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import { Store } from '../Stores';
import axios from "axios";
import {URL} from "../Constants";

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true };
        case "FETCH_SUCCESS":
            return { ...state, info: action.payload, loading: false };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const initialState = {
    info: null,
    loading: false,
    error: null,
};
const MembershipOptionsScreen = () => {
    const { state: ctxState } = useContext(Store);
    const { userInfo } = ctxState;
    const navigate = useNavigate();

    const [state, dispatch] = useReducer(reducer, initialState);

    const getInfo = async () => {
        dispatch({ type: "FETCH_REQUEST" });
        try {
            const response = await axios.get(`${URL}/user/info`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: "FETCH_SUCCESS", payload: response.data });
        } catch (error) {
            dispatch({ type: "FETCH_FAIL", payload: error.message });
        }
    };

    useEffect(() => {
        if (userInfo) getInfo();
    },[userInfo])

    const handleRegularClick = () => {
        if (!userInfo) {
            navigate('/signin?redirect=/membership-options');
        }
        else if (info.member.membershipTier === 'Premium') {
            navigate('/profile');
        }
    };

    const handlePremiumClick = () => {
        if (!userInfo) {
            navigate('/signin?redirect=/membership-options');
        }
        else if (info.member.membershipTier === 'Regular') {
            navigate('/premium');
        }
    };

    const {info} = state;

    return (
        <Container className="membership-options">
            <h1 className="membership-options-title">Membership Options</h1>
            <Row style={{color:"black"}}>
                <Col md={6} className="mb-4">
                    <Card className="membership-plan-card">
                        <Card.Body>
                            <Card.Title className="membership-plan-title">Regular Membership</Card.Title>
                            <Card.Text className="membership-plan-benefits">
                                <p>Regular membership is free and provides the following benefits:</p>
                                <ul>
                                    <li>Free access to view information about upcoming movies and current schedules.</li>
                                    <li>Option to book tickets for movie shows with a simple and straightforward process.</li>
                                    <li>Newsletter subscription for regular updates on movie releases and exclusive offers.</li>
                                </ul>
                            </Card.Text>
                                <Button variant="info"
                                        className="mx-auto d-block membership-card-button"
                                        onClick={handleRegularClick}
                                        disabled={info && info.member.membershipTier === 'Regular'}
                                >
                                    {!info ? 'Choose plan': info.member.membershipTier !== 'Premium' ? 'Current plan': 'Choose plan' }
                                </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-4">
                    <Card className="membership-plan-card">
                        <Card.Body >
                            <Card.Title className="membership-plan-title">Premium Membership</Card.Title>
                            <Card.Text className="membership-plan-benefits">
                                <p>Premium membership comes with additional benefits for an annual fee of $15:</p>
                                <ul>
                                    <li>Online service fee waived for any booking.</li>
                                    <li>Book multiple seats (up to 8) for a movie show.</li>
                                    <li>Accumulate rewards points at an accelerated rate - 2 points per dollar spent.</li>
                                    <li>Cancel previous tickets before showtime and request a refund.</li>
                                    <li>Receive invitations to special events, premieres, or exclusive screenings.</li>
                                </ul>
                            </Card.Text>
                                <Button variant="info"
                                        className="mt-3 mx-auto d-block"
                                        onClick={handlePremiumClick}
                                        disabled={info && info.member.membershipTier === 'Premium'}
                                >
                                    {!info ? 'Choose plan': info.member.membershipTier !== 'Premium' ? 'Upgrade': 'Current plan'}
                                </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MembershipOptionsScreen;
