import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    status: 'idle',
    error: null   
};

export const registerUser = createAsyncThunk(
  'register/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("https://my-django-project-7203.onrender.com/api/register/", formData);
      // const response = await axios.post("http://127.0.0.1:8000/api/register/", formData);

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        const firstField = Object.keys(error.response.data)[0];
        const errorMessage = error.response.data[firstField][0];
        return rejectWithValue(errorMessage);
      } else {
        return rejectWithValue("Реєстрація не відбулася");
      }
    }
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; 
      });
  }
});

export default registerSlice.reducer;
