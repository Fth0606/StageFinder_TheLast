import React, { useEffect } from 'react';
import { Container, Row, Col, Form, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaFilter, FaTimes, FaSearch } from 'react-icons/fa';
import SearchBar from '../../components/SearchBar/SearchBar';
import StageCard from '../../components/Cards/StageCard';
import { fetchStages, setFilters } from '../../store/slices/stagesSlice';
import styles from './StagesList.module.css';

const StagesList = () => {
  const dispatch = useDispatch();
  const { stages, isLoading, filters } = useSelector((state) => state.stages);

  useEffect(() => {
    dispatch(fetchStages(filters));
  }, [dispatch, filters]);

  const handleSearch = (searchFilters) => {
    dispatch(setFilters(searchFilters));
  };

  const handleFilterChange = (filterName, value) => {
    dispatch(setFilters({ [filterName]: value }));
  };

  const clearFilters = () => {
    dispatch(setFilters({
      search: '',
      location: '',
      domain: '',
      duration: '',
      type: '',
    }));
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '');
  };

  return (
    <div className={styles.stagesListPage}>
      {/* Dynamic Background */}
      <div className={styles.bgBlob1}></div>
      <div className={styles.bgBlob2}></div>

      <Container style={{ position: 'relative', zIndex: 1, padding: '3rem 0' }}>
        <div className="text-center mb-5 pb-3">
          <Badge bg="transparent" style={{ color: 'var(--primary-color)', border: '1px solid var(--primary-color)', padding: '8px 16px', borderRadius: '50px', marginBottom: '1rem', fontWeight: '600' }}>
            Découverte
          </Badge>
          <h1 style={{ fontWeight: '800', color: 'var(--bg-dark)', letterSpacing: '-1px', fontSize: '3rem', marginBottom: '1rem' }}>
            Trouver le Stage Idéal
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Explorez plus de <strong style={{ color: 'var(--primary-color)' }}>{stages.length}</strong> opportunités et lancez votre carrière aujourd'hui.
          </p>
        </div>

        <div className={styles.searchContainer}>
          <SearchBar onSearch={handleSearch} />
        </div>

        <Row className="mt-5 g-4">
          {/* Sidebar Filters */}
          <Col lg={3}>
            <div className={`glass-panel ${styles.filterSidebar}`}>
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <h5 className="mb-0" style={{ fontWeight: '700', color: 'var(--bg-dark)', display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                    <FaFilter size={14} />
                  </div>
                  Filtres
                </h5>
                {hasActiveFilters() && (
                  <button
                    onClick={clearFilters}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', transition: 'all 0.2s', padding: 0 }}
                  >
                    <FaTimes className="me-1" /> Effacer
                  </button>
                )}
              </div>

              {/* Duration Filter */}
              <div className="mb-4">
                <h6 style={{ fontWeight: '700', color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.95rem' }}>Durée</h6>
                <Form.Group>
                  <Form.Check type="radio" id="duration-1" label="Moins de 3 mois" name="duration" value="<3" checked={filters.duration === '<3'} onChange={(e) => handleFilterChange('duration', e.target.value)} className={styles.customRadio} />
                  <Form.Check type="radio" id="duration-2" label="3-6 mois" name="duration" value="3-6" checked={filters.duration === '3-6'} onChange={(e) => handleFilterChange('duration', e.target.value)} className={styles.customRadio} />
                  <Form.Check type="radio" id="duration-3" label="Plus de 6 mois" name="duration" value=">6" checked={filters.duration === '>6'} onChange={(e) => handleFilterChange('duration', e.target.value)} className={styles.customRadio} />
                </Form.Group>
              </div>

              {/* Type Filter */}
              <div className="mb-4">
                <h6 style={{ fontWeight: '700', color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.95rem' }}>Type</h6>
                <Form.Group>
                  <Form.Check type="checkbox" id="type-1" label="Rémunéré" checked={filters.type === 'paid'} onChange={(e) => handleFilterChange('type', e.target.checked ? 'paid' : '')} className={styles.customCheckbox} />
                  <Form.Check type="checkbox" id="type-2" label="Temps plein" checked={filters.type === 'fulltime'} onChange={(e) => handleFilterChange('type', e.target.checked ? 'fulltime' : '')} className={styles.customCheckbox} />
                  <Form.Check type="checkbox" id="type-3" label="Télétravail possible" checked={filters.type === 'remote'} onChange={(e) => handleFilterChange('type', e.target.checked ? 'remote' : '')} className={styles.customCheckbox} />
                </Form.Group>
              </div>

              {/* Active Filters */}
              {hasActiveFilters() && (
                <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <h6 style={{ fontWeight: '600', color: '#94a3b8', marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filtres actifs</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {filters.search && <Badge bg="transparent" className={styles.activeTag}>{filters.search}</Badge>}
                    {filters.location && <Badge bg="transparent" className={styles.activeTag}>{filters.location}</Badge>}
                    {filters.domain && <Badge bg="transparent" className={styles.activeTag}>{filters.domain}</Badge>}
                  </div>
                </div>
              )}
            </div>
          </Col>

          {/* Stages Grid */}
          <Col lg={9}>
            {isLoading ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '300px' }}>
                <div className="spinner-border" style={{ color: 'var(--primary-color)', width: '3rem', height: '3rem', marginBottom: '1rem' }} role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p style={{ color: '#64748b', fontWeight: '500' }}>Recherche des meilleures offres...</p>
              </div>
            ) : stages.length > 0 ? (
              <Row>
                {stages.map((stage) => (
                  <Col key={stage.id} md={6} xl={6} className="mb-4">
                    <StageCard stage={stage} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="glass-panel text-center py-5">
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>
                  <FaSearch />
                </div>
                <h4 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '0.5rem' }}>Aucun résultat trouvé</h4>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                  Nous n'avons trouvé aucune offre correspondant à vos critères de recherche.
                </p>
                <button className="btn-modern btn-modern-primary" onClick={clearFilters}>
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StagesList;