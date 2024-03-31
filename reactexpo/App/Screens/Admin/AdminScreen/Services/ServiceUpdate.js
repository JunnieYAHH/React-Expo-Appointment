import { View, Text, TouchableOpacity, Alert, TextInput, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import PageHeader from '../../../../Components/Shared/PageHeader';
import mime from "mime";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import baseURL from '../../../../../assets/common/baseURL';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ServiceUpdate = () => {
    const param = useRoute().params;
    const navigation = useNavigation();
    const [service, setService] = useState([])
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);

    const pickImages = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                multiple: true
            });

            if (!result.cancelled && result.assets.length > 0) {
                const newImages = result.assets.map(asset => asset.uri);
                setImages(prevImages => [...prevImages, ...newImages]);
            }
        } catch (error) {
            console.log('Error picking image:', error);
        }
    };

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(`${baseURL}/services/get-service-to-appoint`, {
                    params: {
                        serviceId: param.serviceId
                    }
                });
                setService(response.data.service);
            } catch (error) {
                console.error('Fetch Services Error:', error.message);
            }
        };
        fetchService()
    }, []);

    const handleUpdateService = async (id) => {
        try {
            // console.log('press')
            let formData = new FormData();

            formData.append("name", name);
            formData.append("description", description);
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
            // console.log(config)
            axios.put(`${baseURL}/services/update-service/${id}`, formData, config)
                .then((response) => {
                    console.log(response);
                    Alert.alert("Update Services Successfully");
                    navigation.navigate('AdminHome')
                })
                .catch((error) => {
                    console.error("Update Service Error", error.message);
                    Alert.alert('Error in Service', 'Cannot Update Service');
                });
        } catch (error) {
            Alert.alert('Update Service Is Not Successful')
            console.log(error);
        }
    }

    return (
        <View style={{ padding: 17, marginTop: 100 }}>
            <PageHeader title={'Update Service'} />
            <View style={{ marginTop: 50, borderWidth: 2, padding: 20, borderRadius: 20 }}>
                <Text>Edit the Service Data</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <View key={index} style={{ marginRight: 10 }}>
                                <Image source={{ uri: image }} style={{ width: 120, height: 120 }} />
                            </View>
                        ))
                    ) : (
                        service && service.image && service.image.length > 0 ? (
                            service.image.length > 1 ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 60 }}>
                                    {service.image.map((image, index) => (
                                        <View key={index} style={{ marginRight: 10 }}>
                                            <Image source={{ uri: image.url }} style={{ width: 120, height: 120 }} />
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <>
                                    <Image source={{ uri: service.image[0].url }} style={{ width: 220, height: 220 }} />
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
                        placeholder={service.name}
                    />
                    <TextInput
                        numberOfLines={3}
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                        style={{ borderWidth: 1, borderRadius: 5, paddingLeft: 5, textAlign: 'left', marginTop: 10 }}
                        placeholder={service.description}
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
                        onPress={() => handleUpdateService(service._id)}
                        style={{ backgroundColor: '#87CEEB', padding: 10, borderRadius: 60, width: 150, marginTop: 15 }}
                    >
                        <Text style={{ fontWeight: "bold", textAlign: 'center' }}>Update Service</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    )
}

export default ServiceUpdate;
