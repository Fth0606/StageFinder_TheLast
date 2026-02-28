import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaUserShield, FaUsers, FaBriefcase, FaBuilding, FaChartLine, FaUserPlus } from 'react-icons/fa';
import AddAdmin from './addAdmin';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.admin);

  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddAdmin = (newAdmin) => {
    setSuccessMessage(`L'administrateur ${newAdmin.name} a été ajouté avec succès !`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <Container className="py-5" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage('')} className="mb-4">
          <strong>✅ {successMessage}</strong>
        </Alert>
      )}

      <Row>
        {/* Left Column */}
        <Col lg={4} className="mb-4">
          <Card style={{ border: 'none', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Body className="text-center p-4">
              <div style={{
                width: '120px', height: '120px', borderRadius: '50%',
                margin: '0 auto 1rem', display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
                color: 'white', fontSize: '3rem',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
              }}>
                <FaUserShield />
              </div>
              <h4>{user?.name || 'Administrateur'}</h4>
              <p className="text-muted">{user?.email}</p>
              <Badge bg="danger" className="mb-3" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                <FaUserShield className="me-1" />
                Administrateur
              </Badge>

              <Button
                variant="danger"
                className="w-100"
                onClick={() => navigate('/admin/edit-profil-admin')}
                style={{ borderRadius: '10px', padding: '0.75rem', fontWeight: '600' }}
              >
                <FaEdit className="me-2" />
                Modifier le profil
              </Button>
            </Card.Body>
          </Card>

          {/* Quick Access */}
          <Card className="mt-4" style={{ border: 'none', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{ background: 'white', borderBottom: '2px solid #e9ecef', borderRadius: '20px 20px 0 0', padding: '1rem' }}>
              <h6 className="mb-0">Accès rapides</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" onClick={() => navigate('/admin/users')} style={{ borderRadius: '8px', textAlign: 'left' }}>
                  <FaUsers className="me-2" />Gérer les utilisateurs
                </Button>
                <Button variant="outline-success" onClick={() => navigate('/admin/stages')} style={{ borderRadius: '8px', textAlign: 'left' }}>
                  <FaBriefcase className="me-2" />Gérer les stages
                </Button>
                <Button variant="outline-warning" onClick={() => navigate('/admin/companies')} style={{ borderRadius: '8px', textAlign: 'left' }}>
                  <FaBuilding className="me-2" />Gérer les entreprises
                </Button>
                <Button variant="outline-secondary" onClick={() => setShowAddAdminModal(true)} style={{ borderRadius: '8px', textAlign: 'left' }}>
                  <FaUserPlus className="me-2" />Ajouter un administrateur
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column */}
        <Col lg={8}>
          {/* Platform Stats */}
          <Card className="mb-4" style={{ border: 'none', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{ background: 'white', borderBottom: '2px solid #e9ecef', borderRadius: '20px 20px 0 0', padding: '1.5rem' }}>
              <h5 className="mb-0" style={{ color: '#9C27B0' }}>
                <FaChartLine className="me-2" />Vue d'ensemble de la plateforme
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                {[
                  { label: 'Utilisateurs', value: stats?.totalUsers, icon: FaUsers, color: '#0066CC' },
                  { label: 'Stages', value: stats?.totalStages, icon: FaBriefcase, color: '#00C853' },
                  { label: 'Entreprises', value: stats?.totalCompanies, icon: FaBuilding, color: '#FFA726' },
                  { label: 'Candidatures', value: stats?.totalApplications, icon: FaChartLine, color: '#9C27B0' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <Col md={3} className="mb-3" key={label}>
                    <div style={{ padding: '1.5rem', background: color, color: 'white', borderRadius: '15px', textAlign: 'center' }}>
                      <Icon size={30} className="mb-2" />
                      <h3>{value || 0}</h3>
                      <p className="mb-0">{label}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* Account Info */}
          <Card style={{ border: 'none', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{ background: 'white', borderBottom: '2px solid #e9ecef', borderRadius: '20px 20px 0 0', padding: '1.5rem' }}>
              <h5 className="mb-0" style={{ color: '#9C27B0' }}>Informations du compte</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col md={6} className="mb-3">
                  <strong>Nom :</strong>
                  <p className="text-muted">{user?.name || 'N/A'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Email :</strong>
                  <p className="text-muted">{user?.email || 'N/A'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Rôle :</strong>
                  <p className="text-muted">Administrateur</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Membre depuis :</strong>
                  <p className="text-muted">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('fr-FR')
                      : 'N/A'}
                  </p>
                </Col>
                <Col md={12}>
                  <strong>Permissions :</strong>
                  <div className="mt-2">
                    {['Gestion utilisateurs', 'Gestion stages', 'Gestion entreprises', 'Accès statistiques', 'Modération contenu'].map(p => (
                      <Badge key={p} bg="primary" className="me-2 mb-2" style={{ padding: '0.5rem 0.75rem' }}>{p}</Badge>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <AddAdmin
        show={showAddAdminModal}
        handleClose={() => setShowAddAdminModal(false)}
        onAddAdmin={handleAddAdmin}
      />
    </Container>
  );
};

export default AdminProfile;