import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { FaUser, FaUserCircle, FaSignOutAlt, FaCog, FaHeart } from 'react-icons/fa';

const ProfileButton = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleProfileClick = () => {
    if (user?.userType === 'student') {
      navigate('/profile');
    } else if (user?.userType === 'company') {
      navigate('/company/profile');
    } else if (user?.userType === 'admin') {
      navigate('/admin/profile');
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  // Get user initials safely
  const getInitials = () => {
    if (!user?.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle 
        variant="light" 
        className="d-flex align-items-center border-0"
        style={{
          borderRadius: '50px',
          padding: '0.5rem 1rem',
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white'
        }}
      >
        <FaUserCircle className="me-2" size={20} />
        <span className="me-2">{user?.name?.split(' ')[0] || 'Profil'}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: '200px' }}>
        <Dropdown.Item onClick={handleProfileClick}>
          <FaUser className="me-2" />
          Mon Profil
        </Dropdown.Item>
        
        {user?.userType === 'student' && (
          <Dropdown.Item onClick={() => navigate('/favorites')}>
            <FaHeart className="me-2" />
            Mes Favoris
          </Dropdown.Item>
        )}
        
        <Dropdown.Divider />
        
        <Dropdown.Item onClick={handleLogout} className="text-danger">
          <FaSignOutAlt className="me-2" />
          Déconnexion
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileButton;