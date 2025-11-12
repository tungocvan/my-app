import React from 'react';
import { View, Text } from 'react-native';

export const toastConfig = {
  center_success: ({ text1, text2 }) => (
    <View
      style={{
        position: 'absolute',
        top: '45%',
        alignSelf: 'center',
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 10,
        minWidth: '70%',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{text1}</Text>
      {text2 ? <Text style={{ color: '#fff', marginTop: 5 }}>{text2}</Text> : null}
    </View>
  ),
};
