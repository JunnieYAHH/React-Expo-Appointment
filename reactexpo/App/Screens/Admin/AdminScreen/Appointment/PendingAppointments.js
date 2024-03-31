import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import baseURL from '../../../../../assets/common/baseURL'
import { Fontisto } from '@expo/vector-icons';
import moment from 'moment'
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
const PendingAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [users, setUsers] = useState([])
  const [doctors, setDoctors] = useState([])
  const [services, setServices] = useState([])

  // GUMAWA KANA NG MGA APPOINTMENTS HANDLINGG
  useEffect(() => {
    const getPendingAppointments = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken')
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`,
          }
        }

        const result = await axios.get(`${baseURL}/appointments/get-pending-appointments`, config)
        // console.log(result.data.pendingAppointment.user)
        setAppointments(result.data.pendingAppointment)

      } catch (error) {
        console.log('Pending Appointments Error:', error.message)
      }
    }
    const getAllUser = async () => {
      try {

        const token = await AsyncStorage.getItem('authToken')
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`,
          }
        }
        const result = await axios.get(`${baseURL}/users/get-all-users`, config)
        setUsers(result.data.users)
      } catch (error) {
        console.log('To Pend All Users Error:', error.message)
      }
    }
    const getAllServices = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken')
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`,
          }
        }
        const response = await axios.get(`${baseURL}/services/get-services`, config);
        setServices(response.data.services);
      } catch (error) {
        console.error('Fetch Services Error:', error);
      }
    };
    const getAllDoctors = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken')
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`,
          }
        }
        const response = await axios.get(`${baseURL}/doctors/get-all-doctors`, config);
        setDoctors(response.data.doctors);
      } catch (error) {
        console.error('Fetch Doctors Error:', error);
      }
    };
    getAllUser()
    getAllDoctors()
    getAllServices()
    getPendingAppointments()
  }, [])

  // handleAcceptedStatus
  const handleAcceptedStatus = async (id) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token}`,
        }
      }
      const response = await axios.put(`${baseURL}/appointments/accept-appointment/${id}`, config);

      setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment._id !== id));

      Alert.alert('Pending Appointment Was Accepted');
    } catch (error) {
      Alert.alert('Cannot Accept The Appointment');
      console.log('Error In Accepting Status', error.message);
    }
  }
  // handleDeclineStatus
  const handleDeclineStatus = async (id) => {
    try {
      console.log('Appointmentid', id)
      const token = await AsyncStorage.getItem('authToken')
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token}`,
        }
      }
      const response = await axios.put(`${baseURL}/appointments/decline-appointment/${id}`, config);
      setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment._id !== id));
      Alert.alert('Appointment has been declined')
    } catch (error) {
      Alert.alert('Cannot Decline The Appointment')
      console.log('Error In Declining Status', error.message)
    }
  }

  // console.log(users)

  return (
    <ScrollView>
      <View style={{ padding: 5, marginLeft: 2 }}>
        <Text style={{ textAlign: 'center', fontSize: 22 }}>Pending Appointments</Text>
        <View style={{ marginTop: 5, alignItems: 'center', marginRight: 15 }} >
          {appointments.map((appointment, index) => {
            const user = users.find(user => user._id === appointment.user);
            const doctor = doctors.find(doctor => doctor._id === appointment.doctor);
            const service = services.find(service => service._id === appointment.service);
            // console.log('this is user', user)
            // console.log('this is doctor', doctor)
            // console.log('this is service', service)
            if (!user || !doctor || !service) {
              return null;
            }
            return (
              <View key={index} style={{ borderWidth: 1, marginBottom: 10, marginTop: 5, width: 300, borderRadius: 40, padding: 5, backgroundColor: 'white' }}>
                <View style={{ padding: 15, borderWidth: 4 }}>
                  <View style={{ padding: 15, borderWidth: 1, borderRadius: 5, alignItems: 'center' }} >
                    <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Appointed By: </Text>
                      <Text>{user.email}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                      <Fontisto name="doctor" size={20} color="black" />
                      <Text style={{ fontSize: 20, marginLeft: 5 }}>{doctor.name}</Text>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                      {/* {console.log('Service Name:', service.name)} */}
                      <Text style={{ fontSize: 17, marginLeft: 5, fontWeight: 'bold' }}>Service:</Text>
                      <Text style={{ fontSize: 12, marginLeft: 5 }}>{service.name}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                      <FontAwesome name="calendar" size={14} color="black" />
                      <Text style={{ fontWeight: 'bold', fontSize: 14, fontFamily: 'sans-serif', marginLeft: 5 }}>{moment(appointment.date).format('MMM Do, YYYY')} - {appointment.time}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MaterialIcons name="speaker-notes" size={12} color="black" />
                      <Text style={{ fontSize: 15, marginLeft: 5 }}>{appointment.note}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        onPress={() => handleAcceptedStatus(appointment._id)}
                        style={{ marginRight: 70, marginTop: 20, borderWidth: 1, padding: 5, borderRadius: 20 }}
                      >
                        <Text>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeclineStatus(appointment._id)}
                        style={{ marginTop: 20, borderWidth: 1, padding: 5, borderRadius: 20 }}
                      >
                        <Text>Decline</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    </ScrollView>
  )
}

export default PendingAppointments