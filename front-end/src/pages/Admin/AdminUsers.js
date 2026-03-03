import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaEdit, FaTrash, FaUserGraduate, FaUserTie, FaUserShield } from 'react-icons/fa';
import { fetchAllUsers, updateUserStatus, deleteUser } from '../../store/slices/adminSlice';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.admin);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleDeleteUser = async () => {
    if (selectedUser) {
      await dispatch(deleteUser(selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const usersArray = Array.isArray(users) ? users : (users?.data || []);

  const filteredUsers = usersArray.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || user.role === filterType;
    return matchesSearch && matchesType;
  });

  const getUserTypeBadge = (role) => {
    if (role === 'student') return { bg: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', icon: FaUserGraduate, text: 'Étudiant' };
    if (role === 'company') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', icon: FaUserTie, text: 'Entreprise' };
    return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', icon: FaUserShield, text: 'Admin' };
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg-light)', position: 'relative', overflow: 'hidden', padding: '3rem 0' }}>
      {/* Dynamic Backgrounds */}
      <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px', background: 'var(--primary-color)', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '300px', height: '300px', background: 'var(--accent-color)', filter: 'blur(150px)', opacity: '0.08', borderRadius: '50%', zIndex: 0 }}></div>

      <Container style={{ position: 'relative', zIndex: 1 }} fluid="lg">
        <div className="mb-4">
          <h2 style={{ fontWeight: '800', color: 'var(--bg-dark)' }}>Gestion des utilisateurs</h2>
          <p style={{ color: '#64748b' }}>Gérez tous les utilisateurs de la plateforme</p>
        </div>

        {/* Filters Panel */}
        <div className="glass-panel p-4 mb-4">
          <Row className="g-3 align-items-center">
            <Col lg={6}>
              <div style={{ position: 'relative' }}>
                <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '12px 15px 12px 45px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', outline: 'none', transition: 'all 0.2s', fontWeight: '500', color: 'var(--bg-dark)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="d-flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterType('all')}
                  style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '600', transition: 'all 0.2s', border: filterType === 'all' ? '1px solid var(--primary-color)' : '1px solid #e2e8f0', background: filterType === 'all' ? 'var(--primary-color)' : 'white', color: filterType === 'all' ? 'white' : '#64748b' }}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterType('student')}
                  style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '600', transition: 'all 0.2s', border: filterType === 'student' ? '1px solid var(--primary-color)' : '1px solid #e2e8f0', background: filterType === 'student' ? 'rgba(99, 102, 241, 0.1)' : 'white', color: filterType === 'student' ? 'var(--primary-color)' : '#64748b' }}
                >
                  Étudiants
                </button>
                <button
                  onClick={() => setFilterType('company')}
                  style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '600', transition: 'all 0.2s', border: filterType === 'company' ? '1px solid #10b981' : '1px solid #e2e8f0', background: filterType === 'company' ? 'rgba(16, 185, 129, 0.1)' : 'white', color: filterType === 'company' ? '#10b981' : '#64748b' }}
                >
                  Entreprises
                </button>
                <button
                  onClick={() => setFilterType('admin')}
                  style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '600', transition: 'all 0.2s', border: filterType === 'admin' ? '1px solid #ef4444' : '1px solid #e2e8f0', background: filterType === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'white', color: filterType === 'admin' ? '#ef4444' : '#64748b' }}
                >
                  Admin
                </button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Users Table */}
        <div className="glass-panel p-0 overflow-hidden">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: 'var(--primary-color)' }} role="status" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5" style={{ background: '#f8fafc' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'white', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}><FaSearch /></div>
              <h6 style={{ fontWeight: '700', color: 'var(--bg-dark)' }}>Aucun utilisateur trouvé</h6>
              <p style={{ color: '#64748b', margin: 0 }}>Modifiez vos filtres de recherche.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover style={{ margin: 0, verticalAlign: 'middle', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Utilisateur</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Rôle</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Email</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none' }}>Inscription</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', border: 'none', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const typeInfo = getUserTypeBadge(user.role);
                    const TypeIcon = typeInfo.icon;
                    return (
                      <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                        <td style={{ padding: '1.2rem 1.5rem', border: 'none' }}>
                          <div className="d-flex align-items-center">
                            <div style={{
                              width: '45px', height: '45px', borderRadius: '12px',
                              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              marginRight: '15px', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
                            }}>
                              {user.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <strong style={{ color: 'var(--bg-dark)', display: 'block', fontSize: '1.05rem' }}>{user.name}</strong>
                              <small style={{ color: '#94a3b8', fontSize: '0.85rem' }}>ID: #{user.id}</small>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', border: 'none' }}>
                          <div style={{ background: typeInfo.bg, color: typeInfo.color, padding: '6px 14px', borderRadius: '50px', fontWeight: '700', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center' }}>
                            <TypeIcon className="me-2" /> {typeInfo.text}
                          </div>
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', border: 'none', color: '#475569', fontWeight: '500' }}>
                          {user.email}
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', border: 'none', color: '#64748b' }}>
                          {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', border: 'none', textAlign: 'right' }}>
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              onClick={() => { setSelectedUser(user); setShowEditModal(true); }}
                              style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                              title="Modifier"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                              style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                              title="Supprimer"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </Container>


      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered contentClassName="glass-panel" style={{ border: 'none' }}>
        <Modal.Header closeButton style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 2rem' }}>
          <Modal.Title style={{ fontWeight: '800', color: 'var(--bg-dark)' }}>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{selectedUser?.name}</strong> ?
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '10px', marginTop: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
            <FaTrash className="me-2" /> Cette action est irréversible et supprimera toutes les données liées.
          </div>
        </Modal.Body>
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={() => setShowDeleteModal(false)} style={{ background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px' }}>Annuler</button>
          <button onClick={handleDeleteUser} style={{ background: '#ef4444', border: 'none', color: 'white', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)' }}>Supprimer</button>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered contentClassName="glass-panel" style={{ border: 'none' }}>
        <Modal.Header closeButton style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 2rem' }}>
          <Modal.Title style={{ fontWeight: '800', color: 'var(--bg-dark)', display: 'flex', alignItems: 'center' }}>
            <FaEdit className="me-2 text-primary" /> Modifier l'utilisateur
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem', marginBottom: '8px' }}>Nom complet</Form.Label>
              <Form.Control type="text" defaultValue={selectedUser?.name} style={{ padding: '12px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', boxShadow: 'none' }} />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem', marginBottom: '8px' }}>Adresse Email</Form.Label>
              <Form.Control type="email" defaultValue={selectedUser?.email} style={{ padding: '12px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', boxShadow: 'none' }} />
            </Form.Group>
            <Form.Group>
              <Form.Label style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem', marginBottom: '8px' }}>Rôle (Lecture seule)</Form.Label>
              <Form.Control type="text" defaultValue={selectedUser?.role} disabled style={{ padding: '12px 15px', borderRadius: '10px', border: 'none', background: '#f1f5f9', color: '#94a3b8', fontWeight: '500' }} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={() => setShowEditModal(false)} style={{ background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px' }}>Annuler</button>
          <button style={{ background: 'var(--primary-color)', border: 'none', color: 'white', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '10px', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)' }}>Enregistrer</button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;