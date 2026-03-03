import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaBuilding, FaBriefcase, FaSearch, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
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

  const companiesArray = Array.isArray(companies) ? companies : (companies?.data || []);

  const filteredCompanies = companiesArray.filter(company => {
    const name = company.company_name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg-light)', position: 'relative', overflow: 'hidden', padding: '3rem 0' }}>
      {/* Dynamic Backgrounds */}
      <div style={{ position: 'absolute', top: '5%', left: '-5%', width: '400px', height: '400px', background: 'var(--primary-color)', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '300px', height: '300px', background: 'var(--accent-color)', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>

      <Container style={{ position: 'relative', zIndex: 1 }} fluid="lg">
        <div className="mb-4">
          <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)' }}>Gestion des entreprises</h2>
          <p style={{ color: '#64748b' }}>Consultez et gérez les entreprises inscrites sur la plateforme</p>
        </div>

        {/* Stats Overview */}
        <Row className="g-4 mb-4">
          <Col md={6}>
            <div className="glass-panel p-4 text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', borderTop: '4px solid var(--primary-color)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '10px' }}>
                <FaBuilding />
              </div>
              <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)', margin: 0 }}>{companiesArray.length}</h2>
              <p style={{ margin: 0, fontWeight: '700', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total entreprises</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="glass-panel p-4 text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', borderTop: '4px solid #10b981' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '10px' }}>
                <FaBriefcase />
              </div>
              <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)', margin: 0 }}>{companiesArray.reduce((sum, c) => sum + (c.offers_count || 0), 0)}</h2>
              <p style={{ margin: 0, fontWeight: '700', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total offres publiées</p>
            </div>
          </Col>
        </Row>

        {/* Search */}
        <div className="glass-panel p-4 mb-4">
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Rechercher une entreprise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 15px 12px 45px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', outline: 'none', transition: 'all 0.2s', fontWeight: '500', color: 'var(--bg-dark)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        {/* Companies Table */}
        <div className="glass-panel p-0 overflow-hidden">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: 'var(--primary-color)' }} role="status" />
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-5" style={{ background: '#f8fafc' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'white', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}><FaBuilding /></div>
              <h6 style={{ fontWeight: '700', color: 'var(--bg-dark)' }}>Aucune entreprise trouvée</h6>
              <p style={{ color: '#64748b', margin: 0 }}>Modifiez vos critères de recherche.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover style={{ margin: 0, verticalAlign: 'middle', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Entreprise</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Secteur & Localisation</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Site web</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none', textAlign: 'center' }}>Offres</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Inscrit le</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company) => (
                    <tr key={company.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '1.2rem 1.5rem', border: 'none' }}>
                        <div className="d-flex align-items-center">
                          <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px' }}>
                            <FaBuilding size={20} />
                          </div>
                          <div>
                            <strong style={{ color: 'var(--bg-dark)', display: 'block', fontSize: '1.05rem' }}>{company.company_name}</strong>
                            <small style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{company.user?.email || 'Email IP'}</small>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', border: 'none' }}>
                        <div style={{ color: '#475569', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontWeight: '500' }}>{company.industry || 'Non spécifié'}</span>
                          <span style={{ display: 'flex', alignItems: 'center', color: '#64748b' }}><FaMapMarkerAlt className="me-1" /> {company.location || 'N/A'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', border: 'none', color: '#475569', fontSize: '0.95rem' }}>
                        {company.website ? (
                          <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <FaGlobe className="me-1" /> {company.website.replace(/^https?:\/\//, '')}
                          </a>
                        ) : <span className="text-muted">N/A</span>}
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', border: 'none', textAlign: 'center' }}>
                        <div style={{ background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-color)', padding: '6px 12px', borderRadius: '50px', fontWeight: '700', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center' }}>
                          <FaBriefcase className="me-2" /> {company.offers_count || 0}
                        </div>
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', border: 'none', color: '#64748b' }}>
                        {company.user?.created_at ? new Date(company.user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', border: 'none', textAlign: 'right' }}>
                        <button
                          onClick={() => { setSelectedCompany(company); setShowDetailModal(true); }}
                          style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                          title="Voir"
                        >
                          <FaEye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </Container>

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered contentClassName="glass-panel" style={{ border: 'none' }}>
        <Modal.Header closeButton style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 2rem' }}>
          <Modal.Title style={{ fontWeight: '800', color: 'var(--bg-dark)' }}>Détails de l'entreprise</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          {selectedCompany && (
            <div>
              <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--accent-color), #0284c7)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginRight: '20px', boxShadow: '0 8px 16px rgba(14, 165, 233, 0.2)' }}>
                  <FaBuilding />
                </div>
                <div>
                  <h4 style={{ fontWeight: '800', color: 'var(--bg-dark)', marginBottom: '5px' }}>{selectedCompany.company_name}</h4>
                  <p style={{ margin: 0, color: '#64748b', display: 'flex', alignItems: 'center' }}>
                    <FaMapMarkerAlt className="me-2 text-primary" /> {selectedCompany.location || 'Localisation non renseignée'}
                  </p>
                </div>
              </div>

              {selectedCompany.description && (
                <div style={{ marginBottom: '2rem' }}>
                  <h6 style={{ fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px' }}>Description</h6>
                  <p style={{ color: 'var(--bg-dark)', lineHeight: '1.6' }}>{selectedCompany.description}</p>
                </div>
              )}

              <Row className="g-4">
                <Col md={6}>
                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
                    <h6 style={{ fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px', marginBottom: '1rem' }}>Informations</h6>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Secteur:</span> <strong style={{ color: 'var(--bg-dark)' }}>{selectedCompany.industry || 'N/A'}</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Site web:</span>
                        {selectedCompany.website ? <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>{selectedCompany.website.replace(/^https?:\/\//, '')}</a> : <strong style={{ color: 'var(--bg-dark)' }}>N/A</strong>}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Email:</span> <strong style={{ color: 'var(--bg-dark)' }}>{selectedCompany.user?.email || 'N/A'}</strong></div>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
                    <h6 style={{ fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px', marginBottom: '1rem' }}>Statistiques</h6>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Offres publiées:</span> <div style={{ background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-color)', padding: '2px 10px', borderRadius: '50px', fontWeight: '700', fontSize: '0.85rem' }}>{selectedCompany.offers_count || 0}</div></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Inscrit le:</span> <strong style={{ color: 'var(--bg-dark)' }}>{selectedCompany.user?.created_at ? new Date(selectedCompany.user.created_at).toLocaleDateString('fr-FR') : 'N/A'}</strong></div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowDetailModal(false)} style={{ background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px' }}>
            Fermer
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCompanies;