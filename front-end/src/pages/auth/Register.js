import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { register } from '../../store/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const result = await dispatch(register(formData));
    
    if (result.type === 'auth/register/fulfilled') {
      // Rediriger vers la page appropriée selon le type d'utilisateur
      if (formData.userType === 'student') {
        navigate('/complete-profile-student');
      } else if (formData.userType === 'company') {
        navigate('/complete-profile-company');
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
      <Row className="justify-content-center align-items-center py-5">
        <Col md={8} lg={6}>
          <Card className="shadow" style={{
            border: 'none',
            borderRadius: '20px',
            overflow: 'hidden'
          }}>
            <Card.Body className="p-5" style={{ background: 'white' }}>
              <h2 className="text-center mb-4" style={{ color: '#0066CC', fontWeight: 'bold' }}>
                Inscription
              </h2>
              <p className="text-center text-muted mb-4">
                Créez votre compte StageFinder
              </p>

              {(error || validationError) && (
                <Alert variant="danger">
                  {validationError || error.message || 'Une erreur est survenue'}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaUser className="me-2" />
                    Nom complet
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                    required
                    style={{
                      border: '2px solid #e9ecef',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem'
                    }}
                  />
                </Form.Group>

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

                <Form.Group className="mb-3">
                  <Form.Label>Type de compte</Form.Label>
                  <Form.Select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    style={{
                      border: '2px solid #e9ecef',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem'
                    }}
                  >
                    <option value="student">Étudiant</option>
                    <option value="company">Entreprise</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Vous pourrez compléter votre profil après l'inscription
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
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
                    minLength={6}
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
                    Confirmer le mot de passe
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
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
                  variant="success"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={isLoading}
                  style={{
                    backgroundColor: '#00C853',
                    borderColor: '#00C853',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    fontWeight: '600'
                  }}
                >
                  {isLoading ? 'Inscription...' : "S'inscrire"}
                </Button>
              </Form>

              <hr className="my-4" />

              <p className="text-center text-muted mb-0">
                Vous avez déjà un compte ?{' '}
                <Link to="/login" className="fw-bold" style={{ color: '#0066CC' }}>
                  Connectez-vous
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;