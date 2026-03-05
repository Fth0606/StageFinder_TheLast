import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSave, FaTimes, FaPlus, FaUser, FaGraduationCap, FaBriefcase, FaCamera, FaTrash, FaCheckCircle, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { updateUserProfile, fetchUserProfile } from '../../store/slices/userSlice';
import api from '../../services/api';

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
    education: '',
    field: '',
    skills: [],
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const s = profile?.student || user?.student || {};
      let skills = s?.skills || [];
      if (typeof skills === 'string') {
        try { skills = JSON.parse(skills); } catch { skills = []; }
      }

      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: profile?.bio || user.bio || '',
        phone: s?.phone || '',
        location: s?.location || '',
        education: s?.university || '',
        field: s?.specialite || '',
        skills: Array.isArray(skills) ? skills : [],
      });
    }
  }, [user, profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    const skill = currentSkill.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSubmitError('Veuillez sélectionner une image valide.');
      return;
    }

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
      setSubmitError(err.response?.data?.message || 'Erreur lors de l\'upload de la photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const result = await dispatch(updateUserProfile(formData));

    if (result.type === 'user/updateProfile/fulfilled') {
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
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
    padding: '0.8rem 1.2rem',
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
    transition: 'all 0.2s'
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg-light)', position: 'relative', overflow: 'hidden', padding: '4rem 0' }}>
      {/* Decorative background blobs */}
      <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px', background: 'var(--primary-color)', filter: 'blur(150px)', opacity: '0.07', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: '450px', height: '450px', background: 'var(--secondary-color)', filter: 'blur(150px)', opacity: '0.07', borderRadius: '50%', zIndex: 0 }}></div>

      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <div className="glass-panel" style={{ padding: '3rem', background: 'white' }}>
              <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                <div>
                  <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)', letterSpacing: '-0.5px', margin: 0 }}>
                    Modifier mon <span style={{ color: 'var(--primary-color)' }}>Profil</span>
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '1.1rem', margin: '5px 0 0 0' }}>Mettez à jour vos informations et votre CV</p>
                </div>
                <div className="d-flex gap-2">
                  <button onClick={() => navigate('/profile')} style={{ background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '12px', padding: '0.8rem 1.5rem', fontWeight: '600', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--bg-dark)'; e.currentTarget.style.color = 'var(--bg-dark)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}>Annuler</button>
                </div>
              </div>

              {success && (
                <Alert variant="success" className="mb-4" style={{ borderRadius: '12px', border: 'none', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <strong>✅ Succès !</strong> Vos modifications ont été enregistrées.
                </Alert>
              )}
              {submitError && (
                <Alert variant="danger" className="mb-4" style={{ borderRadius: '12px', border: 'none', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                  <strong>❌ Erreur :</strong> {submitError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="g-5">
                  {/* Photo Section */}
                  <Col lg={4} className="text-center">
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                      <div style={{
                        width: '180px', height: '180px', borderRadius: '40px',
                        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                        padding: '5px', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.25)',
                        overflow: 'hidden'
                      }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '35px', overflow: 'hidden', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {user?.profile_picture ? (
                            <img src={`http://localhost:8000/storage/${user.profile_picture}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--primary-color)', opacity: 0.3 }}>{user?.name?.charAt(0)}</span>
                          )}
                        </div>
                      </div>
                      <label htmlFor="photo-upload" style={{
                        position: 'absolute', bottom: '-10px', right: '-10px',
                        width: '50px', height: '50px', borderRadius: '15px',
                        background: 'white', border: '1px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s', color: 'var(--primary-color)'
                      }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.color = 'var(--secondary-color)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = 'var(--primary-color)'; }}>
                        {uploading ? <div className="spinner-border spinner-border-sm" role="status" /> : <FaCamera size={20} />}
                        <input type="file" id="photo-upload" hidden accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
                      </label>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                      <h6 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '10px' }}>Photo de profil</h6>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>Format recommandé : Carré, JPG ou PNG. Max 2MB.</p>
                    </div>
                  </Col>

                  {/* Fields Section */}
                  <Col lg={8}>
                    <h5 className="mb-4" style={{ fontWeight: '700', color: 'var(--bg-dark)', display: 'flex', alignItems: 'center' }}>
                      <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                        <FaUser size={16} />
                      </span>
                      Informations de base
                    </h5>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ fontWeight: '600', color: '#64748b', fontSize: '0.9rem' }}>Nom complet *</Form.Label>
                          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ fontWeight: '600', color: '#64748b', fontSize: '0.9rem' }}>Email *</Form.Label>
                          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ fontWeight: '600', color: '#64748b', fontSize: '0.9rem' }}><FaPhone className="me-2" />Téléphone</Form.Label>
                          <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="06 12 34 56 78" style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ fontWeight: '600', color: '#64748b', fontSize: '0.9rem' }}><FaMapMarkerAlt className="me-2" />Localisation</Form.Label>
                          <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Casablanca, Maroc" style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-5">
                      <Form.Label style={{ fontWeight: '600', color: '#64748b', fontSize: '0.9rem' }}>Biographie / À propos</Form.Label>
                      <Form.Control as="textarea" rows={4} name="bio" value={formData.bio} onChange={handleChange} placeholder="Décrivez votre parcours et vos aspirations..." style={{ ...inputStyle, resize: 'none' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                    </Form.Group>

                    <h5 className="mb-4" style={{ fontWeight: '700', color: 'var(--bg-dark)', display: 'flex', alignItems: 'center' }}>
                      <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                        <FaGraduationCap size={18} />
                      </span>
                      Formation académique
                    </h5>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ fontWeight: '600', color: '#64748b', fontSize: '0.9rem' }}>Université / École</Form.Label>
                          <Form.Control type="text" name="education" value={formData.education} onChange={handleChange} placeholder="Université Mohammed V..." style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ fontWeight: '600', color: '#64748b', fontSize: '0.9rem' }}>Spécialité</Form.Label>
                          <Form.Control type="text" name="field" value={formData.field} onChange={handleChange} placeholder="Développement Logiciel / Finance..." style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                        </Form.Group>
                      </Col>
                    </Row>

                    <h5 className="mb-4 mt-2" style={{ fontWeight: '700', color: 'var(--bg-dark)', display: 'flex', alignItems: 'center' }}>
                      <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                        <FaBriefcase size={16} />
                      </span>
                      Compétences techniques
                    </h5>

                    <Form.Group className="mb-3">
                      <div className="d-flex gap-2 mb-3">
                        <Form.Control type="text" value={currentSkill} onChange={(e) => setCurrentSkill(e.target.value)} placeholder="Ajouter une compétence (ex: React, Java, UI/UX...)" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--secondary-color)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                        <button type="button" onClick={addSkill} style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)', border: 'none', borderRadius: '12px', padding: '0 1.5rem', fontWeight: '700', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(236, 72, 153, 0.15)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(236, 72, 153, 0.1)'}>Ajouter</button>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <Badge key={index} style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default' }}>
                            {skill}
                            <FaTimes style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => removeSkill(skill)} onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'} onMouseLeave={(e) => e.currentTarget.style.color = '#475569'} />
                          </Badge>
                        ))}
                        {formData.skills.length === 0 && <small style={{ color: '#94a3b8' }}>Auncune compétence ajoutée</small>}
                      </div>
                    </Form.Group>

                    <div style={{ marginTop: '4rem', display: 'flex', gap: '15px' }}>
                      <button type="submit" disabled={isLoading} className="btn-modern btn-modern-primary" style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        {isLoading ? <div className="spinner-border spinner-border-sm" role="status" /> : <FaSave />}
                        {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
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

export default EditProfile;