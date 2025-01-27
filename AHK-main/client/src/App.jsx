import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandPage from './pages/LandPage';
import BoxSelect from './pages/BoxSelect';
import MusicPage from './pages/MusicPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandPage />} />
        <Route path="/boxselect" element={<BoxSelect />} />
        <Route path="/music" element={<MusicPage />} />
      </Routes>
    </Router>
  );
}

export default App;
