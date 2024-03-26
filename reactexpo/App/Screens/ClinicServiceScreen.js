import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import PageHeader from '../Components/Shared/PageHeader';
import ClinicDoctorTab from '../Components/ClinicDoctorScreen/ClinicDoctorTab';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const ClinicServiceScreen = () => {
    const [doctors, setDoctors] = useState([]);
    const navigation = useNavigation();

    const param = useRoute().params;
    // console.log(param.serviceId)

    useEffect(() => {
        getAllDoctors();
    }, [param.serviceId]);

    const getAllDoctors = async () => {
        try {
            const response = await axios.get('http://192.168.100.47:8000/get-doctors', {
                // const response = await axios.get('http://192.168.137.222:8000/get-doctors', {
                params: {
                    serviceId: param.serviceId
                }
            });
            setDoctors(response.data.doctors);
        } catch (error) {
            console.error('Fetch All Doctors Error:', error);
        }
    };
    // console.log('This is the serviceId', param.serviceId)
    // console.log('This is all', doctors)

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;

        const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        return totalRating / reviews.length;
    };
    return (
        <View style={{ padding: 20, marginTop: 20, backgroundColor: '#FAF9F6' }} >
            {/* <Text>{param.serviceName}</Text> */}
            <PageHeader title={param.serviceName} />

            <ClinicDoctorTab />
            <View style={{ marginTop: 25 }}>
                {doctors.map((doctor, index) => {
                    const averageRating = calculateAverageRating(doctor.review);
                    console.log(doctor._id)
                    return (
                        <View key={doctor._id} style={{ marginBottom: 10, padding: 15, backgroundColor: '#FFFFFF', borderRadius: 20 }}>
                            <View style={{ flexDirection: 'row', padding: 15 }}>
                                {doctor.image && doctor.image.length > 0 && (
                                    <Image
                                        source={{ uri: doctor.image[0].url }}
                                        style={{ width: 100, height: 125, borderRadius: 10 }}
                                    />
                                )}
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
                                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                        <MaterialCommunityIcons name="email-fast" size={12} color="black" />
                                        <Text style={{ marginLeft: 5 }}>{doctor.email}</Text>
                                    </View> */}
                                    <Text style={{ marginTop: 8, color: 'gray' }} >{param.serviceName}</Text>
                                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
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
                                    </View> */}
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('book-appointment-now', {
                                    doctorId: doctor._id,
                                    serviceId: param.serviceId
                                })}
                                style={{ backgroundColor: '#87CEEB', padding: 10, borderRadius: 60 }} >
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: 'blue', fontFamily: 'System', fontSize: 16 }}> Check Doctor </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

export default ClinicServiceScreen

const styles = StyleSheet.create({})