import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Helmet from 'react-helmet';
import axios from 'axios';
import { Store } from "../Stores";

export default function SigninScreen(){
  const navigate = useNavigate();

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
 
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch} = useContext(Store);
  const {userInfo} = state;
  
  

  

  const submitHandler = async (e) => {
    const apiUrl = 'http://localhost:8080/api/authenticate';
    e.preventDefault();
    try {
      console.log(1);
      const { data } = await axios.post(apiUrl, {
        username,  
        password,
      });
      console.log(2);

      ctxDispatch({type: 'USER_SINGIN', payload: data});
      console.log(3);

      localStorage.setItem('userInfo', JSON.stringify(data));
      console.log(4);

      navigate(redirect || '/');
      console.log(5);

    } catch (err) {
      alert('Invalid username or password');
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  

  return (
    <Container className='small-container'>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className='my-3'>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <div className='mb-3'>
          <Button type="submit">
            Sign In
          </Button>
        </div>
        <div className="mb-3">
        New customer?{' '}
        <Link to={`/register?redirect=${redirect}`}>Create your account</Link>
      </div>
      </Form>
    </Container>
  )
}