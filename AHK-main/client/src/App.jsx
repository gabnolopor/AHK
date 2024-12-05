import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandPage from './pages/LandPage';
import BoxSelect from './pages/BoxSelect';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandPage />} />
        <Route path="/boxselect" element={<BoxSelect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;