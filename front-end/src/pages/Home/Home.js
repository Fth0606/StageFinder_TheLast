import React, { useEffect } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaBriefcase, FaRocket, FaBuilding, FaUserGraduate } from 'react-icons/fa';
import StageCard from '../../components/Cards/StageCard';
import { fetchStages } from '../../store/slices/stagesSlice';
import './Home.module.css';

const Home = () => {
  const dispatch = useDispatch();
  const { stages, isLoading } = useSelector((state) => state.stages);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'student') {
        navigate('/stages');
      } else if (user?.role === 'company') {
        navigate('/company/dashboard');
      } else if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      }
    }
    dispatch(fetchStages({ limit: 6 }));
  }, [dispatch, isAuthenticated, user, navigate]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <div className="hero-badge">
                <span style={{ color: '#fff' }}>✨ Nouveau :</span> Plus de 500 offres ajoutées ce mois-ci
              </div>
              <h1 className="display-4 fw-bold">
                Démarrez votre carrière avec le <span className="text-gradient">stage idéal</span>
              </h1>
              <p className="lead mt-4 mb-5" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', lineHeight: '1.6' }}>
                StageFinder est la plateforme premium qui connecte les étudiants talentueux aux entreprises innovantes. Propulsez votre avenir dès aujourd'hui.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link to="/stages" style={{ textDecoration: 'none' }}>
                  <button className="btn-modern btn-modern-primary">
                    <FaSearch /> Découvrir les offres
                  </button>
                </Link>

                {!isAuthenticated && (
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <button className="btn-modern btn-modern-glass">
                      <FaRocket /> Rejoindre le réseau
                    </button>
                  </Link>
                )}
              </div>

              <div className="mt-5 d-flex gap-4 align-items-center" style={{ opacity: 0.8 }}>
                <div className="d-flex flex-column">
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2M+</span>
                  <span style={{ fontSize: '0.9rem' }}>Étudiants placés</span>
                </div>
                <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)' }}></div>
                <div className="d-flex flex-column">
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>10k+</span>
                  <span style={{ fontSize: '0.9rem' }}>Entreprises trustées</span>
                </div>
              </div>
            </Col>

            <Col lg={6} className="position-relative d-none d-lg-block">
              <div className="hero-illustration">
                {/* Visual abstract representation instead of just a flat icon */}
                <div className="glass-panel" style={{ width: '380px', height: '420px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaBriefcase color="white" size={24} />
                    </div>
                    <Badge bg="success" style={{ padding: '8px 12px', borderRadius: '8px' }}>Active</Badge>
                  </div>
                  <div style={{ height: '20px', width: '60%', background: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}></div>
                  <div style={{ height: '12px', width: '80%', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}></div>
                  <div style={{ height: '12px', width: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}></div>

                  <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-color)' }}></div>
                    <div>
                      <div style={{ height: '10px', width: '100px', background: 'rgba(255,255,255,0.2)', borderRadius: '5px', marginBottom: '8px' }}></div>
                      <div style={{ height: '8px', width: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px' }}></div>
                    </div>
                  </div>
                </div>

                {/* Floating accents */}
                <div className="glass-panel" style={{ position: 'absolute', top: '-20px', right: '0px', padding: '1rem', borderRadius: '16px', animation: 'float 3.5s ease-in-out infinite reverse' }}>
                  <span style={{ fontSize: '1.5rem' }}>🎯</span> Match 98%
                </div>
                <div className="glass-panel" style={{ position: 'absolute', bottom: '40px', left: '-30px', padding: '1rem', borderRadius: '16px', animation: 'float 4.5s ease-in-out infinite' }}>
                  <span style={{ fontSize: '1.5rem' }}>🚀</span> Premium
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Modern Features Section */}
      <section className="features-section">
        <Container>
          <div className="text-center mb-5 pb-3">
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-light)' }}>L'excellence à chaque étape</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '1rem auto' }}>
              Nous avons repensé la recherche de stage pour l'adapter aux standards d'aujourd'hui, avec des algorithmes intelligents et une sécurité infaillible.
            </p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)' }}>
                  <FaSearch />
                </div>
                <h4 style={{ fontWeight: '700', marginBottom: '1rem', color: 'var(--bg-dark)' }}>Recherche Intelligente</h4>
                <p style={{ color: '#64748b', lineHeight: '1.6' }}>Des filtres avancés et un matching sur-mesure pour découvrir des offres qui vous correspondent vraiment, en un instant.</p>
              </div>
            </Col>

            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)' }}>
                  <FaBuilding />
                </div>
                <h4 style={{ fontWeight: '700', marginBottom: '1rem', color: 'var(--bg-dark)' }}>Réseau d'Élite</h4>
                <p style={{ color: '#64748b', lineHeight: '1.6' }}>Accédez à un portfolio d'entreprises certifiées, allant des startups innovantes aux leaders internationaux du CAC40.</p>
              </div>
            </Col>

            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon-wrapper" style={{ background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-color)' }}>
                  <FaUserGraduate />
                </div>
                <h4 style={{ fontWeight: '700', marginBottom: '1rem', color: 'var(--bg-dark)' }}>Profil Impactant</h4>
                <p style={{ color: '#64748b', lineHeight: '1.6' }}>Un espace candidat optimisé pour mettre en valeur vos soft et hard skills. Postulez en un seul clic, sans tracas.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Latest Stages Section */}
      <section style={{ padding: '6rem 0', background: 'white' }}>
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-light)', margin: 0 }}>Offres récentes</h2>
              <p style={{ color: '#64748b', marginTop: '10px', fontSize: '1.1rem' }}>Les opportunités du moment à ne pas manquer</p>
            </div>
            <Link to="/stages" className="d-none d-md-block" style={{ textDecoration: 'none' }}>
              <span style={{ color: 'var(--primary-color)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                Explorer tout <span>→</span>
              </span>
            </Link>
          </div>

          {isLoading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border" style={{ color: 'var(--primary-color)', width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <Row className="g-4">
              {stages.slice(0, 6).map((stage) => (
                <Col key={stage.id} md={6} lg={4}>
                  <StageCard stage={stage} />
                </Col>
              ))}
            </Row>
          )}

          <div className="text-center mt-5 d-md-none">
            <Link to="/stages" style={{ textDecoration: 'none' }}>
              <button className="btn-modern btn-modern-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Explorer tout
              </button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;