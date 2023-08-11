import logo from "./logo.svg";
import "./App.css";
import Header from "./common/header/Header";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  return (
    <div className="App">
      <div>
        <Header />
      </div>
      <div className="mt-20">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
