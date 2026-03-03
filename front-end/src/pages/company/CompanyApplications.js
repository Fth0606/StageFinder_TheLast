import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Form, Row, Col, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaCheck, FaTimes, FaDownload, FaStar, FaRegStar, FaGraduationCap, FaTrophy, FaMedal, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { fetchCompanyApplications, updateApplicationStatus } from '../../store/slices/companySlice';
import { apiService } from '../../services/api';

const StarRating = ({ value, onChange, max = 5 }) => (
  <div className="d-flex gap-1">
    {Array.from({ length: max }, (_, i) => (
      <span key={i} style={{ cursor: onChange ? 'pointer' : 'default', fontSize: '1.4rem', color: i < value ? '#f59e0b' : '#e2e8f0', transition: 'color 0.2s' }}
        onClick={() => onChange && onChange(i + 1)}>
        {i < value ? <FaStar /> : <FaRegStar />}
      </span>
    ))}
    <small className="ms-2 text-muted align-self-center font-weight-bold">{value}/{max}</small>
  </div>
);

const CompanyApplications = () => {
  const dispatch = useDispatch();
  const { applications, isLoading } = useSelector((state) => state.company);

  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [filter, setFilter] = useState('all');

  const [evaluation, setEvaluation] = useState({
    overall: 0,
    technical: 0,
    communication: 0,
    teamwork: 0,
    initiative: 0,
    comment: '',
    completed: false,
    start_date: '',
    end_date: '',
    certificate: false,
  });

  useEffect(() => { dispatch(fetchCompanyApplications()); }, [dispatch]);

  const getCandidateName = (app) => app?.student?.user?.name || 'Candidat';
  const getCandidateEmail = (app) => app?.student?.user?.email || '';
  const getCandidatePhone = (app) => app?.student?.phone || '';
  const getEducation = (app) => app?.student?.university || 'Non renseigné';
  const getSpecialite = (app) => app?.student?.specialite || 'Non renseigné';
  const getOfferTitle = (app) => app?.offer?.title || 'Offre';
  const getOfferLocation = (app) => app?.offer?.location || '';

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
    pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', text: 'En attente' },
    accepted: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', text: 'Acceptée' },
    rejected: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', text: 'Refusée' },
    withdrawn: { bg: '#f1f5f9', color: '#64748b', text: 'Retirée' },
  }[status] || { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', text: 'En attente' });

  const openDetail = (app) => { setSelectedApp(app); setShowDetailModal(true); };

  const openEvaluation = (app) => {
    setSelectedApp(app);
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
      await apiService.submitEvaluation(selectedApp.id, evaluation);
      setShowEvalModal(false);
      dispatch(fetchCompanyApplications());
    } catch (e) {
      console.error('Evaluation error:', e);
      setShowEvalModal(false);
    }
  };

  const getAverageScore = () => {
    const scores = [evaluation.overall, evaluation.technical, evaluation.communication, evaluation.teamwork, evaluation.initiative].filter(s => s > 0);
    return scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
  };

  const filteredApps = applications.filter(a => filter === 'all' || a.status === filter);
  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg-light)', position: 'relative', overflow: 'hidden', padding: '3rem 0' }}>
      <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px', background: 'var(--accent-color)', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '300px', height: '300px', background: '#f59e0b', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>

      <Container style={{ position: 'relative', zIndex: 1 }} fluid="lg">
        <div className="mb-4">
          <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)' }}>Candidatures reçues</h2>
          <p style={{ color: '#64748b' }}>Gérez les candidatures à vos offres de stage</p>
        </div>

        {/* Filters */}
        <div className="glass-panel p-4 mb-4">
          <div className="d-flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '600', transition: 'all 0.2s', border: filter === 'all' ? '1px solid var(--primary-color)' : '1px solid #e2e8f0', background: filter === 'all' ? 'var(--primary-color)' : 'white', color: filter === 'all' ? 'white' : '#64748b' }}
            >
              Toutes ({counts.all})
            </button>
            <button
              onClick={() => setFilter('pending')}
              style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '600', transition: 'all 0.2s', border: filter === 'pending' ? '1px solid #f59e0b' : '1px solid #e2e8f0', background: filter === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'white', color: filter === 'pending' ? '#f59e0b' : '#64748b' }}
            >
              En attente ({counts.pending})
            </button>
            <button
              onClick={() => setFilter('accepted')}
              style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '600', transition: 'all 0.2s', border: filter === 'accepted' ? '1px solid #10b981' : '1px solid #e2e8f0', background: filter === 'accepted' ? 'rgba(16, 185, 129, 0.1)' : 'white', color: filter === 'accepted' ? '#10b981' : '#64748b' }}
            >
              Acceptées ({counts.accepted})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '600', transition: 'all 0.2s', border: filter === 'rejected' ? '1px solid #ef4444' : '1px solid #e2e8f0', background: filter === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'white', color: filter === 'rejected' ? '#ef4444' : '#64748b' }}
            >
              Refusées ({counts.rejected})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="glass-panel p-0 overflow-hidden">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: 'var(--primary-color)' }} role="status" />
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-5" style={{ background: '#f8fafc' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'white', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}><FaEnvelope /></div>
              <h6 style={{ fontWeight: '700', color: 'var(--bg-dark)' }}>Aucune candidature</h6>
              <p style={{ color: '#64748b', margin: 0 }}>Aucune candidature ne correspond à ce statut.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover style={{ margin: 0, verticalAlign: 'middle', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Candidat</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Offre</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Date</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Statut</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map((app) => {
                    const sb = getStatusBadge(app.status);
                    return (
                      <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                        <td style={{ padding: '1.2rem 1.5rem', border: 'none' }}>
                          <strong style={{ color: 'var(--bg-dark)', display: 'block', fontSize: '1.05rem' }}>{getCandidateName(app)}</strong>
                          <small style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{getCandidateEmail(app)}</small>
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', border: 'none', maxWidth: '250px' }}>
                          <strong style={{ color: 'var(--bg-dark)', display: 'block', fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getOfferTitle(app)}</strong>
                          <div style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                            <FaMapMarkerAlt className="me-1 text-muted" /> {getOfferLocation(app)}
                          </div>
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', border: 'none', color: '#64748b' }}>
                          {formatDate(app.applied_at)}
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', border: 'none' }}>
                          <div style={{ background: sb.bg, color: sb.color, padding: '6px 14px', borderRadius: '50px', fontWeight: '700', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center' }}>
                            {sb.text}
                          </div>
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', border: 'none', textAlign: 'right' }}>
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              onClick={() => openDetail(app)}
                              style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                              title="Voir détails"
                            ><FaEye size={16} /></button>

                            {app.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleAccept(app)}
                                  style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                                  title="Accepter"
                                ><FaCheck size={16} /></button>
                                <button
                                  onClick={() => { setSelectedApp(app); setShowRejectModal(true); }}
                                  style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                                  title="Refuser"
                                ><FaTimes size={16} /></button>
                              </>
                            )}

                            {app.status === 'accepted' && (
                              <button
                                onClick={() => openEvaluation(app)}
                                style={{ background: 'white', border: '1px solid #f59e0b', color: '#f59e0b', fontWeight: '600', padding: '6px 12px', borderRadius: '10px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', fontSize: '0.85rem' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.05)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
                                title="Évaluer le stagiaire"
                              ><FaStar className="me-1" /> Évaluer</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </Container>


      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered contentClassName="glass-panel" style={{ border: 'none' }}>
        <Modal.Header closeButton style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 2rem' }}>
          <Modal.Title style={{ fontWeight: '800', color: 'var(--bg-dark)' }}>Détails de la candidature</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          {selectedApp && (
            <>
              <Row className="g-4 mb-4">
                <Col md={6}>
                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
                    <h6 style={{ fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}><FaGraduationCap className="me-2 text-primary" /> Candidat</h6>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--bg-dark)', display: 'block', marginBottom: '5px' }}>{getCandidateName(selectedApp)}</strong>
                    <div style={{ color: '#475569', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}><FaEnvelope className="me-2 text-muted" /> {getCandidateEmail(selectedApp)}</span>
                      {getCandidatePhone(selectedApp) && <span style={{ display: 'flex', alignItems: 'center' }}><FaPhone className="me-2 text-muted" /> {getCandidatePhone(selectedApp)}</span>}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
                    <h6 style={{ fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>📋 Offre</h6>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--bg-dark)', display: 'block', marginBottom: '5px' }}>{getOfferTitle(selectedApp)}</strong>
                    <div style={{ color: '#475569', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}><FaMapMarkerAlt className="me-2 text-muted" /> {getOfferLocation(selectedApp)}</span>
                      <span className="text-muted">Postulé le {formatDate(selectedApp.applied_at)}</span>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="g-4 mb-4">
                <Col md={6}>
                  <h6 style={{ fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px' }}>🎓 Formation</h6>
                  <p style={{ color: 'var(--bg-dark)', fontWeight: '500', marginBottom: '1rem' }}>{getEducation(selectedApp)}</p>
                  <h6 style={{ fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px' }}>📚 Spécialité</h6>
                  <p style={{ color: 'var(--bg-dark)', fontWeight: '500', margin: 0 }}>{getSpecialite(selectedApp)}</p>
                </Col>
                <Col md={6}>
                  <h6 style={{ fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px' }}>💡 Compétences</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {getSkills(selectedApp).length > 0
                      ? getSkills(selectedApp).map((s, i) => (
                        <span key={i} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', padding: '4px 12px', borderRadius: '50px', fontWeight: '600', fontSize: '0.85rem' }}>{s}</span>
                      ))
                      : <span className="text-muted">Non renseigné</span>}
                  </div>
                </Col>
              </Row>

              <div className="mb-4">
                <h6 style={{ fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px', marginBottom: '10px' }}>✉️ Lettre de motivation</h6>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#475569', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {selectedApp.cover_letter || <span className="text-muted fst-italic">Aucune lettre de motivation fournie</span>}
                </div>
              </div>

              {/* CV download */}
              <div>
                {selectedApp.cv_file ? (
                  <button onClick={() => window.open(`http://localhost:8000/storage/${selectedApp.cv_file}`, '_blank')} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', padding: '10px 20px', borderRadius: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'; e.currentTarget.style.color = 'var(--primary-color)'; }}>
                    <FaDownload className="me-2" /> Télécharger le CV
                  </button>
                ) : selectedApp?.student?.cv_path ? (
                  <button onClick={() => window.open(`http://localhost:8000/storage/${selectedApp.student.cv_path}`, '_blank')} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', padding: '10px 20px', borderRadius: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'; e.currentTarget.style.color = 'var(--primary-color)'; }}>
                    <FaDownload className="me-2" /> Télécharger le CV
                  </button>
                ) : (
                  <span className="text-muted fst-italic">Aucun CV joint</span>
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setShowDetailModal(false)} style={{ background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px' }}>Fermer</button>

          <div style={{ display: 'flex', gap: '10px' }}>
            {selectedApp?.status === 'pending' && (
              <>
                <button onClick={() => { setShowDetailModal(false); setShowRejectModal(true); }} style={{ background: 'white', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px' }}><FaTimes className="me-2" /> Refuser</button>
                <button onClick={() => handleAccept(selectedApp)} style={{ background: '#10b981', border: 'none', color: 'white', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' }}><FaCheck className="me-2" /> Accepter</button>
              </>
            )}
            {selectedApp?.status === 'accepted' && (
              <button onClick={() => { setShowDetailModal(false); openEvaluation(selectedApp); }} style={{ background: '#f59e0b', border: 'none', color: 'white', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(245, 158, 11, 0.2)' }}><FaStar className="me-2" /> Évaluer le stagiaire</button>
            )}
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered contentClassName="glass-panel" style={{ border: 'none' }}>
        <Modal.Header closeButton style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 2rem' }}>
          <Modal.Title style={{ fontWeight: '800', color: 'var(--bg-dark)' }}>Refuser la candidature</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          <Form.Group>
            <Form.Label style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Raison du refus (optionnel)</Form.Label>
            <Form.Control as="textarea" rows={4} value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Expliquez brièvement les raisons du refus pour le candidat..."
              style={{ padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', boxShadow: 'none', resize: 'vertical' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </Form.Group>
        </Modal.Body>
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={() => setShowRejectModal(false)} style={{ background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px' }}>Annuler</button>
          <button onClick={handleReject} style={{ background: '#ef4444', border: 'none', color: 'white', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)' }}>Confirmer le refus</button>
        </div>
      </Modal>

      {/* Evaluation Modal */}
      <Modal show={showEvalModal} onHide={() => setShowEvalModal(false)} size="lg" centered contentClassName="glass-panel" style={{ border: 'none', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', padding: '1.5rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontWeight: '800', display: 'flex', alignItems: 'center' }}><FaTrophy className="me-3" /> Évaluation — {selectedApp && getCandidateName(selectedApp)}</h4>
          <button onClick={() => setShowEvalModal(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', opacity: 0.8 }}><FaTimes /></button>
        </div>

        <Modal.Body style={{ padding: '2rem' }}>
          {selectedApp && (
            <>
              {/* Internship period */}
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                <h6 style={{ fontWeight: '700', color: 'var(--primary-color)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}><FaMedal className="me-2" /> Période de stage</h6>
                <Row className="g-3 align-items-end">
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label style={{ fontWeight: '600', color: '#475569', fontSize: '0.85rem' }}>Date de début</Form.Label>
                      <Form.Control type="date" value={evaluation.start_date}
                        onChange={(e) => setEvaluation({ ...evaluation, start_date: e.target.value })}
                        style={{ padding: '10px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: 'none' }} />
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label style={{ fontWeight: '600', color: '#475569', fontSize: '0.85rem' }}>Date de fin</Form.Label>
                      <Form.Control type="date" value={evaluation.end_date}
                        onChange={(e) => setEvaluation({ ...evaluation, end_date: e.target.value })}
                        style={{ padding: '10px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: 'none' }} />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <div style={{ background: evaluation.completed ? 'rgba(16, 185, 129, 0.1)' : 'white', border: evaluation.completed ? '1px solid #10b981' : '1px solid #e2e8f0', padding: '8px 10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '46px' }}>
                      <Form.Check type="switch" id="completed-switch" label={<span style={{ fontWeight: '600', color: evaluation.completed ? '#10b981' : '#64748b', fontSize: '0.85rem' }}>Terminé</span>} checked={evaluation.completed}
                        onChange={(e) => setEvaluation({ ...evaluation, completed: e.target.checked })}
                        className="m-0 custom-switch" />
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Ratings */}
              <h6 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}><FaStar className="me-2 text-warning" /> Évaluation des compétences</h6>
              <div style={{ background: '#fffbeb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #fde68a', marginBottom: '2rem' }}>
                {[
                  { key: 'overall', label: 'Note générale', desc: 'Impression globale' },
                  { key: 'technical', label: 'Compétences tech.', desc: 'Outils et technologies' },
                  { key: 'communication', label: 'Communication', desc: 'Expression écrite et orale' },
                  { key: 'teamwork', label: 'Travail en équipe', desc: 'Esprit collaboratif' },
                  { key: 'initiative', label: 'Initiative', desc: 'Proactivité et autonomie' },
                ].map(({ key, label, desc }) => (
                  <Row key={key} className="mb-3 align-items-center">
                    <Col md={4}>
                      <strong style={{ color: 'var(--bg-dark)', fontSize: '0.95rem', display: 'block' }}>{label}</strong>
                      <small style={{ color: '#92400e', fontSize: '0.8rem' }}>{desc}</small>
                    </Col>
                    <Col md={5}>
                      <StarRating value={evaluation[key]}
                        onChange={(v) => setEvaluation({ ...evaluation, [key]: v })} />
                    </Col>
                    <Col md={3}>
                      <div style={{ height: '8px', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(evaluation[key] / 5) * 100}%`, background: evaluation[key] >= 4 ? '#10b981' : evaluation[key] >= 3 ? '#f59e0b' : '#ef4444', transition: 'width 0.3s ease, background 0.3s ease' }}></div>
                      </div>
                    </Col>
                  </Row>
                ))}

                {getAverageScore() > 0 && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed #fcd34d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h5 style={{ margin: 0, fontWeight: '800', color: '#b45309', display: 'flex', alignItems: 'center' }}>
                      Score moyen : <span style={{ marginLeft: '10px', fontSize: '1.5rem', color: '#d97706' }}>{getAverageScore()}</span> / 5
                    </h5>
                    <div style={{ background: 'white', padding: '6px 16px', borderRadius: '50px', fontWeight: '700', color: '#d97706', border: '1px solid #fcd34d' }}>
                      {getAverageScore() >= 4.5 ? '🏆 Excellent' : getAverageScore() >= 3.5 ? '✅ Très bien' : getAverageScore() >= 2.5 ? '👍 Bien' : getAverageScore() >= 1.5 ? '⚠️ Passable' : '❌ Insuffisant'}
                    </div>
                  </div>
                )}
              </div>

              {/* Comment */}
              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: '700', color: 'var(--bg-dark)', display: 'flex', alignItems: 'center' }}>💬 Commentaire général</Form.Label>
                <Form.Control as="textarea" rows={4} value={evaluation.comment}
                  onChange={(e) => setEvaluation({ ...evaluation, comment: e.target.value })}
                  placeholder="Décrivez les points forts, les axes d'amélioration, et donnez vos impressions générales sur ce stagiaire..."
                  style={{ padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', boxShadow: 'none', resize: 'vertical' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </Form.Group>

              {/* Certificate */}
              <div style={{ background: evaluation.certificate ? 'rgba(16, 185, 129, 0.1)' : '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: evaluation.certificate ? '1px solid #10b981' : '1px solid #e2e8f0', display: 'flex', alignItems: 'center', transition: 'all 0.3s' }}>
                <Form.Check type="switch" id="certificate-switch"
                  label={
                    <div style={{ marginLeft: '10px' }}>
                      <strong style={{ color: evaluation.certificate ? '#059669' : 'var(--bg-dark)', display: 'block', marginBottom: '2px', fontSize: '1.05rem' }}><FaGraduationCap className="me-2" /> Délivrer une attestation</strong>
                      <span style={{ color: evaluation.certificate ? '#10b981' : '#64748b', fontSize: '0.85rem' }}>Le stagiaire recevra une notification officielle</span>
                    </div>
                  }
                  checked={evaluation.certificate}
                  onChange={(e) => setEvaluation({ ...evaluation, certificate: e.target.checked })}
                  className="m-0 custom-switch-lg align-items-center d-flex"
                />
              </div>
            </>
          )}
        </Modal.Body>
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(0,0,0,0.05)', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={() => setShowEvalModal(false)} style={{ background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px' }}>Annuler</button>
          <button onClick={handleSubmitEvaluation} style={{ background: 'var(--primary-color)', border: 'none', color: 'white', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center' }}>
            <FaTrophy className="me-2" /> Enregistrer l'évaluation
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyApplications;