import React, { useState } from 'react';
import { Container, Row, Col, Form, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaGraduationCap, FaMapMarkerAlt, FaLightbulb, FaSave } from 'react-icons/fa';
import { completeStudentProfile } from '../../store/slices/userSlice';

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

    if (!formData.bio.trim()) { setValidationError('La biographie est requise'); return; }
    if (!formData.education.trim()) { setValidationError('Le niveau d\'études est requis'); return; }
    if (!formData.field.trim()) { setValidationError('Le domaine d\'études est requis'); return; }
    if (formData.skills.length === 0) { setValidationError('Ajoutez au moins une compétence'); return; }
    if (!formData.location.trim()) { setValidationError('La localisation est requise'); return; }

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
      setTimeout(() => { navigate('/profile'); }, 1500);
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
        background: 'var(--primary-color)', filter: 'blur(120px)', opacity: '0.1', borderRadius: '50%', zIndex: -1
      }}></div>
      <div style={{
        position: 'absolute', bottom: '10%', left: '10%', width: '400px', height: '400px',
        background: 'var(--accent-color)', filter: 'blur(120px)', opacity: '0.1', borderRadius: '50%', zIndex: -1
      }}></div>

      <Row className="justify-content-center">
        <Col lg={8} xl={7}>
          <div className="glass-panel" style={{ padding: '3rem', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
            <div className="text-center mb-5 pb-3">
              <div style={{
                width: '70px', height: '70px', borderRadius: '20px',
                background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)'
              }}>
                <FaUser size={30} color="white" />
              </div>
              <h2 style={{ color: 'var(--bg-dark)', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Complétez votre profil
              </h2>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                Ces informations aideront les entreprises à mieux vous connaître
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
                <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                  1
                </span>
                Informations personnelles
              </h5>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>Nom complet</Form.Label>
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

              <Form.Group className="mb-5">
                <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>Bio / À propos de moi *</Form.Label>
                <Form.Control
                  as="textarea" rows={4} name="bio" value={formData.bio} onChange={handleChange}
                  placeholder="Parlez-nous de vous, vos passions, vos objectifs professionnels..."
                  required style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                />
              </Form.Group>

              <h5 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                  <FaGraduationCap size={16} />
                </span>
                Formation & Expérience
              </h5>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>Niveau d'études *</Form.Label>
                    <Form.Select
                      name="education" value={formData.education} onChange={handleChange} required
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                    >
                      <option value="">Sélectionnez...</option><option value="Bac">Bac</option><option value="Bac+1">Bac+1</option>
                      <option value="Bac+2 (BTS/DUT)">Bac+2 (BTS/DUT)</option><option value="Bac+3 (Licence)">Bac+3 (Licence)</option>
                      <option value="Bac+4">Bac+4</option><option value="Bac+5 (Master)">Bac+5 (Master)</option><option value="Bac+8 (Doctorat)">Bac+8 (Doctorat)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>Domaine d'études *</Form.Label>
                    <Form.Control
                      type="text" name="field" value={formData.field} onChange={handleChange}
                      placeholder="Ex: Informatique, Finance..." required style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-5">
                <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>Compétences *</Form.Label>
                <div className="d-flex gap-2 mb-3">
                  <Form.Control
                    type="text" value={currentSkill} onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Ex: React, Gestion de projet..." style={inputStyle}
                    onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                  />
                  <button type="button" onClick={handleAddSkill} style={{
                    background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', border: 'none',
                    borderRadius: '12px', padding: '0 1.5rem', fontWeight: '600', transition: 'all 0.2s', cursor: 'pointer'
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
                  >
                    Ajouter
                  </button>
                </div>
                <div>
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} style={{ backgroundColor: 'var(--primary-color)', padding: '8px 12px', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '8px', marginRight: '8px', marginBottom: '8px', fontWeight: '500' }} onClick={() => handleRemoveSkill(skill)}>
                      {skill} <span style={{ marginLeft: '4px', opacity: 0.7 }}>✕</span>
                    </Badge>
                  ))}
                  {formData.skills.length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Auncune compétence ajoutée</span>}
                </div>
              </Form.Group>

              <h5 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                  <FaMapMarkerAlt size={16} />
                </span>
                Localisation
              </h5>

              <Form.Group className="mb-5">
                <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.9rem' }}>Ville / Région *</Form.Label>
                <Form.Control
                  type="text" name="location" value={formData.location} onChange={handleChange}
                  placeholder="Ex: Paris, Lyon, Casablanca..." required style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                />
              </Form.Group>

              <hr style={{ margin: '2rem 0', borderColor: 'rgba(0,0,0,0.05)' }} />

              <div className="d-flex gap-3 justify-content-end">
                <button type="button" onClick={() => navigate('/login')} style={{
                  background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b',
                  borderRadius: '12px', padding: '1rem 2rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.color = 'var(--primary-color)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
                >
                  Plus tard
                </button>
                <button type="submit" disabled={isLoading} style={{
                  background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', border: 'none', color: 'white',
                  borderRadius: '12px', padding: '1rem 2rem', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)', transition: 'all 0.3s ease', opacity: isLoading ? 0.7 : 1
                }}
                  onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(99, 102, 241, 0.4)'; } }}
                  onMouseLeave={(e) => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(99, 102, 241, 0.3)'; } }}
                >
                  <FaSave className="me-2" />
                  {isLoading ? 'Enregistrement...' : 'Enregistrer mon profil'}
                </button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CompleteProfileStudent;