import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import OrderFileActions from './OrderFileActions';

export default function OrderFileActionsModal({ visible, onClose, item, navigation }) {
  useEffect(() => {
    if (!visible || !item) return;

    const { pdf_path, file_path } = item;

    // Nếu mở modal lên mà chưa có file thì alert 1 lần
    if (!pdf_path && !file_path) {
      Alert.alert(
        'Chưa có file',
        'File PDF/Excel chưa được tạo xong. Hệ thống sẽ quay lại danh sách.',
        [
          {
            text: 'OK',
            onPress: () => {
              onClose();
              navigation.replace('BanggiaListScreen');
            },
          },
        ],
        { cancelable: false },
      );
    }
  }, [visible, item]);

  if (!item) return null;

  const { pdf_path, file_path } = item;

  // Nếu không có file → không render modal nữa (alert đã xử lý)
  if (!pdf_path && !file_path) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Tùy chọn bảng báo giá</Text>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              onClose();
              navigation.navigate('BanggiaScreen', { id: item.id });
            }}
          >
            <Ionicons name="document-text-outline" size={20} color="#007AFF" />
            <Text style={styles.btnText}>Xem chi tiết</Text>
          </TouchableOpacity>

          {pdf_path && <OrderFileActions title="File PDF" fileUrl={pdf_path} />}
          {file_path && (
            <OrderFileActions title="File Excel" fileUrl={file_path} showPrint={false} />
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  btnText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#007AFF',
  },
  closeBtn: {
    marginTop: 18,
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
});
