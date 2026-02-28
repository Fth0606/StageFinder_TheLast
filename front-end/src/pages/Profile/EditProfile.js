import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSave, FaTimes, FaPlus, FaUser, FaGraduationCap, FaBriefcase } from 'react-icons/fa';
import { updateUserProfile } from '../../store/slices/userSlice';

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name:      '',
    email:     '',
    bio:       '',
    phone:     '', // → students.phone
    location:  '', // → students.location
    education: '', // → students.university
    field:     '', // → students.specialite
    skills:    [], // → students.skills (JSON)
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (user) {
      const s = profile?.student || user?.student || {};

      // skills stored as JSON string or array
      let skills = s?.skills || [];
      if (typeof skills === 'string') {
        try { skills = JSON.parse(skills); } catch { skills = []; }
      }

      setFormData({
        name:      user.name  || '',
        email:     user.email || '',
        bio:       profile?.bio || user.bio || '',
        phone:     s?.phone    || '',
        location:  s?.location || '',
        education: s?.university || '',
        field:     s?.specialite || '',
        skills:    Array.isArray(skills) ? skills : [],
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

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card style={{ border: 'none', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #0066CC, #00C853)',
              color: 'white', borderRadius: '20px 20px 0 0', padding: '1.5rem'
            }}>
              <h3 className="mb-0"><FaUser className="me-2" />Modifier mon profil</h3>
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

                {/* Personal Info */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>
                  <FaUser className="me-2" />Informations personnelles
                </h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom complet *</Form.Label>
                      <Form.Control type="text" name="name" value={formData.name}
                        onChange={handleChange} required style={{ borderRadius: '10px' }} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control type="email" name="email" value={formData.email}
                        onChange={handleChange} required style={{ borderRadius: '10px' }} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Téléphone</Form.Label>
                      <Form.Control type="tel" name="phone" value={formData.phone}
                        onChange={handleChange} placeholder="06 12 34 56 78"
                        style={{ borderRadius: '10px' }} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Localisation</Form.Label>
                      <Form.Control type="text" name="location" value={formData.location}
                        onChange={handleChange} placeholder="Casablanca, Maroc"
                        style={{ borderRadius: '10px' }} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-4">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control as="textarea" rows={3} name="bio" value={formData.bio}
                    onChange={handleChange} placeholder="Parlez-nous de vous..."
                    style={{ borderRadius: '10px' }} />
                </Form.Group>

                <hr className="my-4" />

                {/* Formation */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>
                  <FaGraduationCap className="me-2" />Formation
                </h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Université / École</Form.Label>
                      <Form.Control type="text" name="education" value={formData.education}
                        onChange={handleChange} placeholder="Université Mohammed V..."
                        style={{ borderRadius: '10px' }} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Spécialité</Form.Label>
                      <Form.Control type="text" name="field" value={formData.field}
                        onChange={handleChange} placeholder="Développement Web"
                        style={{ borderRadius: '10px' }} />
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-4" />

                {/* Skills */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>
                  <FaBriefcase className="me-2" />Compétences
                </h5>
                <Form.Group className="mb-3">
                  <Form.Label>Ajouter une compétence</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control type="text" value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      placeholder="Ex: React, Python, Marketing..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      style={{ borderRadius: '10px' }} />
                    <Button variant="outline-primary" onClick={addSkill} style={{ borderRadius: '10px' }}>
                      <FaPlus />
                    </Button>
                  </div>
                </Form.Group>
                <div className="mb-4">
                  {formData.skills.length > 0 ? formData.skills.map((skill, index) => (
                    <span key={index} className="badge bg-primary me-2 mb-2"
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', cursor: 'pointer' }}
                      onClick={() => removeSkill(skill)}>
                      {skill} <FaTimes className="ms-1" />
                    </span>
                  )) : <p className="text-muted">Aucune compétence ajoutée</p>}
                </div>

                <hr className="my-4" />

                <div className="d-flex gap-2 justify-content-end">
                  <Button variant="outline-secondary" onClick={() => navigate('/profile')}
                    style={{ borderRadius: '10px', padding: '0.75rem 1.5rem' }}>
                    <FaTimes className="me-2" />Annuler
                  </Button>
                  <Button variant="success" type="submit" disabled={isLoading}
                    style={{ backgroundColor: '#00C853', borderColor: '#00C853', borderRadius: '10px', padding: '0.75rem 1.5rem' }}>
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

export default EditProfile;