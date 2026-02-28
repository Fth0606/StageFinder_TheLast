import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaBuilding, FaBriefcase } from 'react-icons/fa';
import { fetchAllCompanies } from '../../store/slices/adminSlice';

const AdminCompanies = () => {
  const dispatch = useDispatch();
  const { companies, isLoading } = useSelector((state) => state.admin);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCompanies());
  }, [dispatch]);

  // Ensure companies is always an array
  const companiesArray = Array.isArray(companies) ? companies : (companies?.data || []);

  const filteredCompanies = companiesArray.filter(company => {
    const name = company.company_name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Container fluid className="py-5">
      <div className="mb-4">
        <h2>Gestion des entreprises</h2>
        <p className="text-muted">Consultez et gérez les entreprises inscrites</p>
      </div>

      {/* Stats */}
      <Row className="mb-4">
        <Col md={6}>
          <Card style={{ border: 'none', borderRadius: '15px', background: '#0066CC', color: 'white' }}>
            <Card.Body className="text-center">
              <h3>{companiesArray.length}</h3>
              <p className="mb-0">Total entreprises</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card style={{ border: 'none', borderRadius: '15px', background: '#00C853', color: 'white' }}>
            <Card.Body className="text-center">
              <h3>{companiesArray.reduce((sum, c) => sum + (c.offers_count || 0), 0)}</h3>
              <p className="mb-0">Total offres publiées</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search */}
      <Card className="mb-4" style={{ border: 'none', borderRadius: '15px' }}>
        <Card.Body>
          <Form.Control
            type="text"
            placeholder="Rechercher une entreprise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: '10px' }}
          />
        </Card.Body>
      </Card>

      {/* Companies Table */}
      <Card style={{ border: 'none', borderRadius: '15px' }}>
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>Aucune entreprise trouvée</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Entreprise</th>
                  <th>Localisation</th>
                  <th>Secteur</th>
                  <th>Site web</th>
                  <th>Offres</th>
                  <th>Inscrit le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaBuilding size={24} className="me-3 text-primary" />
                        <div>
                          <strong>{company.company_name}</strong>
                          <br />
                          <small className="text-muted">
                            {company.user?.email || 'N/A'}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>{company.location || 'N/A'}</td>
                    <td>{company.industry || 'N/A'}</td>
                    <td>
                      {company.website ? (
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td>
                      <Badge bg="info">
                        <FaBriefcase className="me-1" />
                        {company.offers_count || 0}
                      </Badge>
                    </td>
                    <td>
                      <small>
                        {company.user?.created_at
                          ? new Date(company.user.created_at).toLocaleDateString('fr-FR')
                          : 'N/A'}
                      </small>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => { setSelectedCompany(company); setShowDetailModal(true); }}
                        style={{ borderRadius: '8px' }}
                      >
                        <FaEye />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de l'entreprise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCompany && (
            <div>
              <Row className="mb-3">
                <Col md={8}>
                  <h5>{selectedCompany.company_name}</h5>
                  <p className="text-muted">
                    <FaBuilding className="me-2" />
                    {selectedCompany.location || 'Localisation non renseignée'}
                  </p>
                </Col>
              </Row>

              {selectedCompany.description && (
                <>
                  <h6>Description</h6>
                  <p>{selectedCompany.description}</p>
                </>
              )}

              <Row>
                <Col md={6}>
                  <h6>Informations</h6>
                  <p>
                    <strong>Secteur:</strong> {selectedCompany.industry || 'N/A'}<br />
                    <strong>Site web:</strong>{' '}
                    {selectedCompany.website
                      ? <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer">{selectedCompany.website}</a>
                      : 'N/A'
                    }<br />
                    <strong>Email:</strong> {selectedCompany.user?.email || 'N/A'}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Statistiques</h6>
                  <p>
                    <strong>Offres publiées:</strong> {selectedCompany.offers_count || 0}<br />
                    <strong>Inscrit le:</strong>{' '}
                    {selectedCompany.user?.created_at
                      ? new Date(selectedCompany.user.created_at).toLocaleDateString('fr-FR')
                      : 'N/A'}
                  </p>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminCompanies;