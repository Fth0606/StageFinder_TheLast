import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';

const initialState = {
  stages: [],
  applications: [],
  conversations: [],
  stats: {
    totalStages: 0,
    totalApplications: 0,
    pendingApplications: 0,
    viewsThisMonth: 0,
  },
  isLoading: false,
  error: null,
};

// ─── Fetch company's OWN offers (all statuses: pending/approved/rejected) ────
// Uses /api/my-offers instead of /api/offers (which only returns approved ones)
export const fetchCompanyStages = createAsyncThunk(
  'company/fetchStages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getMyOffers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch stages' });
    }
  }
);

export const fetchCompanyApplications = createAsyncThunk(
  'company/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getApplications();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch applications' });
    }
  }
);

export const createStage = createAsyncThunk(
  'company/createStage',
  async (stageData, { rejectWithValue }) => {
    try {
      const response = await apiService.createOffer(stageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create stage' });
    }
  }
);

export const updateStage = createAsyncThunk(
  'company/updateStage',
  async ({ id, stageData }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateOffer(id, stageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update stage' });
    }
  }
);

// ─── Delete a stage ───────────────────────────────────────────────────────────
export const deleteStage = createAsyncThunk(
  'company/deleteStage',
  async (id, { rejectWithValue }) => {
    try {
      await apiService.deleteOffer(id);
      return id; // return id so reducer can remove it from state
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete stage' });
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'company/updateApplicationStatus',
  async ({ applicationId, status, reason }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateApplicationStatus(applicationId, { status, reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update status' });
    }
  }
);

export const fetchCompanyMessages = createAsyncThunk(
  'company/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getConversations();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch messages' });
    }
  }
);

export const sendMessage = createAsyncThunk(
  'company/sendMessage',
  async ({ conversationId, message, sender }, { rejectWithValue }) => {
    try {
      const response = await apiService.sendMessage(conversationId, {
        content: message,
        sender_id: sender,
        sender_type: 'company',
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to send message' });
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch stages ──────────────────────────────────────────────────────
      .addCase(fetchCompanyStages.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCompanyStages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stages = action.payload;
        state.stats.totalStages = action.payload.length;
      })
      .addCase(fetchCompanyStages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ── Fetch applications ────────────────────────────────────────────────
      .addCase(fetchCompanyApplications.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCompanyApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
        state.stats.totalApplications = action.payload.length;
        state.stats.pendingApplications = action.payload.filter(a => a.status === 'pending').length;
      })
      .addCase(fetchCompanyApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ── Create stage ──────────────────────────────────────────────────────
      .addCase(createStage.pending, (state) => { state.isLoading = true; })
      .addCase(createStage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stages.unshift(action.payload);
        state.stats.totalStages += 1;
      })
      .addCase(createStage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ── Update stage ──────────────────────────────────────────────────────
      .addCase(updateStage.fulfilled, (state, action) => {
        const idx = state.stages.findIndex(s => s.id === action.payload.id);
        if (idx !== -1) state.stages[idx] = action.payload;
      })

      // ── Delete stage ──────────────────────────────────────────────────────
      .addCase(deleteStage.fulfilled, (state, action) => {
        state.stages = state.stages.filter(s => s.id !== action.payload);
        state.stats.totalStages = state.stages.length;
      })

      // ── Update application status ─────────────────────────────────────────
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const app = state.applications.find(a => a.id === action.payload.id);
        if (app) {
          app.status = action.payload.status;
          state.stats.pendingApplications = state.applications.filter(a => a.status === 'pending').length;
        }
      })

      // ── Messages ──────────────────────────────────────────────────────────
      .addCase(fetchCompanyMessages.fulfilled, (state, action) => {
        state.conversations = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const conv = state.conversations.find(c => c.id === action.payload.conversation_id);
        if (conv) {
          conv.messages?.push(action.payload.message);
          conv.lastMessage = action.payload.message?.content;
        }
      });
  },
});

export const { clearError } = companySlice.actions;
export default companySlice.reducer;