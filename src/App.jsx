import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SurahList from './components/SurahList';
import SurahPage from './components/SurahPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SurahList />} />
        <Route path="/quran/:surahName" element={<SurahPage />} />
      </Routes>
    </Router>
  );
};

export default App;
