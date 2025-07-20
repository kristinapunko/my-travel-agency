import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  agencyReviews: [],
  reply: {},
  error: "",
};

export const fetchAgencyReviews = createAsyncThunk(
  'agencyReviews/fetchAgencyReviews',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`https://my-django-project-7203.onrender.com/tours/agency-reviews`);
      // const response = await axios.get(`http://127.0.0.1:8000/tours/agency-reviews`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message || 'Failed to fetch reviews');
    }
  }
);

export const fetchAgencyReply = createAsyncThunk(
  'reviews/fetchAgencyReply',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      // const response = await axios.get(`http://127.0.0.1:8000/tours/tours/agency-reviews/replies/`);
      const response = await axios.get(`https://my-django-project-7203.onrender.com/tours/tours/agency-reviews/replies/`);
      const repliesByReview = response.data.reduce((acc, reply) => {
        const reviewId = reply.review;
        if (!acc[reviewId]) acc[reviewId] = [];
        acc[reviewId].push(reply);
        return acc;
      }, {});
      return repliesByReview;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch replies');
    }
  }
);

export const addAgencyReview = createAsyncThunk(
  'agencyReviews/addAgencyReview',
  async ({ reviewData, token }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No token found');
      // const response = await axios.post(
      //   `http://127.0.0.1:8000/tours/agency-reviews`,
      //   {
      //     rating: reviewData.rating,
      //     feedback: reviewData.comment,
      //     pros: reviewData.pros,
      //     cons: reviewData.cons,
      //   },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      const response = await axios.post(
        `https://my-django-project-7203.onrender.com/tours/agency-reviews`,
        {
          rating: reviewData.rating,
          feedback: reviewData.comment,
          pros: reviewData.pros,
          cons: reviewData.cons,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message || 'Failed to add review');
    }
  }
);

export const addAgencyReply = createAsyncThunk(
  'reply/addAgencyReply',
  async ({ agencyReviewId, reviewData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No token found');
      
      console.log('Sending reply payload:', { feedback: reviewData.comment });
      
      // const response = await axios.post(
      //   `http://127.0.0.1:8000/tours/agency-reviews/${agencyReviewId}/reply/create/`, // Added trailing slash
      //   {   review: agencyReviewId,
      //       text: reviewData.comment }, // Assuming 'feedback' is correct; adjust if needed
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      const response = await axios.post(
        `https://my-django-project-7203.onrender.com/tours/agency-reviews/${agencyReviewId}/reply/create/`, // Added trailing slash
        {   review: agencyReviewId,
            text: reviewData.comment }, // Assuming 'feedback' is correct; adjust if needed
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { reviewId: agencyReviewId, reply: response.data };
    } catch (error) {
      console.error('Reply error response:', error.response?.data);
      return rejectWithValue(error.response?.data?.detail || error.response?.data || error.message || 'Failed to add reply');
    }
  }
);

export const updateAgencyReview = createAsyncThunk(
    'agencyReviews/updateAgencyReview',
    async ({ agencyReviewId, reviewData, token }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No token found');
  
        // const response = await axios.put(
        //   `http://127.0.0.1:8000/tours/agency-reviews/${agencyReviewId}/`,
        //   {
        //     rating: reviewData.rating,
        //     feedback: reviewData.feedback,
        //     pros: reviewData.pros,
        //     cons: reviewData.cons,
        //   },
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );
        const response = await axios.put(
          `https://my-django-project-7203.onrender.com/tours/agency-reviews/${agencyReviewId}/`,
          {
            rating: reviewData.rating,
            feedback: reviewData.feedback,
            pros: reviewData.pros,
            cons: reviewData.cons,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.detail || error.message || 'Failed to update review');
      }
    }
  );

export const deleteAgencyReview = createAsyncThunk(
    'agencyReviews/deleteAgencyReview', 
    async ({agencyReviewId}, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No token found');

        console.log("agencyReviewId",agencyReviewId);
        
  
        // const response = await axios.delete(
        //   `http://127.0.0.1:8000/tours/agency-reviews/${agencyReviewId}/`,
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );
        const response = await axios.delete(
          `https://my-django-project-7203.onrender.com/tours/agency-reviews/${agencyReviewId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return agencyReviewId; 
      } catch (error) {
        return rejectWithValue(error.response?.data?.detail || error.message || 'Failed to delete review');
      }
    }
  );

const reviewsSlice = createSlice({
  name: 'agencyReviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgencyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgencyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.agencyReviews = action.payload;
      })
      .addCase(fetchAgencyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAgencyReply.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAgencyReply.fulfilled, (state, action) => {
        state.loading = false;
        state.reply = action.payload;
      })
      .addCase(fetchAgencyReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAgencyReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAgencyReview.fulfilled, (state, action) => {
        state.loading = false;
        state.agencyReviews.push(action.payload);
      })
      .addCase(addAgencyReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAgencyReply.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAgencyReply.fulfilled, (state, action) => {
        state.loading = false;
        const { reviewId, reply } = action.payload;
        if (!state.reply[reviewId]) state.reply[reviewId] = [];
        state.reply[reviewId].push(reply);
      })
      .addCase(addAgencyReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAgencyReview.fulfilled, (state, action) => {
        const index = state.agencyReviews.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
            state.agencyReviews[index] = action.payload;
        }
      })
      .addCase(deleteAgencyReview.fulfilled, (state, action) => {
        state.agencyReviews = state.agencyReviews.filter((r) => r.id !== action.payload);
        state.loading = false;
      });
  },
});

export default reviewsSlice.reducer;
