import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStages } from '../../store/slices/stagesSlice';
import StageCard from '../../components/Cards/StageCard';

const Favorites = () => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.user);
  const { stages } = useSelector((state) => state.stages);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchStages());
  }, [dispatch]);

  // Filter stages to only show favorites
  const favoriteStages = stages.filter(stage => favorites.includes(stage.id));

  return (
    <Container className="py-5">
      <h1 className="mb-4">Mes Favoris</h1>
      
      {favoriteStages.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h3>Aucun favori</h3>
            <p>Vous n'avez pas encore ajouté de stages à vos favoris.</p>
            <Link to="/stages" className="btn btn-primary">
              Découvrir des stages
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {favoriteStages.map(stage => (
            <Col key={stage.id} md={6} lg={4} className="mb-4">
              <StageCard stage={stage} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Favorites;