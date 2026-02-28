import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSave, FaEye, FaPlus, FaTimes } from 'react-icons/fa';
import { createStage } from '../../store/slices/companySlice';

const PostStage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.company);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    duration: '',         // number only (months)
    type: 'full-time',
    description: '',
    requirements: [''],
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Only allow numbers for duration
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
      title:        formData.title,
      description:  formData.description,
      requirements: formData.requirements.filter(r => r.trim() !== '').join('\n'),
      location:     formData.location,
      duration:     formData.duration ? parseInt(formData.duration) : null, // store as number
      type:         formData.type,
      status:       status,
    };

    const result = await dispatch(createStage(stageData));
    if (result.type === 'company/createStage/fulfilled') {
      setSuccess(true);
      setTimeout(() => navigate('/company/dashboard'), 2000);
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card style={{ border: 'none', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #0066CC, #00C853)',
              color: 'white',
              borderRadius: '20px 20px 0 0',
              padding: '1.5rem'
            }}>
              <h3 className="mb-0">Publier une offre de stage</h3>
              <p className="mb-0 mt-2">Créez votre offre de stage en quelques minutes</p>
            </Card.Header>

            <Card.Body className="p-4">
              {success && (
                <Alert variant="success">
                  <strong>Succès !</strong> Votre offre a été soumise et est en attente de validation.
                </Alert>
              )}
              {error && (
                <Alert variant="danger">
                  <strong>Erreur !</strong> {typeof error === 'string' ? error : error?.message || 'Une erreur est survenue'}
                </Alert>
              )}

              <Form onSubmit={(e) => handleSubmit(e, 'pending')}>

                {/* ===== INFORMATIONS DE BASE ===== */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>Informations de base</h5>

                <Form.Group className="mb-3">
                  <Form.Label>Titre du poste *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Stage Développeur Full Stack"
                    required
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Localisation *</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Casablanca, Maroc"
                        required
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Durée (en mois) *</Form.Label>
                      <div className="input-group">
                        <Form.Control
                          type="number"
                          name="duration"
                          value={formData.duration}
                          onChange={handleDurationChange}
                          placeholder="Ex: 6"
                          min="1"
                          max="24"
                          required
                          style={{ borderRadius: '10px 0 0 10px' }}
                        />
                        <span className="input-group-text" style={{
                          borderRadius: '0 10px 10px 0',
                          background: '#0066CC',
                          color: 'white',
                          fontWeight: 'bold',
                          border: 'none'
                        }}>
                          M
                        </span>
                      </div>
                      <Form.Text className="text-muted">
                        {formData.duration ? `${formData.duration} M` : 'Entrez un nombre de mois'}
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Type de stage *</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    style={{ borderRadius: '10px' }}
                  >
                    <option value="full-time">Temps plein</option>
                    <option value="part-time">Temps partiel</option>
                    <option value="remote">Télétravail</option>
                  </Form.Select>
                </Form.Group>

                <hr className="my-4" />

                {/* ===== DESCRIPTION ===== */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>Description du stage</h5>

                <Form.Group className="mb-3">
                  <Form.Label>Description complète *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez le stage : contexte, missions, équipe, objectifs..."
                    required
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>

                <hr className="my-4" />

                {/* ===== PROFIL RECHERCHÉ ===== */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>Profil recherché</h5>

                {formData.requirements.map((req, index) => (
                  <div key={index} className="mb-2">
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        value={req}
                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                        placeholder="Ex: Étudiant en informatique, maîtrise de React..."
                        style={{ borderRadius: '10px' }}
                      />
                      {formData.requirements.length > 1 && (
                        <Button
                          variant="outline-danger"
                          onClick={() => removeRequirement(index)}
                          style={{ borderRadius: '10px' }}
                        >
                          <FaTimes />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline-primary"
                  onClick={addRequirement}
                  className="mb-3"
                  style={{ borderRadius: '10px' }}
                >
                  <FaPlus className="me-2" />
                  Ajouter un critère
                </Button>

                <hr className="my-4" />

                {/* ===== BUTTONS ===== */}
                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    variant="outline-secondary"
                    onClick={(e) => handleSubmit(e, 'pending')}
                    disabled={isLoading}
                    style={{ borderRadius: '10px', padding: '0.75rem 1.5rem' }}
                  >
                    <FaSave className="me-2" />
                    Enregistrer
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
                    <FaEye className="me-2" />
                    {isLoading ? 'Publication...' : "Publier l'offre"}
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

export default PostStage;