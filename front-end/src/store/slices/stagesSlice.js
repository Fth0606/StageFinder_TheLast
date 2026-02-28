import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';

const initialState = {
  stages: [],
  currentStage: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    location: '',
    domain: '',
    duration: '',
    type: '',
  },
};

export const fetchStages = createAsyncThunk(
  'stages/fetchStages',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await apiService.getOffers(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch stages' });
    }
  }
);


export const fetchStageById = createAsyncThunk(
  'stages/fetchStageById',
  async (id, { rejectWithValue }) => {
    try {
      console.log('Fetching stage by ID:', id);
      const response = await apiService.getOffer(id);
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue(error.response?.data || { message: 'Stage non trouvé' });
    }
  }
);

export const applyToStage = createAsyncThunk(
  'stages/applyToStage',
  async ({ stageId, applicationData }, { rejectWithValue }) => {
    try {
      const response = await apiService.applyToOffer({
        offer_id: stageId,
        cover_letter: applicationData.coverLetter,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to apply' });
    }
  }
);

const stagesSlice = createSlice({
  name: 'stages',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentStage: (state) => {
      state.currentStage = null;
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        location: '',
        domain: '',
        duration: '',
        type: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stages
      .addCase(fetchStages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stages = action.payload;
      })
      .addCase(fetchStages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch stage by ID
      .addCase(fetchStageById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStageById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStage = action.payload;
      })
      .addCase(fetchStageById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Apply to stage
      .addCase(applyToStage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(applyToStage.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(applyToStage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearCurrentStage, clearFilters } = stagesSlice.actions;
export default stagesSlice.reducer;