import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSave, FaTimes, FaPlus, FaBuilding, FaGlobe, FaPhone, FaMapMarkerAlt, FaIndustry, FaCamera, FaFileAlt } from 'react-icons/fa';
import { updateUserProfile, fetchUserProfile } from '../../store/slices/userSlice';
import api from '../../services/api';

const CompanyEditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    location: '',
    description: '',
    website: '',
    phone: '',
  });

  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    const company = profile?.company || user?.company || {};
    setFormData({
      company_name: company.company_name || user?.name || '',
      industry: company.industry || '',
      location: company.location || '',
      description: company.description || '',
      website: company.website || '',
      phone: company.phone || '',
    });
  }, [user, profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setSubmitError('');

    const uploadData = new FormData();
    uploadData.append('photo', file);

    try {
      await api.post('/profile/upload-photo', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch(fetchUserProfile());
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Erreur lors de l\'upload du logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (formData.description.length < 10) {
      setSubmitError('La description doit contenir au moins 10 caractères');
      return;
    }

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

  const inputStyle = {
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '12px',
    padding: '0.9rem 1.2rem',
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
    transition: 'all 0.2s'
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg-light)', position: 'relative', overflow: 'hidden', padding: '4rem 0' }}>
      {/* Decorative background blobs */}
      <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px', background: 'var(--accent-color)', filter: 'blur(150px)', opacity: '0.07', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: '450px', height: '450px', background: 'var(--primary-color)', filter: 'blur(150px)', opacity: '0.07', borderRadius: '50%', zIndex: 0 }}></div>

      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <div className="glass-panel" style={{ padding: '3rem', background: 'white' }}>
              <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                <div>
                  <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)', letterSpacing: '-0.5px', margin: 0 }}>
                    Profil <span style={{ color: 'var(--accent-color)' }}>Entreprise</span>
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '1.1rem', margin: '5px 0 0 0' }}>Gérez l'identité visuelle et les détails de votre société</p>
                </div>
                <button onClick={() => navigate('/company/profile')} style={{ background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '12px', padding: '0.8rem 1.5rem', fontWeight: '600', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--bg-dark)'; e.currentTarget.style.color = 'var(--bg-dark)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}>Annuler</button>
              </div>

              {success && (
                <Alert variant="success" className="mb-4" style={{ borderRadius: '12px', border: 'none', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <strong>✅ Succès !</strong> Les informations de l'entreprise ont été mises à jour.
                </Alert>
              )}
              {submitError && (
                <Alert variant="danger" className="mb-4" style={{ borderRadius: '12px', border: 'none', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                  <strong>❌ Erreur :</strong> {submitError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="g-5">
                  {/* Logo Section */}
                  <Col lg={4} className="text-center">
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                      <div style={{
                        width: '180px', height: '180px', borderRadius: '30px',
                        background: 'linear-gradient(135deg, var(--accent-color), #0284c7)',
                        padding: '5px', boxShadow: '0 20px 40px rgba(14, 165, 233, 0.25)',
                        overflow: 'hidden'
                      }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '25px', overflow: 'hidden', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {profile?.company?.logo_path || user?.company?.logo_path ? (
                            <img src={`http://localhost:8000/storage/${profile?.company?.logo_path || user?.company?.logo_path}`} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <FaBuilding size={60} style={{ color: 'var(--accent-color)', opacity: 0.2 }} />
                          )}
                        </div>
                      </div>
                      <label htmlFor="logo-upload" style={{
                        position: 'absolute', bottom: '-10px', right: '-10px',
                        width: '50px', height: '50px', borderRadius: '15px',
                        background: 'white', border: '1px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s', color: 'var(--accent-color)'
                      }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.color = '#0284c7'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = 'var(--accent-color)'; }}>
                        {uploading ? <div className="spinner-border spinner-border-sm" role="status" /> : <FaCamera size={20} />}
                        <input type="file" id="logo-upload" hidden accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
                      </label>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                      <h6 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '10px' }}>Logo d'entreprise</h6>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>Utilisez un logo haute résolution. PNG ou JPG. Max 2MB.</p>
                    </div>
                  </Col>

                  {/* Fields Section */}
                  <Col lg={8}>
                    <h5 className="mb-4" style={{ fontWeight: '700', color: 'var(--bg-dark)', display: 'flex', alignItems: 'center' }}>
                      <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                        <FaBuilding size={16} />
                      </span>
                      Identité de l'entreprise
                    </h5>

                    <Form.Group className="mb-4">
                      <Form.Label style={{ fontWeight: '600', color: '#64748b', fontSize: '0.9rem' }}>Nom de l'entreprise *</Form.Label>
                      <Form.Control type="text" name="company_name" value={formData.company_name} onChange={handleChange} required placeholder="Ex: StageFinder Global" style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ fontWeight: '600', color: '#64748b', fontSize: '0.9rem' }}><FaIndustry className="me-2 text-muted" />Secteur d'activité</Form.Label>
                          <Form.Control type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="Informatique, Finance..." style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ fontWeight: '600', color: '#64748b', fontSize: '0.9rem' }}><FaMapMarkerAlt className="me-2 text-muted" />Siège social</Form.Label>
                          <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ville, Pays" style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ fontWeight: '600', color: '#64748b', fontSize: '0.9rem' }}><FaGlobe className="me-2 text-muted" />Site web</Form.Label>
                          <Form.Control type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://www.entreprise.com" style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ fontWeight: '600', color: '#64748b', fontSize: '0.9rem' }}><FaPhone className="me-2 text-muted" />Ligne directe</Form.Label>
                          <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+212 ..." style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-5">
                      <Form.Label style={{ fontWeight: '600', color: '#64748b', fontSize: '0.9rem' }}><FaFileAlt className="me-2 text-muted" />Description de l'entreprise *</Form.Label>
                      <Form.Control as="textarea" rows={6} name="description" value={formData.description} onChange={handleChange} placeholder="Présentez votre entreprise aux futurs stagiaires..." required style={{ ...inputStyle, resize: 'none' }} onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                      <Form.Text className="text-muted mt-2">
                        {formData.description.length} / 10 caractères minimum
                      </Form.Text>
                    </Form.Group>

                    <div style={{ marginTop: '2rem' }}>
                      <button type="submit" disabled={isLoading} className="btn-modern w-100" style={{ background: 'var(--accent-color)', color: 'white', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)' }}>
                        {isLoading ? <div className="spinner-border spinner-border-sm" role="status" /> : <FaSave />}
                        {isLoading ? 'Enregistrement...' : 'Enregistrer le profil entreprise'}
                      </button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CompanyEditProfile;