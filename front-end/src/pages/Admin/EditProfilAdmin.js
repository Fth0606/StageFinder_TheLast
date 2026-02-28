import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSave, FaTimes, FaUser } from 'react-icons/fa';
import { updateUserProfile } from '../../store/slices/userSlice';

const EditProfilAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.user || {});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validate password fields if user wants to change password
    if (formData.new_password || formData.confirm_password) {
      if (formData.new_password.length < 6) {
        setValidationError('Le nouveau mot de passe doit contenir au moins 6 caractères');
        return;
      }
      if (formData.new_password !== formData.confirm_password) {
        setValidationError('Les mots de passe ne correspondent pas');
        return;
      }
    }

    // Build payload — only send password fields if user filled them
    const dataToUpdate = {
      name:  formData.name,
      email: formData.email,
    };

    if (formData.new_password) {
      dataToUpdate.current_password = formData.current_password;
      dataToUpdate.password         = formData.new_password;
    }

    const result = await dispatch(updateUserProfile(dataToUpdate));

    if (result.type === 'user/updateProfile/fulfilled') {
      setSuccess(true);
      setTimeout(() => navigate('/admin/profile'), 2000);
    } else {
      setValidationError(result.payload?.message || 'Erreur lors de la mise à jour du profil');
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card style={{ border: 'none', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
              color: 'white',
              borderRadius: '20px 20px 0 0',
              padding: '1.5rem'
            }}>
              <h3 className="mb-0">
                <FaUser className="me-2" />
                Modifier mon profil
              </h3>
            </Card.Header>

            <Card.Body className="p-4">
              {success && (
                <Alert variant="success">
                  <strong>✅ Succès !</strong> Votre profil a été mis à jour.
                </Alert>
              )}
              {validationError && (
                <Alert variant="danger">{validationError}</Alert>
              )}

              <Form onSubmit={handleSubmit}>

                {/* Personal Info */}
                <h5 className="mb-3" style={{ color: '#9C27B0' }}>Informations personnelles</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom complet *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-4" />

                {/* Password Change */}
                <h5 className="mb-3" style={{ color: '#9C27B0' }}>Changer le mot de passe (optionnel)</h5>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mot de passe actuel</Form.Label>
                      <Form.Control
                        type="password"
                        name="current_password"
                        value={formData.current_password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nouveau mot de passe</Form.Label>
                      <Form.Control
                        type="password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        style={{ borderRadius: '10px' }}
                      />
                      <Form.Text className="text-muted">Minimum 6 caractères</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirmer le mot de passe</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-4" />

                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/admin/profile')}
                    style={{ borderRadius: '10px', padding: '0.75rem 1.5rem' }}
                  >
                    <FaTimes className="me-2" />Annuler
                  </Button>
                  <Button
                    variant="success"
                    type="submit"
                    disabled={isLoading}
                    style={{ backgroundColor: '#9C27B0', borderColor: '#9C27B0', borderRadius: '10px', padding: '0.75rem 1.5rem' }}
                  >
                    <FaSave className="me-2" />
                    {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfilAdmin;