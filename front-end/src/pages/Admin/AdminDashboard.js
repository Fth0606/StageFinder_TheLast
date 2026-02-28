import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUsers, FaBriefcase, FaBuilding, FaChartLine } from 'react-icons/fa';
import { fetchAdminStats } from '../../store/slices/adminSlice';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, recentActivities, monthlyData, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  return (
    <Container fluid className="py-5">
      <div className="mb-4">
        <h2>Tableau de bord Admin</h2>
        <p className="text-muted">Vue d'ensemble de la plateforme StageFinder</p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card style={{
            border: 'none', borderRadius: '15px',
            background: 'linear-gradient(135deg, #0066CC, #0052A3)',
            color: 'white', boxShadow: '0 5px 20px rgba(0,102,204,0.3)'
          }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">{stats?.totalUsers || 0}</h3>
                  <p className="mb-0">Utilisateurs</p>
                  <small style={{ opacity: 0.8 }}>+{stats?.newUsersThisMonth || 0} ce mois</small>
                </div>
                <FaUsers size={50} style={{ opacity: 0.5 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card style={{
            border: 'none', borderRadius: '15px',
            background: 'linear-gradient(135deg, #00C853, #00A844)',
            color: 'white', boxShadow: '0 5px 20px rgba(0,200,83,0.3)'
          }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">{stats?.totalStages || 0}</h3>
                  <p className="mb-0">Offres de stage</p>
                  <small style={{ opacity: 0.8 }}>{stats?.activeStages || 0} approuvées</small>
                </div>
                <FaBriefcase size={50} style={{ opacity: 0.5 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card style={{
            border: 'none', borderRadius: '15px',
            background: 'linear-gradient(135deg, #FFA726, #FB8C00)',
            color: 'white', boxShadow: '0 5px 20px rgba(255,167,38,0.3)'
          }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">{stats?.totalCompanies || 0}</h3>
                  <p className="mb-0">Entreprises</p>
                  <small style={{ opacity: 0.8 }}>{stats?.pendingStages || 0} stages en attente</small>
                </div>
                <FaBuilding size={50} style={{ opacity: 0.5 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card style={{
            border: 'none', borderRadius: '15px',
            background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
            color: 'white', boxShadow: '0 5px 20px rgba(156,39,176,0.3)'
          }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">{stats?.totalApplications || 0}</h3>
                  <p className="mb-0">Candidatures</p>
                  <small style={{ opacity: 0.8 }}>+{stats?.applicationsToday || 0} aujourd'hui</small>
                </div>
                <FaChartLine size={50} style={{ opacity: 0.5 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts — now using real DB data */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card style={{ border: 'none', borderRadius: '15px', boxShadow: '0 3px 15px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{ background: 'white', borderBottom: '2px solid #e9ecef', borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0">Statistiques des 6 derniers mois</h5>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="stages" stroke="#0066CC" strokeWidth={2} name="Stages" />
                    <Line type="monotone" dataKey="users" stroke="#00C853" strokeWidth={2} name="Utilisateurs" />
                    <Line type="monotone" dataKey="applications" stroke="#FFA726" strokeWidth={2} name="Candidatures" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card style={{ border: 'none', borderRadius: '15px', boxShadow: '0 3px 15px rgba(0,0,0,0.1)', height: '100%' }}>
            <Card.Header style={{ background: 'white', borderBottom: '2px solid #e9ecef', borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0">Répartition des utilisateurs</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { type: 'Étudiants',  count: stats?.studentCount  || 0 },
                  { type: 'Entreprises', count: stats?.companyCount  || 0 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0066CC" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Links + Recent Activities */}
      <Row className="mb-4">
        <Col md={6}>
          <Card style={{ border: 'none', borderRadius: '15px', boxShadow: '0 3px 15px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{ background: 'white', borderBottom: '2px solid #e9ecef' }}>
              <h5 className="mb-0">Actions rapides</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Link to="/admin/users" style={{ textDecoration: 'none' }}>
                  <Card className="p-3" style={{ cursor: 'pointer', border: '1px solid #e9ecef' }}>
                    <div className="d-flex align-items-center">
                      <FaUsers size={30} className="me-3 text-primary" />
                      <div>
                        <strong>Gérer les utilisateurs</strong>
                        <p className="mb-0 text-muted small">Voir et modérer tous les utilisateurs</p>
                      </div>
                    </div>
                  </Card>
                </Link>
                <Link to="/admin/stages" style={{ textDecoration: 'none' }}>
                  <Card className="p-3" style={{ cursor: 'pointer', border: '1px solid #e9ecef' }}>
                    <div className="d-flex align-items-center">
                      <FaBriefcase size={30} className="me-3 text-success" />
                      <div>
                        <strong>Gérer les stages</strong>
                        <p className="mb-0 text-muted small">Modérer les offres de stage</p>
                      </div>
                    </div>
                  </Card>
                </Link>
                <Link to="/admin/companies" style={{ textDecoration: 'none' }}>
                  <Card className="p-3" style={{ cursor: 'pointer', border: '1px solid #e9ecef' }}>
                    <div className="d-flex align-items-center">
                      <FaBuilding size={30} className="me-3 text-warning" />
                      <div>
                        <strong>Gérer les entreprises</strong>
                        <p className="mb-0 text-muted small">Voir et valider les entreprises</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card style={{ border: 'none', borderRadius: '15px', boxShadow: '0 3px 15px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{ background: 'white', borderBottom: '2px solid #e9ecef' }}>
              <h5 className="mb-0">Activités récentes</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {Array.isArray(recentActivities) && recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="mb-3 pb-3" style={{ borderBottom: '1px solid #e9ecef' }}>
                    <div className="d-flex align-items-start">
                      <div className="me-3 mt-1">
                        {activity.type === 'user'  && <FaUsers className="text-primary" />}
                        {activity.type === 'offer' && <FaBriefcase className="text-success" />}
                        {activity.type === 'application' && <FaChartLine className="text-info" />}
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1">{activity.message}</p>
                        <small className="text-muted">
                          {activity.timestamp
                            ? new Date(activity.timestamp).toLocaleString('fr-FR')
                            : ''}
                        </small>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center py-3">Aucune activité récente</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;