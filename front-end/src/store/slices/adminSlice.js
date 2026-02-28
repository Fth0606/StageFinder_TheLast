import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';

const initialState = {
  users: [],
  stages: [],
  companies: [],
  monthlyData: [],
  stats: {
    totalUsers: 0,
    totalStages: 0,
    totalCompanies: 0,
    totalApplications: 0,
    newUsersThisMonth: 0,
    activeStages: 0,
    pendingStages: 0,
    rejectedStages: 0,
    applicationsToday: 0,
    studentCount: 0,
    companyCount: 0,
  },
  recentActivities: [],
  isLoading: false,
  error: null,
};

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAdminStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch stats' });
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAdminUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch users' });
    }
  }
);

export const fetchAllStages = createAsyncThunk(
  'admin/fetchStages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAdminOffers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch stages' });
    }
  }
);

export const fetchAllCompanies = createAsyncThunk(
  'admin/fetchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAdminCompanies();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch companies' });
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateUserStatus(userId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update user' });
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await apiService.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete user' });
    }
  }
);

export const updateStageStatus = createAsyncThunk(
  'admin/updateStageStatus',
  async ({ stageId, status }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateOfferStatus(stageId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update stage' });
    }
  }
);

export const deleteStage = createAsyncThunk(
  'admin/deleteStage',
  async (stageId, { rejectWithValue }) => {
    try {
      await apiService.deleteOffer(stageId);
      return stageId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete stage' });
    }
  }
);

export const verifyCompany = createAsyncThunk(
  'admin/verifyCompany',
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await apiService.verifyCompany(companyId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to verify company' });
    }
  }
);

export const suspendCompany = createAsyncThunk(
  'admin/suspendCompany',
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await apiService.updateUserStatus(companyId, 'suspended');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to suspend company' });
    }
  }
);

export const createAdmin = createAsyncThunk(
  'admin/createAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await apiService.createAdmin(adminData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create admin' });
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== FETCH STATS =====
      .addCase(fetchAdminStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.isLoading = false;
        // API returns { stats: {...}, recent_activities: [...] }
        // Must extract each part separately — NOT assign the whole payload to state.stats
        state.stats = action.payload.stats || initialState.stats;
        state.monthlyData = action.payload.monthly_data || [];
        state.recentActivities = action.payload.recent_activities || [];
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ===== FETCH USERS =====
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        // API returns a plain array
        state.users = Array.isArray(action.payload)
          ? action.payload
          : action.payload.data || [];
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ===== UPDATE USER STATUS =====
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload?.user;
        if (updatedUser) {
          const index = state.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) state.users[index] = updatedUser;
        }
      })

      // ===== DELETE USER =====
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      })

      // ===== FETCH STAGES =====
      .addCase(fetchAllStages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllStages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stages = Array.isArray(action.payload)
          ? action.payload
          : action.payload.data || [];
      })
      .addCase(fetchAllStages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ===== UPDATE STAGE STATUS =====
      .addCase(updateStageStatus.fulfilled, (state, action) => {
        const updatedOffer = action.payload?.offer;
        if (updatedOffer) {
          const index = state.stages.findIndex(s => s.id === updatedOffer.id);
          if (index !== -1) state.stages[index] = updatedOffer;
        }
      })

      // ===== DELETE STAGE =====
      .addCase(deleteStage.fulfilled, (state, action) => {
        state.stages = state.stages.filter(s => s.id !== action.payload);
      })

      // ===== FETCH COMPANIES =====
      .addCase(fetchAllCompanies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies = Array.isArray(action.payload)
          ? action.payload
          : action.payload.data || [];
      })
      .addCase(fetchAllCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ===== VERIFY COMPANY =====
      .addCase(verifyCompany.fulfilled, (state, action) => {
        const updatedCompany = action.payload?.company;
        if (updatedCompany) {
          const index = state.companies.findIndex(c => c.id === updatedCompany.id);
          if (index !== -1) state.companies[index] = updatedCompany;
        }
      })

      // ===== CREATE ADMIN =====
      .addCase(createAdmin.fulfilled, (state, action) => {
        if (action.payload?.user) {
          state.users.push(action.payload.user);
        }
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;