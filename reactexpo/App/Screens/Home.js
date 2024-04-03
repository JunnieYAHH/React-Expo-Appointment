import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Pressable, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import baseURL from '../../assets/common/baseURL';
import Colors from '../../assets/Shared/Colors';
import Homepage from '../Components/Home/Homepage';
import { useUser } from '@clerk/clerk-expo';
import Slider from '../Components/Home/Slider';
import Categories from '../Components/Home/Categories';
import { LiveSupport } from './LiveSupport';
import axios from 'axios';

export default function Home() {
    const [services, setServices] = useState([]);
    const navigation = useNavigation();
    const { isSignedIn } = useUser();

    useEffect(() => {
        if (!isSignedIn) {
            const fetchServices = async () => {
                try {
                    const response = await axios.get(`${baseURL}/services/get-services`);
                    setServices(response.data.services);
                } catch (error) {
                    console.error('Fetch Services Error:', error.message);
                }
            };

            fetchServices();
        }
    }, [isSignedIn]);

    const onButtonPress = () => {
        console.log("Chat Live Support");
        navigation.navigate('LiveSupport');
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.searchContainer}>
                        <Pressable style={styles.searchBar}>
                            <Ionicons name="search-outline" size={20} color="black" />
                            <TextInput placeholder='Search' style={styles.input} />
                            <Feather name="mic" size={20} color="gray" style={styles.micIcon} />
                        </Pressable>
                    </View>
                    <Slider />
                    <Categories />
                    <Homepage />
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.chatButton}
                onPress={() => onButtonPress()}
            >
                <Ionicons name="chatbubbles-outline" size={40} color="#357EC7"/>
                <Text>Chat!</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'light',
        padding: 10,
    },
    searchContainer: {
        marginTop: 15,
        width: 350,
        marginLeft: 20,
        height: 40
    },
    searchBar: {
        padding: 10,
        flexDirection: "row",
        alignItems: 'center',
        marginHorizontal: 7,
        gap: 10,
        backgroundColor: 'white',
        borderRadius: 3,
        height: 40,
        flex: 1
    },
    input: {
        flex: 1
    },
    micIcon: {
        marginLeft: 220
    },
    chatButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "white",
        padding: 6,
        borderRadius: 30, // Make the button circular
        right: 20, // Adjust the position from the right
        bottom: 20, // Adjust the position from the bottom
        zIndex: 999, // Ensure the button stays on top
    },
});
