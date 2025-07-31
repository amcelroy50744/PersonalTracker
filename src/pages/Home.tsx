import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // Assuming you have a CSS file for styles

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Welcome to my personal page</h1>
      
      <div className="features">
        <div className="feature-card">
          <h2>Track Income</h2>
          <p>Record all your income sources and see your monthly totals.</p>
        </div>
        
        <div className="feature-card">
          <h2>Car Tracker</h2>
          <p>Keep track of car maintenance</p>
        </div>
        
        <div className="feature-card">
          <h2>Home Tracker</h2>
          <p>Keep track of home maintenance</p>
        </div>
      </div>
      
      <Link to="/budget" className="cta-button">
        Get Started with Budget Tracker
      </Link>
    </div>
  );
};

export default HomePage;