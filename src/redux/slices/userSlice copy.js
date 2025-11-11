// src/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ================================
//  ✅ API THUNK
// ================================

// ✅ LOGIN
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/login', payload);

      // Lưu token
      if (res.data?.token) {
        await AsyncStorage.setItem('token', res.data.token);
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ✅ REGISTER
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/register', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ✅ LẤY THÔNG TIN USER HIỆN TẠI
export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/user/profile');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ✅ UPDATE USER
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/users/${id}`, updatedData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ✅ LOGOUT
export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await AsyncStorage.removeItem('token');
  return true;
});

// ================================
// ✅ INITIAL STATE
// ================================
const initialState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

// ================================
// ✅ SLICE
// ================================
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // -------------------------------------
      // ✅ LOGIN
      // -------------------------------------
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // -------------------------------------
      // ✅ REGISTER
      // -------------------------------------
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
      })

      // -------------------------------------
      // ✅ FETCH PROFILE
      // -------------------------------------
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user || action.payload;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.status = 'failed';
        state.user = null; // token hết hạn -> user = null
      })

      // -------------------------------------
      // ✅ UPDATE USER
      // -------------------------------------
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload; // update realtime
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // -------------------------------------
      // ✅ LOGOUT
      // -------------------------------------
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});

// ================================
// ✅ EXPORT
// ================================
export default userSlice.reducer;
