import React, { useState } from 'react';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSave, FaEye, FaPlus, FaTimes, FaBriefcase, FaEdit } from 'react-icons/fa';
import { createStage } from '../../store/slices/companySlice';

const PostStage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.company);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    duration: '',
    type: 'full-time',
    description: '',
    requirements: [''],
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 1)) {
      setFormData({ ...formData, duration: value });
    }
  };

  const handleRequirementChange = (index, value) => {
    const newReqs = [...formData.requirements];
    newReqs[index] = value;
    setFormData({ ...formData, requirements: newReqs });
  };

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ''] });
  };

  const removeRequirement = (index) => {
    const newReqs = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newReqs });
  };

  const handleSubmit = async (e, status = 'pending') => {
    e.preventDefault();

    const stageData = {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements.filter(r => r.trim() !== '').join('\n'),
      location: formData.location,
      duration: formData.duration ? parseInt(formData.duration) : null,
      type: formData.type,
      status: status,
    };

    const result = await dispatch(createStage(stageData));
    if (result.type === 'company/createStage/fulfilled') {
      setSuccess(true);
      setTimeout(() => navigate('/company/dashboard'), 2000);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg-light)', position: 'relative', overflow: 'hidden', padding: '3rem 0' }}>
      <div style={{ position: 'absolute', top: '5%', right: '-5%', width: '400px', height: '400px', background: 'var(--primary-color)', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '300px', height: '300px', background: 'var(--accent-color)', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>

      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row>
          <Col lg={8} className="mx-auto">
            <div className="glass-panel p-0 overflow-hidden mb-5">
              <div style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', padding: '2rem 3rem', color: 'white', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginRight: '20px', backdropFilter: 'blur(10px)' }}>
                  <FaEdit />
                </div>
                <div>
                  <h3 style={{ fontWeight: '800', margin: 0 }}>Publier une offre de stage</h3>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>Créez votre offre de stage en quelques minutes</p>
                </div>
              </div>

              <div style={{ padding: '3rem' }}>
                {success && (
                  <Alert variant="success" style={{ borderRadius: '12px', border: 'none', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', fontWeight: '600' }}>
                    <FaCheck className="me-3" size={20} /> Votre offre a été soumise et est en attente de validation.
                  </Alert>
                )}
                {error && (
                  <Alert variant="danger" style={{ borderRadius: '12px', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', fontWeight: '600' }}>
                    <FaTimes className="me-3" size={20} /> {typeof error === 'string' ? error : error?.message || 'Une erreur est survenue'}
                  </Alert>
                )}

                <Form onSubmit={(e) => handleSubmit(e, 'pending')}>
                  {/* ===== INFORMATIONS DE BASE ===== */}
                  <h5 style={{ fontWeight: '700', color: 'var(--primary-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}><FaBriefcase size={14} /></div>
                    Informations de base
                  </h5>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Titre du poste *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Ex: Stage Développeur Full Stack"
                      required
                      style={{ padding: '12px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', boxShadow: 'none' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </Form.Group>

                  <Row className="g-4 mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Localisation *</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Casablanca, Maroc"
                          required
                          style={{ padding: '12px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', boxShadow: 'none' }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Durée (en mois) *</Form.Label>
                        <div className="d-flex align-items-center">
                          <Form.Control
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleDurationChange}
                            placeholder="Ex: 6"
                            min="1"
                            max="24"
                            required
                            style={{ padding: '12px 15px', borderRadius: '10px 0 0 10px', border: '1px solid #e2e8f0', background: '#f8fafc', boxShadow: 'none', borderRight: 'none' }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                          />
                          <div style={{ padding: '12px 20px', background: 'var(--primary-color)', color: 'white', fontWeight: '700', borderRadius: '0 10px 10px 0', border: '1px solid var(--primary-color)' }}>
                            Mois
                          </div>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Type de stage *</Form.Label>
                    <Form.Select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      style={{ padding: '12px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', boxShadow: 'none', cursor: 'pointer' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <option value="full-time">Temps plein</option>
                      <option value="part-time">Temps partiel</option>
                      <option value="remote">Télétravail</option>
                    </Form.Select>
                  </Form.Group>

                  <hr style={{ margin: '2.5rem 0', borderColor: '#e2e8f0' }} />

                  {/* ===== DESCRIPTION ===== */}
                  <h5 style={{ fontWeight: '700', color: 'var(--primary-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}><FaEdit size={14} /></div>
                    Description du stage
                  </h5>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Description complète *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Décrivez le stage : contexte, missions, équipe, objectifs..."
                      required
                      style={{ padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', boxShadow: 'none', resize: 'vertical' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </Form.Group>

                  <hr style={{ margin: '2.5rem 0', borderColor: '#e2e8f0' }} />

                  {/* ===== PROFIL RECHERCHÉ ===== */}
                  <h5 style={{ fontWeight: '700', color: 'var(--primary-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}><FaPlus size={14} /></div>
                    Profil recherché
                  </h5>

                  {formData.requirements.map((req, index) => (
                    <div key={index} className="mb-3 d-flex gap-2">
                      <Form.Control
                        type="text"
                        value={req}
                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                        placeholder="Ex: Étudiant en informatique, maîtrise de React..."
                        style={{ padding: '12px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', boxShadow: 'none' }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          style={{ width: '48px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addRequirement}
                    style={{ background: 'transparent', color: 'var(--primary-color)', border: '1px dashed var(--primary-color)', borderRadius: '10px', padding: '10px 20px', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <FaPlus className="me-2" /> Ajouter un critère
                  </button>

                  <hr style={{ margin: '2.5rem 0', borderColor: '#e2e8f0' }} />

                  {/* ===== BUTTONS ===== */}
                  <div className="d-flex justify-content-end gap-3">
                    <button
                      type="button"
                      onClick={(e) => handleSubmit(e, 'pending')}
                      disabled={isLoading}
                      style={{ background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600', padding: '12px 25px', borderRadius: '12px', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
                    >
                      <FaSave className="me-2" /> Enregistrer brouillon
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', border: 'none', color: 'white', fontWeight: '700', padding: '12px 30px', borderRadius: '12px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.4)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)'; }}
                    >
                      <FaEye className="me-2" /> {isLoading ? 'Publication...' : "Publier l'offre"}
                    </button>
                  </div>

                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PostStage;