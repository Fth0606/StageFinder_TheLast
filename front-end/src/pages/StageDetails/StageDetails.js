import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Badge, Alert, Modal, Form, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaMapMarkerAlt, FaClock, FaBuilding, FaMoneyBillWave,
  FaCalendarAlt, FaHeart, FaRegHeart, FaShareAlt, FaCheckCircle, FaArrowLeft
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
  const [applicationData, setApplicationData] = useState({ coverLetter: '' });
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchStageById(id)).unwrap().catch(err => console.error(err));
    }
  }, [dispatch, id]);

  const isFavorite = favorites?.includes(parseInt(id)) || false;
  const isStudent = user?.role === 'student';

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) return navigate('/login');
    if (isFavorite) dispatch(removeFavorite(parseInt(id)));
    else dispatch(addFavorite(parseInt(id)));
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) return navigate('/login');
    if (!isStudent) return alert('Seuls les étudiants peuvent postuler aux stages');
    setShowApplyModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setApplicationError('');
    if (!applicationData.coverLetter.trim()) return setApplicationError('Veuillez écrire une lettre de motivation');

    try {
      await dispatch(applyToStage({ stageId: id, applicationData })).unwrap();
      setApplicationSuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
        setApplicationSuccess(false);
        setApplicationData({ coverLetter: '' });
      }, 2000);
    } catch (error) {
      setApplicationError(error.message || 'Erreur lors de la candidature');
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({ title: currentStage?.title, text: `Découvrez cette offre de stage: ${currentStage?.title}`, url: shareUrl })
        .catch(() => { navigator.clipboard.writeText(shareUrl); alert('Lien copié dans le presse-papier!'); });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Lien copié dans le presse-papier!');
    }
  };

  if (isLoading) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="spinner-border" style={{ color: 'var(--primary-color)', width: '3rem', height: '3rem', marginBottom: '1rem' }} role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p style={{ color: '#64748b', fontWeight: '500' }}>Chargement des détails du stage...</p>
      </Container>
    );
  }

  if (error || !currentStage) {
    return (
      <Container className="py-5 text-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="glass-panel py-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
          <h3 style={{ fontWeight: '700', color: 'var(--bg-dark)' }}>Stage introuvable</h3>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>L'offre de stage que vous recherchez n'existe pas ou a été supprimée.</p>
          <button className="btn-modern btn-modern-primary" onClick={() => navigate('/stages')}>
            Voir toutes les offres
          </button>
        </div>
      </Container>
    );
  }

  const companyName = typeof currentStage.company === 'object'
    ? currentStage.company?.company_name || currentStage.company?.name || 'Entreprise'
    : currentStage.company || 'Entreprise';

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
  const missions = parseList(currentStage.missions);

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg-light)', position: 'relative', overflow: 'hidden' }}>
      {/* Dynamic Backgrounds */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', background: 'var(--primary-color)', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '600px', height: '600px', background: 'var(--accent-color)', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>

      <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', marginBottom: '2rem', transition: 'color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <FaArrowLeft className="me-2" /> Retour
        </button>

        <Row className="g-4">
          <Col lg={isStudent || !isAuthenticated ? 8 : 12}>
            <div className="glass-panel" style={{ padding: '3rem', background: 'rgba(255, 255, 255, 0.9)', marginBottom: '2rem' }}>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="d-flex align-items-center">
                  {currentStage.companyLogo ? (
                    <img src={currentStage.companyLogo} alt={companyName} style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '16px', background: 'white', padding: '5px', border: '1px solid rgba(0,0,0,0.05)', marginRight: '1.5rem' }} />
                  ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', marginRight: '1.5rem', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)' }}>
                      <FaBuilding />
                    </div>
                  )}
                  <div>
                    <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)', marginBottom: '0.3rem', letterSpacing: '-0.5px' }}>{currentStage.title}</h2>
                    <h5 style={{ color: 'var(--primary-color)', fontWeight: '600', margin: 0 }}>{companyName}</h5>
                  </div>
                </div>
                {!isAuthenticated || isStudent ? (
                  <Badge bg="transparent" style={{ color: 'var(--accent-color)', background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)', padding: '8px 16px', borderRadius: '50px', fontWeight: '600' }}>
                    Ouvert
                  </Badge>
                ) : null}
              </div>

              <div className="d-flex flex-wrap gap-4 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#475569' }}>
                    <FaMapMarkerAlt />
                  </div>
                  <span style={{ fontWeight: '500' }}>{currentStage.location || 'Non spécifié'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#475569' }}>
                    <FaClock />
                  </div>
                  <span style={{ fontWeight: '500' }}>{currentStage.duration || 'Non spécifié'}</span>
                </div>
                {currentStage.salary && (
                  <div style={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#475569' }}>
                      <FaMoneyBillWave />
                    </div>
                    <span style={{ fontWeight: '500' }}>{currentStage.salary}</span>
                  </div>
                )}
                {currentStage.start_date && (
                  <div style={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#475569' }}>
                      <FaCalendarAlt />
                    </div>
                    <span style={{ fontWeight: '500' }}>Début : {currentStage.start_date}</span>
                  </div>
                )}
              </div>

              <div className="d-flex flex-wrap gap-2 mb-4">
                {currentStage.tags?.map((tag, index) => (
                  <Badge key={index} bg="transparent" style={{ color: '#475569', background: '#f1f5f9', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', fontSize: '0.85rem' }}>
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mb-5">
                <h4 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '1rem' }}>Description du stage</h4>
                <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
                  {currentStage.full_description || currentStage.description || 'Aucune description disponible'}
                </p>
              </div>

              {requirements.length > 0 && (
                <div className="mb-5 glass-panel" style={{ background: '#f8fafc', padding: '2rem', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '1.5rem' }}>Profil recherché</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {requirements.map((req, index) => (
                      <li key={index} style={{ color: '#475569', marginBottom: '0.8rem', display: 'flex', alignItems: 'flex-start' }}>
                        <FaCheckCircle className="mt-1 me-3 text-success" />
                        <span style={{ lineHeight: '1.6' }}>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {missions.length > 0 && (
                <div className="mb-4">
                  <h4 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '1.5rem' }}>Missions clés</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {missions.map((mission, index) => (
                      <li key={index} style={{ color: '#475569', marginBottom: '0.8rem', display: 'flex', alignItems: 'flex-start', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.02)' }}>
                        <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', marginRight: '15px', flexShrink: 0, marginTop: '2px' }}>
                          {index + 1}
                        </span>
                        <span style={{ lineHeight: '1.5', fontWeight: '500' }}>{mission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Col>

          {(!isAuthenticated || isStudent) && (
            <Col lg={4}>
              <div className="glass-panel" style={{ position: 'sticky', top: '2rem', padding: '2rem', background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
                <button
                  className="w-100 mb-3"
                  onClick={handleApplyClick}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: 'white',
                    borderRadius: '12px', padding: '1.2rem', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)', transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(16, 185, 129, 0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(16, 185, 129, 0.3)'; }}
                >
                  Postuler maintenant
                </button>

                <div className="d-flex gap-2 mb-4">
                  <button
                    className="flex-fill"
                    onClick={handleFavoriteToggle}
                    style={{
                      background: isFavorite ? 'rgba(239, 68, 68, 0.1)' : 'white',
                      color: isFavorite ? '#ef4444' : '#64748b',
                      border: isFavorite ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid #e2e8f0',
                      borderRadius: '12px', padding: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { if (!isFavorite) { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; } }}
                    onMouseLeave={(e) => { if (!isFavorite) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; } }}
                  >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />} {isFavorite ? 'Sauvegardé' : 'Sauvegarder'}
                  </button>
                  <button
                    onClick={handleShare}
                    style={{
                      background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.8rem 1.2rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.color = 'var(--primary-color)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
                  >
                    <FaShareAlt /> Partager
                  </button>
                </div>

                <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h6 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '1.2rem', display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color)', marginRight: '10px' }}></span>
                    Informations clés
                  </h6>

                  <div className="mb-3">
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '2px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date de publication</span>
                    <strong style={{ color: '#475569' }}>{currentStage.created_at ? new Date(currentStage.created_at).toLocaleDateString('fr-FR') : 'Non spécifié'}</strong>
                  </div>

                  <div className="mb-3">
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '2px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type de contrat</span>
                    <strong style={{ color: '#475569' }}>
                      Stage {currentStage.type === 'full-time' ? 'temps plein' : currentStage.type === 'part-time' ? 'temps partiel' : currentStage.type === 'remote' ? 'à distance' : 'non spécifié'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '2px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Postes ouverts</span>
                    <strong style={{ color: '#475569' }}>{currentStage.positions || 1}</strong>
                  </div>
                </div>
              </div>
            </Col>
          )}
        </Row>

        {/* Application Modal */}
        <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)} size="lg" centered contentClassName="glass-panel" style={{ border: 'none' }}>
          <Modal.Header closeButton style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 2rem' }}>
            <Modal.Title style={{ fontWeight: '800', color: 'var(--bg-dark)' }}>Postuler à {currentStage?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '2rem' }}>
            {applicationSuccess ? (
              <Alert variant="success" className="text-center py-4" style={{ borderRadius: '16px', border: 'none', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Candidature envoyée !</h4>
                <p style={{ margin: 0 }}>L'entreprise a bien reçu votre profil. Elle vous contactera prochainement.</p>
              </Alert>
            ) : (
              <Form onSubmit={handleApplicationSubmit}>
                {applicationError && (
                  <Alert variant="danger" style={{ borderRadius: '12px', border: 'none', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>{applicationError}</Alert>
                )}

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '0.95rem' }}>Lettre de motivation *</Form.Label>
                  <Form.Control
                    as="textarea" rows={6}
                    placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce stage..."
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                    required
                    style={{
                      borderRadius: '12px', padding: '1rem', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                  />
                </Form.Group>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                    <FaCheckCircle />
                  </div>
                  <div>
                    <h6 style={{ margin: 0, fontWeight: '600', color: 'var(--bg-dark)' }}>Profil automatique</h6>
                    <small style={{ color: '#64748b' }}>Votre CV et vos informations de profil seront automatiquement joints.</small>
                  </div>
                </div>

                <div className="d-flex gap-3 justify-content-end">
                  <button type="button" onClick={() => setShowApplyModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: '600', padding: '0.8rem 1.5rem' }}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-modern btn-modern-primary px-4">
                    Envoyer ma candidature
                  </button>
                </div>
              </Form>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default StageDetails;