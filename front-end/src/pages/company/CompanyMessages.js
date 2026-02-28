import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Container, Row, Col, Card, ListGroup, Form, Button, 
  Badge, Dropdown, Spinner, InputGroup, Alert
} from 'react-bootstrap';
import { 
  FaPaperPlane, FaUser, FaSearch, FaFilter, 
  FaRegCommentDots, FaEllipsisV, FaCheck,
  FaCheckDouble, FaClock, FaPaperclip, FaTimes,
  FaUserGraduate, FaSortAmountDown, FaStar
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCompanyMessages,
  sendMessage,
  selectCompanyConversations,
  selectCompanyUnreadCount
} from '../../store/slices/companySlice';
import { markConversationAsRead } from '../../store/slices/messagesSlice';
import { format, formatDistanceToNow, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

const CompanyMessages = () => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const { conversations, isLoading, isSending } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Fetch conversations
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCompanyMessages(user.id));
    }
  }, [dispatch, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current && selectedConversation?.messages) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation?.messages]);

  const filteredConversations = conversations.filter(conv => {
    // Filter by search
    const matchesSearch = 
      conv.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.stageTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = filterStatus === 'all' || conv.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    // Sort by criteria
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
      case 'unread':
        return b.unreadCount - a.unreadCount;
      case 'name':
        return a.candidateName.localeCompare(b.candidateName);
      default:
        return 0;
    }
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim() && selectedConversation) {
      try {
        await dispatch(sendMessage({
          conversationId: selectedConversation.id,
          content: messageText,
          senderId: user?.id,
          senderType: 'company'
        })).unwrap();
        setMessageText('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleSelectConversation = useCallback((conversation) => {
    setSelectedConversation(conversation);
    if (conversation.unreadCount > 0) {
      dispatch(markConversationAsRead(conversation.id));
    }
  }, [dispatch]);

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: fr });
    }
    return format(date, 'dd/MM', { locale: fr });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'new': { color: 'info', text: 'Nouveau' },
      'active': { color: 'success', text: 'Actif' },
      'pending': { color: 'warning', text: 'En attente' },
      'archived': { color: 'secondary', text: 'Archivé' },
      'hired': { color: 'success', text: 'Embauché' },
      'rejected': { color: 'danger', text: 'Rejeté' }
    };
    
    const config = statusConfig[status] || { color: 'secondary', text: status };
    return (
      <Badge bg={config.color} className="rounded-pill" style={{ fontSize: '0.65rem' }}>
        {config.text}
      </Badge>
    );
  };

  const renderQuickResponses = () => {
    const responses = [
      "Merci pour votre intérêt !",
      "Pouvez-vous nous envoyer votre CV ?",
      "Êtes-vous disponible pour un entretien ?",
      "Nous vous recontacterons bientôt.",
      "Votre profil nous intéresse !"
    ];
    
    return (
      <div className="d-flex flex-wrap gap-2 mb-3">
        {responses.map((response, index) => (
          <Button
            key={index}
            variant="outline-primary"
            size="sm"
            onClick={() => setMessageText(response)}
            className="rounded-pill"
          >
            {response}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-1">Messagerie Entreprise</h2>
          <p className="text-muted">Communiquez avec vos candidats</p>
        </Col>
      </Row>

      <Row>
        {/* Sidebar des conversations */}
        <Col lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-0 pt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Candidats</h5>
                <Badge bg="primary" pill>
                  {filteredConversations.length}
                </Badge>
              </div>
              
              {/* Search and Filters */}
              <InputGroup className="mb-3">
                <InputGroup.Text className="bg-light border-end-0">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Rechercher un candidat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-start-0"
                />
              </InputGroup>
              
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm" className="d-flex align-items-center">
                    <FaFilter className="me-1" /> Statut: {filterStatus === 'all' ? 'Tous' : filterStatus}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setFilterStatus('all')}>Tous</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilterStatus('new')}>Nouveaux</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilterStatus('active')}>Actifs</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilterStatus('pending')}>En attente</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilterStatus('hired')}>Embauchés</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm" className="d-flex align-items-center">
                    <FaSortAmountDown className="me-1" /> Trier
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSortBy('recent')}>Plus récent</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('unread')}>Non lus</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('name')}>Nom A-Z</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                
                {searchQuery || filterStatus !== 'all' || sortBy !== 'recent' ? (
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterStatus('all');
                      setSortBy('recent');
                    }}
                    className="d-flex align-items-center"
                  >
                    <FaTimes className="me-1" /> Réinitialiser
                  </Button>
                ) : null}
              </div>
              
              <div className="d-flex gap-2">
                <Badge bg="warning" text="dark">
                  {conversations.filter(c => c.status === 'new').length} Nouveaux
                </Badge>
                <Badge bg="danger">
                  {conversations.filter(c => c.unreadCount > 0).length} Non lus
                </Badge>
              </div>
            </Card.Header>

            <Card.Body className="p-0" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3 text-muted">Chargement des conversations...</p>
                </div>
              ) : filteredConversations.length > 0 ? (
                <ListGroup variant="flush">
                  {filteredConversations.map((conversation) => (
                    <ListGroup.Item
                      key={conversation.id}
                      action
                      active={selectedConversation?.id === conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className="border-0 py-3 px-3"
                      style={{
                        borderLeft: selectedConversation?.id === conversation.id 
                          ? '4px solid var(--bs-primary)' 
                          : '4px solid transparent',
                        backgroundColor: conversation.unreadCount > 0 
                          ? 'rgba(var(--bs-primary-rgb), 0.05)' 
                          : 'transparent'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: 0 }}>
                          <div className="position-relative me-3">
                            <div className="rounded-circle bg-success bg-gradient d-flex align-items-center justify-content-center"
                              style={{ width: '48px', height: '48px', color: 'white' }}>
                              <FaUserGraduate size={20} />
                            </div>
                            {conversation.unreadCount > 0 && (
                              <Badge 
                                pill 
                                bg="danger" 
                                className="position-absolute top-0 start-100 translate-middle"
                                style={{ fontSize: '0.6rem' }}
                              >
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex-grow-1" style={{ minWidth: 0 }}>
                            <div className="d-flex justify-content-between align-items-start">
                              <h6 className="mb-1 text-truncate">{conversation.candidateName}</h6>
                              <small className="text-muted text-nowrap ms-2">
                                {formatMessageTime(conversation.lastMessageAt)}
                              </small>
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              {getStatusBadge(conversation.status)}
                              {conversation.isFavorite && (
                                <FaStar className="text-warning" size={12} />
                              )}
                            </div>
                            <p className="text-truncate text-muted mb-1 small">
                              {conversation.stageTitle}
                            </p>
                            <small className="text-truncate text-muted d-block">
                              {conversation.lastMessage || 'Aucun message'}
                            </small>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-5">
                  <FaRegCommentDots size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">Aucun candidat</h5>
                  <p className="text-muted small">
                    {searchQuery || filterStatus !== 'all'
                      ? 'Aucun candidat ne correspond à vos critères'
                      : 'Les candidats apparaîtront ici'
                    }
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Zone de conversation */}
        <Col lg={8}>
          {selectedConversation ? (
            <Card className="shadow-sm h-100 d-flex flex-column">
              {/* En-tête de conversation */}
              <Card.Header className="bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-success bg-gradient d-flex align-items-center justify-content-center me-3"
                      style={{ width: '50px', height: '50px', color: 'white' }}>
                      <FaUserGraduate size={24} />
                    </div>
                    <div>
                      <h5 className="mb-0">{selectedConversation.candidateName}</h5>
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted">
                          {selectedConversation.stageTitle}
                        </small>
                        {getStatusBadge(selectedConversation.status)}
                        {selectedConversation.isFavorite && (
                          <FaStar className="text-warning" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Dropdown>
                      <Dropdown.Toggle variant="light" size="sm" className="rounded-circle">
                        <FaEllipsisV />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>
                          {selectedConversation.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        </Dropdown.Item>
                        <Dropdown.Item>Voir le profil</Dropdown.Item>
                        <Dropdown.Item>Télécharger le CV</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="text-success">Marquer comme embauché</Dropdown.Item>
                        <Dropdown.Item className="text-danger">Rejeter la candidature</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="text-danger">Archiver</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </Card.Header>

              {/* Messages */}
              <Card.Body 
                className="flex-grow-1 p-3" 
                style={{ 
                  overflowY: 'auto', 
                  backgroundColor: '#f8fafc'
                }}
              >
                {selectedConversation.messages?.length > 0 ? (
                  <>
                    <div className="text-center my-3">
                      <Badge bg="light" text="dark" className="px-3 py-2">
                        <FaClock className="me-1" />
                        Conversation démarrée le {format(new Date(selectedConversation.messages[0].timestamp), 'dd/MM/yyyy', { locale: fr })}
                      </Badge>
                    </div>
                    
                    {selectedConversation.messages.map((message, index) => (
                      <div
                        key={message.id || index}
                        className={`mb-3 ${index === selectedConversation.messages.length - 1 ? 'pb-5' : ''}`}
                      >
                        <div className={`d-flex ${message.senderType === 'company' ? 'justify-content-end' : 'justify-content-start'}`}>
                          <div 
                            className={`p-3 rounded-4 ${message.senderType === 'company' 
                              ? 'bg-primary text-white' 
                              : 'bg-white border'
                            }`}
                            style={{ 
                              maxWidth: '70%',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                          >
                            <div className="d-flex align-items-center mb-2">
                              {message.senderType !== 'company' && (
                                <div className="rounded-circle bg-secondary bg-gradient d-flex align-items-center justify-content-center me-2"
                                  style={{ width: '28px', height: '28px', color: 'white' }}>
                                  <FaUser size={12} />
                                </div>
                              )}
                              <small className={`${message.senderType === 'company' ? 'text-white-50' : 'text-muted'}`}>
                                {message.senderType === 'company' ? 'Vous' : selectedConversation.candidateName}
                                {' • '}
                                {format(new Date(message.timestamp), 'HH:mm', { locale: fr })}
                              </small>
                            </div>
                            <p className="mb-2">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="text-center py-5">
                    <FaRegCommentDots size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">Aucun message</h5>
                    <p className="text-muted">
                      Envoyez un message pour commencer la conversation avec {selectedConversation.candidateName}
                    </p>
                  </div>
                )}
              </Card.Body>

              {/* Zone de saisie */}
              <Card.Footer className="bg-white border-0 pt-3">
                {renderQuickResponses()}
                <Form onSubmit={handleSendMessage}>
                  <div className="d-flex gap-2 align-items-end">
                    <Button 
                      variant="light" 
                      size="lg" 
                      className="rounded-circle"
                      title="Joindre un fichier"
                    >
                      <FaPaperclip />
                    </Button>
                    <div className="flex-grow-1 position-relative">
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder={`Écrivez un message à ${selectedConversation.candidateName}...`}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="rounded-4 border"
                        style={{ resize: 'none' }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                      {messageText.length > 0 && (
                        <small className="position-absolute end-0 bottom-0 mb-2 me-2 text-muted">
                          {messageText.length}/1000
                        </small>
                      )}
                    </div>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={!messageText.trim() || isSending}
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '50px', height: '50px' }}
                    >
                      {isSending ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <FaPaperPlane />
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Footer>
            </Card>
          ) : (
            <Card className="shadow-sm h-100 d-flex align-items-center justify-content-center">
              <div className="text-center py-5">
                <FaRegCommentDots size={64} className="text-muted mb-4" />
                <h4 className="text-muted mb-3">Sélectionnez un candidat</h4>
                <p className="text-muted">
                  Choisissez un candidat dans la liste pour voir la conversation
                </p>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyMessages;