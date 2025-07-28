import React, { useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    // Trim the query to avoid navigating with just whitespace
    if (query.trim()) {
      navigate(`/search/?query=${query}`);
    } else {
      // Optional: you could navigate to a general search/explore page
      // navigate('/search');
    }
    setQuery(''); // Clear the search box after submission
  };

  return (
      <Form className='d-flex' onSubmit={submitHandler}>
        {/* Custom container for the glassmorphism effect */}
        <div className="search-box-container">
          <FormControl
              type='text'
              name='q'
              id='q'
              className='search-input' // Custom class for styling
              value={query} // Controlled component
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search movies...'
              aria-label='Search Movies'
              aria-describedby='button-search'
          />
          <Button type='submit' id='button-search' className="search-button">
            <i className='fas fa-search'></i>
          </Button>
        </div>
      </Form>
  );
}