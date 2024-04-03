 import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Homepage() {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>The Clinic</Text>
        <Text style={styles.description}>The number one(1) best clinic in the Philippines that has leading healthcare facility renowned for its excellence in providing medical services.</Text>
      </View>
   
    </View>
  
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'lightgrey',
  },
  innerContainer: {
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontFamily: 'System',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'System',
    textAlign: 'center',
  },
 
});