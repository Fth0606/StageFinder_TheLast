import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { login } from '../../store/slices/authSlice';
import './Auth.module.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));

    if (result.type === 'auth/login/fulfilled') {
      const user = result.payload.user;

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'company') {
        navigate('/company/dashboard');
      } else if (user.role === 'student') {
        navigate('/profile');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <Container style={{
      minHeight: 'calc(100vh - 80px)',
      padding: '4rem 0',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Decorative background blobs */}
      <div style={{
        position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px',
        background: 'var(--primary-color)', filter: 'blur(100px)', opacity: '0.15', borderRadius: '50%', zIndex: -1
      }}></div>
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px',
        background: 'var(--secondary-color)', filter: 'blur(120px)', opacity: '0.15', borderRadius: '50%', zIndex: -1
      }}></div>

      <Row className="justify-content-center w-100 m-0">
        <Col md={8} lg={5}>
          <div className="glass-panel" style={{ padding: '3rem 2.5rem', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
            <div className="text-center mb-5">
              <div style={{
                width: '60px', height: '60px', borderRadius: '15px',
                background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)'
              }}>
                <span style={{ fontSize: '1.8rem', color: '#fff' }}>✨</span>
              </div>
              <h2 style={{ color: 'var(--bg-dark)', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Bon retour !
              </h2>
              <p style={{ color: '#64748b' }}>
                Connectez-vous pour accéder à votre espace
              </p>
            </div>

            {error && (
              <Alert variant="danger" style={{ borderRadius: '12px', border: 'none', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                {error.message || 'Une erreur est survenue'}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                  <FaEnvelope className="me-2" style={{ color: 'var(--primary-color)' }} />
                  Adresse Email
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  required
                  style={{
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    padding: '0.9rem 1.2rem',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem', margin: 0 }}>
                    <FaLock className="me-2" style={{ color: 'var(--primary-color)' }} />
                    Mot de passe
                  </Form.Label>
                  <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '500' }}>
                    Oublié ?
                  </Link>
                </div>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    padding: '0.9rem 1.2rem',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                />
              </Form.Group>

              <button
                type="submit"
                className="w-100"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                  border: 'none',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
                  transition: 'all 0.3s ease',
                  marginTop: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(99, 102, 241, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(99, 102, 241, 0.3)';
                  }
                }}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </Form>

            <div className="text-center mt-4 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <p style={{ color: '#64748b', margin: 0 }}>
                Nouveau sur StageFinder ?{' '}
                <Link to="/register" style={{ fontWeight: '600', color: 'var(--primary-color)', textDecoration: 'none' }}>
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;