import React from 'react';
import { Link } from 'react-router-dom';

const TestNavbar = () => {
  return (
    <div style={{
      backgroundColor: '#0066CC',
      padding: '15px',
      color: 'white'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px' }}>
          StageFinder
        </Link>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Accueil
          </Link>
          <Link to="/stages" style={{ color: 'white', textDecoration: 'none' }}>
            Offres
          </Link>
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
            Connexion
          </Link>
          <Link to="/register">
            <button style={{
              backgroundColor: '#00C853',
              color: 'white',
              border: 'none',
              padding: '5px 15px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Inscription
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestNavbar;