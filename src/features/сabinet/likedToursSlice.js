import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchLikedTours = createAsyncThunk(
  'likedTours/fetchLikedTours',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return rejectWithValue('No token found');
    }

    // const response = await fetch('http://127.0.0.1:8000/cabinet/liked-tours/', {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    const response = await fetch('https://my-django-project-7203.onrender.com/cabinet/liked-tours/', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); 
    return data;
  }
);

export const toggleLike = createAsyncThunk(
  'likedTours/toggleLike',
  async (tourId, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return rejectWithValue('No token found');
    }

    // const response = await fetch('http://localhost:8000/cabinet/toggle-like/', {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ tour: tourId }),
    // });

    const response = await fetch('https://my-django-project-7203.onrender.com/cabinet/toggle-like/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tour: tourId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); 
    return { tourId, status: data.status };
  }
);

const likedToursSlice = createSlice({
  name: 'likedTours',
  initialState: {
    likedTourIds: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearLikedTours(state) {
      state.likedTourIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikedTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikedTours.fulfilled, (state, action) => {
        state.loading = false;
        state.likedTourIds = action.payload;
      })
      .addCase(fetchLikedTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.likedTourIds = [];
      })
      .addCase(toggleLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.loading = false;
        const { tourId, status } = action.payload;
        if (status === 'liked') {
          state.likedTourIds.push(tourId);
        } else if (status === 'unliked') {
          state.likedTourIds = state.likedTourIds.filter((id) => id !== tourId);
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearLikedTours } = likedToursSlice.actions;
export default likedToursSlice.reducer;

export const selectLikedTourIds = (state) => state.likedTours.likedTourIds;
export const selectLikedToursLoading = (state) => state.likedTours.loading;
export const selectLikedToursError = (state) => state.likedTours.error;
