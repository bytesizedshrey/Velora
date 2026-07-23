import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for user registration
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/auth/register", userData);
            return response.data;
        } catch (error) {
            const data = error.response?.data;
            if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                return rejectWithValue(data.errors[0].msg);
            }
            return rejectWithValue(
                data?.message || "Registration failed"
            );
        }
    }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/auth/login", credentials);
            return response.data;
        } catch (error) {
            const data = error.response?.data;
            if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                return rejectWithValue(data.errors[0].msg);
            }
            return rejectWithValue(
                data?.message || "Login failed"
            );
        }
    }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/auth/logout", {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Logout failed"
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: true,
        authChecked: true,
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
            });
    },
});

export const { setError, setLoading, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;