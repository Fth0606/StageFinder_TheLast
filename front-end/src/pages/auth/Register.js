import React, { useState } from 'react';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaUserGraduate } from 'react-icons/fa';
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

  const handleUserTypeSelect = (type) => {
    setFormData({
      ...formData,
      userType: type
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
      if (formData.userType === 'student') {
        navigate('/complete-profile-student');
      } else if (formData.userType === 'company') {
        navigate('/complete-profile-company');
      } else {
        navigate('/');
      }
    }
  };

  const inputStyle = {
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '12px',
    padding: '0.9rem 1.2rem',
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
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
        position: 'absolute', top: '5%', right: '10%', width: '350px', height: '350px',
        background: 'var(--accent-color)', filter: 'blur(120px)', opacity: '0.15', borderRadius: '50%', zIndex: -1
      }}></div>
      <div style={{
        position: 'absolute', bottom: '5%', left: '10%', width: '400px', height: '400px',
        background: 'var(--primary-color)', filter: 'blur(120px)', opacity: '0.15', borderRadius: '50%', zIndex: -1
      }}></div>

      <Row className="justify-content-center w-100 m-0">
        <Col md={10} lg={7} xl={6}>
          <div className="glass-panel" style={{ padding: '3rem 2.5rem', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
            <div className="text-center mb-5">
              <h2 style={{ color: 'var(--bg-dark)', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Rejoignez l'aventure
              </h2>
              <p style={{ color: '#64748b' }}>
                Créez votre compte StageFinder en quelques secondes.
              </p>
            </div>

            {(error || validationError) && (
              <Alert variant="danger" style={{ borderRadius: '12px', border: 'none', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                {validationError || error.message || 'Une erreur est survenue'}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>

              {/* Custom Radio Tabs for User Type */}
              <div className="mb-4" style={{ display: 'flex', gap: '15px' }}>
                <div
                  onClick={() => handleUserTypeSelect('student')}
                  style={{
                    flex: 1, padding: '15px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer',
                    background: formData.userType === 'student' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    border: formData.userType === 'student' ? '2px solid var(--primary-color)' : '2px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease', color: formData.userType === 'student' ? 'var(--primary-color)' : '#64748b'
                  }}
                >
                  <FaUserGraduate size={24} className="mb-2" />
                  <div style={{ fontWeight: '600' }}>Je suis Étudiant(e)</div>
                </div>

                <div
                  onClick={() => handleUserTypeSelect('company')}
                  style={{
                    flex: 1, padding: '15px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer',
                    background: formData.userType === 'company' ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
                    border: formData.userType === 'company' ? '2px solid var(--secondary-color)' : '2px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease', color: formData.userType === 'company' ? 'var(--secondary-color)' : '#64748b'
                  }}
                >
                  <FaBuilding size={24} className="mb-2" />
                  <div style={{ fontWeight: '600' }}>Je suis une Entreprise</div>
                </div>
              </div>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      <FaUser className="me-2" style={{ color: 'var(--primary-color)' }} />
                      Nom complet / Nom de l'entreprise
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jean Dupont / TechCorp"
                      required
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      <FaEnvelope className="me-2" style={{ color: 'var(--primary-color)' }} />
                      Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      required
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      <FaLock className="me-2" style={{ color: 'var(--primary-color)' }} />
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
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      <FaLock className="me-2" style={{ color: 'var(--primary-color)' }} />
                      Confirmation
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <button
                type="submit"
                className="w-100"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
                  border: 'none',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  boxShadow: '0 10px 20px rgba(236, 72, 153, 0.3)',
                  transition: 'all 0.3s ease',
                  marginTop: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(236, 72, 153, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(236, 72, 153, 0.3)';
                  }
                }}
              >
                {isLoading ? 'Création en cours...' : "S'inscrire"}
              </button>
            </Form>

            <div className="text-center mt-4 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <p style={{ color: '#64748b', margin: 0 }}>
                Vous avez déjà un compte ?{' '}
                <Link to="/login" style={{ fontWeight: '600', color: 'var(--primary-color)', textDecoration: 'none' }}>
                  Connectez-vous
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;