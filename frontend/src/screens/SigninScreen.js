import React, { useContext, useState } from "react";
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
  
  const apiUrl = 'localhost:8080/api/authenticate';

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(apiUrl, {
        username,  
        password,
      });
      ctxDispatch({type: 'USER_SINGIN', payload: data});
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      alert('Invalid email or password');
    }
  };

  return (
    <Container className='small-container'>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <div className='signin-form'>
        <h1 className='mb-3'>Sign In</h1>
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

          <Button className="btn-primary" type="submit">
            Sign In
          </Button>
        </Form>
        <div className="mt-3">
          New customer?{' '}
          <Link to={`/register?redirect=${redirect}`}>Create your account</Link>
        </div>
      </div>
    </Container>
  )

}