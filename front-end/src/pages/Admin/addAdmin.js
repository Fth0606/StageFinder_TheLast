import React, { useState } from 'react';
import { Modal, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { FaUserPlus, FaTimes, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';

const AddAdmin = ({ show, handleClose, onAddAdmin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setValidationError('Le nom est requis');
      return false;
    }

    if (!formData.email.trim()) {
      setValidationError('L\'email est requis');
      return false;
    }

    // Validation email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Format d\'email invalide');
      return false;
    }

    if (!formData.password) {
      setValidationError('Le mot de passe est requis');
      return false;
    }

    if (formData.password.length < 6) {
      setValidationError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newAdmin = {
        id: Date.now(), // Générer un ID unique
        name: formData.name,
        email: formData.email,
        password: formData.password, // En production, cela devrait être hashé côté serveur
        role: formData.role,
        createdAt: new Date().toISOString()
      };

      // Sauvegarder dans localStorage (simulation)
      const existingAdmins = JSON.parse(localStorage.getItem('admins') || '[]');
      
      // Vérifier si l'email existe déjà
      if (existingAdmins.some(admin => admin.email === formData.email)) {
        setValidationError('Cet email est déjà utilisé');
        setIsLoading(false);
        return;
      }

      existingAdmins.push(newAdmin);
      localStorage.setItem('admins', JSON.stringify(existingAdmins));

      // Callback pour informer le parent
      if (onAddAdmin) {
        onAddAdmin(newAdmin);
      }

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'admin'
      });

      setIsLoading(false);
      handleClose();
    } catch (error) {
      setValidationError('Erreur lors de l\'ajout de l\'administrateur');
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'admin'
    });
    setValidationError('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered size="lg">
      <Modal.Header 
        style={{
          background: 'linear-gradient(135deg, #0066CC, #00C853)',
          color: 'white',
          borderRadius: '0'
        }}
      >
        <Modal.Title>
          <FaUserPlus className="me-2" />
          Ajouter un nouvel administrateur
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {validationError && (
          <Alert variant="danger" dismissible onClose={() => setValidationError('')}>
            {validationError}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nom complet *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Jean Dupont"
              style={{ borderRadius: '10px' }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              style={{ borderRadius: '10px' }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rôle *</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ borderRadius: '10px' }}
              required
            >
              <option value="admin">Administrateur</option>
              <option value="super_admin">Super Administrateur</option>
              <option value="moderator">Modérateur</option>
            </Form.Select>
            <Form.Text className="text-muted">
              Sélectionnez le niveau d'accès pour ce compte
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mot de passe *</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 caractères"
                style={{ borderRadius: '10px 0 0 10px' }}
                required
                minLength={6}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                style={{ borderRadius: '0 10px 10px 0' }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirmer le mot de passe *</Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Retapez le mot de passe"
                style={{ borderRadius: '10px 0 0 10px' }}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ borderRadius: '0 10px 10px 0' }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            <Button 
              variant="outline-secondary"
              onClick={handleModalClose}
              style={{ borderRadius: '10px', padding: '0.75rem 1.5rem' }}
              disabled={isLoading}
            >
              <FaTimes className="me-2" />
              Annuler
            </Button>
            <Button 
              variant="success"
              type="submit"
              disabled={isLoading}
              style={{ 
                backgroundColor: '#00C853',
                borderColor: '#00C853',
                borderRadius: '10px',
                padding: '0.75rem 1.5rem'
              }}
            >
              <FaSave className="me-2" />
              {isLoading ? 'Ajout en cours...' : 'Ajouter'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAdmin;