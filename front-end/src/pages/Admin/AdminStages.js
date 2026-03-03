import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaCheck, FaTimes, FaTrash, FaSearch, FaBriefcase, FaBuilding, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { fetchAllStages, updateStageStatus, deleteStage } from '../../store/slices/adminSlice';

const AdminStages = () => {
  const dispatch = useDispatch();
  const { stages, isLoading } = useSelector((state) => state.admin);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStage, setSelectedStage] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllStages());
  }, [dispatch]);

  const handleApprove = async (stage) => {
    await dispatch(updateStageStatus({ stageId: stage.id, status: 'approved' }));
    setShowDetailModal(false);
  };
  const handleReject = async (stage) => {
    await dispatch(updateStageStatus({ stageId: stage.id, status: 'rejected' }));
    setShowDetailModal(false);
  };
  const handleDelete = async () => {
    if (selectedStage) {
      await dispatch(deleteStage(selectedStage.id));
      setShowDeleteModal(false);
      setSelectedStage(null);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      approved: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', text: 'Approuvée' },
      pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', text: 'En attente' },
      rejected: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', text: 'Rejetée' },
    };
    return variants[status] || variants.pending;
  };

  const getCompanyName = (stage) => {
    if (!stage.company) return 'N/A';
    if (typeof stage.company === 'string') return stage.company;
    return stage.company.company_name || 'N/A';
  };

  const stagesArray = Array.isArray(stages) ? stages : (stages?.data || []);

  const filteredStages = stagesArray.filter(stage => {
    const companyName = getCompanyName(stage).toLowerCase();
    const matchesSearch =
      stage.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      companyName.includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || stage.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg-light)', position: 'relative', overflow: 'hidden', padding: '3rem 0' }}>
      <div style={{ position: 'absolute', top: '5%', left: '-5%', width: '400px', height: '400px', background: 'var(--accent-color)', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '300px', height: '300px', background: '#10b981', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>

      <Container style={{ position: 'relative', zIndex: 1 }} fluid="lg">
        <div className="mb-4">
          <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)' }}>Gestion des offres de stage</h2>
          <p style={{ color: '#64748b' }}>Modérez et gérez toutes les offres de stage publiées</p>
        </div>

        {/* Stats Overview */}
        <Row className="g-4 mb-4">
          <Col md={3} sm={6}>
            <div className="glass-panel p-4 text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', borderTop: '4px solid var(--primary-color)' }}>
              <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)', margin: 0 }}>{stagesArray.length}</h2>
              <p style={{ margin: 0, fontWeight: '700', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</p>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="glass-panel p-4 text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', borderTop: '4px solid #f59e0b' }}>
              <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)', margin: 0 }}>{stagesArray.filter(s => s.status === 'pending').length}</h2>
              <p style={{ margin: 0, fontWeight: '700', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>En attente</p>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="glass-panel p-4 text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', borderTop: '4px solid #10b981' }}>
              <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)', margin: 0 }}>{stagesArray.filter(s => s.status === 'approved').length}</h2>
              <p style={{ margin: 0, fontWeight: '700', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Approuvés</p>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="glass-panel p-4 text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', borderTop: '4px solid #ef4444' }}>
              <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)', margin: 0 }}>{stagesArray.filter(s => s.status === 'rejected').length}</h2>
              <p style={{ margin: 0, fontWeight: '700', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rejetés</p>
            </div>
          </Col>
        </Row>

        {/* Filters Panel */}
        <div className="glass-panel p-4 mb-4">
          <Row className="g-3 align-items-center">
            <Col lg={6}>
              <div style={{ position: 'relative' }}>
                <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Rechercher par titre ou entreprise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '12px 15px 12px 45px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', outline: 'none', transition: 'all 0.2s', fontWeight: '500', color: 'var(--bg-dark)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="d-flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterStatus('all')}
                  style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '600', transition: 'all 0.2s', border: filterStatus === 'all' ? '1px solid var(--primary-color)' : '1px solid #e2e8f0', background: filterStatus === 'all' ? 'var(--primary-color)' : 'white', color: filterStatus === 'all' ? 'white' : '#64748b' }}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '600', transition: 'all 0.2s', border: filterStatus === 'pending' ? '1px solid #f59e0b' : '1px solid #e2e8f0', background: filterStatus === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'white', color: filterStatus === 'pending' ? '#f59e0b' : '#64748b' }}
                >
                  En attente
                </button>
                <button
                  onClick={() => setFilterStatus('approved')}
                  style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '600', transition: 'all 0.2s', border: filterStatus === 'approved' ? '1px solid #10b981' : '1px solid #e2e8f0', background: filterStatus === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'white', color: filterStatus === 'approved' ? '#10b981' : '#64748b' }}
                >
                  Approuvés
                </button>
                <button
                  onClick={() => setFilterStatus('rejected')}
                  style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '600', transition: 'all 0.2s', border: filterStatus === 'rejected' ? '1px solid #ef4444' : '1px solid #e2e8f0', background: filterStatus === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'white', color: filterStatus === 'rejected' ? '#ef4444' : '#64748b' }}
                >
                  Rejetés
                </button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Stages Table */}
        <div className="glass-panel p-0 overflow-hidden">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: 'var(--primary-color)' }} role="status" />
            </div>
          ) : filteredStages.length === 0 ? (
            <div className="text-center py-5" style={{ background: '#f8fafc' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'white', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}><FaBriefcase /></div>
              <h6 style={{ fontWeight: '700', color: 'var(--bg-dark)' }}>Aucune offre trouvée</h6>
              <p style={{ color: '#64748b', margin: 0 }}>Aucun stage ne correspond à vos filtres.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover style={{ margin: 0, verticalAlign: 'middle', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Offre & Entreprise</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Détails</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Date</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Statut</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStages.map((stage) => {
                    const statusBadge = getStatusBadge(stage.status);
                    return (
                      <tr key={stage.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                        <td style={{ padding: '1.2rem 1.5rem', border: 'none', maxWidth: '300px' }}>
                          <strong style={{ color: 'var(--bg-dark)', display: 'block', fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stage.title}</strong>
                          <div style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                            <FaBuilding className="me-2 text-primary" /> {getCompanyName(stage)}
                          </div>
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', border: 'none' }}>
                          <div style={{ color: '#475569', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ display: 'flex', alignItems: 'center' }}><FaMapMarkerAlt className="me-2 text-muted" /> {stage.location}</span>
                            <span style={{ display: 'flex', alignItems: 'center' }}><FaClock className="me-2 text-muted" /> {stage.duration ? `${stage.duration} Mois` : 'N/A'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', border: 'none', color: '#64748b', fontSize: '0.9rem' }}>
                          {stage.created_at ? new Date(stage.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', border: 'none' }}>
                          <div style={{ background: statusBadge.bg, color: statusBadge.color, padding: '6px 14px', borderRadius: '50px', fontWeight: '700', fontSize: '0.85rem', display: 'inline-block' }}>
                            {statusBadge.text}
                          </div>
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', border: 'none', textAlign: 'right' }}>
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              onClick={() => { setSelectedStage(stage); setShowDetailModal(true); }}
                              style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                              title="Voir détails"
                            ><FaEye size={16} /></button>

                            {stage.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(stage)}
                                  style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                                  title="Approuver"
                                ><FaCheck size={16} /></button>
                                <button
                                  onClick={() => handleReject(stage)}
                                  style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = 'rgba(245, 158, 11, 0.05)'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                                  title="Rejeter"
                                ><FaTimes size={16} /></button>
                              </>
                            )}

                            <button
                              onClick={() => { setSelectedStage(stage); setShowDeleteModal(true); }}
                              style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                              title="Supprimer"
                            ><FaTrash size={16} /></button>
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
          <Modal.Title style={{ fontWeight: '800', color: 'var(--bg-dark)' }}>Détails de l'offre</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          {selectedStage && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--bg-dark)', marginBottom: '10px' }}>{selectedStage.title}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                  <span style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#475569', display: 'flex', alignItems: 'center' }}><FaBuilding className="me-2 text-primary" /> {getCompanyName(selectedStage)}</span>
                  <span style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#475569', display: 'flex', alignItems: 'center' }}><FaMapMarkerAlt className="me-2 text-accent" /> {selectedStage.location}</span>
                  <span style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#475569', display: 'flex', alignItems: 'center' }}><FaClock className="me-2 text-warning" /> {selectedStage.duration ? `${selectedStage.duration} Mois` : 'N/A'}</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h6 style={{ fontWeight: '700', color: '#64748b', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px' }}>Description</h6>
                <p style={{ color: 'var(--bg-dark)', lineHeight: '1.6' }}>{selectedStage.description}</p>
              </div>

              {selectedStage.requirements && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h6 style={{ fontWeight: '700', color: '#64748b', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px' }}>Profil recherché</h6>
                  <p style={{ color: 'var(--bg-dark)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{selectedStage.requirements}</p>
                </div>
              )}

              <div>
                <h6 style={{ fontWeight: '700', color: '#64748b', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px', marginBottom: '10px' }}>État actuel</h6>
                {(() => {
                  const sb = getStatusBadge(selectedStage.status);
                  return <span style={{ background: sb.bg, color: sb.color, padding: '8px 16px', borderRadius: '50px', fontWeight: '700', fontSize: '0.9rem', display: 'inline-block' }}>{sb.text}</span>;
                })()}
              </div>
            </div>
          )}
        </Modal.Body>
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setShowDetailModal(false)} style={{ background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px' }}>Fermer</button>

          {selectedStage?.status === 'pending' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleReject(selectedStage)} style={{ background: 'white', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px' }}>Rejeter</button>
              <button onClick={() => handleApprove(selectedStage)} style={{ background: '#10b981', border: 'none', color: 'white', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' }}>Approuver</button>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered contentClassName="glass-panel" style={{ border: 'none' }}>
        <Modal.Header closeButton style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 2rem' }}>
          <Modal.Title style={{ fontWeight: '800', color: 'var(--bg-dark)' }}>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          Êtes-vous sûr de vouloir supprimer l'offre <strong>"{selectedStage?.title}"</strong> ?
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '10px', marginTop: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
            <FaTrash className="me-2" /> Cette action est irréversible.
          </div>
        </Modal.Body>
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={() => setShowDeleteModal(false)} style={{ background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px' }}>Annuler</button>
          <button onClick={handleDelete} style={{ background: '#ef4444', border: 'none', color: 'white', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)' }}>Supprimer</button>
        </div>
      </Modal>

    </div>
  );
};

export default AdminStages;