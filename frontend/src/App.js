import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import MovieScreen from './screens/MovieScreen';
import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import  LinkContainer from 'react-router-bootstrap/LinkContainer';


export default function App(){
  return (
    <BrowserRouter>
      <div className='d-flex flex-column site-container'>
        <header>
          <Navbar bg='dark' variant='dark'>
            <Container>
              <LinkContainer to='/'>
                <Navbar.Brand>THC Theater</Navbar.Brand>
              </LinkContainer>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container>
          <Routes>
            <Route path='/' element={<HomeScreen/>}/>
            <Route path='/movie/:slug' element={<MovieScreen/>}/>
          </Routes>
          </Container>
        </main>
        <footer> 
          <div className='text-center'>
            2003-2004 TCH Theater , Inc - All Right Reserver
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}