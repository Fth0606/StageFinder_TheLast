import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const initialState = {
  conversations: [],
  activeConversation: null,
  isLoading: false,
  isSending: false,
  error: null,
  filters: {
    unreadOnly: false,
    searchTerm: '',
  },
};

// Mock conversations améliorées
const mockStudentConversations = [
  {
    id: 1,
    companyId: 101,
    companyName: 'TechCorp',
    companyLogo: 'https://example.com/techcorp-logo.png',
    internshipId: 201,
    internshipTitle: 'Stage Développeur Full Stack',
    status: 'active', // active, pending, archived
    lastMessage: 'Merci pour votre candidature !',
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 1,
    participants: [
      { id: 1, name: 'John Doe', type: 'student' },
      { id: 101, name: 'TechCorp HR', type: 'company' }
    ],
    messages: [
      {
        id: 1,
        content: 'Bonjour, j\'ai postulé pour votre offre de stage.',
        senderId: 1,
        senderType: 'student',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        isRead: true,
        type: 'text'
      },
      {
        id: 2,
        content: 'Bonjour ! Merci pour votre candidature. Nous l\'avons bien reçue.',
        senderId: 101,
        senderType: 'company',
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        isRead: true,
        type: 'text'
      },
      {
        id: 3,
        content: 'Merci pour votre candidature !',
        senderId: 101,
        senderType: 'company',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: false,
        type: 'text'
      },
    ],
  },
  // Plus de conversations...
];

// Async thunks améliorés
export const fetchStudentMessages = createAsyncThunk(
  'messages/fetchStudentMessages',
  async (studentId, { rejectWithValue }) => {
    try {
      await simulateDelay();
      // En production, vous appellerez votre API Laravel
      // const response = await axios.get(`/api/students/${studentId}/conversations`);
      // return response.data;
      
      return mockStudentConversations.filter(conv => 
        conv.participants.some(p => p.id === studentId && p.type === 'student')
      );
    } catch (error) {
      return rejectWithValue({ 
        message: 'Erreur de chargement des messages',
        details: error.message 
      });
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  'messages/fetchConversationMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      await simulateDelay();
      const conversation = mockStudentConversations.find(c => c.id === conversationId);
      
      if (!conversation) {
        throw new Error('Conversation non trouvée');
      }
      
      return conversation;
    } catch (error) {
      return rejectWithValue({ 
        message: 'Erreur de chargement de la conversation',
        details: error.message 
      });
    }
  }
);

export const sendMessageToCompany = createAsyncThunk(
  'messages/sendMessage',
  async ({ conversationId, content, senderId, senderType = 'student' }, { rejectWithValue, dispatch }) => {
    try {
      // Simulation d'envoi
      await simulateDelay(300);
      
      const newMessage = {
        id: Date.now(),
        content,
        senderId,
        senderType,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: 'text'
      };
      
      // En production, vous enverrez à votre API Laravel
      // const response = await axios.post(`/api/conversations/${conversationId}/messages`, {
      //   content,
      //   sender_id: senderId,
      //   sender_type: senderType
      // });
      
      // Après l'envoi, marquer comme lu par l'expéditeur
      dispatch(markMessageAsRead({ 
        conversationId, 
        messageId: newMessage.id,
        userId: senderId 
      }));
      
      return {
        conversationId,
        message: newMessage
      };
    } catch (error) {
      return rejectWithValue({ 
        message: 'Erreur d\'envoi du message',
        details: error.message 
      });
    }
  }
);

export const startConversation = createAsyncThunk(
  'messages/startConversation',
  async ({ 
    studentId, 
    companyId, 
    companyName, 
    internshipId, 
    internshipTitle, 
    initialMessage 
  }, { rejectWithValue }) => {
    try {
      await simulateDelay();
      
      // En production, appel à l'API Laravel
      // const response = await axios.post('/api/conversations', {
      //   student_id: studentId,
      //   company_id: companyId,
      //   internship_id: internshipId,
      //   initial_message: initialMessage
      // });
      
      const newConversation = {
        id: Date.now(),
        companyId,
        companyName,
        internshipId,
        internshipTitle,
        status: 'pending',
        lastMessage: initialMessage,
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
        participants: [
          { id: studentId, name: 'Étudiant', type: 'student' },
          { id: companyId, name: companyName, type: 'company' }
        ],
        messages: [
          {
            id: 1,
            content: initialMessage,
            senderId: studentId,
            senderType: 'student',
            timestamp: new Date().toISOString(),
            isRead: true,
            type: 'text'
          },
        ],
      };
      
      return newConversation;
    } catch (error) {
      return rejectWithValue({ 
        message: 'Erreur de création de conversation',
        details: error.message 
      });
    }
  }
);

