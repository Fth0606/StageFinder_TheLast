import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';
import { setUser } from './authSlice';

const initialState = {
  profile: null,
  applications: [],
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  isLoading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch profile' });
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiService.updateProfile(profileData);
      const updatedUser = response.data.user || response.data;

      dispatch(setUser(updatedUser));
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Re-fetch full profile so profile.student is always fresh
      const profileResponse = await apiService.getProfile();
      return profileResponse.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update profile' });
    }
  }
);

export const completeStudentProfile = createAsyncThunk(
  'user/completeStudentProfile',
  async (profileData, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiService.completeStudentProfile(profileData);
      const updatedUser = response.data.user || response.data;
      dispatch(setUser(updatedUser));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to complete profile' });
    }
  }
);

export const completeCompanyProfile = createAsyncThunk(
  'user/completeCompanyProfile',
  async (profileData, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiService.completeCompanyProfile(profileData);
      const updatedUser = response.data.user || response.data;
      dispatch(setUser(updatedUser));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to complete profile' });
    }
  }
);

export const fetchUserApplications = createAsyncThunk(
  'user/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getApplications();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch applications' });
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    clearFavorites: (state) => {
      state.favorites = [];
      localStorage.removeItem('favorites');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload; // now always the fresh full profile with .student
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(completeStudentProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeStudentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.user || action.payload;
      })
      .addCase(completeStudentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(completeCompanyProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeCompanyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.user || action.payload;
      })
      .addCase(completeCompanyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserApplications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = userSlice.actions;
export default userSlice.reducer;