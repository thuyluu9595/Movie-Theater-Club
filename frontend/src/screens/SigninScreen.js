import React, { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { Store } from "../Stores";
import { URL } from "../Constants";
import { getError } from "../utils"; // Assuming you have this utility for parsing errors
import MessageBox from "../components/MessageBox";

export default function SigninScreen() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    // State to handle login errors gracefully
    const [error, setError] = useState('');

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const { data } = await axios.post(`${URL}/authenticate`, {
                username,
                password,
            });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');
            // No more window.location.reload() for a smoother SPA experience
        } catch (err) {
            // Use an inline message box instead of an alert
            setError(getError(err));
        }
    };

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    return (
        // A custom container for the centered, glassmorphism card
        <div className="auth-container">
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <h1 className='auth-title'>Sign In</h1>
            <Form onSubmit={submitHandler}>
                {/* Display login error message here */}
                {error && <MessageBox variant="danger">{error}</MessageBox>}

                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <div className='d-grid mb-3'>
                    <Button type="submit" className="auth-button">
                        Sign In
                    </Button>
                </div>
                <div className="auth-switch-link">
                    New customer?{' '}
                    <Link to={`/register?redirect=${redirect}`}>Create your account</Link>
                </div>
            </Form>
        </div>
    )
}