import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    status: 'idle',
    error: null
};

export const loginUser = createAsyncThunk(
    'login/loginUser',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post("https://my-django-project-7203.onrender.com/api/login/", formData);
            // const response = await axios.post("http://127.0.0.1:8000/api/login/", formData);
            console.log("success", response.data);

            localStorage.setItem("accessToken", response.data.token.access);
            localStorage.setItem("refreshToken", response.data.token.refresh);
            return response.data;
         } 

        catch (error) {
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

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {}, 
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export default loginSlice.reducer;
