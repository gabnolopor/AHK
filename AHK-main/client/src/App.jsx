import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandPage from './pages/LandPage';
import BoxSelect from './pages/BoxSelect';
import Writings from './pages/Writings';
import ArtRoom from './pages/ArtRoom';
import PhotoRoom from './pages/PhotoRoom';
import Credits from './pages/Credits';
import MusicPage from './pages/MusicPage';
import Admin from './pages/Admin';
import PrivateRoute from './components/PrivateRoute';
import TestApi from './components/TestApi';
import TextContentPage from './components/TextContentPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandPage />} />
        <Route path="/testapi" element={<TestApi />} />
        <Route path="/boxselect" element={<BoxSelect />} />
        <Route path="/writings" element={<Writings />} />
        <Route path="/artroom" element={<ArtRoom />} />
        <Route path="/photoroom" element={<PhotoRoom />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/admin/login" element={<Admin />} />
        <Route 
          path="/admin" 
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          } 
        />
        <Route path="/text-content" element={<TextContentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;