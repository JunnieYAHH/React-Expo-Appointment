import { View, Text, FlatList, Image, TouchableOpacity, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import baseURL from '../../../../../assets/common/baseURL';
import Colors from '../../../../../assets/Shared/Colors';
import SectionLabel from '../../../../Components/Shared/SectionLabel';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const navigation = useNavigation()

    useEffect(() => {
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
    })
    // console.log(services)

    const handleDeleteService = async (id) => {
        try {
            // console.log(id)
            const token = AsyncStorage.getItem('authToken')

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }

            console.log('This is the serviceId', id)

            const result = await axios.delete(`${baseURL}/services/delete-service/${id}`, config)
            setServices(services.filter(service => service.id !== id));
            Alert.alert('Service Delete Successfully')
        } catch (error) {
            Alert.alert('Service Delete Unsuccessful', error.message)
        }
    }
    return (
        <View>
            <View style={{ borderWidth: 1, padding: 4, marginBottom: 10, borderRadius: 12, borderColor: Colors.LIGHT_GRAY, backgroundColor: Colors.white, marginTop: 30, marginRight: 10, alignItems: 'center' }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <SectionLabel style={{ fontSize: 20, fontFamily: 'System' }} title={'Clinic Specialty'} ></SectionLabel>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 15, borderWidth: 1, width: 100, textAlign: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ServiceCreate')}
                    >
                        <Text style={{ fontSize: 20, fontFamily: 'System', marginTop: 5, marginBottom: 5 }}>Create</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={services}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row' }}
                    renderItem={({ item, index }) => (
                        <>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ alignItems: 'center', marginLeft: 24, marginRight: 4, borderWidth: 1, borderRadius: 12, borderBottomLeftRadius: 22, borderBottomRightRadius: 22, marginBottom: 10 }}>
                                    <View style={{ padding: 5, borderRadius: 12, borderColor: Colors.LIGHT_GRAY, backgroundColor: Colors.white, alignItems: 'center' }}>
                                        <View key={item._id} style={{ padding: 15, borderRadius: 99, alignItems: 'center' }}>
                                            {/* <Image source={{ uri: item.image[0].url }} style={{ width: 220, height: 220 }} />
                                            <Text>{item.name}</Text> */}
                                            {item.image.length > 1 ? (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 60 }}>
                                                    {item.image.map((image, index) => (
                                                        <View key={index} style={{ marginRight: 10 }}>
                                                            <Image source={{ uri: image.url }} style={{ width: 120, height: 120 }} />
                                                        </View>
                                                    ))}
                                                </View>
                                            ) : (
                                                <>
                                                    <Image source={{ uri: item.image[0].url }} style={{ width: 220, height: 220 }} />
                                                    <Text>{item.name}</Text>
                                                </>
                                            )}
                                        </View>
                                        <Text>{item.description}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginRight: 27 }}>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('ServiceUpdate', {
                                                serviceId: item._id
                                            })}
                                            style={{ alignItems: 'flex-end', width: 100 }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 60 }}>
                                                <MaterialIcons name="edit" size={17} color="black" />
                                                <Text style={{ fontSize: 17 }}> Edit</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleDeleteService(item._id)}
                                            style={{ alignItems: 'flex-end', width: 100 }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 60 }}>
                                                <AntDesign name="delete" size={17} color="red" />
                                                <Text style={{ fontSize: 17 }}> Delete</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    )
}

export default AdminServices