import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from "axios";
import { Store } from '../Stores';
import { URL } from "../Constants";
import { getError } from '../utils';
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true, error: '' };
        case "FETCH_SUCCESS":
            return { ...state, userProfile: action.payload, loading: false };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };

        case "UPDATE_REQUEST":
            return { ...state, loadingUpdate: true, errorUpdate: '', successUpdate: '' };
        case "UPDATE_SUCCESS":
            return { ...state, loadingUpdate: false, successUpdate: 'Profile updated successfully!' };
        case "UPDATE_FAIL":
            return { ...state, loadingUpdate: false, errorUpdate: action.payload };

        case "UPDATE_FIELD":
            // Handle changes to form fields
            return { ...state, userProfile: { ...state.userProfile, [action.field]: action.payload } };

        case "CLEAR_MESSAGES":
            return { ...state, successUpdate: '', errorUpdate: '' };

        default:
            return state;
    }
};

export default function ProfileScreen() {
    const { state: storeState, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = storeState;

    const [{ loading, error, userProfile, loadingUpdate, errorUpdate, successUpdate }, dispatch] = useReducer(reducer, {
        userProfile: null,
        loading: true,
        error: '',
        loadingUpdate: false,
        errorUpdate: '',
        successUpdate: '',
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            dispatch({ type: "FETCH_REQUEST" });
            try {
                const { data } = await axios.get(`${URL}/user/info`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: "FETCH_SUCCESS", payload: data });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };
        fetchUserProfile();
    }, [userInfo.token]);

    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch({ type: "UPDATE_REQUEST" });
        try {
            const { data } = await axios.put(`${URL}/user/${userInfo.id}/update-info`, {
                firstname: userProfile.firstname,
                lastname: userProfile.lastname,
                email: userProfile.email
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });

            // Update global state and local storage without a page reload
            ctxDispatch({ type: 'USER_SIGNIN', payload: { ...userInfo, firstname: userProfile.firstname } });
            localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, firstname: userProfile.firstname }));

            dispatch({ type: "UPDATE_SUCCESS" });
            setTimeout(() => dispatch({ type: "CLEAR_MESSAGES" }), 3000);

        } catch (err) {
            dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
        }
    };

    const handleFieldChange = (field, value) => {
        dispatch({ type: 'UPDATE_FIELD', field, payload: value });
    };

    return (
        <Container className="profile-page">
            <Helmet>
                <title>User Profile</title>
            </Helmet>
            <div className="page-header">
                <h1 className='page-title'>User Profile</h1>
            </div>

            {loading ? <LoadingBox /> : error ? <MessageBox variant="danger">{error}</MessageBox> : (
                <div className="profile-card">
                    <Row>
                        {/* Left Column: User Info */}
                        <Col md={4} className="profile-sidebar">
                            <div className="profile-avatar">
                                {/* Placeholder for an avatar */}
                                <i className="fas fa-user-circle"></i>
                            </div>
                            <h3 className="profile-name">{userProfile?.firstname} {userProfile?.lastname}</h3>
                            <p className="profile-username">@{userProfile?.username}</p>
                            <div className={`membership-badge ${userProfile?.member.membershipTier.toLowerCase()}`}>
                                {userProfile?.member.membershipTier} Member
                            </div>
                        </Col>

                        {/* Right Column: Update Form */}
                        <Col md={8} className="profile-form">
                            <h4 className="form-section-title">Edit Your Information</h4>
                            <Form onSubmit={submitHandler}>
                                {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                                {successUpdate && <MessageBox variant="success">{successUpdate}</MessageBox>}
                                <Form.Group className='mb-3' controlId='firstname'>
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        value={userProfile?.firstname || ''}
                                        onChange={(e) => handleFieldChange('firstname', e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className='mb-3' controlId='lastname'>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        value={userProfile?.lastname || ''}
                                        onChange={(e) => handleFieldChange('lastname', e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className='mb-4' controlId='email'>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type='email'
                                        value={userProfile?.email || ''}
                                        onChange={(e) => handleFieldChange('email', e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <div className='d-grid'>
                                    <Button type='submit' className="auth-button" disabled={loadingUpdate}>
                                        {loadingUpdate ? <LoadingBox isButton={true} /> : 'Update Profile'}
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </div>
            )}
        </Container>
    );
}
