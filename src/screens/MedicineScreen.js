import React from 'react';
import { View } from 'react-native';
import MedicineList from '../components/MedicineList';

const MedicineScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <MedicineList />
    </View>
  );
};

export default MedicineScreen;
