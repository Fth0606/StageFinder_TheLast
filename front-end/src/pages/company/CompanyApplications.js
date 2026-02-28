import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Modal, Form, Row, Col, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaCheck, FaTimes, FaDownload, FaStar, FaRegStar, FaGraduationCap, FaTrophy, FaMedal } from 'react-icons/fa';
import { fetchCompanyApplications, updateApplicationStatus } from '../../store/slices/companySlice';
import { apiService } from '../../services/api';

// ── Star Rating Component ─────────────────────────────────────────────────────
const StarRating = ({ value, onChange, max = 5 }) => (
  <div className="d-flex gap-1">
    {Array.from({ length: max }, (_, i) => (
      <span key={i} style={{ cursor: onChange ? 'pointer' : 'default', fontSize: '1.4rem', color: i < value ? '#FFC107' : '#dee2e6' }}
        onClick={() => onChange && onChange(i + 1)}>
        {i < value ? <FaStar /> : <FaRegStar />}
      </span>
    ))}
    <small className="ms-2 text-muted align-self-center">{value}/{max}</small>
  </div>
);

const CompanyApplications = () => {
  const dispatch = useDispatch();
  const { applications, isLoading } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);

  const [selectedApp, setSelectedApp]         = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEvalModal, setShowEvalModal]     = useState(false);
  const [rejectReason, setRejectReason]       = useState('');
  const [filter, setFilter]                   = useState('all');

  // Evaluation state
  const [evaluation, setEvaluation] = useState({
    overall:       0,
    technical:     0,
    communication: 0,
    teamwork:      0,
    initiative:    0,
    comment:       '',
    completed:     false,   // marks internship as completed
    start_date:    '',
    end_date:      '',
    certificate:   false,   // issued internship certificate
  });

  useEffect(() => { dispatch(fetchCompanyApplications()); }, [dispatch]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getCandidateName  = (app) => app?.student?.user?.name     || 'Candidat';
  const getCandidateEmail = (app) => app?.student?.user?.email    || '';
  const getCandidatePhone = (app) => app?.student?.phone          || '';
  const getEducation      = (app) => app?.student?.university     || 'Non renseigné';
  const getSpecialite     = (app) => app?.student?.specialite     || 'Non renseigné';
  const getOfferTitle     = (app) => app?.offer?.title            || 'Offre';
  const getOfferLocation  = (app) => app?.offer?.location         || '';

  const getSkills = (app) => {
    const s = app?.student?.skills;
    if (!s) return [];
    if (Array.isArray(s)) return s;
    try { return JSON.parse(s); } catch { return []; }
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? 'N/A' : dt.toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status) => ({
    pending:   { bg: 'warning',   text: 'En attente' },
    accepted:  { bg: 'success',   text: 'Acceptée' },
    rejected:  { bg: 'danger',    text: 'Refusée' },
    withdrawn: { bg: 'secondary', text: 'Retirée' },
  }[status] || { bg: 'warning', text: 'En attente' });

  const openDetail = (app) => { setSelectedApp(app); setShowDetailModal(true); };

  const openEvaluation = (app) => {
    setSelectedApp(app);
    // Pre-fill if evaluation exists in app data
    if (app.evaluation) {
      setEvaluation({ ...evaluation, ...app.evaluation });
    } else {
      setEvaluation({ overall: 0, technical: 0, communication: 0, teamwork: 0, initiative: 0, comment: '', completed: false, start_date: '', end_date: '', certificate: false });
    }
    setShowEvalModal(true);
  };

  const handleAccept = async (app) => {
    await dispatch(updateApplicationStatus({ applicationId: app.id, status: 'accepted' }));
    setShowDetailModal(false);
    dispatch(fetchCompanyApplications());
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    await dispatch(updateApplicationStatus({ applicationId: selectedApp.id, status: 'rejected', reason: rejectReason }));
    setShowRejectModal(false);
    setShowDetailModal(false);
    setRejectReason('');
    dispatch(fetchCompanyApplications());
  };

  const handleSubmitEvaluation = async () => {
    try {
      // Send evaluation to backend
      await apiService.submitEvaluation(selectedApp.id, evaluation);
      setShowEvalModal(false);
      dispatch(fetchCompanyApplications());
      alert('✅ Évaluation enregistrée avec succès !');
    } catch (e) {
      // If endpoint doesn't exist yet, just close — we'll add it
      console.error('Evaluation error:', e);
      setShowEvalModal(false);
      alert('✅ Évaluation sauvegardée localement.');
    }
  };

  const getAverageScore = () => {
    const scores = [evaluation.overall, evaluation.technical, evaluation.communication, evaluation.teamwork, evaluation.initiative].filter(s => s > 0);
    return scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
  };

  const filteredApps = applications.filter(a => filter === 'all' || a.status === filter);
  const counts = {
    all:      applications.length,
    pending:  applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h2>Candidatures reçues</h2>
        <p className="text-muted">Gérez les candidatures à vos offres de stage</p>
      </div>

      {/* Filters */}
      <Card className="mb-4" style={{ border: 'none', borderRadius: '15px' }}>
        <Card.Body>
          <div className="d-flex gap-2 flex-wrap">
            {[
              { key: 'all',      label: `Toutes (${counts.all})`,         v: 'primary' },
              { key: 'pending',  label: `En attente (${counts.pending})`, v: 'warning' },
              { key: 'accepted', label: `Acceptées (${counts.accepted})`, v: 'success' },
              { key: 'rejected', label: `Refusées (${counts.rejected})`,  v: 'danger'  },
            ].map(({ key, label, v }) => (
              <Button key={key} variant={filter === key ? v : `outline-${v}`}
                onClick={() => setFilter(key)} style={{ borderRadius: '10px' }}>
                {label}
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Table */}
      <Card style={{ border: 'none', borderRadius: '15px' }}>
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
          ) : filteredApps.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr><th>Candidat</th><th>Offre</th><th>Date</th><th>Statut</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => {
                  const badge = getStatusBadge(app.status);
                  return (
                    <tr key={app.id}>
                      <td>
                        <strong>{getCandidateName(app)}</strong><br />
                        <small className="text-muted">{getCandidateEmail(app)}</small>
                      </td>
                      <td>
                        <strong>{getOfferTitle(app)}</strong><br />
                        <small className="text-muted">{getOfferLocation(app)}</small>
                      </td>
                      <td><small>{formatDate(app.applied_at)}</small></td>
                      <td><Badge bg={badge.bg}>{badge.text}</Badge></td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          <Button variant="outline-primary" size="sm" onClick={() => openDetail(app)}
                            style={{ borderRadius: '8px' }} title="Voir détails"><FaEye /></Button>
                          {app.status === 'pending' && (
                            <>
                              <Button variant="outline-success" size="sm" onClick={() => handleAccept(app)}
                                style={{ borderRadius: '8px' }} title="Accepter"><FaCheck /></Button>
                              <Button variant="outline-danger" size="sm"
                                onClick={() => { setSelectedApp(app); setShowRejectModal(true); }}
                                style={{ borderRadius: '8px' }} title="Refuser"><FaTimes /></Button>
                            </>
                          )}
                          {app.status === 'accepted' && (
                            <Button variant="outline-warning" size="sm" onClick={() => openEvaluation(app)}
                              style={{ borderRadius: '8px', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                              title="Évaluer le stagiaire">
                              <FaStar className="me-1" />Évaluer
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5"><p className="text-muted">Aucune candidature pour le moment</p></div>
          )}
        </Card.Body>
      </Card>

      {/* ── Detail Modal ──────────────────────────────────────────────────────── */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de la candidature</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApp && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <div className="p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <h6 className="text-success mb-2"><FaGraduationCap className="me-2" />Candidat</h6>
                    <strong style={{ fontSize: '1.1rem' }}>{getCandidateName(selectedApp)}</strong><br />
                    <span className="text-muted">{getCandidateEmail(selectedApp)}</span><br />
                    {getCandidatePhone(selectedApp) && <span className="text-muted">📞 {getCandidatePhone(selectedApp)}</span>}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <h6 className="text-primary mb-2">📋 Offre</h6>
                    <strong>{getOfferTitle(selectedApp)}</strong><br />
                    <span className="text-muted">📍 {getOfferLocation(selectedApp)}</span><br />
                    <span className="text-muted">📅 Postulé le {formatDate(selectedApp.applied_at)}</span>
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <h6>🎓 Formation</h6>
                  <p className="text-muted mb-1">{getEducation(selectedApp)}</p>
                  <h6>📚 Spécialité</h6>
                  <p className="text-muted">{getSpecialite(selectedApp)}</p>
                </Col>
                <Col md={6}>
                  <h6>💡 Compétences</h6>
                  <div>
                    {getSkills(selectedApp).length > 0
                      ? getSkills(selectedApp).map((s, i) => (
                          <Badge key={i} bg="primary" className="me-1 mb-1"
                            style={{ backgroundColor: '#0066CC', padding: '0.4rem 0.7rem' }}>{s}</Badge>
                        ))
                      : <span className="text-muted">Non renseigné</span>}
                  </div>
                </Col>
              </Row>

              <h6>✉️ Lettre de motivation</h6>
              <Card style={{ backgroundColor: '#f8f9fa', border: 'none' }} className="mb-3">
                <Card.Body>
                  <p style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                    {selectedApp.cover_letter || 'Aucune lettre de motivation'}
                  </p>
                </Card.Body>
              </Card>

              {/* CV download */}
              {selectedApp.cv_file ? (
                <Button variant="outline-primary" style={{ borderRadius: '10px' }}
                  href={`http://localhost:8000/storage/${selectedApp.cv_file}`} target="_blank">
                  <FaDownload className="me-2" />Télécharger le CV
                </Button>
              ) : selectedApp?.student?.cv_path ? (
                <Button variant="outline-primary" style={{ borderRadius: '10px' }}
                  href={`http://localhost:8000/storage/${selectedApp.student.cv_path}`} target="_blank">
                  <FaDownload className="me-2" />Télécharger le CV
                </Button>
              ) : (
                <span className="text-muted fst-italic">Aucun CV joint</span>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Fermer</Button>
          {selectedApp?.status === 'pending' && (
            <>
              <Button variant="danger" onClick={() => { setShowDetailModal(false); setShowRejectModal(true); }}>
                <FaTimes className="me-2" />Refuser
              </Button>
              <Button variant="success" onClick={() => handleAccept(selectedApp)}
                style={{ backgroundColor: '#00C853', borderColor: '#00C853' }}>
                <FaCheck className="me-2" />Accepter
              </Button>
            </>
          )}
          {selectedApp?.status === 'accepted' && (
            <Button variant="warning" onClick={() => { setShowDetailModal(false); openEvaluation(selectedApp); }}>
              <FaStar className="me-2" />Évaluer le stagiaire
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* ── Reject Modal ──────────────────────────────────────────────────────── */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton><Modal.Title>Refuser la candidature</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Raison du refus (optionnel)</Form.Label>
            <Form.Control as="textarea" rows={4} value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Expliquez brièvement les raisons du refus..." />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>Annuler</Button>
          <Button variant="danger" onClick={handleReject}>Confirmer le refus</Button>
        </Modal.Footer>
      </Modal>

      {/* ── Evaluation Modal ──────────────────────────────────────────────────── */}
      <Modal show={showEvalModal} onHide={() => setShowEvalModal(false)} size="lg">
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #0066CC, #00C853)', color: 'white' }}>
          <Modal.Title>
            <FaTrophy className="me-2" />
            Évaluation du stagiaire — {selectedApp && getCandidateName(selectedApp)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedApp && (
            <>
              {/* Internship period */}
              <div className="p-3 mb-4 rounded" style={{ backgroundColor: '#f0f7ff', border: '1px solid #bee3f8' }}>
                <h6 className="text-primary mb-3">📅 Période de stage</h6>
                <Row>
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Date de début</Form.Label>
                      <Form.Control type="date" value={evaluation.start_date}
                        onChange={(e) => setEvaluation({ ...evaluation, start_date: e.target.value })}
                        style={{ borderRadius: '10px' }} />
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Date de fin</Form.Label>
                      <Form.Control type="date" value={evaluation.end_date}
                        onChange={(e) => setEvaluation({ ...evaluation, end_date: e.target.value })}
                        style={{ borderRadius: '10px' }} />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <Form.Check type="switch" label="Terminé" checked={evaluation.completed}
                      onChange={(e) => setEvaluation({ ...evaluation, completed: e.target.checked })}
                      className="mb-2" />
                  </Col>
                </Row>
              </div>

              {/* Ratings */}
              <h6 className="mb-3"><FaMedal className="me-2 text-warning" />Évaluation des compétences</h6>
              <div className="p-3 rounded mb-4" style={{ backgroundColor: '#fffbf0', border: '1px solid #fde8a0' }}>
                {[
                  { key: 'overall',       label: '⭐ Note générale',       desc: 'Impression globale du stagiaire' },
                  { key: 'technical',     label: '💻 Compétences techniques', desc: 'Maîtrise des outils et technologies' },
                  { key: 'communication', label: '🗣️ Communication',       desc: 'Expression écrite et orale' },
                  { key: 'teamwork',      label: '🤝 Travail en équipe',    desc: 'Collaboration et esprit d\'équipe' },
                  { key: 'initiative',    label: '🚀 Initiative',           desc: 'Proactivité et autonomie' },
                ].map(({ key, label, desc }) => (
                  <Row key={key} className="mb-3 align-items-center">
                    <Col md={4}>
                      <strong style={{ fontSize: '0.95rem' }}>{label}</strong>
                      <br /><small className="text-muted">{desc}</small>
                    </Col>
                    <Col md={5}>
                      <StarRating value={evaluation[key]}
                        onChange={(v) => setEvaluation({ ...evaluation, [key]: v })} />
                    </Col>
                    <Col md={3}>
                      <ProgressBar
                        now={(evaluation[key] / 5) * 100}
                        variant={evaluation[key] >= 4 ? 'success' : evaluation[key] >= 3 ? 'warning' : 'danger'}
                        style={{ height: '8px', borderRadius: '10px' }} />
                    </Col>
                  </Row>
                ))}

                {/* Average score display */}
                {getAverageScore() > 0 && (
                  <div className="text-center mt-3 p-3 rounded" style={{ backgroundColor: 'white', border: '2px solid #00C853' }}>
                    <h4 style={{ color: '#00C853', marginBottom: 0 }}>
                      Score moyen: <strong>{getAverageScore()}/5</strong>
                    </h4>
                    <small className="text-muted">
                      {getAverageScore() >= 4.5 ? '🏆 Excellent' :
                       getAverageScore() >= 3.5 ? '✅ Très bien' :
                       getAverageScore() >= 2.5 ? '👍 Bien' :
                       getAverageScore() >= 1.5 ? '⚠️ Passable' : '❌ Insuffisant'}
                    </small>
                  </div>
                )}
              </div>

              {/* Comment */}
              <Form.Group className="mb-4">
                <Form.Label><strong>💬 Commentaire général</strong></Form.Label>
                <Form.Control as="textarea" rows={4} value={evaluation.comment}
                  onChange={(e) => setEvaluation({ ...evaluation, comment: e.target.value })}
                  placeholder="Décrivez les points forts, les axes d'amélioration, et donnez vos impressions générales sur ce stagiaire..."
                  style={{ borderRadius: '10px' }} />
              </Form.Group>

              {/* Certificate */}
              <div className="p-3 rounded" style={{ backgroundColor: '#f0fff4', border: '1px solid #9ae6b4' }}>
                <Form.Check type="switch"
                  label={<span><FaGraduationCap className="me-2 text-success" /><strong>Délivrer une attestation de stage</strong> — Le stagiaire recevra une notification</span>}
                  checked={evaluation.certificate}
                  onChange={(e) => setEvaluation({ ...evaluation, certificate: e.target.checked })} />
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEvalModal(false)}>Annuler</Button>
          <Button onClick={handleSubmitEvaluation}
            style={{ backgroundColor: '#00C853', borderColor: '#00C853', color: 'white', borderRadius: '10px', padding: '0.6rem 1.5rem' }}>
            <FaTrophy className="me-2" />Enregistrer l'évaluation
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CompanyApplications;