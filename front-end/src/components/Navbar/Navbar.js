import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Track window width and scroll position
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    }
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

  const NavLinkItem = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} style={{
        color: isActive ? 'var(--accent-color)' : 'rgba(255,255,255,0.8)',
        textDecoration: 'none',
        padding: '8px 16px',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        fontSize: '0.95rem',
        fontWeight: isActive ? '600' : '400',
        background: isActive ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
      }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav style={{
      background: scrolled ? 'rgba(15, 23, 42, 0.85)' : 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
      padding: scrolled ? '0.8rem 1.5rem' : '1.2rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: scrolled ? '0 10px 30px -10px rgba(0,0,0,0.5)' : 'none'
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
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          letterSpacing: '-0.5px'
        }}>
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <span style={{ fontSize: '1.2rem', color: '#fff' }}>✦</span>
          </div>
          StageFinder
        </Link>

        {/* ===== DESKTOP NAV ===== */}
        {!isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            padding: '6px',
            borderRadius: '16px',
            gap: '4px'
          }}>
            {!isAuthenticated && <NavLinkItem to="/">Accueil</NavLinkItem>}

            {isAuthenticated && user?.role === 'student' && (
              <>
                <NavLinkItem to="/stages">Rechercher</NavLinkItem>
                <NavLinkItem to="/mes-candidatures">Candidatures</NavLinkItem>
              </>
            )}

            {isAuthenticated && user?.role === 'company' && (
              <>
                <NavLinkItem to="/company/dashboard">Tableau de bord</NavLinkItem>
                <NavLinkItem to="/company/post-stage">Publier</NavLinkItem>
                <NavLinkItem to="/company/applications">Candidatures</NavLinkItem>
              </>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <>
                <NavLinkItem to="/admin/dashboard">Dashboard</NavLinkItem>
                <NavLinkItem to="/admin/users">Utilisateurs</NavLinkItem>
                <NavLinkItem to="/admin/stages">Stages</NavLinkItem>
                <NavLinkItem to="/admin/companies">Entreprises</NavLinkItem>
              </>
            )}
          </div>
        )}

        {/* Desktop Auth */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', minWidth: '150px', justifyContent: 'flex-end' }}>
            {isAuthenticated ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    padding: '6px 16px 6px 6px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 10px rgba(236, 72, 153, 0.3)'
                  }}>
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                  {user?.name?.split(' ')[0] || 'Profil'}
                  <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
                </button>

                {showDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    minWidth: '220px',
                    zIndex: 1001,
                    overflow: 'hidden'
                  }}>
                    <div
                      onClick={handleProfileClick}
                      style={{
                        padding: '14px 20px',
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <span>👤</span> Mon Profil
                    </div>

                    {user?.role === 'student' && (
                      <div
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/favorites');
                        }}
                        style={{
                          padding: '14px 20px',
                          cursor: 'pointer',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <span>❤️</span> Mes Favoris
                      </div>
                    )}

                    <div
                      onClick={handleLogout}
                      style={{
                        padding: '14px 20px',
                        cursor: 'pointer',
                        color: '#fb7185',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(251, 113, 133, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ color: 'transparent', textShadow: '0 0 0 #fb7185' }}>🚪</span> Déconnexion
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Link to="/login" style={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.95rem',
                  transition: 'color 0.3s'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                >
                  Connexion
                </Link>
                <Link to="/register">
                  <button style={{
                    background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                    color: 'white',
                    border: 'none',
                    padding: '8px 24px',
                    borderRadius: '50px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.3)';
                    }}
                  >
                    S'inscrire
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ===== MOBILE HEADER BUTTONS ===== */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
            top: 'calc(100% + 15px)',
            right: 0,
            left: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'slideDown 0.3s ease-out forwards'
          }}>
            <style>
              {`
                @keyframes slideDown {
                  from { opacity: 0; transform: translateY(-10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}
            </style>
            {!isAuthenticated && <NavLinkItem to="/">Accueil</NavLinkItem>}

            {isAuthenticated && user?.role === 'student' && (
              <>
                <NavLinkItem to="/stages">Rechercher</NavLinkItem>
                <NavLinkItem to="/mes-candidatures">Mes Candidatures</NavLinkItem>
              </>
            )}

            {isAuthenticated && user?.role === 'company' && (
              <>
                <NavLinkItem to="/company/dashboard">Tableau de bord</NavLinkItem>
                <NavLinkItem to="/company/post-stage">Publier une offre</NavLinkItem>
                <NavLinkItem to="/company/applications">Candidatures</NavLinkItem>
              </>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <>
                <NavLinkItem to="/admin/dashboard">Dashboard</NavLinkItem>
                <NavLinkItem to="/admin/users">Utilisateurs</NavLinkItem>
                <NavLinkItem to="/admin/stages">Stages</NavLinkItem>
                <NavLinkItem to="/admin/companies">Entreprises</NavLinkItem>
              </>
            )}

            {/* Mobile Auth */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '15px', paddingTop: '15px' }}>
              {isAuthenticated ? (
                <>
                  <div style={{
                    color: 'white',
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    marginBottom: '10px'
                  }}>
                    <span style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: 'var(--primary-color)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>{user?.name?.charAt(0)}</span>
                    <strong>{user?.name}</strong>
                  </div>
                  <div onClick={handleProfileClick} style={{ cursor: 'pointer', padding: '10px 16px', color: 'rgba(255,255,255,0.8)' }}>
                    👤 Mon Profil
                  </div>
                  {user?.role === 'student' && (
                    <div onClick={() => { setMobileMenuOpen(false); navigate('/favorites'); }} style={{ cursor: 'pointer', padding: '10px 16px', color: 'rgba(255,255,255,0.8)' }}>
                      ❤️ Mes Favoris
                    </div>
                  )}
                  <div onClick={() => { handleLogout(); setMobileMenuOpen(false); }} style={{ color: '#fb7185', cursor: 'pointer', padding: '10px 16px' }}>
                    🚪 Déconnexion
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <NavLinkItem to="/login">Connexion</NavLinkItem>
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <button style={{
                      width: '100%',
                      background: 'var(--primary-color)',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      Inscription
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;