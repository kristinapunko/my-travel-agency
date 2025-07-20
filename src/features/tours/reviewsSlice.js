
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    loading: false,
    reviews: [],
    error: "",
};

export const addReview = createAsyncThunk(
    'reviwes/addReview',
    async ({ tourId, reviewData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('No token found');
            if (!tourId) throw new Error('Tour ID is missing');

            // const response = await axios.post(
            //     `http://127.0.0.1:8000/tours/tours/${tourId}/reviews/`,
            //     { tour: tourId,
            //       rating: reviewData.rating,
            //       feedback: reviewData.comment, 
            //      },
            //     { headers: { Authorization: `Bearer ${token}` } }
            // );
            const response = await axios.post(
              `https://my-django-project-7203.onrender.com/tours/tours/${tourId}/reviews/`,
              { tour: tourId,
                rating: reviewData.rating,
                feedback: reviewData.comment, 
               },
              { headers: { Authorization: `Bearer ${token}` } }
          );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || error.message || 'Booking request failed');
        }
    }
);


export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (tourIds, { rejectWithValue }) => {
    try {
      let allReviews = [];

      if (!Array.isArray(tourIds)) {
        // const url = `http://127.0.0.1:8000/tours/tours/${tourIds}/reviews/`;
        const url = `https://my-django-project-7203.onrender.com/tours/tours/${tourIds}/reviews/`;
        console.log('Fetching single tour reviews:', url);
        const response = await axios.get(url);
        allReviews = response.data;
      } 
      else {
        const requests = tourIds.map(id => {
          // const url = `http://127.0.0.1:8000/tours/tours/${id}/reviews/`;
          const url = `https://my-django-project-7203.onrender.com/tours/tours/${id}/reviews/`;
          console.log('Fetching:', url);
          return axios.get(url);
        });
        const responses = await Promise.all(requests);
        allReviews = responses.flatMap(response => response.data);
      }

      console.log('API Response:', allReviews);
      return allReviews;
    } catch (error) {
      console.error('Error in fetchReviews:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateReview = createAsyncThunk(
    'reviwes/updateReview',
    async ({reviewId, reviewData}, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('No token found');

            // const response = await axios.put(
            //     `http://127.0.0.1:8000/tours/reviews/${reviewId}/`,
            //         {
            //             rating: reviewData.rating,
            //             feedback: reviewData.feedback,
            //             tour: reviewData.tour,
            //        },
            //     { headers: { Authorization: `Bearer ${token}` } }
            // );
            const response = await axios.put(
              `https://my-django-project-7203.onrender.com/tours/reviews/${reviewId}/`,
                  {
                      rating: reviewData.rating,
                      feedback: reviewData.feedback,
                      tour: reviewData.tour,
                 },
              { headers: { Authorization: `Bearer ${token}` } }
          );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || error.message || 'Failed to update review');
        }
    }
);

export const deleteReview = createAsyncThunk(
    'reviews/deleteReview', 
    async ({ reviewId }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No token found');
  
        // const response = await axios.delete(
        //   `http://127.0.0.1:8000/tours/reviews/${reviewId}/`,
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );
        const response = await axios.delete(
          `https://my-django-project-7203.onrender.com/tours/reviews/${reviewId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return reviewId; 
      } catch (error) {
        return rejectWithValue(error.response?.data?.detail || error.message || 'Failed to delete review');
      }
    }
  );
  

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch reviews
        builder
          .addCase(fetchReviews.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchReviews.fulfilled, (state, action) => {
            state.loading = false;
            state.reviews = action.payload;
          })
          .addCase(fetchReviews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          // Add review
          .addCase(addReview.fulfilled, (state, action) => {
            state.reviews.push(action.payload);
          })
          // Update review
          .addCase(updateReview.fulfilled, (state, action) => {
            const index = state.reviews.findIndex((r) => r.id === action.payload.id);
            if (index !== -1) {
              state.reviews[index] = action.payload;
            }
          })
          // Delete review
          .addCase(deleteReview.fulfilled, (state, action) => {
            state.reviews = state.reviews.filter((r) => r.id !== action.payload);
  state.loading = false;
          });
      },
    });

    export default reviewsSlice.reducer;
