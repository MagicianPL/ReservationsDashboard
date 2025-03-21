import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1 onClick={navigateToHome}>Dashboard Rezerwacji Hotelowych</h1>
        </div>
        <div className="header-actions">
          <div className="date-display">
            {new Date().toLocaleDateString('pl-PL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 