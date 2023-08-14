import "./App.css";
import Header from "./common/header/Header";
import { Route, Routes, HashRouter } from 'react-router-dom';
import Dashboard from "./components/dashboard/Dashboard";
import PokemonDetails from "./components/Pokemon-details";

function App() {
  return (
    
    <div className="App">
    <div>
      <Header />
      </div>
      <div className='wrapper'>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pokemon-app" element={<Dashboard />} />
        <Route path="/pokemon-app/pokemon/:name/:id/*" element={<PokemonDetails />} />
      </Routes>
        </HashRouter>
        </div>
  </div>
  );
}

export default App;
