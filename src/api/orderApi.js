// Hàm gọi API tạo đơn hàng
import axiosClient from './axiosClient';
export const createOrder = async (order) => {
  try {
    const response = await axiosClient.post('/order', order);
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi khi tạo đơn hàng:', error.response?.data || error.message);
    throw error;
  }
};
