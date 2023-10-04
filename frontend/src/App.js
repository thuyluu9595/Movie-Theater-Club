import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import React from 'react';
import { Navbar, Nav, Container, Form} from 'react-bootstrap';
import  LinkContainer from 'react-router-bootstrap/LinkContainer';
import HomeScreen from './screens/HomeScreen';
import MovieScreen from './screens/MovieScreen';
import SigninScreen from './screens/SigninScreen';
import ShowTimeScreen from './screens/ShowTimeScreen';
import RegisterScreen from './screens/RegisterScreen';


export default function App(){
  return (
    <BrowserRouter>
      <div className='d-flex flex-column site-container'>
        <header>
          <Navbar style={{backgroundColor: '#9d1010', fontFamily: 'Luminari, fantasy', color: 'white'}}>
            <Container>
              <LinkContainer to='/'>
                <Navbar.Brand>THC Theater</Navbar.Brand>
              </LinkContainer>
              <Nav className='me-auto'>
                <Link to='/sidebar' className='nav-Link'>
                  Side Bar
                </Link>
              </Nav>
              <Nav className='d-flex justify-content-center align-items-center flex-grow-1'>
                <Form>
                  <input type='text' id='search' placeholder='Search...' className='form-control' />
                </Form>
            </Nav>
              <Nav className='ms-auto'>
                <Link to='/showtime' className='nav-Link'>
                  Show Time 
                </Link>
              </Nav>
              <Nav className='ms-2'>
                <Link to='/signin' className='nav-Link'>
                  Sign In
                </Link>
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className='mt-3'>
          <Routes>
            <Route path='/' element={<HomeScreen/>}/>
            <Route path='/movie/:slug' element={<MovieScreen/>}/>
            <Route path='/signin' element={<SigninScreen/>}/>
            <Route path='/showtime' element={<ShowTimeScreen/>}/>
            <Route path='/register' element={<RegisterScreen/>}/>
          </Routes>
          </Container>
        </main>
        <footer> 
          <Navbar style={{backgroundColor: '#9d1010', fontFamily: 'Luminari, fantasy', color: 'white'}}>
            <Container className='d-flex justify-content-center align-items-center flex-grow-1'>
              <div className='text-center'>
                2003-2004 TCH Theater , Inc - All Right Reserver
              </div>
            </Container>
          </Navbar>
        </footer>
      </div>
    </BrowserRouter>
  )
}