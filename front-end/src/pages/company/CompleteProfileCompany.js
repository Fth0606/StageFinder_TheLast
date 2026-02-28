import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaBuilding, FaGlobe, FaIndustry, FaFileAlt, FaSave } from 'react-icons/fa';
import { updateUserProfile, completeCompanyProfile } from '../../store/slices/userSlice';

const CompleteProfileCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    website: '',
    sector: [],
    description: ''
  });

  const [currentSector, setCurrentSector] = useState('');
  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState(false);

  const secteurOptions = [
    'Technologie',
    'Finance',
    'Marketing',
    'Santé',
    'Éducation',
    'Commerce',
    'Industrie',
    'Services',
    'Transport',
    'Immobilier',
    'Tourisme',
    'Agriculture'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSector = () => {
    if (currentSector && !formData.sector.includes(currentSector)) {
      setFormData({
        ...formData,
        sector: [...formData.sector, currentSector]
      });
      setCurrentSector('');
    }
  };

  const handleRemoveSector = (sectorToRemove) => {
    setFormData({
      ...formData,
      sector: formData.sector.filter(s => s !== sectorToRemove)
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setValidationError('');

  if (!formData.website.trim()) {
    setValidationError('Le site web est requis');
    return;
  }

  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (!urlPattern.test(formData.website)) {
    setValidationError('Veuillez entrer une URL valide (ex: www.entreprise.com)');
    return;
  }

  if (formData.sector.length === 0) {
    setValidationError('Ajoutez au moins un secteur d\'activité');
    return;
  }

  if (!formData.description.trim()) {
    setValidationError('La description de l\'entreprise est requise');
    return;
  }

  if (formData.description.length < 20) {
    setValidationError('La description doit contenir au moins 20 caractères');
    return;
  }

  // Prepare data for API
  const profileData = {
    company_name: formData.name,
    industry: formData.sector.join(', '),
    location: formData.location,
    description: formData.description,
    website: formData.website,
  };

  const result = await dispatch(completeCompanyProfile(profileData));

  if (result.type === 'user/completeCompanyProfile/fulfilled') {
    setSuccess(true);
    setTimeout(() => {
      navigate('/company/profile');
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
              background: 'linear-gradient(135deg, #00C853, #00A844)',
              color: 'white',
              borderRadius: '20px 20px 0 0',
              padding: '2rem'
            }}>
              <h3 className="mb-0">
                <FaBuilding className="me-2" />
                Complétez votre profil entreprise
              </h3>
              <p className="mb-0 mt-2" style={{ opacity: 0.9 }}>
                Ces informations aideront les étudiants à mieux connaître votre entreprise
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
                <h5 className="mb-3" style={{ color: '#00C853' }}>
                  <FaBuilding className="me-2" />
                  Informations de l'entreprise
                </h5>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom de l'entreprise *</Form.Label>
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

                {/* Site web */}
                <h5 className="mb-3 mt-4" style={{ color: '#00C853' }}>
                  <FaGlobe className="me-2" />
                  Présence en ligne
                </h5>

                <Form.Group className="mb-4">
                  <Form.Label>Site web *</Form.Label>
                  <Form.Control
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.votreentreprise.com"
                    required
                    style={{ borderRadius: '10px' }}
                  />
                  <Form.Text className="text-muted">
                    Incluez http:// ou https:// si possible
                  </Form.Text>
                </Form.Group>

                {/* Secteur d'activité */}
                <h5 className="mb-3 mt-4" style={{ color: '#00C853' }}>
                  <FaIndustry className="me-2" />
                  Secteur d'activité
                </h5>

                <Form.Group className="mb-3">
                  <Form.Label>Sélectionnez vos secteurs d'activité *</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Select
                      value={currentSector}
                      onChange={(e) => setCurrentSector(e.target.value)}
                      style={{ borderRadius: '10px' }}
                    >
                      <option value="">Choisir un secteur...</option>
                      {secteurOptions.map((sector, index) => (
                        <option key={index} value={sector}>
                          {sector}
                        </option>
                      ))}
                    </Form.Select>
                    <Button
                      variant="success"
                      onClick={handleAddSector}
                      style={{
                        backgroundColor: '#00C853',
                        borderColor: '#00C853',
                        borderRadius: '10px',
                        padding: '0.5rem 1.5rem'
                      }}
                    >
                      Ajouter
                    </Button>
                  </div>
                  <Form.Text className="text-muted">
                    Vous pouvez ajouter plusieurs secteurs d'activité
                  </Form.Text>
                </Form.Group>

                <div className="mb-4">
                  {formData.sector.map((sector, index) => (
                    <Badge
                      key={index}
                      bg="success"
                      className="me-2 mb-2"
                      style={{
                        backgroundColor: '#00C853',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleRemoveSector(sector)}
                    >
                      {sector} ✕
                    </Badge>
                  ))}
                  {formData.sector.length === 0 && (
                    <p className="text-muted">Aucun secteur ajouté</p>
                  )}
                </div>

                {/* Description */}
                <h5 className="mb-3 mt-4" style={{ color: '#00C853' }}>
                  <FaFileAlt className="me-2" />
                  À propos de votre entreprise
                </h5>

                <Form.Group className="mb-4">
                  <Form.Label>Description de l'entreprise *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez votre entreprise, sa mission, ses valeurs, son domaine d'expertise... (minimum 20 caractères)"
                    required
                    style={{ borderRadius: '10px' }}
                  />
                  <Form.Text className="text-muted">
                    {formData.description.length} / 20 caractères minimum
                  </Form.Text>
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
                    {isLoading ? 'Enregistrement...' : 'Enregistrer le profil'}
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

export default CompleteProfileCompany;