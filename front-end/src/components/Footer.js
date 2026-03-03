import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaBriefcase, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--bg-dark)', color: 'white', position: 'relative', overflow: 'hidden', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Decorative Background Elements */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', background: 'var(--primary-color)', filter: 'blur(150px)', opacity: '0.15', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '300px', height: '300px', background: 'var(--accent-color)', filter: 'blur(150px)', opacity: '0.15', borderRadius: '50%', zIndex: 0 }}></div>

      <Container style={{ position: 'relative', zIndex: 1 }} fluid="lg">
        <Row className="gy-5 mb-5">
          <Col lg={4} md={6}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: 'white' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.4)' }}>
                <FaBriefcase size={20} color="white" />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Stage<span style={{ color: 'var(--accent-color)' }}>Finder</span></span>
            </Link>
            <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '2rem', maxWidth: '300px' }}>
              La plateforme de référence pour trouver votre stage idéal. Connectez-vous avec les meilleures entreprises et lancez votre carrière dès aujourd'hui.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-color)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </Col>

          <Col lg={2} md={6}>
            <h5 style={{ fontWeight: '700', marginBottom: '1.5rem', fontSize: '1.1rem', color: 'white' }}>Navigation</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Accueil', path: '/' },
                { label: 'Rechercher un stage', path: '/stages' },
                { label: 'À propos de nous', path: '/about' },
                { label: 'Contact', path: '/contact' }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5 style={{ fontWeight: '700', marginBottom: '1.5rem', fontSize: '1.1rem', color: 'white' }}>Ressources</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Guide stagiaire', path: '/guide' },
                { label: 'Conseils CV & Entretien', path: '/conseils' },
                { label: 'Entreprises partenaires', path: '/partenaires' },
                { label: 'FAQ', path: '/faq' }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5 style={{ fontWeight: '700', marginBottom: '1.5rem', fontSize: '1.1rem', color: 'white' }}>Contact</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', color: '#94a3b8', fontSize: '0.95rem' }}>
                <FaMapMarkerAlt style={{ marginTop: '4px', marginRight: '10px', color: 'var(--primary-color)' }} />
                <span>Casablanca, Maroc<br />Technopark, Route de Nouasseur</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', fontSize: '0.95rem' }}>
                <FaEnvelope style={{ marginRight: '10px', color: 'var(--primary-color)' }} />
                <a href="mailto:contact@stagefinder.com" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>contact@stagefinder.com</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', fontSize: '0.95rem' }}>
                <FaPhone style={{ marginRight: '10px', color: 'var(--primary-color)' }} />
                <span>+212 5 22 00 00 00</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Footer Bottom */}
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container fluid="lg">
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
              <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
                &copy; {new Date().getFullYear()} StageFinder. Tous droits réservés.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', /* md-end visually via flex */ }}>
                <Link to="/privacy" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Politique de confidentialité</Link>
                <Link to="/terms" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Conditions d'utilisation</Link>
                <Link to="/cookies" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Cookies</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
