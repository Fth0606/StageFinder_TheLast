import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dropdownRef = useRef(null);

  // Track window width reactively
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isMobile = windowWidth <= 768;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    setMobileMenuOpen(false);
    if (user?.role === 'student') {
      navigate('/profile');
    } else if (user?.role === 'company') {
      navigate('/company/profile');
    } else if (user?.role === 'admin') {
      navigate('/admin/profile');
    }
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    transition: 'background 0.3s',
    fontSize: '1rem',
    display: 'block',
    width: '100%'
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)',
      padding: '0.8rem 1rem',
      boxShadow: '0 2px 15px rgba(0, 102, 204, 0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Brand */}
        <Link to="/" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '1.8rem' }}>💼</span>
          StageFinder
        </Link>

        {/* ===== DESKTOP NAV ===== */}
        {!isMobile && (
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Link to="/" style={linkStyle}>Accueil</Link>

            {isAuthenticated && user?.role === 'student' && (
              <>
                <Link to="/stages" style={linkStyle}>Rechercher</Link>
                <Link to="/mes-candidatures" style={linkStyle}>📋 Mes Candidatures</Link>
                <Link to="/messages" style={linkStyle}>✉️ Messages</Link>
              </>
            )}

            {isAuthenticated && user?.role === 'company' && (
              <>
                <Link to="/company/dashboard" style={linkStyle}>Tableau de bord</Link>
                <Link to="/company/post-stage" style={linkStyle}>Publier une offre</Link>
                <Link to="/company/applications" style={linkStyle}>Candidatures</Link>
                <Link to="/company/messages" style={linkStyle}>Messages</Link>
              </>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" style={linkStyle}>Dashboard</Link>
                <Link to="/admin/users" style={linkStyle}>Utilisateurs</Link>
                <Link to="/admin/stages" style={linkStyle}>Stages</Link>
                <Link to="/admin/companies" style={linkStyle}>Entreprises</Link>
              </>
            )}

            {/* Desktop Auth */}
            {isAuthenticated ? (
              <div ref={dropdownRef} style={{ position: 'relative', marginLeft: '10px' }}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: 'white',
                    padding: '8px 15px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  <span style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: '#00C853',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem'
                  }}>
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                  {user?.name?.split(' ')[0] || 'Profil'}
                  <span style={{ fontSize: '0.8rem' }}>▼</span>
                </button>

                {showDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '10px',
                    background: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                    minWidth: '200px',
                    zIndex: 1001
                  }}>
                    <div
                      onClick={handleProfileClick}
                      style={{
                        padding: '12px 15px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee',
                        color: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      Mon Profil
                    </div>

                    {user?.role === 'student' && (
                      <div
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/favorites');
                        }}
                        style={{
                          padding: '12px 15px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                          color: '#333',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <span>❤️</span>
                        Mes Favoris
                      </div>
                    )}

                    <div
                      onClick={handleLogout}
                      style={{
                        padding: '12px 15px',
                        cursor: 'pointer',
                        color: '#dc3545',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      Déconnexion
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Link to="/login" style={linkStyle}>Connexion</Link>
                <Link to="/register">
                  <button style={{
                    backgroundColor: '#00C853',
                    color: 'white',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}>
                    Inscription
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ===== MOBILE HEADER BUTTONS ===== */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {!isAuthenticated && (
              <Link to="/login" style={linkStyle}>Connexion</Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '5px'
              }}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        )}

        {/* ===== MOBILE DROPDOWN MENU ===== */}
        {isMobile && mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '50px',
            right: 0,
            background: 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)',
            width: '250px',
            padding: '15px',
            borderRadius: '0 0 0 10px',
            boxShadow: '-5px 5px 15px rgba(0,0,0,0.2)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
          }}>
            <Link to="/" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
              Accueil
            </Link>

            {isAuthenticated && user?.role === 'student' && (
              <>
                <Link to="/stages" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                  Rechercher
                </Link>
                <Link to="/mes-candidatures" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                  Mes Candidatures
                </Link>
                <Link to="/messages" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                  Messages
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'company' && (
              <>
                <Link to="/company/dashboard" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                  Tableau de bord
                </Link>
                <Link to="/company/post-stage" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                  Publier une offre
                </Link>
                <Link to="/company/applications" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                  Candidatures
                </Link>
                <Link to="/company/messages" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                  Messages
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/admin/users" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                  Utilisateurs
                </Link>
                <Link to="/admin/stages" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                  Stages
                </Link>
                <Link to="/admin/companies" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                  Entreprises
                </Link>
              </>
            )}

            {/* Mobile Auth */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: '10px', paddingTop: '10px' }}>
              {isAuthenticated ? (
                <>
                  <div style={{ color: 'white', padding: '8px 12px' }}>
                    <strong>{user?.name}</strong>
                  </div>
                  <div
                    onClick={handleProfileClick}
                    style={{ ...linkStyle, cursor: 'pointer' }}
                  >
                    👤 Mon Profil
                  </div>
                  {user?.role === 'student' && (
                    <Link to="/favorites" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                      ❤️ Mes Favoris
                    </Link>
                  )}
                  <div
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    style={{ ...linkStyle, color: '#ff6b6b', cursor: 'pointer' }}
                  >
                    Déconnexion
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                    Connexion
                  </Link>
                  <Link to="/register" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;