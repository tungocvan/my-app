// src/redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import { ORDERS } from '../../data/url';

// ====================================================
// ✅ API: LIST ORDER
// ====================================================
export const listOrder = createAsyncThunk(
  'cart/listOrder',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(`${ORDERS}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ====================================================
// ✅ API: LIST ORDER BY ID
// ====================================================
export const listOrderById = createAsyncThunk(
  'cart/listOrderById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(`${ORDERS}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ====================================================
// ✅ API: UPDATE ORDER
// ====================================================
export const updateOrder = createAsyncThunk(
  'cart/updateOrder',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      //console.log('payload:', payload);
      const res = await axiosClient.post(`${ORDERS}/${id}/update`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ====================================================
// ✅ API: DELETE ORDER
// ====================================================
export const deleteOrder = createAsyncThunk(
  'cart/deleteOrder',
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.delete(`${ORDERS}/${id}`);
      return { id, result: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ====================================================
// ✅ API: CREATE ORDER
// ====================================================
export const createOrder = createAsyncThunk(
  'cart/createOrder',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(`${ORDERS}/create`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ====================================================
// ✅ INITIAL STATE
// ====================================================
const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,

  // Orders
  orders: [],
  selectedOrder: null,

  status: 'idle',
  error: null,
  lastOrder: null,
};

// ====================================================
// ✅ SLICE
// ====================================================
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity += product.quantity;
      } else {
        state.items.push({ ...product });
      }

      state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);

      state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },

  extraReducers: (builder) => {
    builder
      // ============ LIST ORDER ===========
      .addCase(listOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(listOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(listOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // ============ LIST ORDER BY ID ===========
      .addCase(listOrderById.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      })

      // ============ UPDATE ORDER ===========
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      })

      // ============ DELETE ORDER ===========
      .addCase(deleteOrder.fulfilled, (state, action) => {
        const deletedId = action.payload.id;
        state.orders = state.orders.filter((o) => o.id !== deletedId);
      })

      // ============ CREATE ORDER ===========
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastOrder = action.payload;

        state.items = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
