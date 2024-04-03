import { View, Text, Button, SafeAreaView, Platform, ScrollView, Pressable, TextInput, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native'
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
import { UserType } from '../../UserContext';
import { jwtDecode } from 'jwt-decode';
import baseURL from '../../assets/common/baseURL';


export default function Home() {
    const { isLoaded, signOut } = useAuth();
    const [services, setServices] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const navigation = useNavigation();
    const { isSignedIn } = useUser();
    const { userId, setUserId } = useContext(UserType)

    if (!isSignedIn) {
        useEffect(() => {
            const fetchUser = async () => {
                const token = await AsyncStorage.getItem("authToken")
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId
                setUserId(userId)
            }
            fetchUser();
            fetchServices();
        }, []);
    }

    const fetchServices = async () => {
        try {
            const response = await axios.get(`${baseURL}/services/get-services`);
            setServices(response.data.services);
        } catch (error) {
            console.error('Fetch Services Error:', error.message);
        }
    };

    const onButtonPress = () => {
        Alert.alert('Floating Button Pressed')
    }

    return (
        <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? 10 : 0, }} >
            {isSignedIn && <Header />}
            <View style={{ marginTop: 15, width: 350, marginLeft: 20, height: 40 }}>
                <Pressable size={22} style={{ padding: 10, flexDirection: "row", alignItems: 'center', marginHorizontal: 7, gap: 10, backgroundColor: 'white', borderRadius: 3, height: 40, flex: 1 }}>
                    <Ionicons name="search-outline" size={20} color="black" />
                    <TextInput placeholder='Search' />
                    <Feather name="mic" size={20} color="gray" style={{ marginLeft: 220 }} />
                </Pressable>
            </View>
            <Slider />
            <Categories />
                <View style={styles.container}>
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={onButtonPress}
                >
                    <Ionicons name="logo-wechat" size={50} color="black" />

                </TouchableOpacity>
            </View>
           
        </SafeAreaView >
        
        
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : '#fff',

    },

    floatingButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: -450,
    }

})