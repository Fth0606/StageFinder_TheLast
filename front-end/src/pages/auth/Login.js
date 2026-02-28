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

      // Redirect based on role
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
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      minHeight: '100vh',
      padding: '3rem 0'
    }}>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Col md={6} lg={5}>
          <Card className="shadow" style={{
            border: 'none',
            borderRadius: '20px',
            overflow: 'hidden'
          }}>
            <Card.Body className="p-5" style={{ background: 'white' }}>
              <h2 className="text-center mb-4" style={{ color: '#0066CC', fontWeight: 'bold' }}>
                Connexion
              </h2>
              <p className="text-center text-muted mb-4">
                Connectez-vous pour accéder à votre compte
              </p>

              {error && (
                <Alert variant="danger">
                  {error.message || 'Une erreur est survenue'}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaEnvelope className="me-2" />
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    required
                    style={{
                      border: '2px solid #e9ecef',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem'
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaLock className="me-2" />
                    Mot de passe
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={{
                      border: '2px solid #e9ecef',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem'
                    }}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={isLoading}
                  style={{
                    backgroundColor: '#0066CC',
                    borderColor: '#0066CC',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    fontWeight: '600'
                  }}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>

                <div className="text-center">
                  <Link to="/forgot-password" className="text-muted small">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </Form>

              <hr className="my-4" />

              <p className="text-center text-muted mb-0">
                Pas encore de compte ?{' '}
                <Link to="/register" className="fw-bold" style={{ color: '#0066CC' }}>
                  Inscrivez-vous
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;