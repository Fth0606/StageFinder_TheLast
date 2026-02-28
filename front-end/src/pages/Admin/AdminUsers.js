import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaEdit, FaTrash, FaBan, FaCheck, FaUserGraduate, FaUserTie } from 'react-icons/fa';
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

  const handleToggleStatus = async (user) => {
    await dispatch(updateUserStatus({
      userId: user.id,
      status: user.status === 'active' ? 'suspended' : 'active',
    }));
  };

  // Ensure users is always an array (guard against paginated object or null)
  const usersArray = Array.isArray(users) ? users : (users?.data || []);

  const filteredUsers = usersArray.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    // Fixed: use user.role instead of user.userType
    const matchesType = filterType === 'all' || user.role === filterType;
    return matchesSearch && matchesType;
  });

  const getUserTypeBadge = (role) => {
    if (role === 'student') return { bg: 'primary', icon: FaUserGraduate, text: 'Étudiant' };
    if (role === 'company') return { bg: 'success', icon: FaUserTie, text: 'Entreprise' };
    return { bg: 'danger', icon: FaUserTie, text: 'Admin' };
  };

  return (
    <Container fluid className="py-5">
      <div className="mb-4">
        <h2>Gestion des utilisateurs</h2>
        <p className="text-muted">Gérez tous les utilisateurs de la plateforme</p>
      </div>

      {/* Filters */}
      <Card className="mb-4" style={{ border: 'none', borderRadius: '15px' }}>
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text style={{ borderRadius: '10px 0 0 10px', border: '2px solid #e9ecef' }}>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: '2px solid #e9ecef', borderLeft: 'none', borderRadius: '0 10px 10px 0' }}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <div className="d-flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilterType('all')}
                  style={{ borderRadius: '10px' }}
                >
                  Tous
                </Button>
                <Button
                  variant={filterType === 'student' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilterType('student')}
                  style={{ borderRadius: '10px' }}
                >
                  Étudiants
                </Button>
                <Button
                  variant={filterType === 'company' ? 'success' : 'outline-success'}
                  onClick={() => setFilterType('company')}
                  style={{ borderRadius: '10px' }}
                >
                  Entreprises
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card style={{ border: 'none', borderRadius: '15px' }}>
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Rôle</th>
                  <th>Email</th>
                  <th>Inscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const typeInfo = getUserTypeBadge(user.role); // Fixed: user.role
                  const TypeIcon = typeInfo.icon;
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0066CC, #00C853)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            fontWeight: 'bold'
                          }}>
                            {user.name?.charAt(0) || '?'}
                          </div>
                          <strong>{user.name}</strong>
                        </div>
                      </td>
                      <td>
                        <Badge bg={typeInfo.bg}>
                          <TypeIcon className="me-1" />
                          {typeInfo.text}
                        </Badge>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <small>
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString('fr-FR')
                            : 'N/A'}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => { setSelectedUser(user); setShowEditModal(true); }}
                            style={{ borderRadius: '8px' }}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                            style={{ borderRadius: '8px' }}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{selectedUser?.name}</strong> ?
          Cette action est irréversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
          <Button variant="danger" onClick={handleDeleteUser}>Supprimer</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier l'utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" defaultValue={selectedUser?.name} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" defaultValue={selectedUser?.email} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rôle</Form.Label>
              <Form.Control type="text" defaultValue={selectedUser?.role} disabled />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Annuler</Button>
          <Button variant="primary">Enregistrer</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminUsers;