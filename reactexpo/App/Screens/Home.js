import { View, Text, Button, SafeAreaView, Platform, ScrollView, Pressable, TextInput, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo';
import SearchBar from '../Components/Home/SearchBar';
import Header from '../Components/Home/Header';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import Slider from '../Components/Home/Slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import Categories from '../Components/Home/Categories';
// import jwt_decode from 'jwt-decode';
// import  from 'jwt-decode';
import { UserType } from '../../UserContext';
import { jwtDecode } from 'jwt-decode';

export default function Home() {
    const { isLoaded, signOut } = useAuth();
    const [services, setServices] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const navigation = useNavigation();
    const { isSignedIn } = useUser();
    const { userId, setUserId } = useContext(UserType)

    useEffect(() => {
        fetchServices();
    }, []);

    if (!isSignedIn) {
        useEffect(() => {
            const fetchUser = async () => {
                const token = await AsyncStorage.getItem("authToken")
                // console.log('Token',token)
                const decodedToken = jwtDecode(token);
                // console.log("Decoded Token:", decodedToken);
                const userId = decodedToken.userId
                setUserId(userId)
                fetchCurrentUser(userId); // Fetch user data when userId changes
            }
            fetchUser();
        }, []);
    }

    const fetchCurrentUser = async (userId) => {
        try {
            if (userId) {
                const response = await axios.get('http://192.168.100.47:8000/get-current-user', {
                    // const response = await axios.get('http://192.168.137.190:8000/get-current-user', {
                    params: {
                        user_id: userId
                    }
                });
                setCurrentUser(response.data.user);
            }
        } catch (error) {
            console.error('Fetch Services Error:', error.message);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://192.168.100.47:8000/get-services');
            // const response = await axios.get('http://192.168.137.190:8000/get-services');
            setServices(response.data.services);
        } catch (error) {
            console.error('Fetch Services Error:', error.message);
        }
    };

    const handleLogout = () => {
        setCurrentUser([]);
        AsyncStorage.clear()
            .then(() => {
                navigation.navigate('Login');
                console.log('AsyncStorage cleared successfully.');
            })
            .catch((error) => {
                console.error('Error clearing AsyncStorage:', error);
            });
    }

    // console.log(services)

    return (
        <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? 40 : 0, }} >
            {isSignedIn && <Header />}
            {isSignedIn === false && (
                <View>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 7,
                        alignItems: 'center'
                    }}>
                        <View style={{ flexDirection: 'row' }} >
                            <FontAwesome name="user-circle-o" size={40} color="black" />
                            <View style={{ marginLeft: 5 }}>
                                <Text>Hello, 👋</Text>
                                {currentUser && (
                                    <Text style={{
                                        fontSize: 15,
                                        fontWeight: 'bold',
                                    }}>
                                        {currentUser.name}
                                    </Text>
                                )}
                            </View>
                        </View>
                        <Ionicons name="notifications-outline"
                            size={28}
                            color="black"
                            style={{ flexDirection: 'column', marginLeft: 165 }} />
                        <Button
                            title='SignOut'
                            onPress={handleLogout}
                            style={{ borderRadius: 100 }}
                        />
                    </View>
                </View>
            )}

            <View style={{ marginTop: 15, width: 350, marginLeft: 20, height: 40 }}>
                <Pressable size={22} style={{ padding: 10, flexDirection: "row", alignItems: 'center', marginHorizontal: 7, gap: 10, backgroundColor: 'white', borderRadius: 3, height: 40, flex: 1 }}>
                    <Ionicons name="search-outline" size={20} color="black" />
                    <TextInput placeholder='Search' />
                    <Feather name="mic" size={20} color="gray" style={{ marginLeft: 220 }} />
                </Pressable>
            </View>
            <Slider />
            <Categories />
        </SafeAreaView >
    )
}
