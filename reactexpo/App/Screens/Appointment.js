import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, TextInput, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';
import { UserType } from '../../UserContext';
import axios from 'axios';
import moment from 'moment';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import Colors from '../../assets/Shared/Colors';
import { Ionicons } from '@expo/vector-icons';
import PageHeader from '../Components/Shared/PageHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import AppointmentsCard from './AppointmentsCard';
import BookAppointment from './BookAppointment';
import baseURL from '../../assets/common/baseURL';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function Appointment() {
  const [activeIndex, setActiveIndex] = useState(0)
  const param = useRoute().params;
  const navigation = useNavigation();
  const { isLoaded, isSignedIn, user } = useUser();
  const [currentUser, setCurrentUser] = useState([]);
  const [currentGoogleId, setGoogleAuthId] = useState([]);
  const [currentGoogleEmail, setGoogleAuthEmail] = useState([]);
  const [services, setService] = useState([]);
  const [doctors, setDoctor] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [appointment, setAppointment] = useState([]);
  const [comment, setComment] = useState([]);
  const [rating, setRating] = useState(0);

  // console.log('The Doctors', doctors)
  // console.log('The Appointment', appointment)

  useEffect(() => {
    if (user) {
      setGoogleAuthId(user.id);
      setGoogleAuthEmail(user.primaryEmailAddress.emailAddress);
    }
    getUserAppointment(userId, currentGoogleId);
  }, [user, currentGoogleId, appointment]);

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          setUserId(userId);
          const response = await axios.get(`${baseURL}/users/get-current-user`, {
            params: {
              user_id: userId,
            },
          });
          setCurrentUser(response.data.user);
        } catch (error) {
          console.error('Fetch User Error:', error.message);
        }
      };
      fetchUser();
    }
  }, [userId]);

  useEffect(() => {
    fetchService();
    fetchDoctor();
  }, [appointment]);

  const getUserAppointment = async (userId, currentGoogleId) => {
    try {
      let user;
      if (userId) {
        user = userId;
      } else {
        user = currentGoogleId;
      }
      const result = await axios.get(`${baseURL}/appointments/get-user-appointment`, {
        params: {
          user: user,
        },
      });
      // console.log('RESULT IN THE CONTROLLER',result.data.appointment)
      setAppointment(result.data.appointment);
    } catch (error) {
      console.log('Error in Getting User Appointment', error.message);
    }
  };

  const fetchService = async () => {
    try {
      const response = await axios.get(`${baseURL}/services/get-services`);
      // console.log('thisis service', response.data.services);
      setService(response.data.services);
    } catch (error) {
      console.error('Fetch Services Error:', error.message);
    }
  };

  const fetchDoctor = async () => {
    try {
      const response = await axios.get(`${baseURL}/doctors/get-doctors`)
      // console.log('This is the doctor response', response.data.doctors)
      setDoctor(response.data.doctors);
    } catch (error) {
      console.error('Fetch Services Error:', error.message);
    }
  };
  const sortedAppointments = appointment.sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleStarPress = (ratingValue) => {
    setRating(ratingValue);
  };

  const renderStars = () => {
    const stars = [];
    const starSize = 30; // Adjust the size as per your preference
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
          <Text style={{ fontSize: starSize, margin: 5, color: '#FFD700', fontWeight: '900' }}>{rating >= i ? '★' : '☆'}</Text>

        </TouchableOpacity>
      );
    }
    return stars;
  };
  // console.log(appointment)

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;

    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return totalRating / reviews.length;
  };

  // console.log('The doctor', doctors)

  return (
    <View style={{ padding: 10, marginTop: 40, flex: 1 }}>
      <PageHeader title={'Account Appointment'} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 20 }}>
        <TouchableOpacity
          style={[activeIndex == 0 ? styles.activeTab : styles.inActiveTab]}
          onPress={() => setActiveIndex(0)}>
          <Text style={[activeIndex == 0 ? styles.activeText : styles.inActiveText]} >Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[activeIndex == 1 ? styles.activeTab : styles.inActiveTab]}
          onPress={() => setActiveIndex(1)}>
          <Text style={[activeIndex == 1 ? styles.activeText : styles.inActiveText]} >Complete</Text>
        </TouchableOpacity>
      </View>
      <View>
        {activeIndex === 0 && (
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={sortedAppointments.filter(item => item.status === 'pending')}
            renderItem={({ item }) => {
              // console.log('The doctor', doctors)
              const service = services.find(service => service._id === item.service);
              const doctor = doctors.find(doctor => doctor._id === item.doctor);
              if (!doctor) {
                return null
              }
              return (
                <View style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 12, borderColor: Colors.LIGHT_GRAY, backgroundColor: Colors.white, marginTop: 100, marginRight: 20, alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, fontFamily: 'sans-serif' }}>{moment(item.date).format('MMM Do, YYYY')} - {item.time}</Text>
                  <View style={{ marginTop: 20 }}>
                    {doctor && doctor.image && doctor.image.length > 0 && (
                      <Image
                        source={{ uri: doctor.image[0].url }}
                        style={{ width: 150, height: 200, borderRadius: 10 }}
                      />)}
                  </View>
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10, alignItems: 'center'
                  }}>
                    {service && service.image && service.image.length > 0 && (
                      <Image
                        source={{ uri: service.image[0].url }}
                        style={{ width: 90, height: 100, borderRadius: 10 }}
                      />)}

                    <View>
                      <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'sans-serif' }}>{service.name}</Text>
                      <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                        <FontAwesome6 name="user-doctor" size={17} color="blue" />
                        <Text style={{ fontSize: 15, fontFamily: 'sans-serif' }}>{doctor.name}</Text>
                      </View>

                      <View style={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center', marginTop: 5 }}>
                        <FontAwesome5 name="file-medical-alt" size={17} color="blue" />
                        <Text style={{ fontSize: 15, fontFamily: 'sans-serif' }}>Id: #{item.service}</Text>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 5 }}>
                        <Ionicons name="document-text" size={17} color="blue" />
                        <Text style={{ fontWeight: 'bold', fontFamily: 'sans-serif' }}>Status: {item.status}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        )}
        {activeIndex === 1 && (
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={sortedAppointments.filter(item => item.status === 'completed')}
            renderItem={({ item }) => {
              const service = services.find(service => service._id === item.service);
              const doctor = doctors.find(doctor => doctor._id === item.doctor);

              if (!doctor) {
                return null
              }
              const averageRating = calculateAverageRating(doctor.review);

              return (
                <>
                  <View style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 12, borderColor: Colors.LIGHT_GRAY, backgroundColor: Colors.white, marginTop: 100, marginRight: 20, alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, fontFamily: 'sans-serif' }}>{moment(item.date).format('MMM Do, YYYY')} - {item.time}</Text>
                    <View>
                      {doctor && doctor.image && doctor.image.length > 0 && (
                        <Image
                          source={{ uri: doctor.image[0].url }}
                          style={{ width: 150, height: 200, borderRadius: 10 }}
                        />)}
                    </View>
                    <View style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 10, alignItems: 'center'
                    }}>
                      {service && service.image && service.image.length > 0 && (
                        <Image
                          source={{ uri: service.image[0].url }}
                          style={{ width: 90, height: 100, borderRadius: 10 }}
                        />)}

                      <View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'sans-serif' }}>{service.name}</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                          <FontAwesome6 name="user-doctor" size={17} color="blue" />
                          <Text style={{ fontSize: 15, fontFamily: 'sans-serif' }}>{doctor.name}</Text>
                        </View>

                        <View style={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center', marginTop: 5 }}>
                          <FontAwesome5 name="file-medical-alt" size={17} color="blue" />
                          <Text style={{ fontSize: 15, fontFamily: 'sans-serif' }}>Id: #{item.service}</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 5 }}>
                          <Ionicons name="document-text" size={17} color="blue" />
                          <Text style={{ fontWeight: 'bold', fontFamily: 'sans-serif' }}>Status: {item.status}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      {[1, 2, 3, 4, 5].map((star, index) => (
                        <View key={index}>
                          <MaterialCommunityIcons
                            key={index}
                            name={star <= calculateAverageRating(doctor.review) ? 'star' : 'star-outline'}
                            size={20}
                            color="#FFD700"
                          />
                        </View>
                      ))}
                      <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{averageRating.toFixed(1)}</Text>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                      {/* <Text>Review</Text>
                    <KeyboardAvoidingView>
                      <TextInput
                        // numberOfLines={3}
                        onChangeText={(value) => setComment(value)}
                        style={{ backgroundColor: '#E5E4E2', padding: 5, borderRadius: 10, color: 'gray', marginTop: 10, width: 300 }}
                      />
                    </KeyboardAvoidingView>
                    <Text>{renderStars()}</Text> */}
                      <TouchableOpacity onPress={() => navigation.navigate('ReviewDoctor', {
                        //  serviceId: item._id,
                        serviceName: service.name,
                        doctorId: doctor._id
                      })} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 10, }} >
                        <Text style={{ color: 'white', fontFamily: 'System', fontSize: 16 }}>Review Doctor</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              );
            }}
          />
        )}
      </View>
    </View >
  )
}

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
    width: '18%'
  },
  inActiveTab: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    padding: 3,
    width: '18%'
  },
})