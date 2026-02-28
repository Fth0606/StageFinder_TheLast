import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaBriefcase, FaUsers, FaEnvelope, FaPlus, FaEye, FaChartLine } from 'react-icons/fa';
import { fetchCompanyStages, fetchCompanyApplications } from '../../store/slices/companySlice';

const CompanyDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stages, applications, stats, isLoading } = useSelector((state) => state.company);

  useEffect(() => {
    dispatch(fetchCompanyStages());
    dispatch(fetchCompanyApplications());
  }, [dispatch]);

  // Helper: safe date formatting — offers table may not have created_at
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('fr-FR');
  };

  // Helper: get candidate name from application DB structure
  // DB: applications.student_id → students → users.name
  const getCandidateName = (app) =>
    app?.student?.user?.name || app?.candidateName || 'Candidat';

  // Helper: get offer title from application DB structure
  // DB: applications.offer_id → offers.title
  const getOfferTitle = (app) =>
    app?.offer?.title || app?.stageTitle || 'Offre';

  // Helper: status badge for offers
  const getStatusBadge = (status) => {
    if (status === 'approved') return { bg: 'success', text: 'Active' };
    if (status === 'pending')  return { bg: 'warning', text: 'En attente' };
    if (status === 'rejected') return { bg: 'danger',  text: 'Refusée' };
    return { bg: 'secondary', text: 'Brouillon' };
  };

  const pendingCount = applications.filter(a => a.status === 'pending').length;

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h2>Tableau de bord - {user?.name}</h2>
        <p className="text-muted">Gérez vos offres de stage et candidatures</p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card style={{ border: 'none', borderRadius: '15px', background: 'linear-gradient(135deg, #0066CC, #0052A3)', color: 'white' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">{stages.length}</h3>
                  <p className="mb-0">Offres actives</p>
                </div>
                <FaBriefcase size={40} style={{ opacity: 0.5 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={{ border: 'none', borderRadius: '15px', background: 'linear-gradient(135deg, #00C853, #00A844)', color: 'white' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">{applications.length}</h3>
                  <p className="mb-0">Candidatures</p>
                </div>
                <FaUsers size={40} style={{ opacity: 0.5 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={{ border: 'none', borderRadius: '15px', background: 'linear-gradient(135deg, #FFA726, #FB8C00)', color: 'white' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">{pendingCount}</h3>
                  <p className="mb-0">En attente</p>
                </div>
                <FaEnvelope size={40} style={{ opacity: 0.5 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={{ border: 'none', borderRadius: '15px', background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)', color: 'white' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">{stats?.viewsThisMonth || 0}</h3>
                  <p className="mb-0">Vues ce mois</p>
                </div>
                <FaChartLine size={40} style={{ opacity: 0.5 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card style={{ border: 'none', borderRadius: '15px' }}>
            <Card.Body>
              <h5 className="mb-3">Actions rapides</h5>
              <div className="d-flex gap-2 flex-wrap">
                <Link to="/company/post-stage">
                  <Button variant="primary" style={{ backgroundColor: '#0066CC', borderColor: '#0066CC', borderRadius: '10px' }}>
                    <FaPlus className="me-2" />Publier une offre
                  </Button>
                </Link>
                <Link to="/company/applications">
                  <Button variant="success" style={{ backgroundColor: '#00C853', borderColor: '#00C853', borderRadius: '10px' }}>
                    <FaUsers className="me-2" />Voir les candidatures
                  </Button>
                </Link>
                <Link to="/company/messages">
                  <Button variant="info" style={{ borderRadius: '10px' }}>
                    <FaEnvelope className="me-2" />Messages
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Stages Table */}
        <Col lg={8}>
          <Card style={{ border: 'none', borderRadius: '15px' }}>
            <Card.Header style={{ background: 'white', borderBottom: '2px solid #e9ecef', borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0">Mes offres de stage</h5>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : stages.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Statut</th>
                      <th>Candidatures</th>
                      <th>Publié le</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stages.slice(0, 5).map((stage) => {
                      const badge = getStatusBadge(stage.status);
                      return (
                        <tr key={stage.id}>
                          <td>
                            <strong>{stage.title}</strong><br />
                            <small className="text-muted">{stage.location}</small>
                          </td>
                          <td>
                            <Badge bg={badge.bg}>{badge.text}</Badge>
                          </td>
                          <td>
                            {/* DB: applications_count from withCount() */}
                            <Badge bg="info">{stage.applications_count || 0}</Badge>
                          </td>
                          <td>
                            {/* DB column: created_at (may be null if no timestamps) */}
                            <small>{formatDate(stage.created_at)}</small>
                          </td>
                          <td>
                            <Link to={`/company/stages/${stage.id}`}>
                              <Button variant="outline-primary" size="sm">
                                <FaEye className="me-1" />Voir
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">Aucune offre publiée</p>
                  <Link to="/company/post-stage">
                    <Button variant="primary">Créer une offre</Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Applications */}
        <Col lg={4}>
          <Card style={{ border: 'none', borderRadius: '15px' }}>
            <Card.Header style={{ background: 'white', borderBottom: '2px solid #e9ecef', borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0">Candidatures récentes</h5>
            </Card.Header>
            <Card.Body>
              {applications.length > 0 ? (
                applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="mb-3 p-3"
                    style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        {/* DB: student → user → name */}
                        <strong>{getCandidateName(app)}</strong><br />
                        {/* DB: offer → title */}
                        <small className="text-muted">{getOfferTitle(app)}</small><br />
                        {/* DB column: applied_at */}
                        <small className="text-muted">{formatDate(app.applied_at)}</small>
                      </div>
                      <Badge bg="warning" text="dark">Nouveau</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">Aucune candidature</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyDashboard;