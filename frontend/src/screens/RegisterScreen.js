import React, { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';
import axios from "axios";
import { Store } from "../Stores";
import { URL } from "../Constants";
import { getError } from "../utils";
import MessageBox from "../components/MessageBox";

export default function RegisterScreen() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State for handling success and error messages
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { state } = useContext(Store);
    const { userInfo } = state;

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await axios.post(`${URL}/user/`, {
                firstname,
                lastname,
                username,
                email,
                password,
            });
            setSuccess('Account created successfully! Redirecting to sign in...');
            // Redirect to sign-in page after a short delay
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        } catch (err) {
            setError(getError(err));
        }
    };

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    return (
        // Using the same container as the SigninScreen for consistency
        <div className="auth-container">
            <Helmet>
                <title>Register</title>
            </Helmet>
            <h1 className="auth-title">Create an Account</h1>
            <Form onSubmit={submitHandler}>
                {/* Display error or success messages */}
                {error && <MessageBox variant="danger">{error}</MessageBox>}
                {success && <MessageBox variant="success">{success}</MessageBox>}

                <Form.Group className="mb-3" controlId="first_name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="last_name">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <div className="d-grid mb-3">
                    <Button type="submit" className="auth-button" disabled={!!success}>
                        Create Account
                    </Button>
                </div>
                <div className="auth-switch-link">
                    Already have an account?{' '}
                    <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
                </div>
            </Form>
        </div>
    );
}
