import "./App.css";
import Header from "./common/header/Header";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from "./components/dashboard/Dashboard";
import PokemonDetails from "./components/Pokemon-details";

function App() {
  return (
    
    <div className="App">
    <div>
      <Header />
      </div>
      <div className='wrapper'>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pokemon-app" element={<Dashboard />} />
        <Route path="/pokemon-app/pokemon/:name/:id/*" element={<PokemonDetails />} />
      </Routes>
        </Router>
        </div>
  </div>
  );
}

export default App;
