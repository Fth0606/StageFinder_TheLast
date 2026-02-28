import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSave, FaEye, FaPlus, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { updateStage } from '../../store/slices/companySlice';
import { apiService } from '../../services/api';

const EditStage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.company);

  const [formData, setFormData] = useState({
    title:           '',
    location:        '',
    duration:        '',
    description:     '',
    requirements:    [''],
    type:            'full-time',
  });

  const [currentTag, setCurrentTag]   = useState('');
  const [success, setSuccess]         = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fetching, setFetching]       = useState(true);

  // Load existing offer data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiService.getOffer(id);
        const s   = res.data;

        const parseList = (v) => {
          if (!v) return [''];
          if (Array.isArray(v)) return v.length ? v : [''];
          try { const p = JSON.parse(v); return Array.isArray(p) && p.length ? p : [v]; }
          catch { return v.split('\n').map(x => x.trim()).filter(Boolean) || ['']; }
        };

        setFormData({
          title:        s.title        || '',
          location:     s.location     || '',
          duration:     s.duration     || '',
          description:  s.description  || '',
          requirements: parseList(s.requirements),
          type:         s.type         || 'full-time',
        });
      } catch (e) {
        setSubmitError('Impossible de charger l\'offre.');
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleReqChange = (index, value) => {
    const reqs = [...formData.requirements];
    reqs[index] = value;
    setFormData({ ...formData, requirements: reqs });
  };

  const addReq    = () => setFormData({ ...formData, requirements: [...formData.requirements, ''] });
  const removeReq = (i) => setFormData({ ...formData, requirements: formData.requirements.filter((_, idx) => idx !== i) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const payload = {
      ...formData,
      requirements: formData.requirements.filter(r => r.trim() !== ''),
    };

    const result = await dispatch(updateStage({ id, stageData: payload }));

    if (result.type === 'company/updateStage/fulfilled') {
      setSuccess(true);
      setTimeout(() => navigate('/company/profile'), 2000);
    } else {
      const errMsg = result.payload?.message
        || Object.values(result.payload?.errors || {}).flat().join(' ')
        || 'Erreur lors de la mise à jour';
      setSubmitError(errMsg);
    }
  };

  if (fetching) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Chargement de l'offre...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          {/* Back button */}
          <Button variant="link" className="mb-3 ps-0 text-muted"
            onClick={() => navigate('/company/profile')}>
            <FaArrowLeft className="me-2" />Retour
          </Button>

          <Card style={{ border: 'none', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #0066CC, #00C853)',
              color: 'white', borderRadius: '20px 20px 0 0', padding: '1.5rem'
            }}>
              <h3 className="mb-0">Modifier l'offre de stage</h3>
              <p className="mb-0 mt-1 opacity-75">Les modifications seront soumises pour validation</p>
            </Card.Header>

            <Card.Body className="p-4">
              {success && (
                <Alert variant="success">
                  <strong>✅ Succès !</strong> L'offre a été mise à jour et soumise pour validation.
                </Alert>
              )}
              {submitError && (
                <Alert variant="danger">
                  <strong>❌ Erreur :</strong> {submitError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Basic info */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>Informations de base</h5>

                <Form.Group className="mb-3">
                  <Form.Label>Titre du poste *</Form.Label>
                  <Form.Control type="text" name="title" value={formData.title}
                    onChange={handleChange} required placeholder="Ex: Stage Développeur Full Stack"
                    style={{ borderRadius: '10px' }} />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Localisation *</Form.Label>
                      <Form.Control type="text" name="location" value={formData.location}
                        onChange={handleChange} required placeholder="Casablanca, Maroc"
                        style={{ borderRadius: '10px' }} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Durée *</Form.Label>
                      <Form.Control type="text" name="duration" value={formData.duration}
                        onChange={handleChange} required placeholder="3 mois"
                        style={{ borderRadius: '10px' }} />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Type de stage</Form.Label>
                  <Form.Select name="type" value={formData.type} onChange={handleChange}
                    style={{ borderRadius: '10px' }}>
                    <option value="full-time">Temps plein</option>
                    <option value="part-time">Temps partiel</option>
                    <option value="remote">À distance</option>
                  </Form.Select>
                </Form.Group>

                <hr className="my-4" />

                {/* Description */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>Description</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control as="textarea" rows={5} name="description" value={formData.description}
                    onChange={handleChange} required placeholder="Description du stage..."
                    style={{ borderRadius: '10px' }} />
                </Form.Group>

                <hr className="my-4" />

                {/* Requirements */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>Profil recherché</h5>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="d-flex gap-2 mb-2">
                    <Form.Control type="text" value={req}
                      onChange={(e) => handleReqChange(index, e.target.value)}
                      placeholder="Compétence ou qualification requise..."
                      style={{ borderRadius: '10px' }} />
                    {formData.requirements.length > 1 && (
                      <Button variant="outline-danger" onClick={() => removeReq(index)}
                        style={{ borderRadius: '10px' }}>
                        <FaTimes />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline-primary" onClick={addReq} className="mb-3"
                  style={{ borderRadius: '10px' }}>
                  <FaPlus className="me-2" />Ajouter un critère
                </Button>

                <hr className="my-4" />

                {/* Buttons */}
                <div className="d-flex gap-2 justify-content-end">
                  <Button variant="outline-secondary" onClick={() => navigate('/company/profile')}
                    style={{ borderRadius: '10px', padding: '0.75rem 1.5rem' }}>
                    <FaTimes className="me-2" />Annuler
                  </Button>
                  <Button type="submit" disabled={isLoading}
                    style={{ backgroundColor: '#00C853', borderColor: '#00C853', color: 'white', borderRadius: '10px', padding: '0.75rem 1.5rem' }}>
                    <FaSave className="me-2" />
                    {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
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

export default EditStage;