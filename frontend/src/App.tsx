import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StyleManager from './components/StyleManager';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<StyleManager />} />
      </Routes>
    </Router>
  );
}

export default App;
