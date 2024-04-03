import { View, Text, TouchableOpacity, Alert, TextInput, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import PageHeader from '../../../../Components/Shared/PageHeader';
import mime from "mime";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import baseURL from '../../../../../assets/common/baseURL';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DoctorUpdate = () => {
    const param = useRoute().params;
    const navigation = useNavigation();
    const [doctor, setDoctor] = useState('');
    const [services, setServices] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [images, setImages] = useState([]);


    const pickImages = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.cancelled && result.assets.length > 0) {
                const newImages = result.assets.map(asset => asset.uri);
                setImages([...images, ...newImages]);
            }
        } catch (error) {
            console.log('Error picking image:', error);
        }
    };

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
        const fetchDoctor = async () => {
            try {
                const response = await axios.get(`${baseURL}/doctors/get-doctor-to-update`, {
                    params: {
                        doctorId: param.doctorId
                    }
                });
                setDoctor(response.data.doctor);
            } catch (error) {
                console.error('Fetch Doctor Error:', error.message);
            }
        };
        fetchDoctor()
        getallService()
    }, [])

    const serviceItems = services.map(service => ({
        label: service.name,
        value: service._id
    }));


    const handleUpdateDoctor = async (id) => {
        try {
            let formData = new FormData();

            formData.append("name", name);
            formData.append("email", email);
            formData.append("gender", gender);
            formData.append("service", selectedService);
            for (let i = 0; i < images.length; i++) {
                const newImageUri = "file:///" + images[i].split("file:/").join("");
                const file = {
                    uri: newImageUri,
                    type: mime.getType(newImageUri),
                    name: newImageUri.split("/").pop()
                };
                formData.append("images[]", file);
            }
            const token = await AsyncStorage.getItem('authToken');

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${token}`,
                }
            }
            
            axios.put(`${baseURL}/doctors/update-doctor/${id}`, formData, config)
                .then((response) => {
                    console.log(response);
                    Alert.alert("Update Doctor Successfully");
                    navigation.navigate('AdminDoctors')
                })
                .catch((error) => {
                    console.error("Update Doctor Error", error.message);
                    Alert.alert('Error in Doctor', 'Cannot Update Doctor');
                });
        } catch (error) {
            console.log('Error:', error.message);
            Alert.alert('Error in Doctor', 'Cannot Update Doctor');
        }
    }
    return (
        <View>
            <View style={{ padding: 17, marginTop: 20 }}>
                <PageHeader title={'Update Doctor'} />
                <View style={{ marginTop: 50, borderWidth: 2, padding: 20, borderRadius: 20 }}>
                    <Text>Edit the Doctor Data</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                        {images.length > 0 ? (
                            images.map((image, index) => (
                                <View key={index} style={{ marginRight: 10 }}>
                                    <Image source={{ uri: image }} style={{ width: 120, height: 120 }} />
                                </View>
                            ))
                        ) : (
                            doctor && doctor.image && doctor.image.length > 0 ? (
                                doctor.image.length > 1 ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 60 }}>
                                        {doctor.image.map((image, index) => (
                                            <View key={index} style={{ marginRight: 10 }}>
                                                <Image source={{ uri: image.url }} style={{ width: 120, height: 120 }} />
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <>
                                        <Image source={{ uri: doctor.image[0].url }} style={{ width: 220, height: 220 }} />
                                    </>
                                )
                            ) : (
                                <Text>No images available</Text>
                            )
                        )}
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <TextInput
                            style={{ borderWidth: 1, borderRadius: 5, paddingLeft: 5, textAlign: 'left' }}
                            value={name}
                            onChangeText={(text) => setName(text)}
                            placeholder={doctor.name}
                        />
                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            style={{ borderWidth: 1, borderRadius: 5, paddingLeft: 5, textAlign: 'left', marginTop: 10 }}
                            placeholder={doctor.email}
                        />
                    </View>
                    <RNPickerSelect
                        onValueChange={(value) => setGender(value)}
                        placeholder={{
                            label: doctor.gender === 'male' ? 'Male' : 'Female',
                            value: null
                        }}
                        items={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                        ]}
                    />
                    <RNPickerSelect
                        onValueChange={(value) => setSelectedService(value)}
                        placeholder={{ label: 'Select Service', value: null }}
                        items={serviceItems}
                        value={selectedService}
                    />
                </View>
                <View style={{ padding: 10, alignItems: 'center' }}>
                    <TouchableOpacity
                        medium
                        primary
                        onPress={pickImages}
                        style={{ backgroundColor: '#87CEEB', padding: 10, borderRadius: 60, width: 150 }}
                    >
                        <Text style={{ fontWeight: "bold", textAlign: 'center' }}>Pick Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        medium
                        primary
                        onPress={() => handleUpdateDoctor(doctor._id)}
                        style={{ backgroundColor: '#87CEEB', padding: 10, borderRadius: 60, width: 150, marginTop: 15 }}
                    >
                        <Text style={{ fontWeight: "bold", textAlign: 'center' }}>Update Doctor</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    )
}

export default DoctorUpdate