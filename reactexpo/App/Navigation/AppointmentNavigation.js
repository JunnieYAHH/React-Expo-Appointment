import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import ReviewDoctor from '../Screens/ReviewDoctor';
import Appointment from '../Screens/Appointment';

const Stack = createStackNavigator();

const AppointmentNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name='Appointment' component={Appointment} />
            <Stack.Screen name='ReviewDoctor' component={ReviewDoctor} />
        </Stack.Navigator>
    )
}

export default AppointmentNavigation