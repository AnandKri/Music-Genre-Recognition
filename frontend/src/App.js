import Header from './components/Header'
import InputSection from './components/InputSection'
import SongDetail from './components/SongDetail'
import SpotifySearchResults from './components/SpotifySearchResults'
import {Routes,Route, BrowserRouter} from 'react-router-dom';
import React from 'react';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header/>
        {/* <InputSection/> */}
        <Routes>
          <Route exact path='/' element={<InputSection/>} />
          <Route exact path='/results' element={<SpotifySearchResults/>} />
          <Route exact path='/results/detail/:songInfo' element={<SongDetail/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