export const markConversationAsRead = createAsyncThunk(
  'messages/markConversationAsRead',
  async (conversationId, { rejectWithValue }) => {
    try {
      await simulateDelay(200);
      
      // En production, appel à l'API
      // await axios.patch(`/api/conversations/${conversationId}/read`);
      
      return conversationId;
    } catch (error) {
      return rejectWithValue({
        message: 'Erreur lors du marquage comme lu',
        details: error.message
      });
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    clearActiveConversation: (state) => {
      state.activeConversation = null;
    },
    markMessageAsRead: (state, action) => {
      const { conversationId, messageId, userId } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        const message = conversation.messages.find(m => m.id === messageId);
        if (message && message.senderId !== userId) {
          message.isRead = true;
        }
      }
    },
    markAllAsRead: (state, action) => {
      const conversationId = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        conversation.messages.forEach(message => {
          message.isRead = true;
        });
        conversation.unreadCount = 0;
      }
    },
    addMessageToConversation: (state, action) => {
      // Pour les messages reçus via WebSocket
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        conversation.messages.push(message);
        conversation.lastMessage = message.content;
        conversation.lastMessageAt = message.timestamp;
        
        // Incrémenter unreadCount si l'utilisateur n'est pas l'expéditeur
        if (message.senderType !== 'student') {
          conversation.unreadCount += 1;
        }
      }
    },
    updateConversationStatus: (state, action) => {
      const { conversationId, status } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        conversation.status = status;
      }
    },
    setFilter: (state, action) => {
      const { filter, value } = action.payload;
      state.filters[filter] = value;
    },
    clearFilters: (state) => {
      state.filters = {
        unreadOnly: false,
        searchTerm: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all conversations
      .addCase(fetchStudentMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchStudentMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch single conversation
      .addCase(fetchConversationMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversationMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeConversation = action.payload;
      })
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Send message
      .addCase(sendMessageToCompany.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendMessageToCompany.fulfilled, (state, action) => {
        state.isSending = false;
        const { conversationId, message } = action.payload;
        const conversation = state.conversations.find(c => c.id === conversationId);
        
        if (conversation) {
          conversation.messages.push(message);
          conversation.lastMessage = message.content;
          conversation.lastMessageAt = message.timestamp;
          conversation.unreadCount = 0; // L'étudiant a envoyé le message
        }
        
        // Mettre à jour aussi activeConversation si elle existe
        if (state.activeConversation && state.activeConversation.id === conversationId) {
          state.activeConversation.messages.push(message);
          state.activeConversation.lastMessage = message.content;
          state.activeConversation.lastMessageAt = message.timestamp;
          state.activeConversation.unreadCount = 0;
        }
      })
      .addCase(sendMessageToCompany.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      })
      
      // Start conversation
      .addCase(startConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload);
      })
      
      // Mark conversation as read
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        const conversationId = action.payload;
        const conversation = state.conversations.find(c => c.id === conversationId);
        
        if (conversation) {
          conversation.unreadCount = 0;
        }
        
        if (state.activeConversation && state.activeConversation.id === conversationId) {
          state.activeConversation.unreadCount = 0;
        }
      });
  },
});

// Selectors utiles
export const selectAllConversations = (state) => state.messages.conversations;

export const selectFilteredConversations = (state) => {
  const { conversations, filters } = state.messages;
  
  return conversations.filter(conversation => {
    // Filtre par non-lus
    if (filters.unreadOnly && conversation.unreadCount === 0) {
      return false;
    }
    
    // Filtre par recherche
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        conversation.companyName.toLowerCase().includes(searchLower) ||
        conversation.internshipTitle.toLowerCase().includes(searchLower) ||
        conversation.lastMessage.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
};

export const selectActiveConversation = (state) => state.messages.activeConversation;

export const selectTotalUnreadCount = (state) => {
  return state.messages.conversations.reduce(
    (total, conversation) => total + conversation.unreadCount, 
    0
  );
};

export const selectConversationById = (conversationId) => (state) => {
  return state.messages.conversations.find(c => c.id === conversationId);
};

export const { 
  clearError, 
  setActiveConversation, 
  clearActiveConversation,
  markMessageAsRead,
  markAllAsRead,
  addMessageToConversation,
  updateConversationStatus,
  setFilter,
  clearFilters 
} = messagesSlice.actions;

export default messagesSlice.reducer;