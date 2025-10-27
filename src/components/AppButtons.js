import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AppButtons = ({ buttons, columns = 2 }) => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View
        style={[styles.container, { justifyContent: columns === 2 ? 'space-evenly' : 'center' }]}
      >
        {buttons.map((btn, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { width: columns === 2 ? 140 : 120 }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(btn.screen)}
          >
            <Ionicons name={btn.icon} size={50} color="#007bff" />
            <Text style={styles.text}>{btn.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  card: {
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#007bff',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  text: {
    position: 'absolute',
    bottom: 10,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: '100%',
  },
});

export default AppButtons;
