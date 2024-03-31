import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import ManageAppointment from '../../Screens/Admin/AdminScreen/Appointment/ManageAppointment';
import PendingAppointments from '../../Screens/Admin/AdminScreen/Appointment/PendingAppointments';
import { createStackNavigator } from '@react-navigation/stack';
import ServiceUpdate from '../../Screens/Admin/AdminScreen/Services/ServiceUpdate';

const Stack = createStackNavigator();

const AdminAppointmentNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name='ManageAppointment' component={ManageAppointment} />
            <Stack.Screen name='PendingAppointment' component={PendingAppointments} />
            <Stack.Screen name='ServiceUpdate' component={ServiceUpdate} />
        </Stack.Navigator>
    )
}

export default AdminAppointmentNavigation