import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const SectionLabel = ({ title }) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }} >
    <Text style={{ fontSize: 25, fontFamily: 'System' }} >{title}</Text>
</View>
  )
}

export default SectionLabel