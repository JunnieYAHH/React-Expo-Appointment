import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AdminHomeNavigation from './AdminHomeNavigation';
import ManageAppointment from '../../Screens/Admin/AdminScreen/Appointment/ManageAppointment';
import AdminProfile from '../../Screens/Admin/AdminProfile';
import AdminAppointmentNavigation from './AdminAppointmentNavigation';

const Tab = createBottomTabNavigator()

const AdminTabNavigation = () => {

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <Tab.Navigator screenOptions={{
                headerShown: false
            }}>
                <Tab.Screen name='Dashboard' component={AdminHomeNavigation}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="dashboard" size={24} color={color} />)
                    }}
                />
                <Tab.Screen name='Appointment' component={AdminAppointmentNavigation}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="home" size={20} color={color} />
                        )
                    }}
                />
                <Tab.Screen name='Profile' component={AdminProfile}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="home" size={20} color={color} />
                        )
                    }}
                />
            </Tab.Navigator>
        </SafeAreaView>
    )
}

export default AdminTabNavigation