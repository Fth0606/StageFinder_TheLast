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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('fr-FR');
  };

  const getCandidateName = (app) => app?.student?.user?.name || app?.candidateName || 'Candidat';
  const getOfferTitle = (app) => app?.offer?.title || app?.stageTitle || 'Offre';

  const getStatusBadge = (status) => {
    if (status === 'approved') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', text: 'Active' };
    if (status === 'pending') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', text: 'En attente' };
    if (status === 'rejected') return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', text: 'Refusée' };
    return { bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b', text: 'Brouillon' };
  };

  const pendingCount = applications.filter(a => a.status === 'pending').length;

  const StatCard = ({ title, count, icon, colorBase }) => (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      height: '100%',
      border: `1px solid rgba(255,255,255,0.8)`,
      background: 'white',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = `0 15px 30px ${colorBase}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
      }}>
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '100px', height: '100px',
        background: `radial-gradient(circle at top right, ${colorBase}44, transparent 70%)`,
        borderRadius: '0 0 0 100%'
      }}></div>
      <div className="d-flex justify-content-between align-items-center position-relative">
        <div>
          <h3 className="mb-1" style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--bg-dark)' }}>{count}</h3>
          <p className="mb-0" style={{ fontWeight: '600', color: '#64748b' }}>{title}</p>
        </div>
        <div style={{
          width: '60px', height: '60px', borderRadius: '16px',
          background: `${colorBase}15`, color: colorBase,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <Container className="py-5" style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg-light)' }}>
      <div className="mb-5">
        <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)', letterSpacing: '-0.5px' }}>
          Tableau de bord <span style={{ color: 'var(--primary-color)' }}>{user?.name}</span>
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Gérez vos offres de stage et pilotez vos recrutements</p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-5 g-4">
        <Col md={3}>
          <StatCard title="Offres actives" count={stages.length} icon={<FaBriefcase />} colorBase="#0ea5e9" />
        </Col>
        <Col md={3}>
          <StatCard title="Candidatures" count={applications.length} icon={<FaUsers />} colorBase="#6366f1" />
        </Col>
        <Col md={3}>
          <StatCard title="En attente" count={pendingCount} icon={<FaEnvelope />} colorBase="#f59e0b" />
        </Col>
        <Col md={3}>
          <StatCard title="Vues ce mois" count={stats?.viewsThisMonth || 0} icon={<FaChartLine />} colorBase="#ec4899" />
        </Col>
      </Row>

      {/* Quick Actions */}
      <div className="glass-panel mb-5" style={{ background: 'white', padding: '1.5rem 2rem' }}>
        <h5 style={{ fontWeight: '700', marginBottom: '1.5rem', color: 'var(--bg-dark)' }}>Actions rapides</h5>
        <div className="d-flex gap-3 flex-wrap">
          <Link to="/company/post-stage" style={{ textDecoration: 'none' }}>
            <button className="btn-modern btn-modern-primary" style={{ padding: '10px 20px', fontSize: '0.95rem' }}>
              <FaPlus /> Publier une offre
            </button>
          </Link>
          <Link to="/company/applications" style={{ textDecoration: 'none' }}>
            <button style={{
              border: '1px solid #e2e8f0', background: 'white', color: 'var(--bg-dark)',
              padding: '10px 20px', borderRadius: '12px', fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)'; }}
            >
              <FaUsers className="text-primary" /> Voir les candidatures
            </button>
          </Link>
          <Link to="/company/messages" style={{ textDecoration: 'none' }}>
            <button style={{
              border: '1px solid #e2e8f0', background: 'white', color: 'var(--bg-dark)',
              padding: '10px 20px', borderRadius: '12px', fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)'; }}
            >
              <FaEnvelope className="text-primary" /> Messages
            </button>
          </Link>
        </div>
      </div>

      <Row className="g-4">
        {/* Stages Table */}
        <Col lg={8}>
          <div className="glass-panel" style={{ background: 'white', padding: '1.5rem', height: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <h5 style={{ fontWeight: '700', color: 'var(--bg-dark)', margin: 0 }}>Mes offres de stage récentes</h5>
            </div>

            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: 'var(--primary-color)' }} role="status" />
              </div>
            ) : stages.length > 0 ? (
              <Table responsive borderless hover style={{ margin: 0 }}>
                <thead>
                  <tr style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ paddingBottom: '1rem', fontWeight: '600' }}>Titre de l'offre</th>
                    <th style={{ paddingBottom: '1rem', fontWeight: '600' }}>Statut</th>
                    <th style={{ paddingBottom: '1rem', fontWeight: '600' }}>Candidatures</th>
                    <th style={{ paddingBottom: '1rem', fontWeight: '600' }}>Date</th>
                    <th style={{ paddingBottom: '1rem', fontWeight: '600', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stages.slice(0, 5).map((stage) => {
                    const badge = getStatusBadge(stage.status);
                    return (
                      <tr key={stage.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }}>
                        <td style={{ padding: '1rem 0', verticalAlign: 'middle' }}>
                          <strong style={{ color: 'var(--bg-dark)', fontSize: '0.95rem' }}>{stage.title}</strong><br />
                          <small style={{ color: '#64748b' }}>{stage.location}</small>
                        </td>
                        <td style={{ padding: '1rem 0', verticalAlign: 'middle' }}>
                          <span style={{
                            background: badge.bg, color: badge.color,
                            padding: '4px 10px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '600'
                          }}>
                            {badge.text}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0', verticalAlign: 'middle' }}>
                          <span style={{
                            background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)',
                            padding: '4px 10px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600'
                          }}>
                            {stage.applications_count || 0}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0', verticalAlign: 'middle', color: '#64748b', fontSize: '0.9rem' }}>
                          {formatDate(stage.created_at)}
                        </td>
                        <td style={{ padding: '1rem 0', verticalAlign: 'middle', textAlign: 'right' }}>
                          <Link to={`/company/stages/${stage.id}`}>
                            <button style={{
                              background: 'transparent', border: '1px solid #e2e8f0', color: 'var(--bg-dark)',
                              padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.color = 'var(--primary-color)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = 'var(--bg-dark)'; }}
                            >
                              <FaEye className="me-1" /> Voir
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5">
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📝</div>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Vous n'avez pas encore publié d'offres.</p>
                <Link to="/company/post-stage" style={{ textDecoration: 'none' }}>
                  <button className="btn-modern btn-modern-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                    Créer ma première offre
                  </button>
                </Link>
              </div>
            )}
          </div>
        </Col>

        {/* Recent Applications */}
        <Col lg={4}>
          <div className="glass-panel" style={{ background: 'white', padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <h5 style={{ fontWeight: '700', color: 'var(--bg-dark)', margin: 0 }}>Candidatures récentes</h5>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {applications.length > 0 ? (
                applications.slice(0, 5).map((app) => (
                  <div key={app.id} style={{
                    padding: '1rem', marginBottom: '1rem', borderRadius: '16px',
                    border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#f8fafc',
                    cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div>
                      <strong style={{ color: 'var(--bg-dark)', display: 'block', marginBottom: '3px' }}>{getCandidateName(app)}</strong>
                      <small style={{ color: '#64748b', display: 'block', marginBottom: '8px' }}>{getOfferTitle(app)}</small>
                      <small style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaEnvelope /> {formatDate(app.applied_at)}
                      </small>
                    </div>
                    {app.status === 'pending' && (
                      <span style={{
                        background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)',
                        padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600'
                      }}>New</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 py-4 opacity-50">
                  <span style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📫</span>
                  <p className="text-center m-0" style={{ color: '#64748b' }}>Aucune candidature récente</p>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyDashboard;