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
        case "FETCH_REQUEST":
            return {...state, loading: true};
        case "FETCH_SUCCESS":
            return {...state, info: action.payload, loading: false};
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload};
        case "UPDATE_INFO_REQUEST":
            return {...state, loading: true, success: false};
        case "UPDATE_INFO_SUCCESS":
            return {...state, loading: false, success: true};
        case "UPDATE_INFO_FAIL":
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

export default function ProfileScreen() {
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;


    const [firstname, setFirstname] = useState();
    const [lastname, setLastname] = useState();
    const [email, setEmail] = useState();

    const navigate = useNavigate();

    const [{loading, success, error, info}, dispatch] = useReducer(reducer, initialState);
    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch({type: "UPDATE_INFO_REQUEST"});
        try {
            await axios.put(`${URL}/user/${userInfo.id}/update-info`, {
                    firstname,
                    lastname,
                    email
                },
                {
                    headers: {Authorization: `Bearer ${userInfo.token}`},
                });
            dispatch({type: "UPDATE_INFO_SUCCESS"});
        } catch (error) {
            dispatch({type: "UPDATE_INFO_FAIL", payload: error.message});
            throw error
        }
    };

    const getInfo = async () => {
        dispatch({type: "FETCH_REQUEST"});
        try {
            const {data} = await axios.get(`${URL}/user/info`, {
                headers: {Authorization: `Bearer ${userInfo.token}`},
            });
            dispatch({type: "FETCH_SUCCESS", payload: data});
            setFirstname(data.firstname);
            setLastname(data.lastname);
            setEmail(data.email);
        } catch (error) {
            dispatch({type: "FETCH_FAIL", payload: error.message});
        }
    };

    useEffect(() => {
        getInfo();
        if (success) {
            alert("Successfully update your profile");
            userInfo.firstname = firstname;
            userInfo.lastname = lastname;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            navigate("/");
            window.location.reload();
        }
    }, [success, dispatch]);

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
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3' controlId='email'>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3' controlId='password'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                {/*<Form.Group className='mb-3' controlId='confirmPassword'>*/}
                {/*    <Form.Label>Confirm Password</Form.Label>*/}
                {/*    <Form.Control*/}
                {/*        value={confirmPassword}*/}
                {/*        onChange={(e) => setConfirmPassword(e.target.value)}*/}
                {/*        required />*/}
                {/*</Form.Group>*/}
                <div className='mb-3'>
                    <Button type='submit'>Update</Button>
                </div>
            </form>

        </div>
    );
}
