import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axiosClient from '../api/axiosClient';
import { TAOBANGGIA } from '../data/url';

export default function CreateBanggiaModal({ visible, onClose, products, onSuccess }) {
  const [ten_khach_hang, setTenKhachHang] = useState('');
  const [ghi_chu, setGhiChu] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!ten_khach_hang) return alert('Chưa nhập tên khách hàng');

    setLoading(true);
    try {
      const res = await axiosClient.post(TAOBANGGIA, {
        ten_khach_hang,
        ghi_chu,
        company,
        product_ids: products,
      });

      if (res.data?.success) {
        onSuccess();
      } else {
        alert('Không thể tạo bảng giá!');
      }
    } catch (e) {
      alert('Lỗi API');
    }
    setLoading(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Tạo bảng báo giá</Text>

          <TextInput
            style={styles.input}
            placeholder="Tên khách hàng"
            value={ten_khach_hang}
            onChangeText={setTenKhachHang}
          />

          <TextInput
            style={styles.input}
            placeholder="Ghi chú"
            value={ghi_chu}
            onChangeText={setGhiChu}
          />

          <TextInput
            style={styles.input}
            placeholder="Company"
            value={company}
            onChangeText={setCompany}
          />

          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
              <TouchableOpacity style={styles.btn} onPress={submit}>
                <Text style={styles.btnText}>Tạo bảng giá</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose}>
                <Text style={styles.cancel}>Hủy</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  box: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  title: { fontSize: 18, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  btn: {
    marginTop: 15,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  btnText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  cancel: { color: 'red', textAlign: 'center', marginTop: 10 },
});
