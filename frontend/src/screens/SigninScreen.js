import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import Helmet from 'react-helmet';

export default function SigninScreen(){

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  return (
    <Container className='small-container'>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <div className='signin-form'>
        <h1 className='mb-3'>Sign In</h1>
        <Form>
          <Form.Group controlId='email'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              required
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
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