import { View, Text, Button, SafeAreaView, Platform, ScrollView, Pressable, TextInput, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import AdminServices from './AdminScreen/Services/AdminServices';
import { SimpleLineIcons } from '@expo/vector-icons';

const AdminHome = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);
  const DrawerItem = ({ label, index }) => {
    return (
      <TouchableOpacity
        style={[styles.tabContainer, activeIndex === index ? styles.activeTab : styles.inActiveTab]}
        onPress={() => {
          setActiveIndex(index);
          setIsDrawerOpen(false);
        }}>
        <Text style={activeIndex === index ? styles.activeText : styles.inActiveText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? 40 : 0, }} >
      <View>
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, textAlign: 'center' }}>Dashboard</Text>
            <MaterialIcons name="dashboard" size={24} color="black" />
          </View>
          <TouchableOpacity onPress={toggleDrawer} style={styles.drawerIcon}>
            <View style={{ flexDirection: 'row', textAlign: 'center' }}>
              <SimpleLineIcons name="drawer" size={24} color="black" />
            </View>
          </TouchableOpacity>
          {isDrawerOpen && (
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
              <DrawerItem label="Charts" index={0} />
              <DrawerItem label="Service" index={1} />
              <DrawerItem label="Doctor" index={2} />
            </ScrollView>
          )}
        </View>
      </View>
      {activeIndex === 0 && (
        <View style={{ padding: 15, marginLeft: 15 }} >
          <AdminServices />
        </View>
      )}
      {activeIndex === 1 && (
        <View style={{ padding: 15, marginLeft: 15 }} >
          <AdminServices />
        </View>
      )}
      {activeIndex === 2 && (
        <View style={{ padding: 15, marginLeft: 15 }} >
          <Text>THIS IS FOR DOCTORS</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

export default AdminHome

const styles = StyleSheet.create({
  drawerIcon: {
    marginLeft: 10,
  },
  scrollViewContainer: {
    marginTop: 20,
    marginLeft: 6,
  },
  tabContainer: {
    borderBottomWidth: 1,
    padding: 3,
    width: '22%',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeTab: {
    borderBottomColor: '#0000FF',
  },
  inActiveTab: {
    borderBottomColor: 'gray',
  },
  activeText: {
    color: '#0000FF',
    fontSize: 16,
    textAlign: 'center',
  },
  inActiveText: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
  },
});
