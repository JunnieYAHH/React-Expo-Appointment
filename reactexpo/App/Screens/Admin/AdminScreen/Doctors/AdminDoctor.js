import { View, Text, FlatList, Image, TouchableOpacity, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import baseURL from '../../../../../assets/common/baseURL';
import Colors from '../../../../../assets/Shared/Colors';
import SectionLabel from '../../../../Components/Shared/SectionLabel';
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
import AdminHomeHeader from '../../AdminHomeHeader';

const AdminDoctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const navigation = useNavigation()
    const [rating, setRating] = useState(0);

    // console.log('This is the doctors',doctors )
    // console.log('This is the services',services )

    useEffect(() => {
        const getAllDoctors = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken')
                // console.log(token)
                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'Authorization': `Bearer ${token}`,
                    }
                };
                // console.log(config)

                const result = await axios.get(`${baseURL}/doctors/get-all-doctors`, config);
                // console.log(result.data.doctors)
                setDoctors(result.data.doctors);
            } catch (error) {
                console.log(error.message)
            }
        };
        const getallService = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken')
                // console.log(token)
                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'Authorization': `Bearer ${token}`,
                    }
                };
                // console.log(config)

                const result = await axios.get(`${baseURL}/services/get-admin-services`, config);
                // console.log(result.data.services)
                setServices(result.data.services);
            } catch (error) {
                console.log(error.message)
            }
        };
        getallService()
        getAllDoctors()
    }, [doctors])
    // console.log(doctors)

    const handleDeleteDoctor = async (id) => {
        try {
            // console.log(id)
            const token = AsyncStorage.getItem('authToken')

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }

            // console.log('This is the doctorId', id)

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
        <View>
            <AdminHomeHeader />
            <View style={{ borderWidth: 1, padding: 4, marginBottom: 10, borderRadius: 12, borderColor: Colors.LIGHT_GRAY, backgroundColor: Colors.white, marginTop: 30, marginRight: 10, alignItems: 'center', marginLeft: 6 }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <SectionLabel style={{ fontSize: 20, fontFamily: 'System' }} title={'Doctors Lists'} ></SectionLabel>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, marginTop: 15, borderWidth: 1, width: 100, textAlign: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('DoctorCreate')}
                    >
                        <Text style={{ fontSize: 20, fontFamily: 'System', marginTop: 5, marginBottom: 5 }}>Create</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={doctors}
                    renderItem={({ item }) => {
                        const service = services.find(service => service._id === item.service);

                        if (!service) {
                            return null
                        }
                        const averageRating = calculateAverageRating(item.review);

                        return (
                            <>
                                <View style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 12, borderColor: Colors.LIGHT_GRAY, backgroundColor: Colors.white, marginTop: 10, marginRight: 20, alignItems: 'center', marginLeft: 48 }}>
                                    <View>
                                        {item.image.length > 1 ? (
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 60 }}>
                                                {item.image.map((image, index) => (
                                                    <View key={index} style={{ marginRight: 10 }}>
                                                        <Image source={{ uri: image.url }} style={{ width: 120, height: 160 }} />
                                                    </View>
                                                ))}
                                            </View>
                                        ) : (
                                            <>
                                                <Image source={{ uri: item.image[0].url }} style={{ width: 220, height: 220 }} />
                                            </>
                                        )}
                                    </View>
                                    <View style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 10, alignItems: 'center'
                                    }}>
                                        {service && service.image && service.image.length > 0 && (
                                            <Image
                                                source={{ uri: service.image[0].url }}
                                                style={{ width: 60, height: 70, borderRadius: 10 }}
                                            />)}

                                        <View>
                                            <Text style={{ marginLeft: 20 }}>Specialty:</Text>
                                            <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'sans-serif' }}>{service.name}</Text>
                                            <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 10 }}>
                                                <FontAwesome6 name="user-doctor" size={17} color="blue" />
                                                <Text style={{ fontSize: 15, fontFamily: 'sans-serif' }}>{item.name}</Text>
                                            </View>

                                            <View style={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center', marginTop: 5 }}>
                                                <MaterialIcons name="email" size={17} color="blue" />
                                                <Text style={{ fontSize: 15, fontFamily: 'sans-serif' }}>{item.email}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        {[1, 2, 3, 4, 5].map((star, index) => (
                                            <View key={index}>
                                                <MaterialCommunityIcons
                                                    key={index}
                                                    name={star <= calculateAverageRating(item.review) ? 'star' : 'star-outline'}
                                                    size={20}
                                                    color="#FFD700"
                                                />
                                            </View>
                                        ))}
                                        <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{averageRating.toFixed(1)}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginRight: 27 }}>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('DoctorUpdate', {
                                                doctorId: item._id
                                            })}
                                            style={{ alignItems: 'flex-end', width: 100 }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 60 }}>
                                                <MaterialIcons name="edit" size={17} color="black" />
                                                <Text style={{ fontSize: 17 }}> Edit</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleDeleteDoctor(item._id)}
                                            style={{ alignItems: 'flex-end', width: 100 }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 60 }}>
                                                <AntDesign name="delete" size={17} color="red" />
                                                <Text style={{ fontSize: 17 }}> Delete</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        );
                    }}
                />
            </View>
        </View>
    )
}

export default AdminDoctor