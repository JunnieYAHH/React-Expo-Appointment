
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Screens/Home';
import ClinicServiceScreen from '../Screens/ClinicServiceScreen';
import BookAppointment from '../Screens/BookAppointment';
import ReviewDoctor from '../Screens/ReviewDoctor';
import LiveSupport from '../Screens/LiveSupport';

const Stack = createStackNavigator();

const HomeNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name='HomeScreen' component={Home} />
            <Stack.Screen name='clinic-service-screen' component={ClinicServiceScreen} />
            <Stack.Screen name='book-appointment-now' component={BookAppointment} />
            <Stack.Screen name='ReviewDoctor' component={ReviewDoctor} />
            <Stack.Screen name='LiveSupport' component={LiveSupport} />
        </Stack.Navigator>
    )
}

export default HomeNavigation

const styles = StyleSheet.create({})