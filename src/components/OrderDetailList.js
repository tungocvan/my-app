import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OrderDetailList = ({ item, index, onUpdateQty, onRemove, editable }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.qty}>x{item.quantity}</Text>
      <Text style={styles.price}>{parseInt(item.total).toLocaleString('vi-VN')} ₫</Text>

      {editable && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onUpdateQty(index, item.quantity + 1)}>
            <Ionicons name="add-circle-outline" size={22} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onUpdateQty(index, item.quantity - 1)}>
            <Ionicons name="remove-circle-outline" size={22} color="#FF9500" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onRemove(index)}>
            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default OrderDetailList;

const styles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  title: { flex: 3, color: '#444' },
  qty: { flex: 1, textAlign: 'center', color: '#444' },
  price: { flex: 2, textAlign: 'right', fontWeight: '600', color: '#444' },
  actions: { flexDirection: 'row', gap: 6 },
};
