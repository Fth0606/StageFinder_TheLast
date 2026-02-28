import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal, ProgressBar } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaBriefcase, FaGraduationCap, FaFilePdf, FaUpload, FaDownload,
         FaTrash, FaCheckCircle, FaMapMarkerAlt, FaPhone, FaStar, FaTrophy, FaMedal } from 'react-icons/fa';
import { fetchUserProfile, fetchUserApplications } from '../../store/slices/userSlice';
import api from '../../services/api';

// ── Star display (read-only) ──────────────────────────────────────────────────
const StarDisplay = ({ value, max = 5 }) => (
  <span>
    {Array.from({ length: max }, (_, i) => (
      <FaStar key={i} style={{ color: i < value ? '#FFC107' : '#dee2e6', fontSize: '1rem' }} />
    ))}
    <small className="ms-1 text-muted">{value}/{max}</small>
  </span>
);

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user }                      = useSelector((state) => state.auth);
  const { profile, applications }     = useSelector((state) => state.user);

  const [showCvModal, setShowCvModal]       = useState(false);
  const [uploadSuccess, setUploadSuccess]   = useState(false);
  const [cvError, setCvError]               = useState('');
  const [uploading, setUploading]           = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserApplications());
  }, [dispatch]);

  // ── Data helpers ──────────────────────────────────────────────────────────
  const student    = profile?.student || user?.student || null;
  const university = student?.university || null;
  const specialite = student?.specialite || null;
  const location   = student?.location   || null;
  const phone      = student?.phone      || null;
  const bio        = profile?.bio        || user?.bio  || null;
  const cvPath     = student?.cv_path    || null; // DB column in students table

  // Skills: DB stores as JSON string OR array (cast handles it, but be safe)
  const parseSkills = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; }
    catch { return typeof raw === 'string' && raw.trim() ? [raw] : []; }
  };
  const skills = parseSkills(student?.skills);

  // ── CV upload to server ───────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { setCvError('Format non supporté. PDF, DOC ou DOCX uniquement.'); return; }
    if (file.size > 5 * 1024 * 1024)  { setCvError('Fichier trop volumineux (max 5MB).'); return; }

    setCvError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('cv', file);
      await api.post('/profile/upload-cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadSuccess(true);
      dispatch(fetchUserProfile()); // refresh to get new cv_path
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
    } catch {
      // silently ignore
    }
  };

  const roleBadge = () => {
    const role = user?.role;
    if (role === 'student') return { bg: 'info',    text: 'Étudiant' };
    if (role === 'company') return { bg: 'success', text: 'Entreprise' };
    if (role === 'admin')   return { bg: 'danger',  text: 'Admin' };
    return { bg: 'secondary', text: role || 'Utilisateur' };
  };
  const badge = roleBadge();

  const formatDate = (d) => {
    if (!d) return 'N/A';
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? 'N/A' : dt.toLocaleDateString('fr-FR');
  };

  // ── Evaluation helpers ────────────────────────────────────────────────────
  const getEval    = (app) => app?.evaluation || null;
  const avgScore   = (ev)  => {
    if (!ev) return 0;
    const vals = [ev.overall, ev.technical, ev.communication, ev.teamwork, ev.initiative].filter(v => v > 0);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0;
  };
  const scoreLabel = (s) => {
    if (s >= 4.5) return { text: '🏆 Excellent',    color: '#00C853' };
    if (s >= 3.5) return { text: '✅ Très bien',     color: '#0066CC' };
    if (s >= 2.5) return { text: '👍 Bien',          color: '#FFA726' };
    if (s >= 1.5) return { text: '⚠️ Passable',     color: '#FF7043' };
    return             { text: '❌ Insuffisant',     color: '#dc3545' };
  };

  return (
    <Container style={{ background: '#f8f9fa', minHeight: '100vh', padding: '3rem 0' }}>
      <Row>
        {/* ── Left column ───────────────────────────────────────────────── */}
        <Col lg={4} className="mb-4">

          {/* Profile card */}
          <Card style={{ border:'none', borderRadius:'20px', boxShadow:'0 5px 20px rgba(0,0,0,0.1)', marginBottom:'1.5rem' }}>
            <Card.Body className="text-center p-4">
              <div style={{
                width:'120px', height:'120px', borderRadius:'50%', margin:'0 auto 1rem',
                display:'flex', alignItems:'center', justifyContent:'center',
                background:'linear-gradient(135deg, #0066CC, #00C853)',
                color:'white', fontSize:'2.5rem', fontWeight:'bold',
                boxShadow:'0 5px 20px rgba(0,0,0,0.1)', overflow:'hidden'
              }}>
                {user?.profile_picture
                  ? <img src={`http://localhost:8000/storage/${user.profile_picture}`} alt={user?.name}
                      style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <span>{user?.name?.charAt(0)?.toUpperCase()}</span>}
              </div>

              <h4>{user?.name}</h4>
              <p className="text-muted mb-1">{user?.email}</p>

              {/* Phone — DB: students.phone */}
              {phone && (
                <p className="text-muted mb-1" style={{ fontSize:'0.9rem' }}>
                  <FaPhone className="me-1" />{phone}
                </p>
              )}
              {/* Location — DB: students.location */}
              {location && (
                <p className="text-muted mb-2" style={{ fontSize:'0.9rem' }}>
                  <FaMapMarkerAlt className="me-1" />{location}
                </p>
              )}

              <Badge bg={badge.bg} className="mb-3" style={{ fontSize:'0.9rem', padding:'0.5rem 1rem' }}>
                {badge.text}
              </Badge>

              {bio && (
                <p className="text-muted small mb-3" style={{ fontStyle:'italic' }}>"{bio}"</p>
              )}

              <Button variant="primary" className="w-100"
                onClick={() => navigate('/edit-profile')}
                style={{ backgroundColor:'#0066CC', borderColor:'#0066CC', borderRadius:'10px', padding:'0.75rem', fontWeight:'600' }}>
                <FaEdit className="me-2" />Modifier le profil
              </Button>
            </Card.Body>
          </Card>

          {/* CV card — uploads to server, not localStorage */}
          <Card style={{ border:'none', borderRadius:'20px', boxShadow:'0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{ background:'linear-gradient(135deg, #00C853, #00A844)', color:'white', borderRadius:'20px 20px 0 0', padding:'1rem' }}>
              <h6 className="mb-0"><FaFilePdf className="me-2" />Mon CV</h6>
            </Card.Header>
            <Card.Body style={{ padding:'1.5rem' }}>
              {cvPath ? (
                <div>
                  <div style={{ backgroundColor:'#f8f9fa', borderRadius:'12px', padding:'1rem', marginBottom:'1rem', border:'2px solid #00C853' }}>
                    <div className="d-flex align-items-center">
                      <FaFilePdf style={{ color:'#dc3545', fontSize:'2rem', marginRight:'1rem' }} />
                      <div className="flex-grow-1">
                        <div style={{ fontWeight:'600', fontSize:'0.9rem' }}>
                          {cvPath.split('/').pop()}
                        </div>
                        <small className="text-muted">CV enregistré sur le serveur</small>
                      </div>
                      <FaCheckCircle style={{ color:'#00C853', fontSize:'1.5rem' }} />
                    </div>
                  </div>
                  <div className="d-grid gap-2">
                    <Button variant="outline-success"
                      href={`http://localhost:8000/storage/${cvPath}`} target="_blank"
                      style={{ borderRadius:'10px' }}>
                      <FaDownload className="me-2" />Télécharger
                    </Button>
                    <Button variant="outline-primary" onClick={() => setShowCvModal(true)} style={{ borderRadius:'10px' }}>
                      <FaUpload className="me-2" />Remplacer
                    </Button>
                    <Button variant="outline-danger" onClick={handleDeleteCv} style={{ borderRadius:'10px' }}>
                      <FaTrash className="me-2" />Supprimer
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <FaFilePdf style={{ fontSize:'3rem', color:'#ccc', marginBottom:'1rem' }} />
                  <p className="text-muted mb-3">Aucun CV ajouté</p>
                  <Button variant="success" onClick={() => setShowCvModal(true)}
                    style={{ backgroundColor:'#00C853', borderColor:'#00C853', borderRadius:'10px', padding:'0.75rem 1.5rem' }}>
                    <FaUpload className="me-2" />Ajouter mon CV
                  </Button>
                  <small className="d-block mt-2 text-muted">PDF, DOC ou DOCX (max 5MB)</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* ── Right column ──────────────────────────────────────────────── */}
        <Col lg={8}>

          {/* About card */}
          <Card className="mb-4" style={{ border:'none', borderRadius:'20px', boxShadow:'0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{ background:'white', borderBottom:'2px solid #e9ecef', borderRadius:'20px 20px 0 0', padding:'1.5rem' }}>
              <h5 className="mb-0" style={{ color:'#0066CC' }}>
                <FaGraduationCap className="me-2" />À propos
              </h5>
            </Card.Header>
            <Card.Body style={{ padding:'1.5rem' }}>
              <Row>
                <Col md={6} className="mb-3">
                  <strong>Université / École :</strong>
                  <p className="text-muted">{university || 'Non renseigné'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Spécialité :</strong>
                  <p className="text-muted">{specialite || 'Non renseigné'}</p>
                </Col>
                <Col md={12}>
                  <strong>Compétences :</strong>
                  <div className="mt-2">
                    {skills.length > 0
                      ? skills.map((s, i) => (
                          <Badge key={i} bg="primary" className="me-2 mb-2"
                            style={{ backgroundColor:'#0066CC', padding:'0.5rem 0.75rem', fontSize:'0.85rem' }}>
                            {s}
                          </Badge>
                        ))
                      : <p className="text-muted">Aucune compétence ajoutée</p>}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Applications card */}
          <Card className="mb-4" style={{ border:'none', borderRadius:'20px', boxShadow:'0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{ background:'white', borderBottom:'2px solid #e9ecef', borderRadius:'20px 20px 0 0', padding:'1.5rem' }}>
              <h5 className="mb-0" style={{ color:'#0066CC' }}>
                <FaBriefcase className="me-2" />
                Mes Candidatures ({Array.isArray(applications) ? applications.length : 0})
              </h5>
            </Card.Header>
            <Card.Body style={{ padding:'1.5rem' }}>
              {Array.isArray(applications) && applications.length > 0 ? (
                applications.map((app) => {
                  const ev  = getEval(app);
                  const avg = avgScore(ev);
                  const lbl = scoreLabel(avg);
                  return (
                    <div key={app.id} className="mb-3 p-3"
                      style={{ backgroundColor:'#f8f9fa', borderRadius:'12px', border:'1px solid #e9ecef' }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div style={{ flex:1 }}>
                          <h6 className="mb-1">{app.offer?.title || 'N/A'}</h6>
                          <p className="text-muted mb-1" style={{ fontSize:'0.9rem' }}>
                            {app.offer?.company?.company_name || 'N/A'}
                          </p>
                          <small className="text-muted">Postulé le {formatDate(app.applied_at)}</small>
                        </div>
                        <Badge bg={
                          app.status === 'accepted' ? 'success' :
                          app.status === 'rejected' ? 'danger' : 'warning'
                        }>
                          {app.status === 'pending'  && 'En attente'}
                          {app.status === 'accepted' && 'Accepté'}
                          {app.status === 'rejected' && 'Refusé'}
                        </Badge>
                      </div>

                      {/* Evaluation block — shown if company evaluated this application */}
                      {ev && (
                        <div className="mt-3 p-3 rounded" style={{ backgroundColor:'white', border:'1px solid #e9ecef' }}>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <FaTrophy style={{ color:'#FFC107' }} />
                            <strong style={{ fontSize:'0.9rem' }}>Évaluation de l'entreprise</strong>
                            <span style={{ color: lbl.color, fontWeight:'bold', fontSize:'0.9rem' }}>{lbl.text}</span>
                          </div>

                          <Row className="mb-2">
                            {[
                              { key:'overall',       label:'Note générale' },
                              { key:'technical',     label:'Technique' },
                              { key:'communication', label:'Communication' },
                              { key:'teamwork',      label:'Travail en équipe' },
                              { key:'initiative',    label:'Initiative' },
                            ].map(({ key, label }) => ev[key] > 0 && (
                              <Col md={6} key={key} className="mb-2">
                                <div className="d-flex justify-content-between mb-1">
                                  <small>{label}</small>
                                  <StarDisplay value={ev[key]} />
                                </div>
                                <ProgressBar
                                  now={(ev[key] / 5) * 100}
                                  variant={ev[key] >= 4 ? 'success' : ev[key] >= 3 ? 'warning' : 'danger'}
                                  style={{ height:'6px', borderRadius:'10px' }} />
                              </Col>
                            ))}
                          </Row>

                          {ev.comment && (
                            <div className="p-2 rounded" style={{ backgroundColor:'#f8f9fa', fontSize:'0.85rem' }}>
                              <em>"{ev.comment}"</em>
                            </div>
                          )}

                          {ev.certificate && (
                            <div className="mt-2">
                              <Badge bg="success" style={{ padding:'0.4rem 0.8rem' }}>
                                <FaMedal className="me-1" />Attestation de stage délivrée
                              </Badge>
                            </div>
                          )}

                          {(ev.start_date || ev.end_date) && (
                            <small className="text-muted d-block mt-1">
                              📅 {ev.start_date ? formatDate(ev.start_date) : '?'} → {ev.end_date ? formatDate(ev.end_date) : 'En cours'}
                            </small>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-muted text-center py-3">Aucune candidature pour le moment</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CV Upload Modal */}
      <Modal show={showCvModal} onHide={() => setShowCvModal(false)} centered>
        <Modal.Header closeButton style={{ background:'linear-gradient(135deg, #00C853, #00A844)', color:'white' }}>
          <Modal.Title><FaUpload className="me-2" />{cvPath ? 'Remplacer mon CV' : 'Ajouter mon CV'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          {uploadSuccess ? (
            <Alert variant="success">
              <FaCheckCircle size={40} className="mb-3" />
              <h5>CV uploadé avec succès !</h5>
              <p>Votre CV est maintenant visible par les entreprises.</p>
            </Alert>
          ) : (
            <>
              {cvError && <Alert variant="danger" dismissible onClose={() => setCvError('')}>{cvError}</Alert>}
              <FaFilePdf style={{ fontSize:'4rem', color:'#00C853', marginBottom:'1rem' }} />
              <h5 className="mb-2">Sélectionnez votre CV</h5>
              <p className="text-muted mb-4">Formats acceptés : PDF, DOC, DOCX<br />Taille maximale : 5MB</p>
              <input type="file" id="cv-upload" accept=".pdf,.doc,.docx"
                onChange={handleFileChange} style={{ display:'none' }} />
              <Button variant="success" size="lg" disabled={uploading}
                onClick={() => document.getElementById('cv-upload').click()}
                style={{ backgroundColor:'#00C853', borderColor:'#00C853', borderRadius:'10px', padding:'0.75rem 2rem' }}>
                <FaUpload className="me-2" />
                {uploading ? 'Envoi en cours...' : 'Choisir un fichier'}
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Profile;