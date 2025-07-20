import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    user: null,
    isLoggedIn: false,
    status: 'idle',
    error: null
};

export const checkLoggedInUser = createAsyncThunk('auth/checkLoggedInUser', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) return rejectWithValue("No token found");

        const config = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };
        // const response = await axios.get("http://127.0.0.1:8000/api/user/", config);
        const response = await axios.get("https://my-django-project-7203.onrender.com/api/user/", config);
        return response.data; 
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (accessToken && refreshToken) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            };
            await axios.post("https://my-django-project-7203.onrender.com/api/logout/", { "refresh": refreshToken }, config);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
    } catch (error) {
        console.error("Failed to logout", error.response?.data || error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkLoggedInUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(checkLoggedInUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoggedIn = true;
                state.user = action.payload;
            })
            .addCase(checkLoggedInUser.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoggedIn = false;
                state.user = null;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoggedIn = false;
                state.user = null;
            });
    }
});

export default authSlice.reducer;
