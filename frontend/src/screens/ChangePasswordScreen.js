import React, {useContext, useEffect, useReducer, useState} from 'react'
import {Store} from '../Stores'
import {Helmet} from 'react-helmet';
import {Form, Button} from 'react-bootstrap'
import axios from "axios";
import {URL} from "../Constants";
import {useNavigate} from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_PASSWORD_REQUEST":
            return {...state, loading: true, success: false};
        case "UPDATE_PASSWORD_SUCCESS":
            return {...state, loading: false, success: true};
        case "UPDATE_PASSWORD_FAIL":
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
};

const initialState = {
    error: null,
    success: false,
    loading: false
};

export default function ChangePasswordScreen() {
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;


    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const [{loading, success, error}, dispatch] = useReducer(reducer, initialState);
    const submitHandler = async (e) => {
        e.preventDefault();
        if (newPassword === confirmPassword) {
            dispatch({type: "UPDATE_PASSWORD_REQUEST"});
            try {
                await axios.put(`${URL}/user/changepw`, {
                        password,
                        newPassword
                    },
                    {
                        headers: {Authorization: `Bearer ${userInfo.token}`},
                    });
                dispatch({type: "UPDATE_PASSWORD_SUCCESS"});
            } catch (error) {
                dispatch({type: "UPDATE_PASSWORD_FAIL", payload: error.message});
            }
        } else {
            alert("Password not match.");
        }
    };


    useEffect(() => {
        if (success) {
            alert("Successfully update your password");
            navigate("/");
        }
    }, [success]);

    return (
        <div className='container small-container'>
            <Helmet>
                <title>Profile Screen</title>
            </Helmet>
            <h1 className='my-3'>User Profile</h1>
            {loading && <LoadingBox/>}
            {error && <MessageBox variant={"danger"}>{error}</MessageBox>}
            <form onSubmit={e => submitHandler(e)}>
                <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                        value={password}
                        type={"password"}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3' controlId='email'>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type={"password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3' controlId='password'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type={"password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <div className='mb-3'>
                    <Button type='submit'>Update</Button>
                </div>
            </form>

        </div>
    );
}
