import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { FaSearch, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import './SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    domain: '',
    duration: '',
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <div className="searchBar">
      <Form onSubmit={handleSubmit}>
        <Row className="align-items-end g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                <FaSearch className="me-2" />
                Mot-clé
              </Form.Label>
              <Form.Control
                type="text"
                name="search"
                placeholder="Titre, entreprise, compétences..."
                value={filters.search}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>
                <FaMapMarkerAlt className="me-2" />
                Localisation
              </Form.Label>
              <Form.Control
                type="text"
                name="location"
                placeholder="Ville, région..."
                value={filters.location}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>
                <FaBriefcase className="me-2" />
                Domaine
              </Form.Label>
              <Form.Select
                name="domain"
                value={filters.domain}
                onChange={handleChange}
              >
                <option value="">Tous les domaines</option>
                <option value="informatique">Informatique</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
                <option value="rh">Ressources Humaines</option>
                <option value="commerce">Commerce</option>
                <option value="ingenierie">Ingénierie</option>
                <option value="design">Design</option>
                <option value="communication">Communication</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={2}>
            <Button
              type="submit"
              variant="primary"
              className="w-100 searchButton"
            >
              <FaSearch className="me-2" />
              Rechercher
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchBar;