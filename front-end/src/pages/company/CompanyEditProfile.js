import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSave, FaTimes, FaBuilding, FaGlobe, FaPhone, FaMapMarkerAlt, FaIndustry } from 'react-icons/fa';
import { updateUserProfile } from '../../store/slices/userSlice';
import { fetchUserProfile } from '../../store/slices/userSlice';

const CompanyEditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    company_name: '',
    industry:     '',
    location:     '',
    description:  '',
    website:      '',
    phone:        '',
  });

  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    const company = profile?.company || user?.company || {};
    setFormData({
      company_name: company.company_name || user?.name || '',
      industry:     company.industry     || '',
      location:     company.location     || '',
      description:  company.description  || '',
      website:      company.website      || '',
      phone:        company.phone        || '',
    });
  }, [user, profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const result = await dispatch(updateUserProfile(formData));

    if (result.type === 'user/updateProfile/fulfilled') {
      setSuccess(true);
      setTimeout(() => navigate('/company/profile'), 2000);
    } else {
      const errMsg = result.payload?.message
        || Object.values(result.payload?.errors || {}).flat().join(' ')
        || 'Erreur lors de la mise à jour du profil';
      setSubmitError(errMsg);
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card style={{ border: 'none', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #00C853, #00A844)',
              color: 'white', borderRadius: '20px 20px 0 0', padding: '1.5rem'
            }}>
              <h3 className="mb-0">
                <FaBuilding className="me-2" />
                Modifier le profil entreprise
              </h3>
            </Card.Header>

            <Card.Body className="p-4">
              {success && (
                <Alert variant="success">
                  <strong>✅ Succès !</strong> Votre profil a été mis à jour avec succès.
                </Alert>
              )}
              {submitError && (
                <Alert variant="danger">
                  <strong>❌ Erreur :</strong> {submitError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>

                {/* Company Info */}
                <h5 className="mb-3" style={{ color: '#00C853' }}>
                  <FaBuilding className="me-2" />Informations de l'entreprise
                </h5>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom de l'entreprise *</Form.Label>
                      <Form.Control
                        type="text" name="company_name" value={formData.company_name}
                        onChange={handleChange} required
                        placeholder="StageFinder SARL"
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaIndustry className="me-1" />Secteur d'activité
                      </Form.Label>
                      <Form.Control
                        type="text" name="industry" value={formData.industry}
                        onChange={handleChange}
                        placeholder="Informatique, Finance, Marketing..."
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaMapMarkerAlt className="me-1" />Localisation
                      </Form.Label>
                      <Form.Control
                        type="text" name="location" value={formData.location}
                        onChange={handleChange}
                        placeholder="Casablanca, Maroc"
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaGlobe className="me-1" />Site web
                      </Form.Label>
                      <Form.Control
                        type="text" name="website" value={formData.website}
                        onChange={handleChange}
                        placeholder="https://www.monentreprise.ma"
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                        <Form.Label>
                            <FaPhone className="me-2 text-success" />Téléphone
                        </Form.Label>
                        <Form.Control
                            type="text" name="phone" value={formData.phone}
                            onChange={handleChange}
                            placeholder="+212 00 000 00 00"
                            style={{ borderRadius: '10px' }}
                        />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Description de l'entreprise</Form.Label>
                  <Form.Control
                    as="textarea" rows={5} name="description" value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez votre entreprise, vos activités, votre culture..."
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>

                <hr className="my-4" />

                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/company/profile')}
                    style={{ borderRadius: '10px', padding: '0.75rem 1.5rem' }}
                  >
                    <FaTimes className="me-2" />Annuler
                  </Button>
                  <Button
                    type="submit" disabled={isLoading}
                    style={{ backgroundColor: '#00C853', borderColor: '#00C853', borderRadius: '10px', padding: '0.75rem 1.5rem', color: 'white' }}
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

export default CompanyEditProfile;