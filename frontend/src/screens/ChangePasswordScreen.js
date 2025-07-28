import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Button, Container } from 'react-bootstrap';
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Store } from '../Stores';
import { URL } from "../Constants";
import { getError } from '../utils';
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_REQUEST":
            return { ...state, loadingUpdate: true, errorUpdate: '', successUpdate: '' };
        case "UPDATE_SUCCESS":
            return { ...state, loadingUpdate: false, successUpdate: 'Password updated successfully!' };
        case "UPDATE_FAIL":
            return { ...state, loadingUpdate: false, errorUpdate: action.payload };
        case "CLEAR_MESSAGES":
            return { ...state, errorUpdate: '', successUpdate: '' };
        case "PASSWORD_NO_MATCH":
            return { ...state, errorUpdate: 'New passwords do not match.' };
        default:
            return state;
    }
};

export default function ChangePasswordScreen() {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [{ loadingUpdate, successUpdate, errorUpdate }, dispatch] = useReducer(reducer, {
        loadingUpdate: false,
        successUpdate: '',
        errorUpdate: '',
    });

    useEffect(() => {
        if (successUpdate) {
            // After showing the success message, redirect the user
            setTimeout(() => {
                navigate("/profile");
            }, 2000);
        }
    }, [successUpdate, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch({ type: 'CLEAR_MESSAGES' }); // Clear previous messages

        if (newPassword !== confirmPassword) {
            dispatch({ type: 'PASSWORD_NO_MATCH' });
            return;
        }

        dispatch({ type: "UPDATE_REQUEST" });
        try {
            await axios.put(`${URL}/user/changepw`, {
                password,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: "UPDATE_SUCCESS" });
        } catch (error) {
            dispatch({ type: "UPDATE_FAIL", payload: getError(error) });
        }
    };

    return (
        // Reusing the auth-container for a consistent look
        <div className='auth-container' style={{maxWidth: '450px'}}>
            <Helmet>
                <title>Change Password</title>
            </Helmet>
            <h1 className='auth-title'>Change Password</h1>

            <Form onSubmit={submitHandler}>
                {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                {successUpdate && <MessageBox variant="success">{successUpdate}</MessageBox>}

                <Form.Group className='mb-3' controlId='currentPassword'>
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3' controlId='newPassword'>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-4' controlId='confirmPassword'>
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <div className='d-grid'>
                    <Button type='submit' className="auth-button" disabled={loadingUpdate || !!successUpdate}>
                        {loadingUpdate ? <LoadingBox isButton={true} /> : 'Update Password'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
