import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

const AdminNoteModal = ({
  visible,
  onClose,
  value,
  onChange,
  onConfirm,
  onCancel,
  loading,
  isAdmin,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{isAdmin ? 'Ghi chú của Admin' : 'Ghi chú đơn hàng'}</Text>

          <TextInput
            style={styles.input}
            placeholder={isAdmin ? 'Nhập ghi chú...' : 'Nhập ghi chú của bạn...'}
            multiline
            value={value}
            onChangeText={onChange}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#FF3B30' }]}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Hủy đơn</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, { backgroundColor: '#ccc' }]} onPress={onClose}>
              <Text>Đóng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#34C759' }]}
              onPress={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: '600' }}>Xác nhận</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AdminNoteModal;

const styles = {
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  box: { width: '85%', backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 10, color: '#007AFF' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  btn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
};
