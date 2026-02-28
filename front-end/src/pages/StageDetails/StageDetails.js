import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal, Form, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaBuilding, 
  FaMoneyBillWave, 
  FaCalendarAlt,
  FaHeart,
  FaRegHeart,
  FaShareAlt
} from 'react-icons/fa';
import { fetchStageById, applyToStage } from '../../store/slices/stagesSlice';
import { addFavorite, removeFavorite } from '../../store/slices/userSlice';

const StageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentStage, isLoading, error } = useSelector((state) => state.stages);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.user);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
  });
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState('');

  useEffect(() => {
    if (id) {
      console.log('Fetching stage with ID:', id);
      dispatch(fetchStageById(id))
        .unwrap()
        .then((data) => {
          console.log('Stage data received:', data);
        })
        .catch((err) => {
          console.error('Error fetching stage:', err);
        });
    }
  }, [dispatch, id]);
  

  // Check if this stage is in favorites
  const isFavorite = favorites?.includes(parseInt(id)) || false;
  const isStudent = user?.role === 'student';

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isFavorite) {
      dispatch(removeFavorite(parseInt(id)));
    } else {
      dispatch(addFavorite(parseInt(id)));
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isStudent) {
      alert('Seuls les étudiants peuvent postuler aux stages');
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setApplicationError('');
    
    if (!applicationData.coverLetter.trim()) {
      setApplicationError('Veuillez écrire une lettre de motivation');
      return;
    }

    try {
      const result = await dispatch(applyToStage({ 
        stageId: id, 
        applicationData 
      })).unwrap();
      
      console.log('Application result:', result);
      setApplicationSuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
        setApplicationSuccess(false);
        setApplicationData({ coverLetter: '' });
      }, 2000);
    } catch (error) {
      console.error('Application error:', error);
      setApplicationError(error.message || 'Erreur lors de la candidature');
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: currentStage?.title,
        text: `Découvrez cette offre de stage: ${currentStage?.title}`,
        url: shareUrl,
      }).catch(() => {
        navigator.clipboard.writeText(shareUrl);
        alert('Lien copié dans le presse-papier!');
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Lien copié dans le presse-papier!');
    }
  };

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement du stage...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error.message || 'Stage non trouvé'}</p>
          <Button variant="primary" onClick={() => navigate('/stages')}>
            Retour aux offres
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!currentStage) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Stage non trouvé</Alert.Heading>
          <p>L'offre de stage que vous recherchez n'existe pas ou a été supprimée.</p>
          <Button variant="primary" onClick={() => navigate('/stages')}>
            Voir toutes les offres
          </Button>
        </Alert>
      </Container>
    );
  }

  // Safely extract company info
  const companyName = typeof currentStage.company === 'object' 
    ? currentStage.company?.company_name || currentStage.company?.name || 'Entreprise'
    : currentStage.company || 'Entreprise';

  // Safely parse requirements/missions — DB may store as string, JSON, or array
  const parseList = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return value.split('\n').map(s => s.trim()).filter(Boolean);
      }
    }
    return [];
  };
  const requirements = parseList(currentStage.requirements);
  const missions     = parseList(currentStage.missions);

  return (
    <Container className="py-5">
      <Row>
        <Col lg={isStudent ? 8 : 12}>
          <Card className="mb-4" style={{ border: 'none', borderRadius: '15px', boxShadow: '0 3px 15px rgba(0,0,0,0.1)' }}>
            <Card.Body>
              <div className="mb-4">
                {currentStage.companyLogo && (
                  <img 
                    src={currentStage.companyLogo} 
                    alt={companyName} 
                    style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '1rem' }}
                  />
                )}
                <h2 className="mb-3">{currentStage.title}</h2>
                <h5 className="mb-4 text-primary">
                  <FaBuilding className="me-2" />
                  {companyName}
                </h5>
                
                <div className="d-flex flex-wrap gap-3 mb-3">
                  <div className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-2 text-muted" />
                    <span>{currentStage.location || 'Non spécifié'}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaClock className="me-2 text-muted" />
                    <span>{currentStage.duration || 'Non spécifié'}</span>
                  </div>
                  {currentStage.salary && (
                    <div className="d-flex align-items-center">
                      <FaMoneyBillWave className="me-2 text-muted" />
                      <span>{currentStage.salary}</span>
                    </div>
                  )}
                  {currentStage.start_date && (
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="me-2 text-muted" />
                      <span>Début: {currentStage.start_date}</span>
                    </div>
                  )}
                </div>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  {currentStage.tags?.map((tag, index) => (
                    <Badge key={index} bg="light" text="dark" className="px-3 py-2">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h5>Description du stage</h5>
                <p>{currentStage.full_description || currentStage.description || 'Aucune description disponible'}</p>
              </div>

              {requirements.length > 0 && (
                <div className="mb-4">
                  <h5>Profil recherché</h5>
                  <ul>
                    {requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {missions.length > 0 && (
                <div className="mb-4">
                  <h5>Missions</h5>
                  <ul>
                    {missions.map((mission, index) => (
                      <li key={index}>{mission}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {isStudent && (
          <Col lg={4}>
            <Card style={{ border: 'none', borderRadius: '15px', boxShadow: '0 3px 15px rgba(0,0,0,0.1)' ,top: '20px'}} className="sticky-top" >
              <Card.Body>
                <Button
                  variant="success"
                  size="lg"
                  className="w-100 mb-3"
                  onClick={handleApplyClick}
                  style={{ backgroundColor: '#00C853', borderColor: '#00C853' }}
                >
                  Postuler maintenant
                </Button>

                <div className="d-flex gap-2 mb-4">
                  <Button
                    variant={isFavorite ? 'danger' : 'outline-danger'}
                    className="flex-fill"
                    onClick={handleFavoriteToggle}
                  >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    <span className="ms-2">{isFavorite ? 'Sauvegardé' : 'Sauvegarder'}</span>
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="flex-fill"
                    onClick={handleShare}
                  >
                    <FaShareAlt className="me-2" />
                    Partager
                  </Button>
                </div>

                <Card className="bg-light">
                  <Card.Body>
                    <h6 className="mb-3">Informations clés</h6>
                    <p className="mb-2">
                      <strong>Date de publication:</strong><br />
                      {currentStage.created_at ? new Date(currentStage.created_at).toLocaleDateString('fr-FR') : 'Non spécifié'}
                    </p>
                    <p className="mb-2">
                      <strong>Type de contrat:</strong><br />
                      Stage {currentStage.type === 'full-time' ? 'temps plein' : 
                             currentStage.type === 'part-time' ? 'temps partiel' : 
                             currentStage.type === 'remote' ? 'à distance' : 'non spécifié'}
                    </p>
                    <p className="mb-0">
                      <strong>Nombre de postes:</strong><br />
                      {currentStage.positions || 1}
                    </p>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Application Modal */}
      <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Postuler à {currentStage?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {applicationSuccess ? (
            <Alert variant="success">
              <h5>✅ Candidature envoyée avec succès!</h5>
              <p>L'entreprise vous contactera si votre profil correspond.</p>
            </Alert>
          ) : (
            <Form onSubmit={handleApplicationSubmit}>
              {applicationError && (
                <Alert variant="danger">{applicationError}</Alert>
              )}
              
              <Form.Group className="mb-3">
                <Form.Label>Lettre de motivation *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce stage..."
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({
                    ...applicationData,
                    coverLetter: e.target.value
                  })}
                  required
                />
              </Form.Group>

              <Alert variant="info">
                <small>
                  Votre CV et vos informations de profil seront automatiquement joints à cette candidature.
                </small>
              </Alert>

              <div className="d-flex gap-2">
                <Button variant="secondary" onClick={() => setShowApplyModal(false)}>
                  Annuler
                </Button>
                <Button variant="success" type="submit" className="flex-fill">
                  Envoyer ma candidature
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default StageDetails;