import { View, Text, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useUser } from '@clerk/clerk-expo';
import { UserType } from '../../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import PageHeader from '../Components/Shared/PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const BookAppointment = () => {
    const param = useRoute().params;
    const { isLoaded, isSignedIn, user } = useUser();
    const [currentUser, setCurrentUser] = useState([])
    const [currentUserId, setGoogleAuthId] = useState([])
    const [currentUserEmail, setGoogleAuthEmail] = useState([])
    const [service, setService] = useState([])
    const [doctor, setDoctor] = useState([])
    const { userId, setUserId } = useContext(UserType)
    // console.log('User Email Address', user.primaryEmailAddress.emailAddress);
    useEffect(() => {
        if (user) {
            setGoogleAuthId(user.id);
            setGoogleAuthEmail(user.primaryEmailAddress.emailAddress);
        }
    }, [user]);
    console.log("Google User ID", currentUserId)
    console.log("Google User Email", currentUserEmail)
    console.log("Application User", currentUser)
    console.log("Application Service", service)
    console.log("Application Doctor", doctor)


    useEffect(() => {
        if (userId) {
            const fetchUser = async () => {
                try {
                    const token = await AsyncStorage.getItem("authToken")
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.userId
                    setUserId(userId)
                    const response = await axios.get('http://192.168.100.47:8000/get-current-user', {
                        params: {
                            user_id: userId
                        }
                    });
                    setCurrentUser(response.data.user);
                } catch (error) {
                    console.error('Fetch User Error:', error.message);
                }
            }
            fetchUser();
        }
    }, [userId]);

    useEffect(() => {
        fetchService();
        fetchDoctor();
    }, []);

    const fetchService = async () => {
        try {
            const response = await axios.get('http://192.168.100.47:8000/get-service-to-appoint', {
                params: {
                    serviceId: param.serviceId
                }
            });
            setService(response.data.service);
        } catch (error) {
            console.error('Fetch Services Error:', error.message);
        }
    };

    const fetchDoctor = async () => {
        try {
            const response = await axios.get('http://192.168.100.47:8000/get-doctor-to-appoint', {
                params: {
                    doctorId: param.doctorId
                }
            });
            setDoctor(response.data.doctor);
        } catch (error) {
            console.error('Fetch Services Error:', error.message);
        }
    };

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;

        const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        return totalRating / reviews.length;
    };

    const averageRating = calculateAverageRating(doctor.review);

    return (
        <View style={{ padding: 15, marginTop: 30 }}>
            <PageHeader title={'Book Appointment'} />
            <View>
                {doctor && doctor.image && doctor.image.length > 0 && (
                    <View key={doctor._id} style={{ marginBottom: 10, padding: 7, backgroundColor: '#FFFFFF', borderRadius: 20 }}>
                        <View style={{ flexDirection: 'row', padding: 15 }}>
                            <Image
                                source={{ uri: doctor.image[0].url }}
                                style={{ width: 125, height: 150, borderRadius: 100 }}
                            />
                            <View style={{ padding: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#87CEEB', padding: 5, borderRadius: 10, width: 140 }} >
                                    <MaterialCommunityIcons name="check-decagram" size={10} color="blue" />
                                    <Text style={{ color: 'blue' }} > Proffesional Doctor</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', marginTop: 5 }} >
                                    <Text style={{ fontSize: 17 }} >Dr. {doctor.name}</Text>
                                    {doctor.gender === 'male' ? (
                                        <Ionicons name="male" size={15} style={{ marginLeft: 5 }} color="blue" />
                                    ) : doctor.gender === 'female' ? (
                                        <Ionicons name="female" size={15} style={{ marginLeft: 5 }} color="#FF00FF" />
                                    ) : null}
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                    <MaterialCommunityIcons name="email-fast" size={12} color="black" />
                                    <Text style={{ marginLeft: 5 }}>{doctor.email}</Text>
                                </View>
                                <View>
                                    <View style={{flexDirection:'row', alignItems:'center', marginTop:10}}>
                                        {service.image && service.image.length > 0 && (
                                            <Image source={{ uri: service.image[0].url }} style={{ width: 30, height: 30 }} />
                                        )}
                                        <Text>{service.name}</Text>
                                    </View>
                                </View>
                                <Text style={{ marginTop: 8, color: 'gray' }} >{param.serviceName}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 1 }}>
                                    {[1, 2, 3, 4, 5].map((star, index) => (
                                        <View>
                                            <MaterialCommunityIcons
                                                key={index}
                                                name={star <= calculateAverageRating(doctor.review) ? 'star' : 'star-outline'}
                                                size={20}
                                                color="#FFD700"
                                            />

                                        </View>
                                    ))}
                                    <Text style={{ fontWeight: 'bold' }}>{averageRating.toFixed(1)}</Text>
                                    <Text style={{ marginLeft: 10 }}>||</Text>
                                    <Text style={{ marginLeft: 10 }}>{doctor.review.length} reviews</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </View>
    )
}

export default BookAppointment
