import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import OrderPDFActions from './OrderPDFActions';

const OrderInfoSection = ({ order, user, onOpenModal }) => {
  const totalAmount = order.order_detail.reduce((sum, item) => sum + parseInt(item.total), 0);

  return (
    <View style={styles.card}>
      {user && <Text>{user.username}</Text>} {/* Thay bằng CustomerInfoBox nếu muốn */}
      <Text style={styles.sectionTitle}>Đơn hàng #{order.id}</Text>
      {order.status === 'confirmed' && order.link_download && (
        <OrderPDFActions pdfUrl={order.link_download} showShare showPrint showCopy />
      )}
      <View style={styles.row}>
        <Text>Trạng thái:</Text>
        {order.status === 'pending' ? (
          <TouchableOpacity style={styles.statusBtn} onPress={onOpenModal}>
            <Text style={{ color: '#fff' }}>Chờ xử lý</Text>
          </TouchableOpacity>
        ) : (
          <Text>{order.status}</Text>
        )}
      </View>
      <View style={styles.row}>
        <Text>Ghi chú khách:</Text>
        <Text>{order.order_note || '— Không có ghi chú —'}</Text>
      </View>
      {order.admin_note && (
        <View style={styles.adminNote}>
          <Text>{order.admin_note}</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text>Ngày đặt:</Text>
        <Text>{new Date(order.created_at).toLocaleString('vi-VN')}</Text>
      </View>
      <Text style={styles.detailHeader}>Chi tiết sản phẩm</Text>
      <View style={styles.totalRow}>
        <Text>Tổng cộng:</Text>
        <Text>{totalAmount.toLocaleString('vi-VN')} ₫</Text>
      </View>
    </View>
  );
};

export default OrderInfoSection;

const styles = {
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#007AFF', marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  statusBtn: {
    backgroundColor: '#ff9500',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  adminNote: { backgroundColor: '#ff3b30', padding: 10, borderRadius: 8, marginTop: 6 },
  detailHeader: { fontWeight: '600', fontSize: 16, marginVertical: 8 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
};
