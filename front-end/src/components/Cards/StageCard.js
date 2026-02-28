import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaBuilding } from 'react-icons/fa';
import './StageCard.module.css';

const StageCard = ({ stage }) => {
  console.log('StageCard - Full stage object:', stage);
  console.log('StageCard - Stage ID:', stage.id);

  // ✅ FIX: Handle both possible data structures
  let companyName = 'Entreprise';
  
  // Case 1: stage has company object with company_name
  if (stage.company?.company_name) {
    companyName = stage.company.company_name;
  }
  // Case 2: stage has company_name directly
  else if (stage.company_name) {
    companyName = stage.company_name;
  }
  // Case 3: stage has company object with name
  else if (stage.company?.name) {
    companyName = stage.company.name;
  }
  // Case 4: we only have company_id
  else if (stage.company_id) {
    companyName = `Entreprise #${stage.company_id}`;
  }

  // Handle location - might be in different formats
  const location = stage.location || stage.lieu || 'Non spécifié';
  
  // Handle duration
  const duration = stage.duration || stage.duree || 'Non spécifié';
  
  // Handle description
  const description = stage.description || stage.full_description || 'Aucune description disponible';
  
  // Handle tags - might be JSON string or array
  let tags = stage.tags || [];
  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch (e) {
      tags = tags.split(',').map(tag => tag.trim());
    }
  }

  // Handle date
  const createdDate = stage.created_at || stage.createdAt || stage.published_at;
  const formattedDate = createdDate 
    ? new Date(createdDate).toLocaleDateString('fr-FR')
    : 'Date inconnue';

  return (
    <Card className="stage-card h-100" style={{ 
      border: 'none',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}>
      <Card.Header style={{
        background: 'linear-gradient(135deg, #0066CC 0%, #00C853 100%)',
        color: 'white',
        borderRadius: '15px 15px 0 0',
        padding: '1.25rem',
        border: 'none'
      }}>
        <h5 className="mb-0">{stage.title}</h5>
      </Card.Header>
      
      <Card.Body style={{ padding: '1.5rem' }}>
        <div className="d-flex align-items-center mb-2">
          <FaBuilding className="me-2 text-primary" />
          <strong>{companyName}</strong>
        </div>
        
        <div className="d-flex align-items-center mb-2 text-muted">
          <FaMapMarkerAlt className="me-2" />
          <span>{location}</span>
        </div>
        
        <div className="d-flex align-items-center mb-3 text-muted">
          <FaClock className="me-2" />
          <span>{duration}</span>
        </div>
        
        <p className="card-text">{description.substring(0, 100)}...</p>
        
        <div className="mb-3">
          {Array.isArray(tags) && tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              bg="primary" 
              className="me-2"
              style={{
                backgroundColor: '#0066CC',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem'
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        <Link to={`/stages/${stage.id}`}>
          <button className="btn btn-primary w-100" style={{
            backgroundColor: '#0066CC',
            borderColor: '#0066CC',
            borderRadius: '10px',
            padding: '0.75rem',
            fontWeight: '600'
          }}>
            Voir les détails
          </button>
        </Link>
      </Card.Body>
      
      <Card.Footer className="text-muted small" style={{
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        padding: '0.75rem 1.5rem'
      }}>
        Publié le {formattedDate}
      </Card.Footer>
    </Card>
  );
};

export default StageCard;