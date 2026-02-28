import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaBuilding, FaBriefcase, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaTrash, FaEye } from 'react-icons/fa';
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

  // Real stats from applications
  const totalApplications = applications?.length || 0;
  const pendingApplications = applications?.filter(a => a.status === 'pending').length || 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') return { bg: 'success', text: 'Active' };
    if (status === 'pending')  return { bg: 'warning', text: 'En attente' };
    if (status === 'rejected') return { bg: 'danger',  text: 'Refusée' };
    return { bg: 'secondary', text: 'Brouillon' };
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
    <Container className="py-5" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Row>
        <Col lg={4} className="mb-4">
          <Card style={{ border: 'none', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Body className="text-center">
              <div style={{
                width: '150px', height: '150px', borderRadius: '50%', margin: '0 auto 1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #00C853, #00A844)', color: 'white',
                fontSize: '4rem', border: '5px solid white', boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
              }}>
                {companyData.logo_path
                  ? <img src={`http://localhost:8000/storage/${companyData.logo_path}`}
                      alt="Logo" style={{ width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover' }} />
                  : <FaBuilding />}
              </div>
              <h3>{companyData.company_name || user?.name || 'Mon Entreprise'}</h3>
              <p className="text-muted">{user?.email}</p>
              <Badge bg="success" className="mb-3"><FaBuilding className="me-1" />Entreprise</Badge>
              <Button variant="success" className="w-100 mb-2"
                onClick={() => navigate('/company/edit-profile')}
                style={{ backgroundColor:'#00C853', borderColor:'#00C853', borderRadius:'10px', padding:'0.75rem', fontWeight:'600' }}>
                <FaEdit className="me-2" />Modifier le profil
              </Button>
              <Button variant="outline-primary" className="w-100"
                onClick={() => navigate('/company/dashboard')}
                style={{ borderRadius:'10px', padding:'0.75rem', fontWeight:'600' }}>
                Voir le tableau de bord
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          {/* Company Info */}
          <Card className="mb-4" style={{ border:'none', borderRadius:'20px', boxShadow:'0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{ background:'white', borderBottom:'2px solid #e9ecef', borderRadius:'20px 20px 0 0', padding:'1.5rem' }}>
              <h5 className="mb-0" style={{ color:'#00C853' }}><FaBuilding className="me-2" />Informations de l'entreprise</h5>
            </Card.Header>
            <Card.Body style={{ padding:'1.5rem' }}>
              <Row>
                <Col md={6} className="mb-3">
                  <strong><FaMapMarkerAlt className="me-2 text-success" />Localisation :</strong>
                  <p className="text-muted">{companyData.location || 'Non renseigné'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong><FaPhone className="me-2 text-success" />Téléphone :</strong>
                  <p className="text-muted">{companyData.phone || 'Non renseigné'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong><FaEnvelope className="me-2 text-success" />Email :</strong>
                  <p className="text-muted">{user?.email}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong><FaGlobe className="me-2 text-success" />Site web :</strong>
                  <p className="text-muted">
                    {companyData.website
                      ? <a href={companyData.website} target="_blank" rel="noopener noreferrer">{companyData.website}</a>
                      : 'Non renseigné'}
                  </p>
                </Col>
                <Col md={12} className="mb-3">
                  <strong>Secteur d'activité :</strong>
                  <div className="mt-2">
                    {companyData.industry
                      ? companyData.industry.split(',').map((s, i) => (
                          <Badge key={i} bg="success" className="me-2 mb-2" style={{ padding:'0.5rem 0.75rem' }}>{s.trim()}</Badge>
                        ))
                      : <Badge bg="secondary" style={{ padding:'0.5rem 0.75rem' }}>Non spécifié</Badge>}
                  </div>
                </Col>
                <Col md={12}>
                  <strong>Description :</strong>
                  <p className="text-muted mt-2">{companyData.description || 'Aucune description fournie'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Stats with real data */}
          <Card className="mb-4" style={{ border:'none', borderRadius:'20px', boxShadow:'0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{ background:'white', borderBottom:'2px solid #e9ecef', borderRadius:'20px 20px 0 0', padding:'1.5rem' }}>
              <h5 className="mb-0" style={{ color:'#00C853' }}><FaBriefcase className="me-2" />Statistiques</h5>
            </Card.Header>
            <Card.Body style={{ padding:'1.5rem' }}>
              <Row className="text-center">
                <Col md={4}>
                  <div style={{ padding:'1.5rem', background:'linear-gradient(135deg, #00C853, #00A844)', color:'white', borderRadius:'15px', marginBottom:'1rem' }}>
                    <h2>{stages?.length || 0}</h2><p className="mb-0">Offres publiées</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div style={{ padding:'1.5rem', background:'linear-gradient(135deg, #0066CC, #0052A3)', color:'white', borderRadius:'15px', marginBottom:'1rem' }}>
                    <h2>{totalApplications}</h2><p className="mb-0">Candidatures</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div style={{ padding:'1.5rem', background:'linear-gradient(135deg, #FFA726, #FB8C00)', color:'white', borderRadius:'15px', marginBottom:'1rem' }}>
                    <h2>{pendingApplications}</h2><p className="mb-0">En attente</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Offers with edit/delete */}
          <Card style={{ border:'none', borderRadius:'20px', boxShadow:'0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{ background:'white', borderBottom:'2px solid #e9ecef', borderRadius:'20px 20px 0 0', padding:'1.5rem' }}>
              <h5 className="mb-0" style={{ color:'#00C853' }}>Mes offres récentes</h5>
            </Card.Header>
            <Card.Body style={{ padding:'1.5rem' }}>
              {isLoading ? (
                <div className="text-center py-3"><div className="spinner-border text-success" role="status" /></div>
              ) : stages && stages.length > 0 ? (
                stages.slice(0, 5).map((stage) => {
                  const badge = getStatusBadge(stage.status);
                  return (
                    <div key={stage.id} className="mb-3 p-3"
                      style={{ backgroundColor:'white', borderRadius:'12px', border:'1px solid #e9ecef', transition:'all 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00C853'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e9ecef'}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div style={{ flex:1 }}>
                          <h6 className="mb-1">{stage.title}</h6>
                          <p className="text-muted mb-1" style={{ fontSize:'0.9rem' }}>
                            <FaMapMarkerAlt className="me-1" />{stage.location}
                          </p>
                          <small className="text-muted">Publié le {formatDate(stage.created_at)}</small>
                        </div>
                        <div className="d-flex align-items-center gap-2 ms-2">
                          <Badge bg={badge.bg}>{badge.text}</Badge>
                          <Button variant="outline-primary" size="sm"
                            onClick={() => navigate(`/stages/${stage.id}`)}
                            style={{ borderRadius:'8px' }} title="Voir">
                            <FaEye />
                          </Button>
                          <Button variant="outline-warning" size="sm"
                            onClick={() => navigate(`/company/edit-stage/${stage.id}`)}
                            style={{ borderRadius:'8px' }} title="Modifier">
                            <FaEdit />
                          </Button>
                          <Button variant="outline-danger" size="sm"
                            onClick={() => confirmDelete(stage)}
                            style={{ borderRadius:'8px' }} title="Supprimer">
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted text-center">Aucune offre publiée</p>
              )}
              <Button variant="outline-success" className="w-100 mt-3"
                onClick={() => navigate('/company/post-stage')}
                style={{ borderRadius:'10px', padding:'0.75rem' }}>
                + Publier une nouvelle offre
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Supprimer l'offre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer <strong>"{stageToDelete?.title}"</strong> ?
          <br /><small className="text-danger">Cette action est irréversible.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
          <Button variant="danger" onClick={handleDelete}>Supprimer</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CompanyProfile;