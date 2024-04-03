import { View, Text, TouchableOpacity, Alert, TextInput, Image } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import React, { useEffect, useState } from 'react';
import PageHeader from '../../../../Components/Shared/PageHeader';
import mime from "mime";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import baseURL from '../../../../../assets/common/baseURL';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DoctorCreate = () => {
    const navigation = useNavigation()
    const [services, setServices] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [images, setImages] = useState([]);

    // console.log('gender:', gender)

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
        getallService()
    }, [])

    const serviceItems = services.map(service => ({
        label: service.name,
        value: service._id
    }));


    const handleCreateDoctor = async () => {
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
            axios.post(`${baseURL}/doctors/create-doctor`, formData, config)
                .then((response) => {
                    console.log(response);
                    Alert.alert("Create Doctor Successfully");
                    navigation.navigate('AdminDoctors')
                })
                .catch((error) => {
                    console.error("Create Doctor Error", error.message);
                    Alert.alert('Error in Doctor', 'Cannot Create Doctor');
                });
        } catch (error) {
            console.log('Error:', error.message);
            Alert.alert('Error in Doctor', 'Cannot Create Doctor');
        }
    }

    // console.log(selectedService)

    return (
        <View style={{ padding: 17, marginTop: 100 }}>
            <PageHeader title={'Create Doctor'} />
            <View style={{ marginTop: 50, borderWidth: 2, padding: 20, borderRadius: 20 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                    {images.map((image, index) => (
                        <Image key={index} source={{ uri: image }} style={{ width: 100, height: 100, margin: 5 }} />
                    ))}
                </View>
                <Text>Fill in The Doctor Form</Text>
                <View style={{ marginTop: 10 }}>
                    <TextInput
                        style={{ borderWidth: 1, borderRadius: 5, paddingLeft: 5, textAlign: 'left' }}
                        value={name}
                        onChangeText={(text) => setName(text)}
                        placeholder='Input Doctor Name'
                    />
                    <TextInput
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        style={{ borderWidth: 1, borderRadius: 5, paddingLeft: 5, textAlign: 'left', marginTop: 10 }}
                        placeholder='Input Doctor Email'
                    />
                </View>
                <RNPickerSelect
                    onValueChange={(value) => setGender(value)}
                    placeholder={{ label: 'Select Gender', value: null }}
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
                        onPress={handleCreateDoctor}
                        style={{ backgroundColor: '#87CEEB', padding: 10, borderRadius: 60, width: 150, marginTop: 15 }}
                    >
                        <Text style={{ fontWeight: "bold", textAlign: 'center' }}>Create Doctor</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    )
}

export default DoctorCreate