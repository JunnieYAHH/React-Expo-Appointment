import { StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView, Image, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import walls from './../../assets/images/walls.gif';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState();
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [password, setPassword] = useState();
    const navigation = useNavigation();

    const handleRegister = () => {
        const user = {
            name: name,
            email: email,
            password: password,
            phone: phone,
        };

        //backend send post request 'register'
        axios.post("http://192.168.100.47:8000/register", user)
        // axios.post("http://192.168.100.47:8000/register", formData, config)
            // axios.post("http://192.168.137.190:8000/register", user)
            .then((response) => {
                // console.log(response);
                Alert.alert("Registered Successfully");
                setName("");
                setEmail("");
                setPassword("");
                setPhone("");
                navigation.navigate('LoginScreen')
            })
            .catch((error) => {
                console.error("Registration Error", error);
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log("Error", error.message);
                }
                Alert.alert('Error in Registration', 'Cannot Register');
            });
    }


    return (
        <ScrollView>
            <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ marginTop: 5 }}>
                    <Image source={walls} style={{ width: 500, height: 500 }} />
                </View>
                <KeyboardAvoidingView>
                    <View>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 12, color: '#041E42' }}>
                            Register Your Account
                        </Text>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#D0D0D0', paddingVertical: 5, borderRadius: 5, marginTop: 5 }}>
                            <Ionicons name="person-sharp" size={24} color="black" style={{ marginLeft: 10 }} />
                            <TextInput
                                value={name}
                                onChangeText={(text) => setName(text)}
                                style={{ fontSize: name ? 12 : 12, color: 'gray', marginVertical: 5, width: 300 }}
                                placeholder='Enter Your name' />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#D0D0D0', paddingVertical: 5, borderRadius: 5, marginTop: 10 }}>
                            <MaterialIcons name="email" size={24} color="black" style={{ marginLeft: 10 }} />
                            <TextInput
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                style={{ fontSize: email ? 12 : 12, color: 'gray', marginVertical: 5, width: 300 }}
                                placeholder='Enter Your Email' />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#D0D0D0', paddingVertical: 5, borderRadius: 5, marginTop: 5 }}>
                            <Ionicons name="person-sharp" size={24} color="black" style={{ marginLeft: 10 }} />
                            <TextInput
                                value={phone}
                                onChangeText={(text) => setPhone(text)}
                                style={{ fontSize: name ? 12 : 12, color: 'gray', marginVertical: 5, width: 300 }}
                                placeholder='Enter Your name' />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#D0D0D0', paddingVertical: 5, borderRadius: 5, marginTop: 10 }}>
                            <FontAwesome name="lock" size={24} color="black" style={{ marginLeft: 14 }} />
                            <TextInput
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={true}
                                style={{ fontSize: password ? 12 : 12, color: 'gray', marginVertical: 5, width: 300 }}
                                placeholder='Enter Your Password' />
                        </View>
                    </View>
                </KeyboardAvoidingView>
                <Pressable
                    onPress={handleRegister}
                    style={{ width: 200, backgroundColor: '#FEBE10', borderRadius: 6, justifyContent: 'center', padding: 15, marginTop: 10 }}>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                        Register
                    </Text>
                </Pressable>

                <Pressable onPress={() => navigation.navigate('LoginScreen')} style={{ marginTop: 10 }}>
                    <Text style={{ textAlign: 'center' }}>
                        Have an account? Sign In
                    </Text>
                </Pressable>

                <View style={{ marginTop: 50, color: 'gray', fontSize: 16 }} />
            </SafeAreaView>
        </ScrollView>
    )
}

export default Register

const styles = StyleSheet.create({})