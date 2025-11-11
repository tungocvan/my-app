// src/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN, REGISTER, USERS } from '../../data/url';
import axiosClient from '../../api/axiosClient'; // sử dụng axiosClient

// ------------------------------
// 🔹 Đăng nhập người dùng
// ------------------------------
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(LOGIN, { email, password });
      const { data } = response.data;

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
// 🔹 Lấy thông tin User bằng Id
// ------------------------------
export const getUserById = createAsyncThunk(
  'user/getUserById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`${USERS}/${id}`);
      return response.data.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Tài khoản không tồn tại.';
      return rejectWithValue(msg);
    }
  },
);

// ------------------------------
// 🔹 Fetch tất cả users
// ------------------------------
export const fetchUsers = createAsyncThunk(
  'userList/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`${USERS}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue('Không lấy được danh sách users');
      }
    } catch (err) {
      return rejectWithValue(err.message);
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
      const response = await axiosClient.post(REGISTER, {
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
// 🔹 Cập nhật user
// ------------------------------
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axiosClient.put(`${USERS}/${id}/app`, updatedData, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });

      if (response.data.status === 'success' && response.data.data) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Cập nhật thất bại.');
    } catch (error) {
      const msg = error.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.';
      return rejectWithValue(msg);
    }
  },
);

// ------------------------------
// 🔹 Lấy thông tin user theo options (linh hoạt)
// ------------------------------
export const fetchUserOptions = createAsyncThunk(
  'user/fetchUserOptions',
  async ({ customer_id, options = ['shipping_info', 'profile'] }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`${USERS}/${customer_id}/options`, { options });
      const data = response.data?.data || {};
      if (Object.keys(data).length === 0) {
        return rejectWithValue('Không tìm thấy thông tin khách hàng');
      }
      return data; // Lưu nguyên cấu trúc backend
    } catch (error) {
      console.error('Lỗi fetchUserOptions:', error);
      return rejectWithValue('Không thể lấy thông tin khách hàng');
    }
  },
);

// ------------------------------
// 🔹 User slice
// ------------------------------
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    user_id: null,
    token: null,
    userOptions: null, // lưu kết quả fetchUserOptions
    customers: [],
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.userOptions = null;
    },
    loadUserFromStorage: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
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
        state.user_id = action.payload.user.id;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- GET USER BY ID ----------------
      .addCase(getUserById.pending, (state) => {
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {})
      .addCase(getUserById.rejected, (state, action) => {
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
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- UPDATE USER ----------------
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- FETCH USERS ----------------
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi khi fetch users';
      })

      // ---------------- FETCH USER OPTIONS ----------------
      .addCase(fetchUserOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.userOptions = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOptions.rejected, (state, action) => {
        state.loading = false;
        state.userOptions = null;
        state.error = action.payload;
      });
  },
});

// ✅ Export actions
export const { setUser, logoutUser, loadUserFromStorage } = userSlice.actions;

// ✅ Export reducer
export default userSlice.reducer;
