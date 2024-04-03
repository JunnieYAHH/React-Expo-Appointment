import { View, Text, Alert, SafeAreaView, StatusBar, ScrollView, Image, TouchableOpacity, StyleSheet, TextInput, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import bg from "../../assets/images/bg.png";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Colors from '../../assets/Shared/Colors';
import Icon from "react-native-vector-icons/FontAwesome"
import * as ImagePicker from 'expo-image-picker';
import mime from "mime";
import axios from 'axios';
import baseURL from '../../assets/common/baseURL';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileUpdate = () => {
    const param = useRoute().params;
    const navigation = useNavigation()
    const [user, setUser] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [images, setImages] = useState([]);

    useEffect(() => {
        getUserToUpdate = async () => {
            try {
                const response = await axios.get(`${baseURL}/users/get-current-user`, {
                    params: {
                        user_id: param.userId
                    }
                });
                // console.log(response)
                setUser(response.data.user)
            } catch (error) {
                Alert.alert('Unable to Get User Info', error.message)
            }
        }
        getUserToUpdate()
    }, [])

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
            Alert.alert('Error Updating User:', error.message);
        }
    };

    // console.log(param.userId)

    const handleUserUpdate = async () => {
        try {
            let formData = new FormData();
            const newImageUri = images.length > 0 ? images[0] : null;


            formData.append("_id", param.userId);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("isAdmin", false);
            if (newImageUri) {
                formData.append("image", {
                    uri: newImageUri,
                    type: mime.getType(newImageUri),
                    name: newImageUri.split("/").pop()
                });
            }
            const token = await AsyncStorage.getItem('authToken');

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${token}`,
                }
            }
            axios.put(`${baseURL}/users/update-user`, formData, config)
                .then((response) => {
                    console.log(response);
                    Alert.alert("Update User Successfully");
                    navigation.goBack()
                })
                .catch((error) => {
                    Alert.alert('Error on Updating Your Account', error.message)
                    console.error("Updating Error", error.message);
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else if (error.request) {
                        console.log(error.request);
                    } else {
                        console.log("Error", error.message);
                    }
                    Alert.alert('Error in Updating User', 'Cannot Update');
                });
        } catch (error) {
            Alert.alert('Error on Updating Your Account', error.message)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
            <StatusBar backgroundColor={Colors.gray} />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Image
                    source={bg}
                    resizeMode="cover"
                    style={{
                        height: 228,
                        width: "100%",
                    }}
                />
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    {user && user.image && user.image.length > 0 && images.length === 0 && (
                        <Image
                            source={{ uri: user.image[0].url }}
                            resizeMode="contain"
                            style={{
                                height: 155,
                                width: 155,
                                borderRadius: 999,
                                borderColor: Colors.primaries,
                                borderWidth: 2,
                                marginBottom: 10,
                            }}
                        />
                    )}

                    {images.length > 0 ? (
                        <Image
                            source={{ uri: images[0] }}
                            resizeMode="contain"
                            style={{
                                height: 155,
                                width: 155,
                                borderRadius: 999,
                                borderColor: Colors.primaries,
                                borderWidth: 2,
                                marginBottom: 10,
                            }}
                        />
                    ) : (
                        <TouchableOpacity
                            onPress={pickImages}
                            style={styles.imagePicker}>
                            <Icon style={{ color: "white" }} name="camera" size={15} />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={pickImages}
                        style={styles.imagePicker}>
                        <Icon style={{ color: "white" }} name="camera" size={15} />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>User Data Update</Text>
                    <View style={{ marginTop: 10, borderWidth: 2, padding: 20, borderRadius: 20, width: 300, alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 }}>
                            <View style={{ marginTop: 2 }}>
                                <TextInput
                                    style={{ borderWidth: 1, borderRadius: 5, paddingLeft: 5, textAlign: 'center' }}
                                    value={name}
                                    onChangeText={(text) => setName(text)}
                                    placeholder={user.name}
                                />
                                <TextInput
                                    value={email}
                                    onChangeText={(text) => setEmail(text)}
                                    style={{ borderWidth: 1, borderRadius: 5, paddingLeft: 5, textAlign: 'center', marginTop: 10, width: 120 }}
                                    placeholder={user.email}
                                />
                                <TextInput
                                    value={phone}
                                    onChangeText={(text) => setPhone(text)}
                                    style={{ borderWidth: 1, borderRadius: 5, paddingLeft: 5, textAlign: 'center', marginTop: 10, width: 120 }}
                                    placeholder={user.phone}
                                />
                            </View>
                        </View>
                    </View>
                    <Pressable
                        onPress={handleUserUpdate}
                        style={{ width: 200, backgroundColor: '#4682B4', borderRadius: 6, justifyContent: 'center', padding: 15, marginTop: 10 }}>
                        <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                            Register
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileUpdate

const styles = StyleSheet.create({
    imagePicker: {
        position: "absolute",
        right: 5,
        bottom: 5,
        backgroundColor: "grey",
        padding: 8,
        borderRadius: 100,
        elevation: 20,
        marginRight: 135,
        marginBottom: 9,
    },
})