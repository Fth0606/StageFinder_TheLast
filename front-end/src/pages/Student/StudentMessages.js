import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Container, Row, Col, Card, ListGroup, Form, Button, 
  Badge, Dropdown, Spinner, InputGroup, Alert, Modal
} from 'react-bootstrap';
import { 
  FaPaperPlane, FaBuilding, FaSearch, FaFilter, 
  FaRegCommentDots, FaPlus, FaEllipsisV, FaCheck,
  FaCheckDouble, FaClock, FaPaperclip, FaTimes
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchStudentMessages, 
  sendMessageToCompany, 
  startConversation,
  markConversationAsRead,
  setFilter,
  clearFilters,
  selectFilteredConversations,
  selectTotalUnreadCount
} from '../../store/slices/messagesSlice';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';

const StudentMessages = () => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const { conversations, isLoading, isSending, error, filters } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);
  
  const filteredConversations = useSelector(selectFilteredConversations);
  const totalUnread = useSelector(selectTotalUnreadCount);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [newConversationData, setNewConversationData] = useState({
    companyId: '',
    initialMessage: ''
  });

  // Fetch conversations
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchStudentMessages(user.id));
    }
  }, [dispatch, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current && !isScrolling) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation?.messages, isScrolling]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim() && selectedConversation) {
      try {
        await dispatch(sendMessageToCompany({
          conversationId: selectedConversation.id,
          content: messageText,
          senderId: user?.id,
          senderType: 'student'
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

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    dispatch(setFilter({ filter: 'searchTerm', value }));
  }, [dispatch]);

  const handleFilterUnread = useCallback(() => {
    dispatch(setFilter({ filter: 'unreadOnly', value: !filters.unreadOnly }));
  }, [dispatch, filters.unreadOnly]);

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: fr });
    } else if (isYesterday(date)) {
      return 'Hier';
    } else {
      return format(date, 'dd/MM/yyyy', { locale: fr });
    }
  };

  const formatLastActive = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true, 
      locale: fr 
    });
  };

  const renderMessageStatus = (message, isLast) => {
    if (message.senderType !== 'student') return null;
    
    return (
      <small className="d-block text-end mt-1" style={{ fontSize: '0.75rem' }}>
        {message.isRead ? (
          <><FaCheckDouble className="text-primary" /> Lu</>
        ) : (
          <><FaCheck className="text-muted" /> Envoyé</>
        )}
      </small>
    );
  };

  const handleStartNewConversation = async () => {
    if (newConversationData.companyId && newConversationData.initialMessage) {
      try {
        await dispatch(startConversation({
          studentId: user.id,
          companyId: newConversationData.companyId,
          companyName: "Nouvelle Entreprise", // À remplacer par les vraies données
          internshipId: null,
          internshipTitle: "Nouvelle Opportunité",
          initialMessage: newConversationData.initialMessage
        })).unwrap();
        
        setShowNewConversationModal(false);
        setNewConversationData({ companyId: '', initialMessage: '' });
      } catch (error) {
        console.error('Failed to start conversation:', error);
      }
    }
  };

  return (
    <Container fluid className="py-4">
      {/* Header avec statistiques */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0">Messagerie</h2>
          <p className="text-muted mb-0">
            {totalUnread > 0 ? `${totalUnread} message(s) non lu(s)` : 'Tous les messages sont lus'}
          </p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => setShowNewConversationModal(true)}
            className="d-flex align-items-center gap-2"
          >
            <FaPlus /> Nouvelle Conversation
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-3" onClose={() => {}} dismissible>
          {error.message}
        </Alert>
      )}

      <Row>
        {/* Sidebar des conversations */}
        <Col lg={4}>
          <Card className="shadow-sm h-100" style={{ minHeight: '75vh' }}>
            <Card.Header className="bg-white border-0 pt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Conversations</h5>
                <Badge bg="primary" pill>
                  {filteredConversations.length}
                </Badge>
              </div>
              
              <InputGroup className="mb-3">
                <InputGroup.Text className="bg-light border-end-0">
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Rechercher une entreprise ou stage..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="border-start-0"
                />
                <Button 
                  variant={filters.unreadOnly ? "primary" : "outline-secondary"}
                  onClick={handleFilterUnread}
                  title="Filtrer les non lus"
                >
                  <FaFilter />
                </Button>
              </InputGroup>
              
              <div className="d-flex gap-2">
                <Badge 
                  bg={filters.unreadOnly ? "primary" : "light"} 
                  text={filters.unreadOnly ? "white" : "dark"}
                  className="cursor-pointer"
                  onClick={handleFilterUnread}
                >
                  Non lus ({conversations.filter(c => c.unreadCount > 0).length})
                </Badge>
                {filters.searchTerm || filters.unreadOnly ? (
                  <Badge 
                    bg="secondary" 
                    className="cursor-pointer"
                    onClick={() => dispatch(clearFilters())}
                  >
                    <FaTimes className="me-1" /> Effacer filtres
                  </Badge>
                ) : null}
              </div>
            </Card.Header>

            <Card.Body className="p-0" style={{ overflowY: 'auto' }}>
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
                            <div className="rounded-circle bg-primary bg-gradient d-flex align-items-center justify-content-center"
                              style={{ width: '48px', height: '48px', color: 'white' }}>
                              <FaBuilding size={20} />
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
                              <h6 className="mb-1 text-truncate">{conversation.companyName}</h6>
                              <small className="text-muted text-nowrap ms-2">
                                {formatMessageTime(conversation.lastMessageAt)}
                              </small>
                            </div>
                            <p className="text-truncate text-muted mb-1 small">
                              {conversation.internshipTitle}
                            </p>
                            <div className="d-flex align-items-center">
                              <small className="text-truncate text-muted flex-grow-1">
                                {conversation.lastMessage || 'Aucun message'}
                              </small>
                              {conversation.status === 'pending' && (
                                <Badge bg="warning" className="ms-2" style={{ fontSize: '0.6rem' }}>
                                  En attente
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-5">
                  <FaRegCommentDots size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">Aucune conversation</h5>
                  <p className="text-muted small mb-3">
                    {filters.searchQuery || filters.unreadOnly 
                      ? 'Aucune conversation ne correspond à vos filtres'
                      : 'Commencez une conversation avec une entreprise'
                    }
                  </p>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => setShowNewConversationModal(true)}
                  >
                    <FaPlus className="me-1" /> Démarrer une conversation
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Zone de conversation */}
        <Col lg={8}>
          {selectedConversation ? (
            <Card className="shadow-sm h-100 d-flex flex-column" style={{ minHeight: '75vh' }}>
              {/* En-tête de conversation */}
              <Card.Header className="bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary bg-gradient d-flex align-items-center justify-content-center me-3"
                      style={{ width: '50px', height: '50px', color: 'white' }}>
                      <FaBuilding size={24} />
                    </div>
                    <div>
                      <h5 className="mb-0">{selectedConversation.companyName}</h5>
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted">
                          {selectedConversation.internshipTitle}
                        </small>
                        <Badge 
                          bg={selectedConversation.status === 'active' ? 'success' : 'warning'}
                          className="rounded-pill"
                          style={{ fontSize: '0.65rem' }}
                        >
                          {selectedConversation.status === 'active' ? 'Actif' : 'En attente'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle variant="light" size="sm" className="rounded-circle">
                      <FaEllipsisV />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>Marquer comme important</Dropdown.Item>
                      <Dropdown.Item>Archiver la conversation</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item className="text-danger">Supprimer</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Card.Header>

              {/* Messages */}
              <Card.Body 
                className="flex-grow-1 p-3" 
                style={{ 
                  overflowY: 'auto', 
                  backgroundColor: '#f8fafc',
                  backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
                onScroll={() => setIsScrolling(true)}
                onMouseLeave={() => setIsScrolling(false)}
              >
                {selectedConversation.messages?.length > 0 ? (
                  <>
                    <div className="text-center my-3">
                      <Badge bg="light" text="dark" className="px-3 py-2">
                        <FaClock className="me-1" />
                        Conversation démarrée {formatLastActive(selectedConversation.messages[0].timestamp)}
                      </Badge>
                    </div>
                    
                    {selectedConversation.messages.map((message, index) => (
                      <div
                        key={message.id || index}
                        className={`mb-3 ${index === selectedConversation.messages.length - 1 ? 'pb-5' : ''}`}
                      >
                        <div className={`d-flex ${message.senderType === 'student' ? 'justify-content-end' : 'justify-content-start'}`}>
                          <div 
                            className={`p-3 rounded-4 ${message.senderType === 'student' 
                              ? 'bg-primary text-white' 
                              : 'bg-white border'
                            }`}
                            style={{ 
                              maxWidth: '70%',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                          >
                            <div className="d-flex align-items-center mb-2">
                              {message.senderType !== 'student' && (
                                <div className="rounded-circle bg-secondary bg-gradient d-flex align-items-center justify-content-center me-2"
                                  style={{ width: '28px', height: '28px', color: 'white' }}>
                                  <FaBuilding size={12} />
                                </div>
                              )}
                              <small className={`${message.senderType === 'student' ? 'text-white-50' : 'text-muted'}`}>
                                {message.senderType === 'student' ? 'Vous' : selectedConversation.companyName}
                                {' • '}
                                {format(new Date(message.timestamp), 'HH:mm', { locale: fr })}
                              </small>
                            </div>
                            <p className="mb-2">{message.content}</p>
                            {renderMessageStatus(message, index === selectedConversation.messages.length - 1)}
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
                      Envoyez le premier message pour commencer la conversation
                    </p>
                  </div>
                )}
              </Card.Body>

              {/* Zone de saisie */}
              <Card.Footer className="bg-white border-0 pt-3">
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
                        placeholder={`Écrivez un message à ${selectedConversation.companyName}...`}
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
                <h4 className="text-muted mb-3">Bienvenue dans votre messagerie</h4>
                <p className="text-muted mb-4">
                  Sélectionnez une conversation ou démarrez-en une nouvelle<br />
                  pour échanger avec les entreprises
                </p>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => setShowNewConversationModal(true)}
                  className="px-4"
                >
                  <FaPlus className="me-2" /> Nouvelle Conversation
                </Button>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      {/* Modal Nouvelle Conversation */}
      <Modal show={showNewConversationModal} onHide={() => setShowNewConversationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nouvelle Conversation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Entreprise</Form.Label>
              <Form.Select
                value={newConversationData.companyId}
                onChange={(e) => setNewConversationData(prev => ({ 
                  ...prev, 
                  companyId: e.target.value 
                }))}
              >
                <option value="">Sélectionnez une entreprise</option>
                <option value="1">TechCorp</option>
                <option value="2">Digital Agency</option>
                <option value="3">StartUp XYZ</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Votre message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Présentez-vous et expliquez pourquoi vous êtes intéressé..."
                value={newConversationData.initialMessage}
                onChange={(e) => setNewConversationData(prev => ({ 
                  ...prev, 
                  initialMessage: e.target.value 
                }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewConversationModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handleStartNewConversation}
            disabled={!newConversationData.companyId || !newConversationData.initialMessage.trim()}
          >
            Démarrer la conversation
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StudentMessages;