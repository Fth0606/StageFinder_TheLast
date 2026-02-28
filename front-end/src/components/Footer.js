import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaBriefcase } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5>
              <FaBriefcase className="me-2" />
              StageFinder
            </h5>
            <p className="text-muted">
              La plateforme de référence pour trouver votre stage idéal. 
              Connectez-vous avec les meilleures entreprises et lancez votre carrière.
            </p>
            <div className="socialIcons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            </div>
          </Col>

          <Col md={2} className="mb-4">
            <h5>Navigation</h5>
            <ul className="footerLinks">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/stages">Rechercher</Link></li>
              <li><Link to="/about">À propos</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </Col>

          <Col md={3} className="mb-4">
            <h5>Pour les Étudiants</h5>
            <ul className="footerLinks">
              <li><Link to="/stages">Offres de stage</Link></li>
              <li><Link to="/conseils">Conseils carrière</Link></li>
              <li><Link to="/cv">Créer un CV</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </Col>

          <Col md={3} className="mb-4">
            <h5>Pour les Entreprises</h5>
            <ul className="footerLinks">
              <li><Link to="/recruter">Recruter</Link></li>
              <li><Link to="/tarifs">Tarifs</Link></li>
              <li><Link to="/success-stories">Success Stories</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </Col>
        </Row>

        <div className="footerBottom">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} StageFinder. Tous droits réservés.
          </p>
          <div className="mt-2">
            <Link to="/privacy" className="me-3">Politique de confidentialité</Link>
            <Link to="/terms" className="me-3">Conditions d'utilisation</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
