import React, { useState } from 'react';
import { Container, Row, Col, Form, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaBuilding, FaGlobe, FaIndustry, FaFileAlt, FaSave } from 'react-icons/fa';
import { completeCompanyProfile } from '../../store/slices/userSlice';

const CompleteProfileCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    website: '',
    location: '',
    sector: [],
    description: ''
  });

  const [currentSector, setCurrentSector] = useState('');
  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState(false);

  const secteurOptions = [
    'Technologie', 'Finance', 'Marketing', 'Santé', 'Éducation',
    'Commerce', 'Industrie', 'Services', 'Transport', 'Immobilier',
    'Tourisme', 'Agriculture'
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

    if (!formData.website.trim()) { setValidationError('Le site web est requis'); return; }

    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(formData.website)) { setValidationError('Veuillez entrer une URL valide (ex: www.entreprise.com)'); return; }
    if (formData.sector.length === 0) { setValidationError('Ajoutez au moins un secteur d\'activité'); return; }
    if (!formData.description.trim()) { setValidationError('La description de l\'entreprise est requise'); return; }
    if (formData.description.length < 10) { setValidationError('La description doit contenir au moins 10 caractères'); return; }

    const profileData = {
      company_name: formData.name,
      industry: formData.sector.join(', '),
      location: formData.location || '',
      description: formData.description,
      website: formData.website,
    };

    const result = await dispatch(completeCompanyProfile(profileData));

    if (result.type === 'user/completeCompanyProfile/fulfilled') {
      setSuccess(true);
      setTimeout(() => { navigate('/company/profile'); }, 1500);
    } else {
      setValidationError(result.payload?.message || 'Erreur lors de la sauvegarde du profil');
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
      position: 'relative',
      zIndex: 1
    }}>
      {/* Decorative background blobs */}
      <div style={{
        position: 'absolute', top: '10%', right: '10%', width: '400px', height: '400px',
        background: 'var(--secondary-color)', filter: 'blur(120px)', opacity: '0.1', borderRadius: '50%', zIndex: -1
      }}></div>
      <div style={{
        position: 'absolute', bottom: '10%', left: '10%', width: '400px', height: '400px',
        background: 'var(--primary-color)', filter: 'blur(120px)', opacity: '0.1', borderRadius: '50%', zIndex: -1
      }}></div>

      <Row className="justify-content-center">
        <Col lg={8} xl={7}>
          <div className="glass-panel" style={{ padding: '3rem', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
            <div className="text-center mb-5 pb-3">
              <div style={{
                width: '70px', height: '70px', borderRadius: '20px',
                background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem', boxShadow: '0 10px 25px rgba(236, 72, 153, 0.4)'
              }}>
                <FaBuilding size={30} color="white" />
              </div>
              <h2 style={{ color: 'var(--bg-dark)', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Complétez votre profil
              </h2>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                Ces informations aideront les étudiants à mieux connaître votre entreprise
              </p>
            </div>

            {success && (
              <Alert variant="success" style={{ borderRadius: '12px', border: 'none', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <strong>✅ Profil complété avec succès !</strong> Redirection en cours...
              </Alert>
            )}

            {validationError && (
              <Alert variant="danger" dismissible onClose={() => setValidationError('')} style={{ borderRadius: '12px', border: 'none', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                {validationError}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <h5 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                  1
                </span>
                Informations de l'entreprise
              </h5>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>Nom de l'entreprise</Form.Label>
                    <Form.Control type="text" name="name" value={formData.name} disabled style={{ ...inputStyle, backgroundColor: '#f1f5f9', color: '#64748b' }} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} disabled style={{ ...inputStyle, backgroundColor: '#f1f5f9', color: '#64748b' }} />
                  </Form.Group>
                </Col>
              </Row>

              <h5 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                  <FaGlobe size={16} />
                </span>
                Présence en ligne
              </h5>

              <Form.Group className="mb-5">
                <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>Site web *</Form.Label>
                <Form.Control
                  type="text" name="website" value={formData.website} onChange={handleChange}
                  placeholder="https://www.votreentreprise.com" required style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--secondary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(236, 72, 153, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                />
              </Form.Group>


              <Form.Group className="mb-5">
                <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>Localisation</Form.Label>
                <Form.Control
                  type="text" name="location" value={formData.location} onChange={handleChange}
                  placeholder="Casablanca, Maroc" style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--secondary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(236, 72, 153, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                />
              </Form.Group>

              <h5 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                  <FaIndustry size={16} />
                </span>
                Secteur d'activité
              </h5>

              <Form.Group className="mb-5">
                <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>Sélectionnez vos secteurs d'activité *</Form.Label>
                <div className="d-flex gap-2 mb-3">
                  <Form.Select
                    value={currentSector} onChange={(e) => setCurrentSector(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--secondary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(236, 72, 153, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                  >
                    <option value="">Choisir un secteur...</option>
                    {secteurOptions.map((sector, index) => (
                      <option key={index} value={sector}>{sector}</option>
                    ))}
                  </Form.Select>
                  <button type="button" onClick={handleAddSector} style={{
                    background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)', border: 'none',
                    borderRadius: '12px', padding: '0 1.5rem', fontWeight: '600', transition: 'all 0.2s', cursor: 'pointer'
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(236, 72, 153, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(236, 72, 153, 0.1)'}
                  >
                    Ajouter
                  </button>
                </div>
                <div>
                  {formData.sector.map((sector, index) => (
                    <Badge key={index} style={{ backgroundColor: 'var(--secondary-color)', padding: '8px 12px', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '8px', marginRight: '8px', marginBottom: '8px', fontWeight: '500' }} onClick={() => handleRemoveSector(sector)}>
                      {sector} <span style={{ marginLeft: '4px', opacity: 0.7 }}>✕</span>
                    </Badge>
                  ))}
                  {formData.sector.length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Aucun secteur ajouté</span>}
                </div>
              </Form.Group>

              <h5 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                  <FaFileAlt size={16} />
                </span>
                À propos de votre entreprise
              </h5>

              <Form.Group className="mb-5">
                <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>Description de l'entreprise *</Form.Label>
                <Form.Control
                  as="textarea" rows={6} name="description" value={formData.description} onChange={handleChange}
                  placeholder="Décrivez votre entreprise, sa mission, ses valeurs, son domaine d'expertise... (minimum 10 caractères)"
                  required style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--secondary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(236, 72, 153, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                />
                <Form.Text className="text-muted mt-2 d-block">
                  {formData.description.length} / 10 caractères minimum
                </Form.Text>
              </Form.Group>

              <hr style={{ margin: '2rem 0', borderColor: 'rgba(0,0,0,0.05)' }} />

              <div className="d-flex gap-3 justify-content-end">
                <button type="button" onClick={() => navigate('/login')} style={{
                  background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b',
                  borderRadius: '12px', padding: '1rem 2rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--secondary-color)'; e.currentTarget.style.color = 'var(--secondary-color)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
                >
                  Plus tard
                </button>
                <button type="submit" disabled={isLoading} style={{
                  background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))', border: 'none', color: 'white',
                  borderRadius: '12px', padding: '1rem 2rem', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 10px 20px rgba(236, 72, 153, 0.3)', transition: 'all 0.3s ease', opacity: isLoading ? 0.7 : 1
                }}
                  onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(236, 72, 153, 0.4)'; } }}
                  onMouseLeave={(e) => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(236, 72, 153, 0.3)'; } }}
                >
                  <FaSave className="me-2" />
                  {isLoading ? 'Enregistrement...' : 'Enregistrer le profil'}
                </button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CompleteProfileCompany;