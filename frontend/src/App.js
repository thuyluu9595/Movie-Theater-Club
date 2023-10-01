import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import MovieScreen from './screens/MovieScreen';


export default function App(){
  return (
    <BrowserRouter>
      <div>
        <header>
          <Link href='/'>THC Theater</Link>
        </header>
        <main>
          <Routes>
            <Route path='/' element={<HomeScreen/>}/>
            <Route path='/movie/:slug' element={<MovieScreen/>}/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}