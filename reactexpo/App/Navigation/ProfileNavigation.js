import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../Screens/Profile';
import ProfileUpdate from '../Screens/ProfileUpdate';


const Stack = createStackNavigator();

const ProfileNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name='ProfileScreen' component={Profile} />
            <Stack.Screen name='ProfileUpdate' component={ProfileUpdate} />
   
        </Stack.Navigator>
    )
}

export default ProfileNavigation