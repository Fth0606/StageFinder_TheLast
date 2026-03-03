import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaBuilding, FaBriefcase } from 'react-icons/fa';
import './StageCard.module.css';

const StageCard = ({ stage }) => {
  let companyName = 'Entreprise';

  if (stage.company?.company_name) {
    companyName = stage.company.company_name;
  }
  else if (stage.company_name) {
    companyName = stage.company_name;
  }
  else if (stage.company?.name) {
    companyName = stage.company.name;
  }
  else if (stage.company_id) {
    companyName = `Entreprise #${stage.company_id}`;
  }

  const location = stage.location || stage.lieu || 'Non spécifié';
  const duration = stage.duration || stage.duree || 'Non spécifié';
  const description = stage.description || stage.full_description || 'Aucune description disponible';

  let tags = stage.tags || [];
  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch (e) {
      tags = tags.split(',').map(tag => tag.trim());
    }
  }

  const createdDate = stage.created_at || stage.createdAt || stage.published_at;
  const formattedDate = createdDate
    ? new Date(createdDate).toLocaleDateString('fr-FR')
    : 'Date inconnue';

  return (
    <Card className="stage-card h-100" style={{
      border: '1px solid rgba(0,0,0,0.05)',
      borderRadius: '24px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      overflow: 'hidden',
      backgroundColor: '#fff',
      position: 'relative'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
        background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color))'
      }}></div>

      <Card.Body style={{ padding: '2rem 1.5rem 1.5rem' }}>
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div style={{
            width: '50px', height: '50px', borderRadius: '14px',
            background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            <FaBriefcase />
          </div>
          <Badge style={{
            backgroundColor: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-color)',
            padding: '6px 12px', borderRadius: '50px', fontWeight: '600'
          }}>
            Nouveau
          </Badge>
        </div>

        <h5 style={{ fontWeight: '700', color: 'var(--bg-dark)', marginBottom: '1rem', lineHeight: '1.4' }}>
          {stage.title}
        </h5>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
          <div className="d-flex align-items-center" style={{ color: '#475569', fontSize: '0.95rem' }}>
            <FaBuilding className="me-2" style={{ color: 'var(--secondary-color)' }} />
            <strong style={{ color: 'var(--text-light)' }}>{companyName}</strong>
          </div>

          <div className="d-flex align-items-center" style={{ color: '#64748b', fontSize: '0.9rem' }}>
            <FaMapMarkerAlt className="me-2" />
            <span>{location}</span>
          </div>

          <div className="d-flex align-items-center" style={{ color: '#64748b', fontSize: '0.9rem' }}>
            <FaClock className="me-2" />
            <span>{duration}</span>
          </div>
        </div>

        <p className="card-text" style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>
          {description.substring(0, 100)}...
        </p>

        <div className="mb-4 d-flex flex-wrap gap-2">
          {Array.isArray(tags) && tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              style={{
                backgroundColor: 'rgba(241, 245, 249, 1)',
                color: '#475569',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '500',
                border: '1px solid #e2e8f0'
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <Link to={`/stages/${stage.id}`} onClick={(e) => e.stopPropagation()} style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%',
            backgroundColor: 'transparent',
            color: 'var(--primary-color)',
            border: '2px solid var(--primary-color)',
            borderRadius: '12px',
            padding: '0.8rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-color)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--primary-color)';
            }}
          >
            Voir les détails
          </button>
        </Link>
      </Card.Body>

      <Card.Footer style={{
        backgroundColor: 'transparent',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        padding: '1rem 1.5rem',
        color: '#94a3b8',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>Publié le</span>
        <span style={{ fontWeight: '500', color: '#64748b' }}>{formattedDate}</span>
      </Card.Footer>
    </Card>
  );
};

export default StageCard;