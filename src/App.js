import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SurveyForm from './components/SurveyForm';
import SurveyResults from './components/SurveyResults';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Lifestyle Preferences Survey</h1>
            <div className="space-x-4">
              <Link to="/" className="hover:underline">Fill Out Survey</Link>
              <Link to="/results" className="hover:underline">View Results</Link>
            </div>
          </div>
        </nav>
        
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<SurveyForm />} />
            <Route path="/results" element={<SurveyResults />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;