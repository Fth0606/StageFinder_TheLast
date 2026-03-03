import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Badge, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaBuilding, FaBriefcase, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaTrash, FaEye, FaChartLine } from 'react-icons/fa';
import { fetchCompanyStages, deleteStage, fetchCompanyApplications } from '../../store/slices/companySlice';
import { fetchUserProfile } from '../../store/slices/userSlice';

const CompanyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stages, applications, isLoading } = useSelector((state) => state.company);
  const { profile } = useSelector((state) => state.user);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stageToDelete, setStageToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchCompanyStages());
    dispatch(fetchCompanyApplications());
  }, [dispatch]);

  const companyData = profile?.company || user?.company || {};
  const totalApplications = applications?.length || 0;
  const pendingApplications = applications?.filter(a => a.status === 'pending').length || 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', text: 'Active' };
    if (status === 'pending') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', text: 'En attente' };
    if (status === 'rejected') return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', text: 'Refusée' };
    return { bg: '#f1f5f9', color: '#64748b', text: 'Brouillon' };
  };

  const confirmDelete = (stage) => { setStageToDelete(stage); setShowDeleteModal(true); };

  const handleDelete = async () => {
    if (!stageToDelete) return;
    await dispatch(deleteStage(stageToDelete.id));
    setShowDeleteModal(false);
    setStageToDelete(null);
    dispatch(fetchCompanyStages());
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg-light)', position: 'relative', overflow: 'hidden', padding: '3rem 0' }}>
      {/* Dynamic Backgrounds */}
      <div style={{ position: 'absolute', top: '5%', right: '-5%', width: '400px', height: '400px', background: 'var(--accent-color)', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '500px', height: '500px', background: 'var(--primary-color)', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>

      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row className="g-4">
          <Col lg={4}>
            {/* Profile Card */}
            <div className="glass-panel text-center p-4 mb-4">
              <div style={{
                width: '130px', height: '130px', borderRadius: '50%', margin: '0 auto 1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--accent-color), #0284c7)', color: 'white',
                fontSize: '3.5rem', border: '4px solid white', boxShadow: '0 15px 30px rgba(14, 165, 233, 0.3)'
              }}>
                {companyData.logo_path
                  ? <img src={`http://localhost:8000/storage/${companyData.logo_path}`}
                    alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : <FaBuilding />}
              </div>
              <h3 style={{ fontWeight: '800', color: 'var(--bg-dark)', marginBottom: '0.2rem' }}>{companyData.company_name || user?.name || 'Mon Entreprise'}</h3>
              <p style={{ color: '#64748b', marginBottom: '1rem', fontWeight: '500' }}>{user?.email}</p>

              <div style={{ display: 'inline-block', color: 'var(--accent-color)', background: 'rgba(14, 165, 233, 0.1)', padding: '6px 16px', borderRadius: '50px', fontWeight: '700', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <FaBuilding className="me-2" /> Entreprise
              </div>

              <div className="d-grid gap-2">
                <button className="btn-modern w-100" onClick={() => navigate('/company/edit-profile')} style={{ background: 'var(--accent-color)', color: 'white', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)' }}>
                  <FaEdit className="me-2" /> Modifier le profil
                </button>
                <button className="btn-modern w-100" onClick={() => navigate('/company/dashboard')} style={{ background: 'white', color: 'var(--accent-color)', border: '1px solid var(--accent-color)' }}>
                  <FaChartLine className="me-2" /> Voir le tableau de bord
                </button>
              </div>
            </div>
          </Col>

          <Col lg={8}>
            {/* Company Info */}
            <div className="glass-panel p-4 mb-4">
              <h5 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                  <FaBuilding size={16} />
                </div>
                Informations de l'entreprise
              </h5>

              <Row className="g-4 mb-4">
                <Col md={6}>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', color: 'var(--accent-color)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', display: 'block' }}>Localisation</span>
                      <strong style={{ color: 'var(--bg-dark)' }}>{companyData.location || 'Non renseigné'}</strong>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', color: 'var(--accent-color)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                      <FaPhone />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', display: 'block' }}>Téléphone</span>
                      <strong style={{ color: 'var(--bg-dark)' }}>{companyData.phone || 'Non renseigné'}</strong>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', color: 'var(--accent-color)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                      <FaEnvelope />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', display: 'block' }}>Email de contact</span>
                      <strong style={{ color: 'var(--bg-dark)' }}>{user?.email}</strong>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', color: 'var(--accent-color)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                      <FaGlobe />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', display: 'block' }}>Site web</span>
                      <strong style={{ color: 'var(--bg-dark)' }}>
                        {companyData.website ? <a href={companyData.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>{companyData.website.replace(/^https?:\/\//, '')}</a> : 'Non renseigné'}
                      </strong>
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="mb-4">
                <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: '10px' }}>Secteurs d'activité</span>
                <div className="d-flex flex-wrap gap-2">
                  {companyData.industry ? companyData.industry.split(',').map((s, i) => (
                    <div key={i} style={{ background: 'white', color: 'var(--accent-color)', border: '1px solid rgba(14, 165, 233, 0.2)', padding: '6px 14px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      {s.trim()}
                    </div>
                  )) : <p className="text-muted m-0" style={{ fontSize: '0.9rem' }}>Non spécifié</p>}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Description globale</span>
                <p style={{ color: '#475569', lineHeight: '1.6', margin: 0 }}>{companyData.description || 'Aucune description fournie'}</p>
              </div>
            </div>

            {/* Stats */}
            <Row className="g-4 mb-4">
              <Col md={4}>
                <div className="glass-panel text-center p-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '10px' }}>
                    <FaBriefcase />
                  </div>
                  <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)', margin: 0 }}>{stages?.length || 0}</h2>
                  <p style={{ margin: 0, fontWeight: '600', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase' }}>Offres publiées</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="glass-panel text-center p-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '10px' }}>
                    <FaGlobe />
                  </div>
                  <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)', margin: 0 }}>{totalApplications}</h2>
                  <p style={{ margin: 0, fontWeight: '600', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase' }}>Candidatures</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="glass-panel text-center p-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '10px' }}>
                    <FaPhone />
                  </div>
                  <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)', margin: 0 }}>{pendingApplications}</h2>
                  <p style={{ margin: 0, fontWeight: '600', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase' }}>En attente</p>
                </div>
              </Col>
            </Row>

            {/* Offers with edit/delete */}
            <div className="glass-panel p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 style={{ fontWeight: '700', color: 'var(--bg-dark)', margin: 0, display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                    <FaBriefcase size={16} />
                  </div>
                  Mes offres récentes
                </h5>
                <button onClick={() => navigate('/company/post-stage')} style={{ background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', fontWeight: '600', fontSize: '0.9rem', boxShadow: '0 4px 6px rgba(14, 165, 233, 0.2)' }}>
                  + Nouvelle offre
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" style={{ color: 'var(--accent-color)' }} role="status" />
                </div>
              ) : stages && stages.length > 0 ? (
                stages.slice(0, 5).map((stage) => {
                  const badge = getStatusBadge(stage.status);
                  return (
                    <div key={stage.id} className="mb-3 p-3" style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <h6 style={{ fontWeight: '700', color: 'var(--bg-dark)', margin: '0 0 5px 0' }}>{stage.title}</h6>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <small style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}><FaMapMarkerAlt className="me-1 text-muted" />{stage.location}</small>
                            <small style={{ color: '#94a3b8' }}>• Publié le {formatDate(stage.created_at)}</small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <span style={{ background: badge.bg, color: badge.color, padding: '4px 10px', borderRadius: '50px', fontWeight: '700', fontSize: '0.75rem' }}>{badge.text}</span>
                          <div className="d-flex gap-2">
                            <button onClick={() => navigate(`/stages/${stage.id}`)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }} title="Voir">
                              <FaEye size={14} />
                            </button>
                            <button onClick={() => navigate(`/company/edit-stage/${stage.id}`)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = 'rgba(245, 158, 11, 0.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }} title="Modifier">
                              <FaEdit size={14} />
                            </button>
                            <button onClick={() => confirmDelete(stage)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }} title="Supprimer">
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4" style={{ background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <p className="text-muted m-0">Aucune offre publiée pour le moment.</p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered contentClassName="glass-panel" style={{ border: 'none' }}>
        <Modal.Header closeButton style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 2rem' }}>
          <Modal.Title style={{ fontWeight: '800', color: 'var(--bg-dark)' }}>Supprimer l'offre</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          Êtes-vous sûr de vouloir supprimer l'offre <strong>"{stageToDelete?.title}"</strong> ?
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '10px', marginTop: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
            <FaTrash className="me-2" /> Cette action est irréversible et supprimera toutes les candidatures associées.
          </div>
        </Modal.Body>
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={() => setShowDeleteModal(false)} style={{ background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px' }}>Annuler</button>
          <button onClick={handleDelete} style={{ background: '#ef4444', border: 'none', color: 'white', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)' }}>Supprimer définitivement</button>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyProfile;