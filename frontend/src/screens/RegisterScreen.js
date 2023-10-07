import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Helmet from 'react-helmet';

export default function RegisterScreen(){
  return (
    <Container className='small-container'>
    <Helmet>
      <title>Register</title>
    </Helmet>
    <div>
      <h1>Create an Account</h1>
      <Form>
      <Form.Group controlId="firstname">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              required
            />
          </Form.Group>
          <Form.Group controlId="lastname">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              required
            />
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              required
            />
          </Form.Group>

        <Form.Group controlId="email">
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
        <Button type="submit">Create Account</Button>
      </Form>

      <p>Already have an account? <Link to="/signin">Sign in</Link></p>
    </div>
    </Container>
  );
}
