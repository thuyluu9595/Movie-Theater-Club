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
            return {...state, loading: false};
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload};

        case "UPDATE_REQUEST":
            return {...state, loadingUpdate: true, success: false}
        case "UPDATE_SUCCESS":
            return {...state, loadingUpdate: false, success: true}
        case "UPDATE_FAIL":
            return {...state, loadingUpdate: false, errorUpdate: action.payload}
        case "UPDATE_RESET":
            return {...state, loadingUpdate: false, success: false}
        default:
            return state;
    }
};

const initialState = {
    error: null,
    loadingUpdate: false,
    errorUpdate: null,
    success: false,
    loading: true
};

export default function Discount() {
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;
    const pm = "before-6pm"
    const tu = "tueday-special"

    const [tueday, setTueday] = useState();
    const [sixPM, setSixPM] = useState();

    const navigate = useNavigate();

    const [{loading, success, error, loadingUpdate, errorUpdate}, dispatch] = useReducer(reducer, initialState);
    const submitHandler = async (e, type) => {
        e.preventDefault();
        dispatch({type: "UPDATE_REQUEST"});
        try {
            const {data} = axios.put(`${URL}/discount/${type}`, {
                "percent": type === pm ? sixPM : tueday
            }, {
                headers: {Authorization: `Bearer ${userInfo.token}`}
            })
            dispatch({type: "UPDATE_SUCCESS"})
        } catch (error) {
            dispatch({type: "UPDATE_FAIL", payload: error.message})
        }

    };


    useEffect(() => {
        if (success) {
            alert("Successfully update discount");
            dispatch({type: "UPDATE_RESET"})
        }
        fetchDiscount();
    }, [success]);

    async function fetchDiscount() {
        dispatch({type: "FETCH_REQUEST"});
        try {
            const {data} = await axios.get(`${URL}/discount`, {
                headers: {Authorization: `Bearer ${userInfo.token}`}
            })
            dispatch({type: "FETCH_SUCCESS", payload: data})
            data.map((d) => {
                if (d.id === "TuedaySpecial") setTueday(d.percentDiscount);
                else setSixPM(d.percentDiscount);
            })
        } catch (error) {
            dispatch({type: "FETCH_FAIL", payload: error.message})
        }
    }

    return (
        <div className='container small-container'>
            <Helmet>
                <title>Profile Screen</title>
            </Helmet>
            <h1 className='my-3'>User Profile</h1>
            {loadingUpdate && <LoadingBox/>}
            {errorUpdate && <MessageBox variant={"danger"}>{errorUpdate}</MessageBox>}
            {loading ? <LoadingBox/> :
                error ? <MessageBox variant={"danger"}>{error}</MessageBox> :
                    <>
                        <Form onSubmit={e => submitHandler(e, tu)}>
                            <Form.Group controlId="price">
                                <Form.Label>Tueday Special</Form.Label>
                                <Form.Control
                                    type="number"
                                    step={0.01}
                                    min={0}
                                    onChange={(e) => setTueday(e.target.value)}
                                    value={tueday}
                                    required
                                />
                            </Form.Group>
                            <Button type={"submit"}>Update</Button>
                        </Form>

                        <Form onSubmit={e => submitHandler(e, pm)}>
                            <Form.Group controlId="price">
                                <Form.Label>Before 6 PM</Form.Label>
                                <Form.Control
                                    type="number"
                                    step={0.01}
                                    min={0}
                                    onChange={(e) => setSixPM(e.target.value)}
                                    value={sixPM}
                                    required
                                />
                            </Form.Group>
                            <Button type={"submit"}>Update</Button>
                        </Form>
                    </>}
        </div>
    );
}
