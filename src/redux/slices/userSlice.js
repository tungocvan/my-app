import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LOGIN, REGISTER, USERS, USER_OPTIONS } from '../../data/url';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------------------
// 🔹 Đăng nhập người dùng
// ------------------------------
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // 🔹 B1. Gọi API đăng nhập
      const response = await axios.post(LOGIN, { email, password });
      const { data } = response.data; // backend trả { data: { user, token } }

      // 🔹 B2. Lưu token và user cơ bản
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      // 🔹 B3. Lấy thêm thông tin chi tiết user (nếu cần)
      const userId = data.user.id;
      let extra_user = null;

      try {
        const resExtra = await axios.get(`${USER_OPTIONS}/${userId}`);
        if (resExtra.data?.data) {
          extra_user = resExtra.data.data;
        }
      } catch (extraErr) {
        console.log('⚠️ Không lấy được extra_user:', extraErr.response?.data || extraErr.message);
      }

      // 🔹 B4. Gộp lại user data
      const mergedUser = { ...data.user, extra_user };
      //console.log('mergedUser:', mergedUser);
      // 🔹 B5. Lưu lại vào AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(mergedUser));

      // 🔹 B6. Trả về data đầy đủ cho Redux state
      return { ...data, user: mergedUser };
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
// 🔹 Cập nhật tài khoản (Redux realtime)
// ------------------------------
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, ...updatedData }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('🟢 Gửi cập nhật user:', updatedData);

      const response = await axios.put(`${USERS}/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      console.log('🟩 Phản hồi từ API:', response.data);
      const res = response.data;

      // ✅ Backend trả về success = true (hoặc status = true)
      if ((res.success || res.status) && res.data) {
        const user = res.data;

        // 🔸 Lưu vào AsyncStorage để đảm bảo khi reload app vẫn giữ
        await AsyncStorage.setItem('user', JSON.stringify(user));

        // 🔸 Trả về cho Redux cập nhật ngay lập tức
        return user;
      }

      return rejectWithValue(res.message || 'Cập nhật thất bại.');
    } catch (error) {
      console.log('❌ Lỗi khi gọi API:', error.response?.data || error.message);
      const msg = error.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.';
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
      })
      // 🔹 Thêm update user
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
      });
  },
});

// ✅ Export actions (đặt sau khi userSlice được khởi tạo)
export const { setUser, logoutUser, loadUserFromStorage } = userSlice.actions;

// ✅ Export reducer
export default userSlice.reducer;
