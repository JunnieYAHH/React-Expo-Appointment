import { View, Text, Button, SafeAreaView, Platform, ScrollView, Pressable, TextInput, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { UserType } from '../../../UserContext';
import { jwtDecode } from 'jwt-decode';
import baseURL from '../../../assets/common/baseURL';
import SectionLabel from '../../Components/Shared/SectionLabel';
import AdminServices from './AdminScreen/Services/AdminServices';

const AdminHome = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [currentUser, setCurrentUser] = useState([]);
  const [services, setServices] = useState([]);
  const navigation = useNavigation();
  const { isSignedIn } = useUser();
  const { userId, setUserId } = useContext(UserType)

  if (!isSignedIn) {
    useEffect(() => {
      const fetchUser = async () => {
        const token = await AsyncStorage.getItem("authToken")
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId
        setUserId(userId)
        fetchCurrentUser(userId);
      }
      fetchUser();
    }, []);
  }

  const fetchCurrentUser = async (userId) => {
    try {
      if (userId) {
        const response = await axios.get(`${baseURL}/users/get-current-user`, {
          params: {
            user_id: userId
          }
        });
        setCurrentUser(response.data.user);

      }
    } catch (error) {
      console.error('Fetch Services Error:', error.message);
    }
  };

  const handleLogout = () => {
    setCurrentUser([]);
    AsyncStorage.clear()
      .then(() => {
        navigation.navigate('Login');
        console.log('AsyncStorage cleared successfully.');
      })
      .catch((error) => {
        console.error('Error clearing AsyncStorage:', error);
      });
  }

  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? 40 : 0, }} >
      <View>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 7,
          alignItems: 'center'
        }}>
          <View style={{ flexDirection: 'row' }} >
            {currentUser && currentUser.image && currentUser.image.length > 0 && (
              <Image source={{ uri: currentUser.image[0].url }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            )}
            <View style={{ marginLeft: 5 }}>
              <Text>Hello, 👋</Text>
              {currentUser && (
                <>
                  <Text style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}>
                    {currentUser.name}
                  </Text>
                </>
              )}
            </View>
          </View>
          <Ionicons name="notifications-outline"
            size={28}
            color="black"
            style={{ flexDirection: 'column', marginLeft: 165 }} />
          <Button
            title='SignOut'
            onPress={handleLogout}
            style={{ borderRadius: 100 }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 20 }}>
        <TouchableOpacity
          style={[activeIndex == 0 ? styles.activeTab : styles.inActiveTab]}
          onPress={() => setActiveIndex(0)}>
          <Text style={[activeIndex == 0 ? styles.activeText : styles.inActiveText]} >Services</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[activeIndex == 1 ? styles.activeTab : styles.inActiveTab]}
          onPress={() => setActiveIndex(1)}>
          <Text style={[activeIndex == 1 ? styles.activeText : styles.inActiveText]} >Doctors</Text>
        </TouchableOpacity>
      </View>
      {activeIndex === 0 && (
        <View style={{ padding: 15, marginLeft: 15 }} >
          <AdminServices />
        </View>
      )}
      {activeIndex === 1 && (
        <View style={{ padding: 15, marginLeft: 15 }} >
          <Text>THIS IS FOR DOCTORS</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

export default AdminHome

const styles = StyleSheet.create({
  activeText: {
    alignItems: 'center',
    color: '#0000FF',
    fontSize: 16,
    width: 85
  },
  inActiveText: {
    alignItems: 'center',
    color: 'gray',
    fontSize: 16,
    width: 85
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: '#0000FF',
    padding: 3,
    width: '15%'
  },
  inActiveTab: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    padding: 3,
    width: '15%'
  },
})