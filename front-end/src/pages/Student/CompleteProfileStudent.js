import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaGraduationCap, FaMapMarkerAlt, FaLightbulb, FaSave } from 'react-icons/fa';
import { updateUserProfile } from '../../store/slices/userSlice';

const CompleteProfileStudent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    education: '',
    field: '',
    skills: [],
    location: ''
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill.trim()]
      });
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setValidationError('');

  if (!formData.bio.trim()) {
    setValidationError('La biographie est requise');
    return;
  }

  if (!formData.education.trim()) {
    setValidationError('Le niveau d\'études est requis');
    return;
  }

  if (!formData.field.trim()) {
    setValidationError('Le domaine d\'études est requis');
    return;
  }

  if (formData.skills.length === 0) {
    setValidationError('Ajoutez au moins une compétence');
    return;
  }

  if (!formData.location.trim()) {
    setValidationError('La localisation est requise');
    return;
  }

  // Prepare data for API
  const profileData = {
    university: formData.education,
    specialite: formData.field,
    skills: formData.skills,
    bio: formData.bio,
    location: formData.location
  };

  const result = await dispatch(completeStudentProfile(profileData));

  if (result.type === 'user/completeStudentProfile/fulfilled') {
    setSuccess(true);
    setTimeout(() => {
      navigate('/profile');
    }, 1500);
  } else {
    setValidationError(result.payload?.message || 'Erreur lors de la sauvegarde du profil');
  }
};

  return (
    <Container style={{
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      minHeight: '100vh',
      padding: '3rem 0'
    }}>
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
          }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #0066CC, #00C853)',
              color: 'white',
              borderRadius: '20px 20px 0 0',
              padding: '2rem'
            }}>
              <h3 className="mb-0">
                <FaUser className="me-2" />
                Complétez votre profil étudiant
              </h3>
              <p className="mb-0 mt-2" style={{ opacity: 0.9 }}>
                Ces informations aideront les entreprises à mieux vous connaître
              </p>
            </Card.Header>

            <Card.Body className="p-4">
              {success && (
                <Alert variant="success">
                  <strong>✅ Profil complété avec succès !</strong> Redirection en cours...
                </Alert>
              )}

              {validationError && (
                <Alert variant="danger" dismissible onClose={() => setValidationError('')}>
                  {validationError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Informations de base */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>
                  <FaUser className="me-2" />
                  Informations personnelles
                </h5>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom complet *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled
                        style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
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
                        disabled
                        style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Bio / À propos de moi *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Parlez-nous de vous, vos passions, vos objectifs professionnels..."
                    required
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>

                {/* Formation */}
                <h5 className="mb-3 mt-4" style={{ color: '#0066CC' }}>
                  <FaGraduationCap className="me-2" />
                  Formation
                </h5>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Niveau d'études *</Form.Label>
                      <Form.Select
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '10px' }}
                      >
                        <option value="">Sélectionnez...</option>
                        <option value="Bac">Bac</option>
                        <option value="Bac+1">Bac+1</option>
                        <option value="Bac+2 (BTS/DUT)">Bac+2 (BTS/DUT)</option>
                        <option value="Bac+3 (Licence)">Bac+3 (Licence)</option>
                        <option value="Bac+4">Bac+4</option>
                        <option value="Bac+5 (Master)">Bac+5 (Master)</option>
                        <option value="Bac+8 (Doctorat)">Bac+8 (Doctorat)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Domaine d'études *</Form.Label>
                      <Form.Control
                        type="text"
                        name="field"
                        value={formData.field}
                        onChange={handleChange}
                        placeholder="Ex: Informatique, Marketing, Finance..."
                        required
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Compétences */}
                <h5 className="mb-3 mt-4" style={{ color: '#0066CC' }}>
                  <FaLightbulb className="me-2" />
                  Compétences
                </h5>

                <Form.Group className="mb-3">
                  <Form.Label>Ajoutez vos compétences *</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      placeholder="Ex: JavaScript, Communication, Gestion de projet..."
                      style={{ borderRadius: '10px' }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                    <Button
                      variant="primary"
                      onClick={handleAddSkill}
                      style={{
                        backgroundColor: '#0066CC',
                        borderColor: '#0066CC',
                        borderRadius: '10px',
                        padding: '0.5rem 1.5rem'
                      }}
                    >
                      Ajouter
                    </Button>
                  </div>
                  <Form.Text className="text-muted">
                    Appuyez sur "Ajouter" ou Entrée pour ajouter une compétence
                  </Form.Text>
                </Form.Group>

                <div className="mb-4">
                  {formData.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      bg="primary"
                      className="me-2 mb-2"
                      style={{
                        backgroundColor: '#0066CC',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      {skill} ✕
                    </Badge>
                  ))}
                  {formData.skills.length === 0 && (
                    <p className="text-muted">Aucune compétence ajoutée</p>
                  )}
                </div>

                {/* Localisation */}
                <h5 className="mb-3 mt-4" style={{ color: '#0066CC' }}>
                  <FaMapMarkerAlt className="me-2" />
                  Localisation
                </h5>

                <Form.Group className="mb-4">
                  <Form.Label>Ville / Région *</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ex: Paris, Lyon, Casablanca..."
                    required
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>

                <hr className="my-4" />

                {/* Boutons */}
                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/login')}
                    style={{ borderRadius: '10px', padding: '0.75rem 1.5rem' }}
                  >
                    Plus tard
                  </Button>
                  <Button
                    variant="success"
                    type="submit"
                    disabled={isLoading}
                    style={{
                      backgroundColor: '#00C853',
                      borderColor: '#00C853',
                      borderRadius: '10px',
                      padding: '0.75rem 1.5rem'
                    }}
                  >
                    <FaSave className="me-2" />
                    {isLoading ? 'Enregistrement...' : 'Enregistrer mon profil'}
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

export default CompleteProfileStudent;