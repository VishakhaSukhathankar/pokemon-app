import "./App.css";
import Header from "./common/header/Header";
import { Route, Routes, HashRouter } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import PokemonDetails from "./components/Pokemon-details";
import { useState } from "react";
function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <div className="App" style={{ background: isDark ? "#404245" : "#F3F9EF" }}>
      <div>
        <Header isDark={isDark} setIsDark={setIsDark} />
      </div>
      <div className="wrapper mt-20">
        <HashRouter>
          <Routes>
            <Route path="/" element={<Dashboard isDark={isDark} />} />
            <Route
              path="/pokemon-app"
              element={<Dashboard isDark={isDark} />}
            />
            <Route
              path="/pokemon-app/pokemon/:name/:id/*"
              element={<PokemonDetails isDark={isDark} />}
            />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}

export default App;
