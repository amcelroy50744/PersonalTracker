import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/Home";
import BudgetTracker from "./pages/BudgetTracker";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/budget">Budget Tracker</Link>
          </li>
        </ul>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/budget" element={<BudgetTracker />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
