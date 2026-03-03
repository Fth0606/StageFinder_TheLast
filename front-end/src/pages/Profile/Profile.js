import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Badge, Alert, Modal, ProgressBar } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FaEdit, FaBriefcase, FaGraduationCap, FaFilePdf, FaUpload, FaDownload,
  FaTrash, FaCheckCircle, FaMapMarkerAlt, FaPhone, FaStar, FaTrophy, FaMedal
} from 'react-icons/fa';
import { fetchUserProfile, fetchUserApplications } from '../../store/slices/userSlice';
import api from '../../services/api';

const StarDisplay = ({ value, max = 5 }) => (
  <span>
    {Array.from({ length: max }, (_, i) => (
      <FaStar key={i} style={{ color: i < value ? '#fbbf24' : '#e2e8f0', fontSize: '1rem' }} />
    ))}
    <small className="ms-1" style={{ color: '#94a3b8', fontWeight: 'bold' }}>{value}/{max}</small>
  </span>
);

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { profile, applications } = useSelector((state) => state.user);

  const [showCvModal, setShowCvModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [cvError, setCvError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserApplications());
  }, [dispatch]);

  const student = profile?.student || user?.student || null;
  const university = student?.university || null;
  const specialite = student?.specialite || null;
  const location = student?.location || null;
  const phone = student?.phone || null;
  const bio = profile?.bio || user?.bio || null;
  const cvPath = student?.cv_path || null;

  const parseSkills = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; }
    catch { return typeof raw === 'string' && raw.trim() ? [raw] : []; }
  };
  const skills = parseSkills(student?.skills);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { setCvError('Format non supporté. PDF, DOC ou DOCX uniquement.'); return; }
    if (file.size > 5 * 1024 * 1024) { setCvError('Fichier trop volumineux (max 5MB).'); return; }

    setCvError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('cv', file);
      await api.post('/profile/upload-cv', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploadSuccess(true);
      dispatch(fetchUserProfile());
      setTimeout(() => { setUploadSuccess(false); setShowCvModal(false); }, 2000);
    } catch (err) {
      setCvError(err.response?.data?.message || 'Erreur lors de l\'upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCv = async () => {
    try {
      await api.delete('/profile/delete-cv');
      dispatch(fetchUserProfile());
    } catch { }
  };

  const roleBadge = () => {
    const role = user?.role;
    if (role === 'student') return { text: 'Étudiant', color: 'var(--primary-color)', bg: 'rgba(99, 102, 241, 0.1)' };
    if (role === 'company') return { text: 'Entreprise', color: 'var(--accent-color)', bg: 'rgba(14, 165, 233, 0.1)' };
    if (role === 'admin') return { text: 'Admin', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
    return { text: role || 'Utilisateur', color: '#64748b', bg: '#f1f5f9' };
  };
  const badge = roleBadge();

  const formatDate = (d) => {
    if (!d) return 'N/A';
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? 'N/A' : dt.toLocaleDateString('fr-FR');
  };

  const getEval = (app) => app?.evaluation || null;
  const avgScore = (ev) => {
    if (!ev) return 0;
    const vals = [ev.overall, ev.technical, ev.communication, ev.teamwork, ev.initiative].filter(v => v > 0);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0;
  };
  const scoreLabel = (s) => {
    if (s >= 4.5) return { text: '🏆 Excellent', color: '#10b981' };
    if (s >= 3.5) return { text: '✅ Très bien', color: '#3b82f6' };
    if (s >= 2.5) return { text: '👍 Bien', color: '#f59e0b' };
    if (s >= 1.5) return { text: '⚠️ Passable', color: '#f97316' };
    return { text: '❌ Insuffisant', color: '#ef4444' };
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg-light)', position: 'relative', overflow: 'hidden', padding: '3rem 0' }}>
      {/* Dynamic Backgrounds */}
      <div style={{ position: 'absolute', top: '5%', left: '-5%', width: '400px', height: '400px', background: 'var(--primary-color)', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '500px', height: '500px', background: 'var(--secondary-color)', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>

      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row className="g-4">
          {/* Left column */}
          <Col lg={4}>
            {/* Profile card */}
            <div className="glass-panel text-center p-4 mb-4">
              <div style={{
                width: '120px', height: '120px', borderRadius: '24px', margin: '0 auto 1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                color: 'white', fontSize: '2.5rem', fontWeight: 'bold',
                boxShadow: '0 15px 30px rgba(99, 102, 241, 0.3)', overflow: 'hidden'
              }}>
                {user?.profile_picture
                  ? <img src={`http://localhost:8000/storage/${user.profile_picture}`} alt={user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span>{user?.name?.charAt(0)?.toUpperCase()}</span>}
              </div>

              <h3 style={{ fontWeight: '800', color: 'var(--bg-dark)', marginBottom: '0.2rem' }}>{user?.name}</h3>
              <p style={{ color: '#64748b', marginBottom: '1rem', fontWeight: '500' }}>{user?.email}</p>

              <div className="d-flex justify-content-center gap-2 mb-4">
                {phone && (
                  <Badge bg="transparent" style={{ color: '#475569', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
                    <FaPhone style={{ color: 'var(--primary-color)', marginRight: '6px' }} /> {phone}
                  </Badge>
                )}
                {location && (
                  <Badge bg="transparent" style={{ color: '#475569', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
                    <FaMapMarkerAlt style={{ color: 'var(--accent-color)', marginRight: '6px' }} /> {location}
                  </Badge>
                )}
              </div>

              <div style={{ display: 'inline-block', color: badge.color, background: badge.bg, padding: '6px 16px', borderRadius: '50px', fontWeight: '700', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {badge.text}
              </div>

              {bio && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', fontStyle: 'italic', color: '#475569', fontSize: '0.95rem' }}>
                  "{bio}"
                </div>
              )}

              <button className="btn-modern btn-modern-primary w-100" onClick={() => navigate('/edit-profile')}>
                <FaEdit className="me-2" /> Modifier le profil
              </button>
            </div>

            {/* CV card */}
            <div className="glass-panel p-0 overflow-hidden">
              <div style={{ background: 'linear-gradient(135deg, var(--accent-color), #0284c7)', padding: '1.2rem 1.5rem', color: 'white' }}>
                <h6 style={{ margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center' }}><FaFilePdf className="me-2" /> Mon CV</h6>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {cvPath ? (
                  <div>
                    <div style={{ backgroundColor: 'rgba(14, 165, 233, 0.05)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(14, 165, 233, 0.2)', display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginRight: '1rem' }}>
                        <FaFilePdf />
                      </div>
                      <div className="flex-grow-1" style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: '600', color: 'var(--bg-dark)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cvPath.split('/').pop()}
                        </div>
                        <small style={{ color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                          <FaCheckCircle className="me-1" /> Sauvegardé
                        </small>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <button onClick={() => window.open(`http://localhost:8000/storage/${cvPath}`, '_blank')} style={{ background: 'white', color: 'var(--accent-color)', border: '1px solid var(--accent-color)', borderRadius: '10px', padding: '0.6rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-color)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--accent-color)'; }}>
                        <FaDownload className="me-2" /> Télécharger
                      </button>
                      <button onClick={() => setShowCvModal(true)} style={{ background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.6rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.color = 'var(--primary-color)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}>
                        <FaUpload className="me-2" /> Remplacer
                      </button>
                      <button onClick={handleDeleteCv} style={{ background: 'white', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '0.6rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#ef4444'; }}>
                        <FaTrash className="me-2" /> Supprimer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem' }}>
                      <FaFilePdf />
                    </div>
                    <p style={{ color: '#64748b', fontWeight: '500', marginBottom: '1.5rem' }}>Aucun CV ajouté</p>
                    <button onClick={() => setShowCvModal(true)} style={{ background: 'var(--accent-color)', border: 'none', color: 'white', borderRadius: '10px', padding: '0.8rem 1.5rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                      <FaUpload className="me-2" /> Ajouter mon CV
                    </button>
                    <small style={{ display: 'block', marginTop: '1rem', color: '#94a3b8' }}>PDF, DOC ou DOCX (max 5MB)</small>
                  </div>
                )}
              </div>
            </div>
          </Col>

          {/* Right column */}
          <Col lg={8}>
            {/* About card */}
            <div className="glass-panel p-4 mb-4">
              <h5 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                  <FaGraduationCap size={16} />
                </div>
                À propos
              </h5>

              <Row className="g-4">
                <Col md={6}>
                  <div style={{ background: '#f8fafc', padding: '1rem 1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>Université / École</span>
                    <strong style={{ color: 'var(--bg-dark)', fontSize: '1.05rem' }}>{university || 'Non renseigné'}</strong>
                  </div>
                </Col>
                <Col md={6}>
                  <div style={{ background: '#f8fafc', padding: '1rem 1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>Spécialité</span>
                    <strong style={{ color: 'var(--bg-dark)', fontSize: '1.05rem' }}>{specialite || 'Non renseigné'}</strong>
                  </div>
                </Col>
                <Col md={12}>
                  <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>Compétences clés</span>
                    <div className="d-flex flex-wrap gap-2">
                      {skills.length > 0 ? skills.map((s, i) => (
                        <div key={i} style={{ background: 'white', color: 'var(--primary-color)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '6px 14px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                          {s}
                        </div>
                      )) : <p className="text-muted m-0" style={{ fontSize: '0.9rem' }}>Aucune compétence ajoutée</p>}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Applications card */}
            <div className="glass-panel p-4 pb-2">
              <h5 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                  <FaBriefcase size={16} />
                </div>
                Mes Candidatures ({Array.isArray(applications) ? applications.length : 0})
              </h5>

              {Array.isArray(applications) && applications.length > 0 ? (
                applications.map((app) => {
                  const ev = getEval(app);
                  const avg = avgScore(ev);
                  const lbl = scoreLabel(avg);

                  const getStatusBadge = (status) => {
                    if (status === 'accepted') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', text: 'Accepté' };
                    if (status === 'rejected') return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', text: 'Refusé' };
                    return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', text: 'En attente' };
                  };
                  const statusBadge = getStatusBadge(app.status);

                  return (
                    <div key={app.id} className="mb-4" style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--secondary-color)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.03)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 style={{ fontWeight: '700', color: 'var(--bg-dark)', margin: 0, fontSize: '1.1rem' }}>{app.offer?.title || 'N/A'}</h6>
                            <p style={{ color: 'var(--primary-color)', fontWeight: '600', margin: '4px 0 10px 0', fontSize: '0.95rem' }}>
                              {app.offer?.company?.company_name || 'N/A'}
                            </p>
                            <small style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                              <FaMapMarkerAlt className="me-1" /> Postulé le {formatDate(app.applied_at)}
                            </small>
                          </div>
                          <div style={{ background: statusBadge.bg, color: statusBadge.color, padding: '6px 12px', borderRadius: '50px', fontWeight: '700', fontSize: '0.8rem', display: 'inline-block' }}>
                            {statusBadge.text}
                          </div>
                        </div>

                        {ev && (
                          <div className="mt-4 pt-3" style={{ borderTop: '1px dashed #e2e8f0' }}>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <h6 style={{ margin: 0, fontWeight: '700', color: 'var(--bg-dark)', display: 'flex', alignItems: 'center' }}>
                                <FaTrophy style={{ color: '#f59e0b', marginRight: '8px', fontSize: '1.1rem' }} /> Évaluation de fin de stage
                              </h6>
                              <div style={{ color: lbl.color, fontWeight: '800', background: `${lbl.color}15`, padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                                {lbl.text} ({avg}/5)
                              </div>
                            </div>

                            <Row className="g-3 mb-3">
                              {[
                                { key: 'overall', label: 'Globale' },
                                { key: 'technical', label: 'Technique' },
                                { key: 'communication', label: 'Communication' },
                                { key: 'teamwork', label: 'Travail équipe' },
                                { key: 'initiative', label: 'Initiative' },
                              ].map(({ key, label }) => ev[key] > 0 && (
                                <Col md={6} key={key}>
                                  <div style={{ background: '#f8fafc', padding: '10px 15px', borderRadius: '10px' }}>
                                    <div className="d-flex justify-content-between mb-1">
                                      <small style={{ fontWeight: '600', color: '#475569' }}>{label}</small>
                                      <StarDisplay value={ev[key]} />
                                    </div>
                                    <ProgressBar now={(ev[key] / 5) * 100} style={{ height: '4px', borderRadius: '10px', backgroundColor: '#e2e8f0' }}
                                      variant={ev[key] >= 4 ? 'success' : ev[key] >= 3 ? 'warning' : 'danger'} />
                                  </div>
                                </Col>
                              ))}
                            </Row>

                            {ev.comment && (
                              <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid var(--primary-color)', color: '#475569', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '1rem' }}>
                                "{ev.comment}"
                              </div>
                            )}

                            <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                              {ev.certificate && (
                                <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '6px 14px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                                  <FaMedal className="me-2" /> Attestation délivrée
                                </div>
                              )}
                              {(ev.start_date || ev.end_date) && (
                                <small style={{ color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '4px 12px', borderRadius: '50px' }}>
                                  <strong className="me-2 text-dark">Période :</strong> {ev.start_date ? formatDate(ev.start_date) : '?'} → {ev.end_date ? formatDate(ev.end_date) : 'En cours'}
                                </small>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-5" style={{ background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'white', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <FaBriefcase />
                  </div>
                  <h6 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '5px' }}>Aucune candidature</h6>
                  <p style={{ color: '#64748b', margin: 0 }}>Vous n'avez pas encore postulé à une offre de stage.</p>
                  <button className="btn-modern btn-modern-primary mt-3 px-4" onClick={() => navigate('/stages')}>
                    Découvrir les offres
                  </button>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>


      <Modal show={showCvModal} onHide={() => setShowCvModal(false)} centered contentClassName="glass-panel" style={{ border: 'none' }}>
        <Modal.Header closeButton style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 2rem' }}>
          <Modal.Title style={{ fontWeight: '800', color: 'var(--bg-dark)', display: 'flex', alignItems: 'center' }}>
            <FaUpload className="me-2 text-primary" /> {cvPath ? 'Remplacer mon CV' : 'Ajouter mon CV'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-5">
          {uploadSuccess ? (
            <Alert variant="success" className="text-center py-4" style={{ borderRadius: '16px', border: 'none', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <FaCheckCircle size={50} style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontWeight: '700' }}>CV validé !</h4>
              <p style={{ margin: 0 }}>Votre profil est maintenant à jour.</p>
            </Alert>
          ) : (
            <>
              {cvError && <Alert variant="danger" style={{ borderRadius: '12px', border: 'none', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }} onClose={() => setCvError('')} dismissible>{cvError}</Alert>}
              <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 1.5rem' }}>
                <FaFilePdf />
              </div>
              <h5 style={{ fontWeight: '700', color: 'var(--bg-dark)' }}>Sélectionnez votre document</h5>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>Formats acceptés : PDF, DOC, DOCX (Max 5MB)</p>

              <input type="file" id="cv-upload" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: 'none' }} />
              <button
                className="btn-modern btn-modern-primary w-100 py-3"
                disabled={uploading}
                onClick={() => document.getElementById('cv-upload').click()}
                style={{ fontSize: '1.05rem', opacity: uploading ? 0.7 : 1 }}
              >
                <FaUpload className="me-2" /> {uploading ? 'Envoi en cours...' : 'Choisir un fichier depuis cet appareil'}
              </button>
            </>
          )}
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default Profile;