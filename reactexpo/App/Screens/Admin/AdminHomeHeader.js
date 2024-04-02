import { View, Text, Button, SafeAreaView, Platform, ScrollView, Pressable, TextInput, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AdminHomeHeader = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [currentUser, setCurrentUser] = useState([]);
  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? 40 : 0, }} >
      <View>
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, textAlign: 'center' }}>Dashboard</Text>
            <MaterialIcons name="dashboard" size={24} color="black" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 20, textAlign: 'center' }}>

            <TouchableOpacity
              style={[activeIndex == 1 ? styles.activeTab : styles.inActiveTab]}
              onPress={() => {
                setActiveIndex(1);
                navigation.navigate('AdminHomeCharts');
              }}>
              <Text style={[activeIndex == 1 ? styles.activeText : styles.inActiveText]} >Charts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[activeIndex == 1 ? styles.activeTab : styles.inActiveTab]}
              onPress={() => {
                setActiveIndex(1);
                navigation.navigate('AdminServices');
              }}>
              <Text style={[activeIndex == 1 ? styles.activeText : styles.inActiveText]} >Services</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[activeIndex == 2 ? styles.activeTab : styles.inActiveTab]}
              onPress={() => {
                setActiveIndex(2);
                navigation.navigate('AdminDoctors');
              }}>
              <Text style={[activeIndex == 2 ? styles.activeText : styles.inActiveText]} >Doctors</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AdminHomeHeader

const styles = StyleSheet.create({
  activeText: {
    alignItems: 'center',
    color: 'gray',
    fontSize: 16,
    padding: 5,
  },
  inActiveText: {
    alignItems: 'center',
    color: 'gray',
    fontSize: 16,
    padding: 5,
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    padding: 3,
  },
  inActiveTab: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    padding: 3,
  },
});
