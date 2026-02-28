import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaBriefcase, FaRocket} from 'react-icons/fa';
import StageCard from '../../components/Cards/StageCard';
import { fetchStages } from '../../store/slices/stagesSlice';
import './Home.module.css';

const Home = () => {
  const dispatch = useDispatch();
  const { stages, isLoading } = useSelector((state) => state.stages);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchStages({ limit: 6 }));
  }, [dispatch]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0066CC 0%, #00C853 100%)',
        color: 'white',
        padding: '5rem 0',
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Trouvez le <span style={{ color: '#00C853' }}>Stage</span> de vos Rêves
              </h1>
              <p className="lead mb-4">
                StageFinder vous connecte avec les meilleures opportunités de stages
                dans votre domaine. Lancez votre carrière dès aujourd'hui !
              </p>
              <div className="d-flex gap-3">
                <Link to="/stages">
                  <Button variant="light" size="lg" style={{
                    padding: '0.75rem 2rem',
                    fontWeight: '600'
                  }}>
                    <FaSearch className="me-2" />
                    Rechercher un Stage
                  </Button>
                </Link>

                {!isAuthenticated && (
                  <Link to="/register">
                  <Button variant="success" size="lg" style={{
                    padding: '0.75rem 2rem',
                    fontWeight: '600',
                    backgroundColor: '#00C853',
                    borderColor: '#00C853'
                  }}>
                    <FaRocket className="me-2" />
                    Créer un Compte
                  </Button>
                </Link>
                )}
                
                
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-flex justify-content-center">
              <FaBriefcase size={300} style={{ opacity: 0.25 }} />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section style={{ 
        padding: '5rem 0', 
        backgroundColor: '#f8f9fa' 
      }}>
        <Container>
          <h2 className="text-center mb-5">Pourquoi StageFinder ?</h2>
          <Row>
            <Col md={4} className="text-center mb-4">
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.1), rgba(0, 200, 83, 0.1))',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <FaSearch size={50} style={{ color: '#0066CC' }} />
              </div>
              <h4>Recherche Facile</h4>
              <p>Trouvez rapidement des stages adaptés à vos compétences et aspirations</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.1), rgba(0, 200, 83, 0.1))',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <FaBriefcase size={50} style={{ color: '#00C853' }} />
              </div>
              <h4>Entreprises Vérifiées</h4>
              <p>Accédez à des offres d'entreprises reconnues et fiables</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.1), rgba(0, 200, 83, 0.1))',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <FaRocket size={50} style={{ color: '#0066CC' }} />
              </div>
              <h4>Candidature Simple</h4>
              <p>Postulez en quelques clics avec votre profil personnalisé</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Latest Stages Section */}
      <section style={{ padding: '5rem 0' }}>
        <Container>
          <h2 className="text-center mb-5">Dernières Offres de Stage</h2>
          {isLoading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status" style={{
                width: '3rem',
                height: '3rem',
                borderWidth: '0.3rem'
              }}>
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <Row>
              {stages.slice(0, 6).map((stage) => (
                <Col key={stage.id} md={6} lg={4} className="mb-4">
                  <StageCard stage={stage} />
                </Col>
              ))}
            </Row>
          )}
          <div className="text-center mt-4">
            <Link to="/stages">
              <Button variant="primary" size="lg" style={{
                backgroundColor: '#0066CC',
                borderColor: '#0066CC',
                padding: '0.75rem 2rem',
                fontWeight: '600'
              }}>
                Voir Toutes les Offres
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;