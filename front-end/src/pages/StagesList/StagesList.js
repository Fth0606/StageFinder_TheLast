import React, { useEffect} from 'react';
import { Container, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaFilter, FaTimes } from 'react-icons/fa';
import SearchBar from '../../components/SearchBar/SearchBar';
import StageCard from '../../components/Cards/StageCard';
import { fetchStages, setFilters } from '../../store/slices/stagesSlice';
import './StagesList.module.css';

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
    <div className="stagesListPage">
      <Container>
        <div className="mb-4">
          <h1 className="mb-3">Rechercher un Stage</h1>
          <p className="text-muted">
            {stages.length} offres de stage disponibles
          </p>
        </div>

        <SearchBar onSearch={handleSearch} />

        <Row>
          {/* Sidebar Filters */}
          <Col lg={3} className="mb-4">
            <div className="filterSidebar">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  <FaFilter className="me-2" />
                  Filtres
                </h5>
                {hasActiveFilters() && (
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger p-0"
                    onClick={clearFilters}
                  >
                    <FaTimes className="me-1" />
                    Effacer
                  </Button>
                )}
              </div>

              {/* Duration Filter */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Durée</Form.Label>
                <Form.Check
                  type="radio"
                  label="Moins de 3 mois"
                  name="duration"
                  value="<3"
                  checked={filters.duration === '<3'}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="3-6 mois"
                  name="duration"
                  value="3-6"
                  checked={filters.duration === '3-6'}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="Plus de 6 mois"
                  name="duration"
                  value=">6"
                  checked={filters.duration === '>6'}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                />
              </Form.Group>

              {/* Type Filter */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Type</Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Rémunéré"
                  checked={filters.type === 'paid'}
                  onChange={(e) => handleFilterChange('type', e.target.checked ? 'paid' : '')}
                />
                <Form.Check
                  type="checkbox"
                  label="Temps plein"
                  checked={filters.type === 'fulltime'}
                  onChange={(e) => handleFilterChange('type', e.target.checked ? 'fulltime' : '')}
                />
                <Form.Check
                  type="checkbox"
                  label="Télétravail possible"
                  checked={filters.type === 'remote'}
                  onChange={(e) => handleFilterChange('type', e.target.checked ? 'remote' : '')}
                />
              </Form.Group>

              {/* Active Filters */}
              {hasActiveFilters() && (
                <div className="mt-4">
                  <h6 className="fw-bold mb-3">Filtres actifs:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {filters.search && (
                      <Badge bg="primary" className="badge-blue">
                        {filters.search}
                      </Badge>
                    )}
                    {filters.location && (
                      <Badge bg="primary" className="badge-blue">
                        {filters.location}
                      </Badge>
                    )}
                    {filters.domain && (
                      <Badge bg="primary" className="badge-blue">
                        {filters.domain}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Col>

          {/* Stages Grid */}
          <Col lg={9}>
            {isLoading ? (
              <div className="loadingSpinner">
                <div className="spinner-border text-primary spinner-border-custom" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : stages.length > 0 ? (
              <Row>
                {stages.map((stage) => (
                  <Col key={stage.id} md={6} xl={4} className="mb-4">
                    <StageCard stage={stage} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="noResults">
                <h4>Aucun résultat trouvé</h4>
                <p className="text-muted">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button variant="primary" onClick={clearFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StagesList;