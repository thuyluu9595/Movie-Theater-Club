import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Helmet from 'react-helmet';

export default function RegisterScreen(){
  return (
    <Container className='small-container'>
    <Helmet>
      <title>Sign In</title>
    </Helmet>
    <div>
      <h1>Create an Account</h1>
      <Form>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            required
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            required
          />
        </Form.Group>

        <Button type="submit">Create Account</Button>
      </Form>

      <p>Already have an account? <Link to="/signin">Sign in</Link></p>
    </div>
    </Container>
  );
}
