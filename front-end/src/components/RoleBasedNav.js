import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

const RoleBasedNav = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) return null;

  // Navigation pour les étudiants
  if (user?.userType === 'student') {
    return (
      <>
        <Nav.Link as={Link} to="/stages">
          Rechercher
        </Nav.Link>
        <Nav.Link as={Link} to="/mes-candidatures">
          Mes Candidatures
        </Nav.Link>
        <Nav.Link as={Link} to="/profile">
          Profil
        </Nav.Link>
      </>
    );
  }

  // Navigation pour les entreprises
  if (user?.userType === 'company') {
    return (
      <>
        <Nav.Link as={Link} to="/company/dashboard">
          Tableau de bord
        </Nav.Link>
        <Nav.Link as={Link} to="/company/post-stage">
          Publier une offre
        </Nav.Link>
        <Nav.Link as={Link} to="/company/applications">
          Candidatures
        </Nav.Link>
        <Nav.Link as={Link} to="/company/messages">
          Messages
        </Nav.Link>
      </>
    );
  }

  // Navigation pour les admins
  if (user?.userType === 'admin') {
    return (
      <>
        <Nav.Link as={Link} to="/admin/dashboard">
          Dashboard Admin
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/users">
          Utilisateurs
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/stages">
          Stages
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/companies">
          Entreprises
        </Nav.Link>
      </>
    );
  }

  return null;
};

export default RoleBasedNav;
