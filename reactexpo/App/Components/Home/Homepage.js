import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { Fontisto } from '@expo/vector-icons';
import baseURL from '../../../assets/common/baseURL';
import axios from 'axios';
import Colors from '../../../assets/Shared/Colors';
import SectionLabel from '../Shared/SectionLabel';

export default function Homepage() {

  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const navigation = useNavigation();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const getAllDoctors = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken')
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`,
          }
        };
        const result = await axios.get(`${baseURL}/doctors/get-all-doctors`, config);
        setDoctors(result.data.doctors);
      } catch (error) {
        console.log(error.message)
      }
    };
    const getallService = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken')
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`,
          }
        };
        const result = await axios.get(`${baseURL}/services/get-admin-services`, config);
        setServices(result.data.services);
      } catch (error) {
        console.log(error.message)
      }
    };
    getallService()
    getAllDoctors()
  }, []);

  const handleDeleteDoctor = async (id) => {
    try {
      const token = AsyncStorage.getItem('authToken')

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }

      const result = await axios.delete(`${baseURL}/doctors/delete-doctor/${id}`, config)
      setDoctors(prevDoctors => prevDoctors.filter(doctor => doctor._id !== id));
      Alert.alert('Doctor Delete Successfully')
    } catch (error) {
      Alert.alert('Doctor Delete Unsuccessful', error.message)
    }
  }

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;

    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return totalRating / reviews.length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>The Clinic</Text>
        <Text style={styles.description}>The number one(1) best clinic in the Philippines that has leading healthcare facility renowned for its excellence in providing medical services.</Text>
      </View>
      <View style={styles.doctorsContainer}>
        <SectionLabel title={'Doctors List'} />
        <View style={styles.doctorsList}>
          {doctors.map((item, index) => {
            const service = services.find(service => service._id === item.service);
            if (!service) {
              return null;
            }
            const averageRating = calculateAverageRating(item.review);

            return (
              <View key={index} style={styles.doctorCard}>
                <View style={styles.doctorImage}>
                  {item.image.length > 1 ? (
                    <View style={styles.multiImages}>
                      {item.image.map((image, index) => (
                        <View key={index} style={styles.singleImage}>
                          <Image source={{ uri: image.url }} style={styles.image} />
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Image source={{ uri: item.image[0].url }} style={styles.image} />
                  )}
                </View>
                <View style={styles.doctorInfo}>
                  {service && service.image && service.image.length > 0 && (
                    <Image
                      source={{ uri: service.image[0].url }}
                      style={styles.serviceImage}
                    />
                  )}
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <View style={styles.doctorDetails}>
                    <FontAwesome6 name="user-doctor" size={17} color="blue" />
                    <Text style={styles.doctorName}>{item.name}</Text>
                  </View>
                  <View style={styles.doctorDetails}>
                    <MaterialIcons name="email" size={17} color="blue" />
                    <Text style={styles.email}>{item.email}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star, index) => (
                      <MaterialCommunityIcons
                        key={index}
                        name={star <= averageRating ? 'star' : 'star-outline'}
                        size={20}
                        color="#FFD700"
                      />
                    ))}
                    <Text style={styles.rating}>{averageRating.toFixed(1)}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'light',
    padding: 10,
  },
  innerContainer: {
    marginBottom: 20,
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
  doctorsContainer: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    backgroundColor: Colors. deepskyblue,
    borderRadius: 12,
    padding: 10,
  },
  doctorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  doctorCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  doctorImage: {
    alignItems: 'center',
  },
  multiImages: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  singleImage: {
    marginRight: 10,
  },
  image: {
    width: 120,
    height: 160,
    borderRadius: 10,
  },
  doctorInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  serviceImage: {
    width: 60,
    height: 70,
    borderRadius: 10,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    marginTop: 5,
  },
  doctorDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  doctorName: {
    fontSize: 15,
    fontFamily: 'sans-serif',
    marginLeft: 5,
  },
  email: {
    fontSize: 15,
    fontFamily: 'sans-serif',
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  rating: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
