import React, { useContext, useEffect, useReducer } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from "axios";

import { Store } from '../Stores';
import { URL } from "../Constants";
import LoadingBox from '../components/LoadingBox'; // Assuming you have this component

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true };
        case "FETCH_SUCCESS":
            return { ...state, info: action.payload, loading: false };
        case "FETCH_FAIL":
            // Fail gracefully for logged-out users, don't show an error
            return { ...state, loading: false, error: null };
        default:
            return state;
    }
};

const MembershipOptionsScreen = () => {
    const { state: ctxState } = useContext(Store);
    const { userInfo } = ctxState;
    const navigate = useNavigate();

    const [{ info, loading }, dispatch] = useReducer(reducer, {
        info: null,
        loading: !!userInfo, // Only set loading if there's a user to fetch info for
        error: null,
    });

    useEffect(() => {
        const getInfo = async () => {
            if (!userInfo) {
                return; // Don't fetch if no user is logged in
            }
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
        getInfo();
    }, [userInfo]);

    const handleRegularClick = () => {
        if (!userInfo) {
            navigate('/signin?redirect=/membership-options');
        } else if (info && info.member.membershipTier === 'Premium') {
            // Potentially a downgrade path in the future
            navigate('/profile');
        }
    };

    const handlePremiumClick = () => {
        if (!userInfo) {
            navigate('/signin?redirect=/membership-options');
        } else if (info && info.member.membershipTier === 'Regular') {
            navigate('/premium');
        }
    };

    // Determine button states and text based on user status
    const getButtonState = (plan) => {
        if (loading) return { text: 'Loading...', disabled: true };
        if (!userInfo) return { text: 'Choose Plan', disabled: false };

        if (plan === 'regular') {
            return {
                text: info?.member.membershipTier === 'Regular' ? 'Current Plan' : 'Choose Plan',
                disabled: info?.member.membershipTier === 'Regular'
            };
        }
        if (plan === 'premium') {
            return {
                text: info?.member.membershipTier === 'Premium' ? 'Current Plan' : 'Upgrade',
                disabled: info?.member.membershipTier === 'Premium'
            };
        }
        return { text: 'Choose Plan', disabled: false };
    };

    const regularButton = getButtonState('regular');
    const premiumButton = getButtonState('premium');

    return (
        <Container className="membership-page">
            <Helmet>
                <title>Membership Options</title>
            </Helmet>
            <div className="page-header text-center">
                <h1 className="page-title">Membership Options</h1>
                <p className="page-subtitle">Choose the plan that's right for you.</p>
            </div>

            {loading && <LoadingBox />}

            <Row className="justify-content-center">
                {/* Regular Membership Card */}
                <Col lg={5} md={6} className="mb-4">
                    <div className="membership-card">
                        <div className="card-content">
                            <h3 className="plan-title">Regular</h3>
                            <p className="plan-price">Free</p>
                            <ul className="plan-benefits">
                                <li><i className="fas fa-check-circle"></i> View movie info & schedules</li>
                                <li><i className="fas fa-check-circle"></i> Book tickets with ease</li>
                                <li><i className="fas fa-check-circle"></i> Newsletter updates</li>
                            </ul>
                            <Button className="btn-choose-plan" onClick={handleRegularClick} disabled={regularButton.disabled}>
                                {regularButton.text}
                            </Button>
                        </div>
                    </div>
                </Col>

                {/* Premium Membership Card */}
                <Col lg={5} md={6} className="mb-4">
                    <div className="membership-card premium">
                        <div className="recommended-badge">Recommended</div>
                        <div className="card-content">
                            <h3 className="plan-title">Premium</h3>
                            <p className="plan-price">$15<span className="price-period">/year</span></p>
                            <ul className="plan-benefits">
                                <li><i className="fas fa-check-circle"></i> Online service fee waived</li>
                                <li><i className="fas fa-check-circle"></i> Book up to 8 seats</li>
                                <li><i className="fas fa-check-circle"></i> Accelerated rewards points</li>
                                <li><i className="fas fa-check-circle"></i> Cancel tickets for a refund</li>
                                <li><i className="fas fa-check-circle"></i> Invitations to special events</li>
                            </ul>
                            <Button className="btn-choose-plan" onClick={handlePremiumClick} disabled={premiumButton.disabled}>
                                {premiumButton.text}
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default MembershipOptionsScreen;
