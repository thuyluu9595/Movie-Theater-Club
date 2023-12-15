import React, { useState } from 'react'
import { Button, Form, FormControl, InputGroup, Nav } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    <Nav className='d-flex justify-content-center align-items-center flex-grow-1'>
      <Form className='d-flex justify-content-center' onSubmit={submitHandler}>
        <InputGroup>
          <FormControl
            type='text'
            name='q'
            id='q'
            onChange={(e) => setQuery(e.target.value)}
            placeholder='search...'
            aria-label='Search Movies'
            aria-describedby='button-search'
          ></FormControl>
          <Button variant='outline-primary' type='submit' id='button-search'>
            <i className='fas fa-search'></i>
          </Button>
        </InputGroup>
      </Form>
    </Nav>
  )
}
