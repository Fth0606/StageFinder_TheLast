import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaUserShield, FaUsers, FaBriefcase, FaBuilding, FaChartLine, FaUserPlus, FaCamera, FaDownload } from 'react-icons/fa';
import AddAdmin from './addAdmin';
import { apiService } from '../../services/api';
import { setUser } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';

const AdminProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.admin);

  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);

  const handleAddAdmin = (newAdmin) => {
    setSuccessMessage(`L'administrateur ${newAdmin.name} a été ajouté avec succès !`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setPhotoLoading(true);
    try {
      const response = await apiService.uploadPhoto(formData);
      dispatch(setUser(response.data.user));
      setSuccessMessage('Photo de profil mise à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Erreur lors de l\'upload de la photo.');
    } finally {
      setPhotoLoading(false);
    }
  };

  return (
    <Container fluid className="py-5" style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg-light)' }}>
      <div className="mb-5">
        <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)', letterSpacing: '-0.5px' }}>Mon Profil Admin</h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Gérez vos informations et accédez aux outils de modération</p>
      </div>
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage('')} className="mb-4">
          <strong>✅ {successMessage}</strong>
        </Alert>
      )}

      <Row>
        {/* Left Column */}
        <Col lg={4} className="mb-4">
          <div className="glass-panel text-center p-4 mb-4" style={{ background: 'white' }}>
            <div
              className="profile-photo-container"
              style={{
                width: '130px', height: '130px', borderRadius: '50%',
                margin: '0 auto 1.5rem', position: 'relative',
                boxShadow: '0 10px 25px rgba(236, 72, 153, 0.3)',
                overflow: 'hidden'
              }}
            >
              <div style={{
                width: '100%', height: '100%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
                color: 'white', fontSize: '3.5rem'
              }}>
                {user?.profile_picture ? (
                  <img src={`http://localhost:8000/storage/${user.profile_picture}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <FaUserShield />
                )}
              </div>

              {/* Overlay for upload */}
              <div
                className="photo-overlay"
                style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s',
                  cursor: 'pointer', color: 'white', gap: '15px'
                }}
                onClick={() => document.getElementById('admin-photo-input').click()}
              >
                <FaCamera size={24} />
              </div>
            </div>

            {/* Download Link */}
            {user?.profile_picture && (
              <div className="mb-3">
                <a
                  href={`http://localhost:8000/storage/${user.profile_picture}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                  style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  <FaDownload className="me-1" /> Télécharger la photo
                </a>
              </div>
            )}

            <input
              type="file"
              id="admin-photo-input"
              hidden
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={photoLoading}
            />
            <h4 style={{ fontWeight: '700', color: 'var(--bg-dark)' }}>{user?.name || 'Administrateur'}</h4>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>{user?.email}</p>
            <Badge style={{
              fontSize: '0.85rem',
              padding: '0.6rem 1.2rem',
              borderRadius: '50px',
              background: 'rgba(236, 72, 153, 0.1)',
              color: 'var(--secondary-color)',
              marginBottom: '1.5rem',
              border: '1px solid rgba(236, 72, 153, 0.2)'
            }}>
              <FaUserShield className="me-1" />
              Administrateur Global
            </Badge>

            <Button
              className="w-100"
              onClick={() => navigate('/admin/edit-profil-admin')}
              style={{
                borderRadius: '12px',
                padding: '0.8rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
                border: 'none',
                boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
              }}
            >
              <FaEdit className="me-2" />
              Modifier le profil
            </Button>
          </div>

          {/* Quick Access */}
          <div className="glass-panel" style={{ background: 'white', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.03)', borderBottom: '1px solid #f1f5f9', padding: '1.25rem' }}>
              <h6 className="mb-0" style={{ fontWeight: '700', color: 'var(--bg-dark)' }}>Accès rapides</h6>
            </div>
            <div className="p-3 d-flex flex-column gap-2">
              <Button
                variant="light"
                onClick={() => navigate('/admin/users')}
                style={{ borderRadius: '12px', textAlign: 'left', padding: '0.75rem 1rem', border: '1px solid #f1f5f9', background: '#f8fafc', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
              >
                <FaUsers className="me-2" style={{ color: 'var(--primary-color)' }} /> Gérer les utilisateurs
              </Button>
              <Button
                variant="light"
                onClick={() => navigate('/admin/stages')}
                style={{ borderRadius: '12px', textAlign: 'left', padding: '0.75rem 1rem', border: '1px solid #f1f5f9', background: '#f8fafc', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
              >
                <FaBriefcase className="me-2" style={{ color: 'var(--accent-color)' }} /> Gérer les stages
              </Button>
              <Button
                variant="light"
                onClick={() => navigate('/admin/companies')}
                style={{ borderRadius: '12px', textAlign: 'left', padding: '0.75rem 1rem', border: '1px solid #f1f5f9', background: '#f8fafc', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
              >
                <FaBuilding className="me-2" style={{ color: 'var(--secondary-color)' }} /> Gérer les entreprises
              </Button>
              <Button
                variant="light"
                onClick={() => setShowAddAdminModal(true)}
                style={{ borderRadius: '12px', textAlign: 'left', padding: '0.75rem 1rem', border: '1px solid #f1f5f9', background: '#f8fafc', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
              >
                <FaUserPlus className="me-2" style={{ color: '#64748b' }} /> Ajouter un administrateur
              </Button>
            </div>
          </div>
        </Col>

        {/* Right Column */}
        <Col lg={8}>
          {/* Platform Stats */}
          <div className="glass-panel mb-4" style={{ background: 'white', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.03)', borderBottom: '1px solid #f1f5f9', padding: '1.5rem' }}>
              <h5 className="mb-0" style={{ fontWeight: '700', color: 'var(--bg-dark)' }}>
                <FaChartLine className="me-2" style={{ color: 'var(--primary-color)' }} /> Vue d'ensemble de la plateforme
              </h5>
            </div>
            <div className="p-4">
              <Row className="g-3">
                {[
                  { label: 'Utilisateurs', value: stats?.totalUsers, icon: FaUsers, color: 'var(--primary-color)', bg: 'rgba(99, 102, 241, 0.1)' },
                  { label: 'Stages', value: stats?.totalStages, icon: FaBriefcase, color: 'var(--accent-color)', bg: 'rgba(14, 165, 233, 0.1)' },
                  { label: 'Entreprises', value: stats?.totalCompanies, icon: FaBuilding, color: 'var(--secondary-color)', bg: 'rgba(236, 72, 153, 0.1)' },
                  { label: 'Candidatures', value: stats?.totalApplications, icon: FaChartLine, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                  <Col md={3} key={label}>
                    <div style={{ padding: '1.5rem', background: bg, borderRadius: '20px', textAlign: 'center', transition: 'transform 0.3s ease' }} className="stat-box-hover">
                      <Icon size={28} className="mb-2" style={{ color }} />
                      <h3 style={{ fontWeight: '800', margin: '0', color: 'var(--bg-dark)' }}>{value || 0}</h3>
                      <p className="mb-0" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>

          {/* Account Info */}
          <div className="glass-panel" style={{ background: 'white', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.03)', borderBottom: '1px solid #f1f5f9', padding: '1.5rem' }}>
              <h5 className="mb-0" style={{ fontWeight: '700', color: 'var(--bg-dark)' }}>Informations du compte</h5>
            </div>
            <div className="p-4">
              <Row>
                <Col md={6} className="mb-4">
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Nom complet</label>
                  <p style={{ fontSize: '1.05rem', fontWeight: '500', color: 'var(--bg-dark)', margin: 0 }}>{user?.name || 'N/A'}</p>
                </Col>
                <Col md={6} className="mb-4">
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Adresse Email</label>
                  <p style={{ fontSize: '1.05rem', fontWeight: '500', color: 'var(--bg-dark)', margin: 0 }}>{user?.email || 'N/A'}</p>
                </Col>
                <Col md={6} className="mb-4">
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Rôle Système</label>
                  <p style={{ fontSize: '1.05rem', fontWeight: '500', color: 'var(--bg-dark)', margin: 0 }}>Administrateur Global</p>
                </Col>
                <Col md={6} className="mb-4">
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Membre depuis</label>
                  <p style={{ fontSize: '1.05rem', fontWeight: '500', color: 'var(--bg-dark)', margin: 0 }}>
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                      : 'N/A'}
                  </p>
                </Col>
                <Col md={12}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', display: 'block', marginBottom: '12px', textTransform: 'uppercase' }}>Permissions activées</label>
                  <div className="d-flex flex-wrap gap-2">
                    {['Gestion utilisateurs', 'Gestion stages', 'Gestion entreprises', 'Accès statistiques', 'Modération contenu'].map(p => (
                      <Badge key={p} style={{
                        padding: '0.6rem 1rem',
                        borderRadius: '8px',
                        background: 'var(--primary-color)',
                        color: 'white',
                        fontWeight: '600',
                        boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)',
                        border: 'none'
                      }}>{p}</Badge>
                    ))}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
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