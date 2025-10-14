import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LOGIN, REGISTER } from '../../data/url';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------------------
// 🔹 Đăng nhập người dùng
// ------------------------------
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(LOGIN, { email, password });
      const { data } = response.data;

      // Lưu token và user vào AsyncStorage
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      return rejectWithValue(msg);
    }
  },
);

// ------------------------------
// 🔹 Đăng ký tài khoản
// ------------------------------
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ name, email, password, password_confirmation }, { rejectWithValue }) => {
    try {
      const response = await axios.post(REGISTER, {
        name,
        email,
        password,
        password_confirmation,
      });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      return rejectWithValue(msg);
    }
  },
);

// ------------------------------
// 🔹 Slice quản lý user
// ------------------------------
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    // ✅ Login bằng Google hoặc phục hồi dữ liệu
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    loadUserFromStorage: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------------- LOGIN ----------------
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- REGISTER ----------------
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export actions (đặt sau khi userSlice được khởi tạo)
export const { setUser, logoutUser, loadUserFromStorage } = userSlice.actions;

// ✅ Export reducer
export default userSlice.reducer;
