import { View, Text, TouchableOpacity, Alert, TextInput, Image } from 'react-native';
import React, { useState } from 'react';
import PageHeader from '../../../../Components/Shared/PageHeader';
import mime from "mime";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import baseURL from '../../../../../assets/common/baseURL';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ServiceCreate = () => {
  const navigation = useNavigation()
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
      });

      if (!result.cancelled && result.assets.length > 0) {
        const newImages = result.assets.map(asset => asset.uri);
        setImages([...images, ...newImages]);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const handleCreateService = async () => {
    try {
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

      axios.post(`${baseURL}/services/create-service`, formData, config)
        .then((response) => {
          console.log(response);
          Alert.alert("Create Services Successfully");
          navigation.navigate('AdminHome')
        })
        .catch((error) => {
          console.error("Create Service Error", error.message);
          Alert.alert('Error in Service', 'Cannot Create Service');
        });
    } catch (error) {
      console.log('Error:', error.message);
    }
  }

  return (
    <View style={{ padding: 17, marginTop: 100 }}>
      <PageHeader title={'Create Service'} />
      <View style={{ marginTop: 50, borderWidth: 2, padding: 20, borderRadius: 20 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={{ width: 100, height: 100, margin: 5 }} />
          ))}
        </View>
        <Text>Fill in The Service Form</Text>
        <View style={{ marginTop: 10 }}>
          <TextInput
            style={{ borderWidth: 1, borderRadius: 5, paddingLeft: 5, textAlign: 'left' }}
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder='Input Service Name'
          />
          <TextInput
            numberOfLines={3}
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={{ borderWidth: 1, borderRadius: 5, paddingLeft: 5, textAlign: 'left', marginTop: 10 }}
            placeholder='Input Service Detail'
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
            onPress={handleCreateService}
            style={{ backgroundColor: '#87CEEB', padding: 10, borderRadius: 60, width: 150, marginTop: 15 }}
          >
            <Text style={{ fontWeight: "bold", textAlign: 'center' }}>Create Service</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View >
  )
}

export default ServiceCreate;