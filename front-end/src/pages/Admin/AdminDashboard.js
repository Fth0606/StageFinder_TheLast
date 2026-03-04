import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUsers, FaBriefcase, FaBuilding, FaChartLine } from 'react-icons/fa';
import { fetchAdminStats } from '../../store/slices/adminSlice';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, recentActivities, monthlyData, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const StatCard = ({ title, count, subtitle, icon, colorBase }) => (
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
          <small style={{ color: colorBase, fontWeight: '500' }}>{subtitle}</small>
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
    <Container fluid className="py-5" style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg-light)' }}>
      <div className="mb-5">
        <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)', letterSpacing: '-0.5px' }}>Tableau de bord Admin</h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Vue d'ensemble de la plateforme StageFinder</p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-5 g-4">
        <Col md={3}>
          <StatCard
            title="Utilisateurs"
            count={stats?.totalUsers || 0}
            subtitle={`+${stats?.newUsersThisMonth || 0} ce mois`}
            icon={<FaUsers />}
            colorBase="#6366f1"
          />
        </Col>

        <Col md={3}>
          <StatCard
            title="Offres de stage"
            count={stats?.totalStages || 0}
            subtitle={`${stats?.activeStages || 0} approuvées`}
            icon={<FaBriefcase />}
            colorBase="#0ea5e9"
          />
        </Col>

        <Col md={3}>
          <StatCard
            title="Entreprises"
            count={stats?.totalCompanies || 0}
            subtitle={`${stats?.pendingStages || 0} en attente`}
            icon={<FaBuilding />}
            colorBase="#ec4899"
          />
        </Col>

        <Col md={3}>
          <StatCard
            title="Candidatures"
            count={stats?.totalApplications || 0}
            subtitle={`+${stats?.applicationsToday || 0} aujourd'hui`}
            icon={<FaChartLine />}
            colorBase="#10b981"
          />
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-5 g-4">
        <Col lg={8}>
          <div className="glass-panel" style={{ background: 'white', padding: '1.5rem', height: '100%' }}>
            <h5 style={{ fontWeight: '700', marginBottom: '1.5rem', color: 'var(--bg-dark)' }}>Statistiques des 6 derniers mois</h5>
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
              </div>
            ) : (
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontWeight: '600' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="stages" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Stages" />
                    <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Utilisateurs" />
                    <Line type="monotone" dataKey="applications" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Candidatures" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Col>

        <Col lg={4}>
          <div className="glass-panel" style={{ background: 'white', padding: '1.5rem', height: '100%' }}>
            <h5 style={{ fontWeight: '700', marginBottom: '1.5rem', color: 'var(--bg-dark)' }}>Répartition des utilisateurs</h5>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { type: 'Étudiants', count: stats?.studentCount || 0, color: '#6366f1' },
                  { type: 'Entreprises', count: stats?.companyCount || 0, color: '#ec4899' },
                  { type: 'Admins', count: stats?.adminCount || 0, color: '#0ea5e9' },
                ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                  <Tooltip
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {
                      [
                        { type: 'Étudiants', count: stats?.studentCount || 0, color: '#6366f1' },
                        { type: 'Entreprises', count: stats?.companyCount || 0, color: '#ec4899' },
                        { type: 'Admins', count: stats?.adminCount || 0, color: '#0ea5e9' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
      </Row>

      {/* Quick Links + Recent Activities */}
      <Row className="mb-4 g-4">
        <Col md={6}>
          <div className="glass-panel" style={{ background: 'white', padding: '1.5rem', height: '100%' }}>
            <h5 style={{ fontWeight: '700', marginBottom: '1.5rem', color: 'var(--bg-dark)' }}>Actions rapides</h5>
            <div className="d-flex flex-column gap-3">
              <Link to="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ padding: '1rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#f8fafc', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.transform = 'translateX(5px)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginRight: '1rem' }}>
                    <FaUsers />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--bg-dark)' }}>Gérer les utilisateurs</strong>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Voir et modérer tous les profils</span>
                  </div>
                </div>
              </Link>

              <Link to="/admin/stages" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ padding: '1rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#f8fafc', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.transform = 'translateX(5px)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginRight: '1rem' }}>
                    <FaBriefcase />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--bg-dark)' }}>Gérer les offres de stage</strong>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Approuver et modérer les annonces</span>
                  </div>
                </div>
              </Link>

              <Link to="/admin/companies" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ padding: '1rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#f8fafc', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.transform = 'translateX(5px)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginRight: '1rem' }}>
                    <FaBuilding />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--bg-dark)' }}>Gérer les entreprises</strong>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Valider les comptes recruteurs</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="glass-panel" style={{ background: 'white', padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h5 style={{ fontWeight: '700', marginBottom: '1.5rem', color: 'var(--bg-dark)' }}>Activités récentes</h5>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
              {Array.isArray(recentActivities) && recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="d-flex align-items-start mb-3 pb-3" style={{ borderBottom: index < recentActivities.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: activity.type === 'user' ? 'rgba(99, 102, 241, 0.1)' : activity.type === 'offer' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(236, 72, 153, 0.1)',
                      color: activity.type === 'user' ? 'var(--primary-color)' : activity.type === 'offer' ? 'var(--accent-color)' : 'var(--secondary-color)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', flexShrink: 0, marginTop: '2px'
                    }}>
                      {activity.type === 'user' && <FaUsers size={16} />}
                      {activity.type === 'offer' && <FaBriefcase size={16} />}
                      {activity.type === 'application' && <FaChartLine size={16} />}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-light)', lineHeight: '1.4' }}>{activity.message}</p>
                      <small style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 py-4 opacity-50">
                  <span style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📭</span>
                  <p className="text-muted text-center m-0">Aucune activité récente</p>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;